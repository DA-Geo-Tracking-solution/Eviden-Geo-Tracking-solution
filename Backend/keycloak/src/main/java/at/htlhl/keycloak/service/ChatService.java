package at.htlhl.keycloak.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import at.htlhl.keycloak.model.GPSData;
import at.htlhl.keycloak.model.ChatByUser;
import at.htlhl.keycloak.model.ChatByUser.ChatByUserKey;
import at.htlhl.keycloak.model.UserByChat;
import at.htlhl.keycloak.model.UserByChat.UserByChatKey;
import at.htlhl.keycloak.repositories.ChatByUserRepository;
import at.htlhl.keycloak.repositories.UserByChatRepository;

@Service
public class ChatService {

    private final UserService userService;
    private final UserByChatRepository usersByChatRepository;
    private final ChatByUserRepository chatsByUserRepository;

    @Autowired
    public ChatService(UserService userService, UserByChatRepository usersByChatRepository, ChatByUserRepository chatsByUserRepository) {
        this.userService = userService;
        this.usersByChatRepository = usersByChatRepository;
        this.chatsByUserRepository = chatsByUserRepository;
    }
    
    public List<ChatByUser> getChatsFromUser(String userEmail) {
        return chatsByUserRepository.getChatsFromUser(userEmail);
    }

    public List<UserByChat> getUsersInChat(UUID chatId) {
        return usersByChatRepository.getUsersInChat(chatId);
    } 

    public boolean isUserInChat(UUID chatId, String userEmail) {
        System.out.println("@Query(\"SELECT user_email FROM users_by_chat WHERE chat_id = " + chatId + " AND user_email = " + userEmail + " LIMIT 1\")");
        return usersByChatRepository.isUserInChat(chatId, userEmail).size() == 1;
    }

    public void createChat(String chatName, List<String> userEmails) throws Exception{
        UUID chatId = UUID.randomUUID();
        try {
            String firstUserEmail = userEmails.remove(0);
            // Inserts if uuid not exists else throws error
            if (userService.getUserByEmail(firstUserEmail) != null) {
                if (!usersByChatRepository.insertIfNotExists(chatId, firstUserEmail) || !chatsByUserRepository.insertIfNotExists(firstUserEmail, chatId, chatName)) {
                    throw new Exception();
                }
            }

            for (String userEmail: userEmails) {
                // Inserts if uuid exists else throws error
                if (userService.getUserByEmail(userEmail) != null) {
                    if (!usersByChatRepository.insertIfExists(chatId, userEmail) || !chatsByUserRepository.insertIfExists(userEmail, chatId, chatName)) {
                        throw new Exception();
                    }
                }
            }
        } catch (Exception e) {
            // Undo changes if one fails
            for (String userEmail: userEmails) {
                revertUsersByChat(userEmail, chatId);
            }
            throw new Exception("Failed to update chat associations, changes rolled back." + e.getMessage());
        }
    }



    public void putUserInChat(String userEmail, UUID chatId, String chatName) throws Exception{
        try {
            // Inserts only if uuid exist else throws error
            if (!usersByChatRepository.insertIfExists(chatId, userEmail) || !chatsByUserRepository.insertIfExists(userEmail, chatId, chatName)) {
                throw new Exception();
            }
        } catch (Exception e) {
            // Undo changes if one fails
            revertUsersByChat(userEmail, chatId);
            throw new Exception("Failed to update chat associations, changes rolled back.");
        }
        
    }

    private void revertUsersByChat(String userEmail, UUID chatId) {
        UserByChatKey userByChatKey = new UserByChatKey(chatId, userEmail);
        usersByChatRepository.deleteById(userByChatKey);
    }    
}
