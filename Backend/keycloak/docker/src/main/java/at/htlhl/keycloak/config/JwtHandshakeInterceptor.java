package at.htlhl.keycloak.config;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;

import java.util.Map;

public class JwtHandshakeInterceptor extends HttpSessionHandshakeInterceptor {

    private final JwtDecoder jwtDecoder;

    public JwtHandshakeInterceptor(JwtDecoder jwtDecoder) {
        this.jwtDecoder = jwtDecoder;
    }

    @Override
    public boolean beforeHandshake( ServerHttpRequest request, ServerHttpResponse response, 
                WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {

        var authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        System.out.println(request.getHeaders());
        System.out.println(request.getURI().getQuery());

        //System.out.println("Headers" + authHeader);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

        try {
            String token = authHeader.substring(7);
            Jwt jwt = jwtDecoder.decode(token);
            attributes.put("jwt", jwt); // Store user info for later use
            System.out.println("JWT successfully added to session attributes: " + jwt.getSubject());
            var auth = new UsernamePasswordAuthenticationToken(jwt.getSubject(), null,
                    new KeycloakJwtAuthenticationConverter().convert(jwt).getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);
            return true;
        } catch (JwtException e) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }
    }

    // @Override
    // public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) {
    //     return true; // Allow all connections
    // }
}
