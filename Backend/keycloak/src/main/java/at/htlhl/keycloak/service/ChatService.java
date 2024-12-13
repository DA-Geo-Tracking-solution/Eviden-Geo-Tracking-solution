package at.htlhl.keycloak.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import at.htlhl.keycloak.model.ChatsByUser;
import at.htlhl.keycloak.model.UsersByChat;
import at.htlhl.keycloak.repositories.ChatRepository;
import at.htlhl.keycloak.repositories.UserRepository;

@Service
public class ChatService {


    private final UserRepository usersByChatRepository;
    private final ChatRepository chatsByUserRepository;

    @Autowired
    public ChatService(UserRepository usersByChatRepository, ChatRepository chatsByUserRepository) {
        this.usersByChatRepository = usersByChatRepository;
        this.chatsByUserRepository = chatsByUserRepository;
    }
    

    public void putUserInChat(String userEmail, String chatId) {
        try {
            // Try updating both repositories
            this.updateUsersByChat(userEmail, chatId);
            this.updateChatsByUser(userEmail, chatId);
        } catch (Exception ex) {
            // Compensating action: undo changes if one fails
            revertUsersByChat(userEmail, chatId);
            throw new RuntimeException("Failed to update chat associations, changes rolled back.");
        }
        
    }
    
    private void updateUsersByChat(String userId, String chatId) {
        UsersByChat usersByChat = new UsersByChat();
        UserByChatKey userByChatKey = new UserByChatKey();
        userByChatKey.setUserId(userId);
        userByChatKey.setChatId(chatId);
        usersByChat.setKey(userByChatKey);
        usersByChatRepository.save(usersByChat);
    }
    private void updateChatsByUser(String userId, String chatId) {
        // Update chats_by_user
        ChatsByUser chatsByUser = new ChatsByUser();
        ChatByUserKey chatByUserKey = new ChatByUserKey();
        chatByUserKey.setUserId(userId);
        chatByUserKey.setChatId(chatId);
        chatsByUser.setKey(chatByUserKey);
        chatsByUserRepository.save(chatsByUser);
    }
}
