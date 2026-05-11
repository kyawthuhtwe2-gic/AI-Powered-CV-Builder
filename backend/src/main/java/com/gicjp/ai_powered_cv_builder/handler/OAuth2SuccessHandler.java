package com.gicjp.ai_powered_cv_builder.handler;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.gicjp.ai_powered_cv_builder.model.User;
import com.gicjp.ai_powered_cv_builder.repository.UserRepository;
import com.gicjp.ai_powered_cv_builder.service.JwtService;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;
        @Value("${frontend.base-url:http://localhost:3000}")
        private String frontendBaseUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        OAuth2User oauthUser =
                (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {

                    User newUser = new User();

                    newUser.setEmail(email);
                    newUser.setName(name);
                    newUser.setProvider("GOOGLE");

                    return userRepository.save(newUser);
                });

        String token =
                jwtService.generateToken(user.getEmail());

        String redirectUrl =
                frontendBaseUrl.replaceAll("/$", "") + "/oauth-success?token=" + token;

        getRedirectStrategy()
                .sendRedirect(request, response, redirectUrl);
    }
}