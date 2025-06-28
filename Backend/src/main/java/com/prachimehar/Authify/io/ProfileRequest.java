package com.prachimehar.Authify.io;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor

public class ProfileRequest {

    @NotBlank(message = "Name should be not empty")
    private String name;
    @Email(message = "Enter valid email address")
    @NotNull(message = "Email should be not null")
    private String email;
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
