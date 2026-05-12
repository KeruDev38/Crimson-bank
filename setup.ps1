# Crimson NeoBank Setup Script
# Run this script to set up the entire application.

$ErrorActionPreference = "Stop"

$backendServices = @(
    "api-gateway",
    "identity-service",
    "account-service",
    "transaction-service",
    "compliance-service",
    "identity-db",
    "account-db",
    "transaction-db",
    "compliance-db"
)

function Invoke-CheckedCommand {
    param(
        [Parameter(Mandatory = $true)]
        [scriptblock]$Command,
        [Parameter(Mandatory = $true)]
        [string]$FailureMessage
    )

    & $Command
    if ($LASTEXITCODE -ne 0) {
        throw $FailureMessage
    }
}

function Wait-ForBackendServices {
    param(
        [string[]]$ExpectedServices,
        [int]$TimeoutSeconds = 180
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

    while ((Get-Date) -lt $deadline) {
        $runningServices = @(docker-compose -f docker-compose.microservices.yml ps --services --filter "status=running")
        $missingServices = @($ExpectedServices | Where-Object { $runningServices -notcontains $_ })

        if ($missingServices.Count -eq 0) {
            return
        }

        Write-Host "Waiting for: $($missingServices -join ', ')" -ForegroundColor DarkYellow
        Start-Sleep -Seconds 5
    }

    docker-compose -f docker-compose.microservices.yml ps
    docker-compose -f docker-compose.microservices.yml logs --tail=120
    throw "Backend services did not all start within $TimeoutSeconds seconds."
}

function Wait-ForApiGateway {
    param(
        [string]$BaseUrl = "http://localhost:8080",
        [int]$TimeoutSeconds = 120
    )

    $routes = @(
        "/api/auth/login",
        "/api/accounts",
        "/api/transactions",
        "/api/compliance/profile"
    )
    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

    while ((Get-Date) -lt $deadline) {
        $unreachableRoutes = @()

        foreach ($route in $routes) {
            try {
                Invoke-WebRequest -Uri "$BaseUrl$route" -Method Get -TimeoutSec 5 -UseBasicParsing | Out-Null
            } catch {
                $statusCode = $null
                if ($_.Exception.Response) {
                    $statusCode = $_.Exception.Response.StatusCode.value__
                }

                if ($statusCode -in @(502, 503, 504) -or $null -eq $statusCode) {
                    $unreachableRoutes += $route
                }
            }
        }

        if ($unreachableRoutes.Count -eq 0) {
            return
        }

        Write-Host "Waiting for gateway routes: $($unreachableRoutes -join ', ')" -ForegroundColor DarkYellow
        Start-Sleep -Seconds 5
    }

    docker-compose -f docker-compose.microservices.yml logs api-gateway identity-service account-service transaction-service compliance-service --tail=120
    throw "API gateway did not become reachable within $TimeoutSeconds seconds."
}

Write-Host "Setting up Crimson NeoBank..." -ForegroundColor Cyan

try {
    $dockerVersion = docker --version 2>$null
    Write-Host "Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "Docker not found. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}

try {
    $nodeVersion = node --version 2>$null
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found. Please install Node.js 18+." -ForegroundColor Red
    exit 1
}

Push-Location neobank-api
try {
    Write-Host "Starting backend services..." -ForegroundColor Yellow
    Invoke-CheckedCommand -Command {
        docker-compose -f docker-compose.microservices.yml up -d --build
    } -FailureMessage "Docker Compose failed to start the backend services."

    Write-Host "Waiting for backend containers..." -ForegroundColor Yellow
    Wait-ForBackendServices -ExpectedServices $backendServices

    Write-Host "Refreshing API gateway upstreams..." -ForegroundColor Yellow
    Invoke-CheckedCommand -Command {
        docker-compose -f docker-compose.microservices.yml restart api-gateway
    } -FailureMessage "API gateway restart failed."

    Write-Host "Checking API gateway..." -ForegroundColor Yellow
    Wait-ForApiGateway

    Write-Host "Backend services started successfully." -ForegroundColor Green
} catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
} finally {
    Pop-Location
}

Push-Location neobank-frontend
try {
    Write-Host "Setting up frontend..." -ForegroundColor Yellow

    if (!(Test-Path node_modules)) {
        Invoke-CheckedCommand -Command { npm install } -FailureMessage "npm install failed."
    }

    Write-Host "Starting frontend..." -ForegroundColor Yellow
    $frontend = Start-Process npm.cmd -ArgumentList "run", "dev", "--", "--host", "0.0.0.0", "--strictPort" -PassThru
    Start-Sleep -Seconds 3

    if ($frontend.HasExited) {
        throw "Frontend dev server exited immediately. Port 5173 may already be in use."
    }
} catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
} finally {
    Pop-Location
}

Write-Host "Setup complete." -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "API Gateway: http://localhost:8080" -ForegroundColor Cyan
