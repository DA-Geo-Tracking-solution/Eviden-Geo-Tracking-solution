package at.htlhl.keycloak.repositories;


import java.time.Instant;
import java.util.List;

import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.stereotype.Repository;

import at.htlhl.keycloak.model.ChatsByUser;
import at.htlhl.keycloak.model.GPSData;
import at.htlhl.keycloak.model.GPSData.GPSDataKey;

@Repository
public interface ChatRepository extends CassandraRepository<ChatsByUser, GPSDataKey> {

    @Query("SELECT * FROM gps_data WHERE user_email = ?0 AND timestamp > ?1")
    List<GPSData> findGPSDataOfUser(String user_email, Instant timestamp);

}
