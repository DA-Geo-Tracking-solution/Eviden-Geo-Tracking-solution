package at.htlhl.keycloak.messaging;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.keycloak.representations.idm.GroupRepresentation;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.stereotype.Component;

import at.htlhl.keycloak.config.KeycloakJwtAuthenticationConverter;
import at.htlhl.keycloak.model.GPSData;
import at.htlhl.keycloak.model.GPSData.GPSDataKey;
import at.htlhl.keycloak.model.UserBySquad;
import at.htlhl.keycloak.service.GPSDataService;
import at.htlhl.keycloak.service.SquadService;
import at.htlhl.keycloak.service.UserService;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;



@Component
public class Consumer {

    @Autowired
    private GPSDataService gpsDataService;

    private final String keycloakIssuerUri = "http://localhost:8081/realms/geo-tracking-solution";
    private SquadService squadService;
    private UserService userService;
    private final SimpMessagingTemplate messagingTemplate;
    
    
    @Autowired
    public Consumer(SimpMessagingTemplate messagingTemplate, SquadService squadService, UserService userService) {
        this.squadService = squadService;
        this.userService = userService;
        this.messagingTemplate = messagingTemplate;
    }

    @RabbitListener(queues = "gps_data_queue")
    public void receiveMessage(String message) {
        try {
            // Split the message
            String[] parts = message.split(":", 2);
            if (parts.length != 2) {
                throw new IllegalArgumentException("Invalid message format");
            }

            String token = parts[0];
            String data = parts[1];

            // Validate the token
            String userEmail = validateTokenAndExtractEmail(token);

            // Parse the GPS data
            String[] gpsParts = data.split(",");
            if (gpsParts.length != 4) {
                throw new IllegalArgumentException("Invalid GPS data format");
            }

            String sender = gpsParts[0];
            Instant timestamp = Instant.parse(gpsParts[1]);
            double longitude = Double.parseDouble(gpsParts[2]);
            double latitude = Double.parseDouble(gpsParts[3]);

            // Save the GPS data
            GPSData gpsData = new GPSData();

            // Create the GPSDataKey
            GPSDataKey gpsDataKey = gpsData.new GPSDataKey();
            gpsDataKey.setUserEmail(userEmail);
            gpsDataKey.setTimestamp(timestamp);

            gpsData.setKey(gpsDataKey);
            gpsData.setLongitude((float) longitude);
            gpsData.setLatitude((float) latitude);

            gpsDataService.saveGPSData(gpsData);

            System.out.println("[x] Received and saved: " + gpsData);


            /* List<GroupRepresentation> groups = userService.getUserGroups();
            if (groups.isEmpty()) {
                //return "Invalid Request! User is in no group! >8[)";
            }

            messagingTemplate.convertAndSend("/topic/geolocation/group/" + groups.get(0).getId(), gpsData);*/
            for (UserBySquad userBySquad: squadService.getSquadsFromUser(userEmail)) {
                messagingTemplate.convertAndSend("/topic/geolocation/squad/" + userBySquad.getKey().getSquadId(), gpsData);
            }
        } catch (Exception e) {
            System.err.println("Error processing message: " + e.getMessage());
        }
    }

    private String validateTokenAndExtractEmail(String token) {
        try {
            JwtDecoder jwtDecoder = JwtDecoders.fromIssuerLocation(keycloakIssuerUri);
            Jwt decodedToken = jwtDecoder.decode(token);
            return decodedToken.getClaimAsString("email");
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid token: " + e.getMessage());
        }
    }

    // @Bean
    // public JwtDecoder jwtDecoderRMQ() {
    //     // Replace with your JwtDecoder logic, e.g., using Keycloak's public key to
    //     // decode the JWT
    //     return JwtDecoders.fromIssuerLocation("http://localhost:8081/realms/geo-tracking-solution");
    // }
}
