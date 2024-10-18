package htl.hl;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.nio.charset.StandardCharsets;

import org.keycloak.representations.idm.authorization.AuthorizationRequest;
import org.keycloak.representations.idm.authorization.AuthorizationResponse;
import org.keycloak.authorization.client.AuthzClient;
import java.util.Scanner;



public class GPSSender {
    private final static String QUEUE_NAME = "gps_data_queue";

    public static void main(String[] argv) throws Exception {

        AuthzClient authzClient = AuthzClient.create();
        AuthorizationRequest request = new AuthorizationRequest();

        Scanner scan = new Scanner(System.in);
        System.out.print("Enter username: ");
        String username = scan.nextLine();

        System.out.print("Enter passwword: ");
        String password = scan.nextLine();

        System.out.print("Enter latitude (like: 45.123): ");
        String latitude = scan.nextLine();

        System.out.print("Enter longitude (like -93.456): ");
        String longitude = scan.nextLine();



        // Set up RabbitMQ connection
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        factory.setPort(5672);
        factory.setUsername("guest");
        factory.setPassword("guest");



        String rpt = null;
        // send the entitlement request to the server in order to
        // obtain an RPT with all permissions granted to the user
        try {
            AuthorizationResponse response = authzClient.authorization(username, password).authorize(request);
            rpt = response.getToken();
            try (Connection connection = factory.newConnection();
            Channel channel = connection.createChannel()) {

           channel.queueDeclare(QUEUE_NAME, false, false, false, null);

           // Define the message format: username:latitude,longitude
           String message = rpt + ":" + username + ":" + latitude + "," + longitude;

           // Publish the message
           channel.basicPublish("", QUEUE_NAME, null, message.getBytes(StandardCharsets.UTF_8));
           System.out.println(" [x] Sent: '" + message + "'");
       }
        } catch (Exception e) {
            System.out.println("Authentication failed!" + e);
            
        } 
    }
}
