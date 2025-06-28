package com.prachimehar.Authify.controller;

import com.prachimehar.Authify.io.ProfileRequest;
import com.prachimehar.Authify.io.ProfileResponse;
import com.prachimehar.Authify.service.EmailService;
import com.prachimehar.Authify.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final EmailService emailService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ProfileResponse register(@Valid @RequestBody ProfileRequest request){
        ProfileResponse response = profileService.createProfile(request);
        emailService.sendWelcomeEmail(response.getEmail(),response.getName());
        return response;
    }

    @GetMapping("/profile")
    public ProfileResponse profileResponse(@CurrentSecurityContext(expression = "authentication?.name") String email){
        try {
            return profileService.getProfile(email);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }



}
