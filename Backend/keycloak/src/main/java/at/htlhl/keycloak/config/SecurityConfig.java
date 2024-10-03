package at.htlhl.keycloak.config;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.stereotype.Controller;

@Controller
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((authz) -> authz
                        .requestMatchers("/", "/public/**").permitAll()  // Public routes
                        .requestMatchers("/admin/**").hasRole("admin")   // Admin-only access
                        .requestMatchers("/user/**").hasRole("user")     // User-only access
                        .anyRequest().authenticated()                      // All other routes require authentication
                )
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/login")  // Custom login page if needed
                );

        return http.build();
    }
}
