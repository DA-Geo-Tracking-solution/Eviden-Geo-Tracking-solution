package at.htlhl.keycloak.config;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {


	@Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String authHeader = accessor.getFirstNativeHeader("Authorization");
                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        String token = authHeader.substring(7);

                        System.out.println(token);

                        Jwt jwt = jwtDecoder().decode(token);
                        Map<String, Object> sessionAttributes = accessor.getSessionAttributes();
                        if (sessionAttributes == null) {
                            sessionAttributes = new HashMap<>();
                            accessor.setSessionAttributes(sessionAttributes);
                        }

                        // Add JWT to session attributes
                        sessionAttributes.put("jwt", jwt);

                        System.out.println("JWT successfully added to session attributes: " + jwt.getSubject());
                        var auth = new UsernamePasswordAuthenticationToken(jwt.getSubject(), null,
                               new KeycloakJwtAuthenticationConverter().convert(jwt).getAuthorities());
                        System.out.println(auth);
                        //SecurityContextHolder.getContext().setAuthentication(auth);

                        /*try {
                            Jwt jwt = jwtDecoder().decode(token);
                            Collection<? extends GrantedAuthority> authorities = new KeycloakJwtAuthenticationConverter().convert(jwt).getAuthorities();
                            accessor.setUser(new UsernamePasswordAuthenticationToken(jwt.getSubject(), null, authorities));
                            System.out.println(accessor.getUser());
                        } catch (Exception e) {
                            System.out.println("Invalid token: " + e.getMessage());
                            throw new AuthenticationException("Invalid token") {};
                        }*/


                           
                        /*try {
                            // Decode the JWT token
                            Jwt jwt = jwtDecoder.decode(token);
                            
                            // Add authentication to WebSocket session
                            accessor.setUser(new UsernamePasswordAuthenticationToken(jwt.getSubject(), null, getAuthoritiesFromJwt(jwt)));
                            System.out.println("Authenticated user: " + jwt.getSubject());
                        } catch (Exception e) {
                            System.out.println("Invalid token: " + e.getMessage());
                            throw new SecurityException("Unauthorized: Invalid JWT token");
                        }**/
                    
                    } else {
                        // Handle case where no Authorization header is found
                        System.out.println("No Authorization header found");
                        // Optionally, throw an exception or reject connection here
                        throw new AuthenticationException("No Authorization header found") {};
                    }
                }
                return message;
            }
        });
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws/chat")
                .setAllowedOriginPatterns("*")
                .addInterceptors(new JwtHandshakeInterceptor(jwtDecoder())); // Allow all origins
                //.withSockJS(); // SockJS fallback
    }
    


    @Bean
    public JwtDecoder jwtDecoder() {
        // Replace with your JwtDecoder logic, e.g., using Keycloak's public key to
        // decode the JWT
        return JwtDecoders.fromIssuerLocation("http://localhost:8081/realms/geo-tracking-solution");
    }

}
