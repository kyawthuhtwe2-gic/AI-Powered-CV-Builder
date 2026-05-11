package com.gicjp.ai_powered_cv_builder.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    @GetMapping("/profile")
    public String profile() {
        return "Protected API Access Success";
    }

    @GetMapping("/me")
    public Map<String, Object> me(Authentication authentication, HttpServletRequest request) {
        Map<String, Object> body = new HashMap<>();

        if (authentication != null) {
            body.put("authenticated", true);
            Object principal = authentication.getPrincipal();

            if (principal instanceof OAuth2User oauthUser) {
                body.put("email", oauthUser.getAttribute("email"));
                body.put("name", oauthUser.getAttribute("name"));
                body.put("provider", oauthUser.getAttribute("iss") != null ? oauthUser.getAttribute("iss") : "GOOGLE");
            } else if (principal instanceof com.gicjp.ai_powered_cv_builder.model.User user) {
                body.put("email", user.getEmail());
                body.put("name", user.getName());
                body.put("provider", user.getProvider());
                body.put("id", user.getId());
            } else {
                body.put("principal", principal.toString());
            }
        } else {
            body.put("authenticated", false);
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            body.put("token", authHeader.substring(7));
        }

        return body;
    }
}