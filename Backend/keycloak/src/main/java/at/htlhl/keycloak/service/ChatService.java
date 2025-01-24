package at.htlhl.keycloak.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import at.htlhl.keycloak.model.Chat;
import at.htlhl.keycloak.model.ChatByUser;
import at.htlhl.keycloak.model.UserByChat;
import at.htlhl.keycloak.model.Chat.Member;
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

    public Chat createChat(String chatName, List<String> userEmails) throws Exception{
        UUID chatId = UUID.randomUUID();
        try {
            // Inserts if uuid not exists else throws error
            if (usersByChatRepository.doesChatIdExist(chatId).isPresent()) {
                throw new Exception();
            }

            List<Member> members = new ArrayList<>();

            for (String userEmail: userEmails) {
                UserRepresentation user = userService.getUserByEmail(userEmail);
               
                if (user != null) {
                    usersByChatRepository.insertIfNotExists(chatId, userEmail);
                    chatsByUserRepository.insertIfNotExists(userEmail, chatId, chatName);
                    members.add(new Member(user.getUsername(), userEmail));
                }    
            }
            return new Chat(chatId, chatName, members);
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
            if (!usersByChatRepository.doesChatIdExist(chatId).isPresent()) {
                throw new Exception();
            }
            usersByChatRepository.insertIfNotExists(chatId, userEmail);
            chatsByUserRepository.insertIfNotExists(userEmail, chatId, chatName);

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
