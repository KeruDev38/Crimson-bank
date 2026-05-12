package com.neobank.identity.controller;

import com.neobank.identity.dto.AuthResponse;
import com.neobank.identity.dto.LoginRequest;
import com.neobank.identity.dto.MessageResponse;
import com.neobank.identity.dto.RegisterRequest;
import com.neobank.identity.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(
                request.username(),
                request.password(),
                request.email(),
                request.firstName(),
                request.lastName()
        );
        return ResponseEntity.ok(new MessageResponse("User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(AuthResponse.bearer(authService.login(request.username(), request.password())));
    }
}
