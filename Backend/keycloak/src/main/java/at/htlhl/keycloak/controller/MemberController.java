package at.htlhl.keycloak.controller;

import at.htlhl.keycloak.model.Chat;
import at.htlhl.keycloak.model.ChatMessage;
import at.htlhl.keycloak.model.GPSData;
import at.htlhl.keycloak.model.keycloak.User;
import at.htlhl.keycloak.service.GPSDataService;
import at.htlhl.keycloak.service.GroupService;
import at.htlhl.keycloak.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.james.mime4j.dom.datetime.DateTime;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/member")
public class MemberController {

    private GroupService groupService;
    private UserService userService;
    private GPSDataService gpsDataService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public MemberController(GroupService groupService, UserService userService, GPSDataService gpsDataService, SimpMessagingTemplate messagingTemplate) {
        this.groupService = groupService;
        this.userService = userService;
        this.gpsDataService = gpsDataService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/group-members")
    @Operation(description = "Returns a List of all members in the group of the requester in format { username, email, firstname, lastname }")
    public List<User> getGroupMembers(){
        List<UserRepresentation> userRepresentations = userService.getGroupMembers();
        List<User> users = new ArrayList<>();
        for (UserRepresentation userRep : userRepresentations) {
            users.add(new User(userRep));
        }
        return users;
    }

    @GetMapping(path = "/user/{userEmail}")
    @Operation(description = "Returns data of specific User (not only users in the same group)")
    public UserRepresentation getUserByEmail(@PathVariable("userEmail") String userEmail){
        UserRepresentation user = userService.getUserByEmail(userEmail);
        return user;
    }

    // TODO this can only be done with a running Database ---------------------

    @GetMapping("/user-location")
    @Operation(description = "Returns some users location data in format { userId, { longitude, latitude }, timestamp } of your group")
    public List<GPSData> getCoordinates(@RequestParam String userEmail, @RequestParam Instant earliestTime) {
        //return gpsDataService.getGPSDataOf(userEmail, earliestTime);
        return gpsDataService.getAllGPSData();
    }

    @GetMapping("/group-members-locations")
    @Operation(description = "Returns some users location data in format { userId, { longitude, latitude }, timestamp } of your group")
    public List<Object> getGroupmembersCoordinates( DateTime earliestTime) {
        userService.getGroupMembers();
        return new ArrayList<>();
    }

    @GetMapping("/chats") // Todo chats: user hinzufügen, editieren
    @Operation(description = "Returns all chats a user has in format { chatId, chatName }")
    public List<Chat> getChats() {
        String userEmail = userService.getUserEmail();
        //TODO get actual data
        ArrayList<Chat> data = new ArrayList<>();
        data.add(new Chat("0", "Global-Chat", new String[]{"", "", "", ""}));
        data.add(new Chat("1", "Global-Chat-2 :)", new String[]{"", "", "", ""}));
        data.add(new Chat("2", "Please implement DB!", new String[]{"", "", "", ""}));
        return data;
    }

    @PostMapping("/chat")
    @Operation(description = "Create a chat with chatId and user-emails-array")
    public String createChat(Chat chat) {
        return "not Successful";
    }

    @PutMapping("/chat/{chatId}")
    @Operation(description = "Edit a chat and its user-emails-array")
    public String editChat(@RequestBody Chat chat) {
        return "not Successful";
    }

    @GetMapping("chat/{chatId}/messages")
    @Operation(description = "Returns some messages in format { timestamp, message, author } of a chat")
    public Object getChatMessages(@PathVariable("chatId") String chatName) {
        //TODO get actual data
        ArrayList<ChatMessage> data = new ArrayList<>();
        data.add(new ChatMessage("puzzles00z", "please implement the the method getChatMessage",  LocalDateTime.of(2024, 11, 30, 15, 30, 0)));
        data.add(new ChatMessage("adrian00z", "please implement the the method getChatMessage",  LocalDateTime.of(2024, 11, 30, 15, 30, 0)));
        data.add(new ChatMessage("puzzles007", "please implement the the method getChatMessage",  LocalDateTime.of(2024, 11, 30, 15, 30, 0)));
        return data;
    }

    @PostMapping("chat/{chatId}")
    @Operation(description = "Adds a message in format { message } to a chat")
    public Object addChatMessage(@PathVariable("chatId") String chatId, @RequestBody String message) {
        //TODO check if chatId is allowed
        messagingTemplate.convertAndSend("/topic/chat/" + chatId,  new ChatMessage(userService.getUsername(), message,  LocalDateTime.now()));
        return new ArrayList<>();
    }

}
