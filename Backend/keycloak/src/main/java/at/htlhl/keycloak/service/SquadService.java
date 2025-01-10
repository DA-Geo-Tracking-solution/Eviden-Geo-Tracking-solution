package at.htlhl.keycloak.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import at.htlhl.keycloak.model.GPSData;
import at.htlhl.keycloak.model.SquadData;
import at.htlhl.keycloak.model.ChatByUser;
import at.htlhl.keycloak.model.ChatByUser.ChatByUserKey;
import at.htlhl.keycloak.model.UserByChat;
import at.htlhl.keycloak.model.UserByChat.UserByChatKey;
import at.htlhl.keycloak.repositories.ChatByUserRepository;
import at.htlhl.keycloak.repositories.SquadRepository;
import at.htlhl.keycloak.repositories.UserByChatRepository;

@Service
public class SquadService {

    private final UserService userService;
    private final SquadRepository squadRepository;

    @Autowired
    public SquadService(UserService userService, SquadRepository squadRepository) {
        this.userService = userService;
        this.squadRepository = squadRepository;
    }
    
    public List<SquadData> getSquadFromUser(String userEmail) {
        return squadRepository.getSquad(userEmail);
    }

    public List<SquadData> getUsersInSquad(UUID squadId) {
        return squadRepository.getUsers(squadId);
    } 


    // public boolean isUserInChat(int squadId, String userEmail) {
    //     System.out.println("@Query(\"SELECT user_email FROM users_by_squad WHERE squad_id = " + squadId + " AND user_email = " + userEmail + " LIMIT 1\")");
    //     return squadRepository.isUserInSquad(squadId, userEmail).size() == 1;
    // }

    public UUID createSquad(List<String> userEmails) throws Exception{
        UUID squadId = UUID.randomUUID();
        try {
            // Inserts if uuid not exists else throws error
            if (squadRepository.doesSquadIdExist(squadId).isPresent()) {
                throw new Exception();
            }

            for (String userEmail: userEmails) {
                if (userService.getUserByEmail(userEmail) != null) {
                    squadRepository.insertIfNotExists(squadId, userEmail);
                }    
            }
            return squadId;
        } catch (Exception e) {
            // Undo changes if one fails
            for (String userEmail: userEmails) {
                revertUsersBySquad(userEmail, squadId);
            }
            throw new Exception("Failed to update chat associations, changes rolled back." + e.getMessage());
        }
    }



    public void putUserInChat(String userEmail, UUID squadId, String chatName) throws Exception{
        try {
            // Inserts only if uuid exist else throws error
            if (!squadRepository.doesSquadIdExist(squadId).isPresent()) {
                throw new Exception();
            }
            squadRepository.insertIfNotExists(squadId, userEmail);

        } catch (Exception e) {
            // Undo changes if one fails
            revertUsersBySquad(userEmail, squadId);
            throw new Exception("Failed to update chat associations, changes rolled back.");
        }
        
    }

    private void revertUsersBySquad(String userEmail, UUID squadId) {
        UserBySquadKey userBySquadKey = new UserBySquadKey(squadId, userEmail);
        squadRepository.deleteById(userByChatKey);
    }    
}