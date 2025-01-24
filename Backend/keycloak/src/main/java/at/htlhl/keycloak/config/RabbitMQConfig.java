package at.htlhl.keycloak.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    @Bean
    public Queue gpsDataQueue() {
        return new Queue("gps_data_queue", true); // Durable queue
    }
}
