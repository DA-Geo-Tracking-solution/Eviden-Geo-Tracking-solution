package at.htlhl.keycloak.config;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KeycloakConfig {
    // Todo put fields in a .env file

    private static Keycloak keycloak = null;
    private static final String serverUrl = "http://localhost:8081/auth"; // Load from env or config
    public static final String realm = "geo-tracking-solution"; // Load from env or config
    private static final String clientId = "angular-client"; // Load from env or config
    private static final String clientSecret = null; // Load from env or config
    private static final String userName = "admin";// Load from env or config
    private static final String password = "admin123"; // Load from env or config


    @Bean
    public Keycloak keycloak() {
        return KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm(realm)
                .grantType(OAuth2Constants.PASSWORD)
                .username(userName)
                .password(password)
                .clientId(clientId)
                .clientSecret(clientSecret)
                .build();
    }
}
