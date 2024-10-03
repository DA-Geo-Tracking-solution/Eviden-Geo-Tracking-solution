package htl.hl;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.nio.charset.StandardCharsets;

import org.keycloak.representations.idm.authorization.AuthorizationRequest;
import org.keycloak.representations.idm.authorization.AuthorizationResponse;
import org.keycloak.authorization.client.AuthzClient;



public class GPSSender {
    private final static String QUEUE_NAME = "gps_data_queue";

    public static void main(String[] argv) throws Exception {

        AuthzClient authzClient = AuthzClient.create();
        AuthorizationRequest request = new AuthorizationRequest();

        // send the entitlement request to the server in order to
        // obtain an RPT with all permissions granted to the user
        AuthorizationResponse response = authzClient.authorization("admin", "password").authorize(request);
        String rpt = response.getToken();


        // Set up RabbitMQ connection
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        factory.setPort(5672);
        factory.setUsername("guest");
        factory.setPassword("guest");


        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {

            channel.queueDeclare(QUEUE_NAME, false, false, false, null);

            // Define the message format: username:latitude,longitude
            String username = "admin";
            double latitude = 45.123;
            double longitude = -93.456;
            String message = rpt + ":" + username + ":" + latitude + "," + longitude;

            // Publish the message
            channel.basicPublish("", QUEUE_NAME, null, message.getBytes(StandardCharsets.UTF_8));
            System.out.println(" [x] Sent: '" + message + "'");
        }
    }
}
