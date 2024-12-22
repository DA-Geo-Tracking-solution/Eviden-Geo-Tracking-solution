package at.htlhl.keycloak.repositories;


import java.time.Instant;
import java.util.List;

import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.stereotype.Repository;

import at.htlhl.keycloak.model.GPSData;
import at.htlhl.keycloak.model.UsersByChat;
import at.htlhl.keycloak.model.GPSData.GPSDataKey;

@Repository
public interface UserRepository extends CassandraRepository<UsersByChat, GPSDataKey> {

    @Query("SELECT * FROM gps_data WHERE user_email = ?0 AND timestamp > ?1")
    List<GPSData> findGPSDataOfUser(String user_email, Instant timestamp);

}