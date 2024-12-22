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


    private final UserByChatRepository usersByChatRepository;
    private final ChatByUserRepository chatsByUserRepository;

    @Autowired
    public ChatService(UserByChatRepository usersByChatRepository, ChatByUserRepository chatsByUserRepository) {
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
        return usersByChatRepository.isUserInChat(chatId, userEmail).size() == 1;
    }

    public void putUserInChat(String userEmail, UUID chatId, String chatName) throws Exception{
        try {
            // Try updating both repositories
            this.updateUsersByChat(userEmail, chatId);
            this.updateChatsByUser(userEmail, chatId, chatName);
        } catch (Exception ex) {
            // Undo changes if one fails
            revertUsersByChat(userEmail, chatId);
            throw new Exception("Failed to update chat associations, changes rolled back.");
        }
        
    }
    
    private void updateUsersByChat(String userEmail, UUID chatId) {

        UserByChatKey userByChatKey = new UserByChatKey(chatId, userEmail);
        UserByChat usersByChat = new UserByChat();
        usersByChat.setKey(userByChatKey);
        usersByChatRepository.save(usersByChat);
    }

    private void updateChatsByUser(String userEmail, UUID chatId, String chatName) {
        ChatByUserKey chatByUserKey = new ChatByUserKey(userEmail, chatId);
        ChatByUser chatsByUser = new ChatByUser(chatByUserKey, chatName);
        chatsByUser.setKey(chatByUserKey);
        chatsByUserRepository.save(chatsByUser);
    }

    private void revertUsersByChat(String userEmail, UUID chatId) {
        UserByChatKey userByChatKey = new UserByChatKey(chatId, userEmail);
        usersByChatRepository.deleteById(userByChatKey);
    }    
}
