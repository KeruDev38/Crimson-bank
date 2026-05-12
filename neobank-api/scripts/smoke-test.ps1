param(
    [string]$BaseUrl = "http://localhost:8080"
)

$username = "smokeuser$(Get-Random)"
$password = "Password123!"
$email = "$username@example.com"

$registerBody = @{
    username = $username
    password = $password
    email = $email
    firstName = "Smoke"
    lastName = "User"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/auth/register" -ContentType "application/json" -Body $registerBody | Out-Null

$loginBody = @{
    username = $username
    password = $password
} | ConvertTo-Json

$auth = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/auth/login" -ContentType "application/json" -Body $loginBody
$headers = @{ Authorization = "Bearer $($auth.token)" }

$account = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/accounts" -Headers $headers

$depositBody = @{
    accountNumber = $account.accountNumber
    amount = 100.00
    description = "Smoke deposit"
    idempotencyKey = "smoke-$username-deposit"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/transactions/deposit" -Headers $headers -ContentType "application/json" -Body $depositBody | Out-Null
Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/transactions/deposit" -Headers $headers -ContentType "application/json" -Body $depositBody | Out-Null

$accounts = Invoke-RestMethod -Method Get -Uri "$BaseUrl/api/accounts" -Headers $headers
$transactions = Invoke-RestMethod -Method Get -Uri "$BaseUrl/api/transactions" -Headers $headers

[PSCustomObject]@{
    Username = $username
    AccountNumber = $account.accountNumber
    AccountCount = $accounts.Count
    TransactionCount = $transactions.Count
}
