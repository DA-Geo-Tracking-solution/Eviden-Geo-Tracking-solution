package at.htlhl.keycloak.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import at.htlhl.keycloak.model.ChatMessage;
import at.htlhl.keycloak.model.MessageByChat;
import at.htlhl.keycloak.repositories.MessageByChatRepository;

@Service
public class MessageService {
    
    @Autowired
    private MessageByChatRepository messageByChatRepository;

    public List<MessageByChat> getMessagesInChat(UUID chatId) {
        return messageByChatRepository.getMessagesFromChat(chatId);
    }

    public UUID createMessagesInChat(UUID chatId, String authorEmail, String content, Instant timestamp) {
        UUID messageId = UUID.randomUUID();
        while (!messageByChatRepository.insertIfNotExist(chatId, messageId, authorEmail, content, timestamp)){
            messageId = UUID.randomUUID();
        }
        return messageId;
    }

}
