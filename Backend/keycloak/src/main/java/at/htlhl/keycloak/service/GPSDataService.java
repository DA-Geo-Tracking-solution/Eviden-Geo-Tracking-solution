package at.htlhl.keycloak.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import at.htlhl.keycloak.model.GPSData;
import at.htlhl.keycloak.repositories.GPSDataRepository;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

@Service
public class GPSDataService {

    @Autowired
    private GPSDataRepository gpsDataRepository;

    public List<GPSData> getAllGPSData() {
        return gpsDataRepository.findAll();
    }

    public List<GPSData> getGPSDataOf(String userEmail, Instant timestamp) {
        return gpsDataRepository.findGPSDataOfUser(userEmail, timestamp);
    }
    public GPSData saveGPSData(GPSData gpsData) {
        return gpsDataRepository.save(gpsData);
    }

    public void deleteGPSData(GPSData gpsData) {
        gpsDataRepository.delete(gpsData);
    }
}
