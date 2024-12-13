package htl.hl;

import com.rabbitmq.client.*;
import com.datastax.oss.driver.api.core.CqlSession;
import org.keycloak.adapters.KeycloakDeployment;
import org.keycloak.adapters.KeycloakDeploymentBuilder;
import org.keycloak.representations.AccessToken;
import org.keycloak.adapters.rotation.AdapterTokenVerifier;

import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.UUID;

public class GPSReceiver {

    private final static String QUEUE_NAME = "gps_data_queue";
    private static KeycloakDeployment keycloakDeployment;   

    public static void main(String[] argv) throws Exception {
        // Set up Keycloak deployment
        keycloakDeployment = KeycloakDeploymentBuilder.build(
            GPSReceiver.class.getResourceAsStream("/keycloak.json")); // Path to your Keycloak config file

        // Set up connection to Cassandra
        CqlSession session = CqlSession.builder()
                .addContactPoint(new InetSocketAddress("localhost", 9042))
                .withKeyspace("my_keyspace")
                .withLocalDatacenter("datacenter1")
                .build();

        // Set up RabbitMQ connection
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        factory.setPort(5672);
        factory.setUsername("guest");
        factory.setPassword("guest");

        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);

        System.out.println(" [*] Waiting for messages. To exit press CTRL+C");

        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), StandardCharsets.UTF_8);
            System.out.println(" [x] Received: '" + message + "'");

            try {
                // Parse the message (token:username:latitude,longitude)
                String[] parts = message.split(":");
                if (parts.length != 3) {
                    throw new IllegalArgumentException(
                            "Invalid message format. Expected 'token:username:latitude,longitude'");
                }

                String token = parts[0]; // Extract the token
                String username = parts[1]; // Extract username
                String[] gpsParts = parts[2].split(",");
                if (gpsParts.length != 2) {
                    throw new IllegalArgumentException("Invalid GPS format. Expected 'latitude,longitude'");
                }

                float latitude = Float.parseFloat(gpsParts[0]);
                float longitude = Float.parseFloat(gpsParts[1]); 

                // Validate token with Keycloak
                AccessToken accessToken = AdapterTokenVerifier.verifyToken(token, keycloakDeployment);
                System.out.println("Access Token" + accessToken);

                if (accessToken == null) {
                    throw new SecurityException("Invalid token!");
                }

                // Insert into CassandraDB
                session.execute("INSERT INTO users (username, created_at) VALUES (?, ?) IF NOT EXISTS",
                        username, Instant.now());

                session.execute("INSERT INTO gps_data (id, username, latitude, longitude, timestamp) " +
                        "VALUES (?, ?, ?, ?, ?)",
                        UUID.randomUUID(), username, latitude, longitude, Instant.now());

                System.out.println("Data inserted successfully!");

            } catch (Exception e) {
                System.err.println("Error while processing the message: " + e.getMessage());
                e.printStackTrace();
            }
        };

        channel.basicConsume(QUEUE_NAME, true, deliverCallback, consumerTag -> {
        });

        // Close resources on shutdown
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            try {
                session.close();
                channel.close();
                connection.close();
            } catch (Exception e) {
                System.err.println("Error while closing resources: " + e.getMessage());
            }
        }));
    }
}
