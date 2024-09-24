package htl.hl;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import java.nio.charset.StandardCharsets;

public class GPSSender {

    private final static String QUEUE_NAME = "gps_data_queue";

    public static void main(String[] argv) throws Exception {
        // Set up connection to RabbitMQ
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");  // Your RabbitMQ host
        factory.setPort(5672);         // Default RabbitMQ port
        factory.setUsername("guest");  // RabbitMQ username
        factory.setPassword("guest");  // RabbitMQ password

        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {
            // Declare a queue to send GPS data
            channel.queueDeclare(QUEUE_NAME, false, false, false, null);

            // Example of GPS data with a username
            String username = "user1";
            String gpsData = "45.123,-93.456";  // Latitude, Longitude

            // Combine username and GPS data into one message
            String message = String.format("%s:%s", username, gpsData);

            // Send message to the queue
            channel.basicPublish("", QUEUE_NAME, null, message.getBytes(StandardCharsets.UTF_8));
            System.out.println(" [x] Sent: '" + message + "'");
        }
    }
}
