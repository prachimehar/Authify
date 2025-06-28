package com.prachimehar.Authify.service;

import com.prachimehar.Authify.io.ProfileRequest;
import com.prachimehar.Authify.io.ProfileResponse;

public interface ProfileService {

   ProfileResponse createProfile(ProfileRequest request);
   ProfileResponse getProfile(String email);

   void sendResetOtp(String email);
   void resetPassword(String email,String otp,String newPassword);

   void sendOtp(String email);
   void verifyOtp(String email, String otp);

   String getLoggedInUserId(String email);
}
