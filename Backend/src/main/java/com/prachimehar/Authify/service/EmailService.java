package com.prachimehar.Authify.service;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class EmailService {


    @Autowired
    private TemplateEngine templateEngine;

    public final JavaMailSender mailSender;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    public void sendWelcomeEmail(String toEmail, String name){
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Welcome to our Platform");
            message.setText("Hello " + name + ",\n\nThanks for registering with us!\n\nRegards,\nAuthify Team");

            mailSender.send(message);
            System.out.println("Welcome email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Error sending email to " + toEmail + ": " + e.getMessage());
        }
    }

//    public void sendResetOtpEmail(String toEmail,String otp){
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setFrom(fromEmail);
//        message.setTo(toEmail);
//        message.setSubject("Password reset OTP");
//        message.setText("your OTP for resetting your password is "+ otp +" use this OTP for proceed with reset ");
//        mailSender.send(message);
//
//    }
//
//    public void sendOtpEmail(String toEmail, String otp) {
//        System.out.println("📧 Inside sendOtpEmail()");
//        System.out.println("➡️ Sending to: " + toEmail);
//        System.out.println("↪️ Using from: " + fromEmail);
//        System.out.println("📝 Message: Your OTP is " + otp);
//
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setFrom(fromEmail);  // log its value
//        message.setTo(toEmail);
//        message.setSubject("Account Verification OTP");
//        message.setText("Your OTP is " + otp + ". Verify your account using this OTP.");
//
//        try {
//            mailSender.send(message);
//            System.out.println("✅ MailSender.send() executed.");
//        } catch (Exception e) {
//            System.out.println("❌ Email failed: " + e.getMessage());
//            e.printStackTrace();
//        }
//    }


    public void sendResetOtpEmail(String toEmail, String otp) throws  MessagingException{
        Context context = new Context();
        context.setVariable("email",toEmail);
        context.setVariable("otp", otp);

        String htmlContent = templateEngine.process("password-reset-email", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Reset Your Password - Authify");
        helper.setText(htmlContent, true);
        mailSender.send(message);

    }

    public void sendOtpEmail(String toEmail, String otp) throws MessagingException {
        Context context = new Context();
        context.setVariable("email", toEmail);
        context.setVariable("verificationLink", "http://localhost:8080/api/v1.0/verify-otp?email=" + toEmail + "&otp=" + otp);

        String htmlContent = templateEngine.process("verify-email", context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);


        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Account Verification OTP - Authify");
        helper.setText(htmlContent, true);
        mailSender.send(message);

    }

}
