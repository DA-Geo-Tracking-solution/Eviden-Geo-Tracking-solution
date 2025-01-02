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
                .withKeyspace("geo_tracking_keyspace")
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
                // Parse the message (token:email:timestamp,longitude,latitude)
                String[] parts = message.split(":");
                if (parts.length != 3) {
                    throw new IllegalArgumentException(
                            "Invalid message format. Expected 'token:user_email:timestamp,longitude,latitude'");
                }

                String token = parts[0]; // Extract the token
                String userEmail = parts[1]; // Extract user email
                String[] dataParts = parts[2].split(",");
                if (dataParts.length != 3) {
                    throw new IllegalArgumentException(
                            "Invalid data format. Expected 'timestamp,longitude,latitude'");
                }

                String timestamp = dataParts[0];
                float longitude = Float.parseFloat(dataParts[1]);
                float latitude = Float.parseFloat(dataParts[2]);

                // Validate token with Keycloak
                AccessToken accessToken = AdapterTokenVerifier.verifyToken(token, keycloakDeployment);
                if (accessToken == null) {
                    throw new SecurityException("Invalid token!");
                }

                // Insert GPS data into Cassandra
                session.execute("INSERT INTO gps_data (user_email, timestamp, latitude, longitude) " +
                        "VALUES (?, ?, ?, ?)",
                        userEmail, Instant.parse(timestamp), latitude, longitude);

                System.out.println("Data inserted successfully for user: " + userEmail);

            } catch (Exception e) {
                System.err.println("Error while processing the message: " + e.getMessage());
                e.printStackTrace();
            }
        };

        channel.basicConsume(QUEUE_NAME, true, deliverCallback, consumerTag -> {});

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
