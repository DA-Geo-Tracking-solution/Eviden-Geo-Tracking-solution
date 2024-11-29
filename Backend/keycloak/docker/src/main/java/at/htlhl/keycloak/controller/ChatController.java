package at.htlhl.keycloak.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.security.oauth2.jwt.Jwt;


import at.htlhl.keycloak.model.ChatMessage;

import java.time.LocalDateTime;

@Controller
public class ChatController {

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(ChatMessage message, SimpMessageHeaderAccessor headerAccessor) {
        System.out.println("sendMessage method triggered.");
        System.out.println("Session Attributes: " + headerAccessor.getSessionAttributes());

        Jwt jwt = (Jwt) headerAccessor.getSessionAttributes().get("jwt");

        if (jwt != null) {
            System.out.println("Received message: " + message.toString());
            String sender = jwt.getClaimAsString("preferred_username");
            message.setSender(sender);
            message.setTimestamp(LocalDateTime.now());
        } else {
            throw new SecurityException("Unauthorized: Missing JWT in WebSocket session");
        }

        return message;
    }
}
