package htl.hl;

import com.rabbitmq.client.*;
import com.datastax.oss.driver.api.core.CqlSession;

import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.UUID;

public class GPSReceiver {

    private final static String QUEUE_NAME = "gps_data_queue";
    
    public static void main(String[] argv) throws Exception {
        // Set up connection to Cassandra
        CqlSession session = CqlSession.builder()
                .addContactPoint(new InetSocketAddress("localhost", 9042))  // Cassandra host and port
                .withKeyspace("my_keyspace")  // Replace with your keyspace
                .withLocalDatacenter("datacenter1")  // Replace with your local datacenter
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

        // Consume messages from the queue
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), StandardCharsets.UTF_8);
            System.out.println(" [x] Received: '" + message + "'");

            try {
                // Parse the message (username:latitude,longitude)
                String[] parts = message.split(":");
                String username = parts[0];
                String[] gpsParts = parts[1].split(",");
                double latitude = Double.parseDouble(gpsParts[0]);
                double longitude = Double.parseDouble(gpsParts[1]);

                // Insert into CassandraDB
                session.execute("INSERT INTO users (username, created_at) VALUES (?, ?) IF NOT EXISTS",
                        username, Instant.now());

                session.execute("INSERT INTO gps_data (id, username, latitude, longitude, timestamp) " +
                                "VALUES (?, ?, ?, ?, ?)",
                        UUID.randomUUID(), username, latitude, longitude, Instant.now());

                System.out.println("Data inserted successfully!");

            } catch (Exception e) {
                System.err.println("Error while inserting into Cassandra: " + e.getMessage());
                e.printStackTrace();
            }
        };

        channel.basicConsume(QUEUE_NAME, true, deliverCallback, consumerTag -> { });

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
