package at.htlhl.keycloak.controller;

import at.htlhl.keycloak.model.Chat;
import at.htlhl.keycloak.model.User;
import at.htlhl.keycloak.service.GroupService;
import at.htlhl.keycloak.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.james.mime4j.dom.datetime.DateTime;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/member")
public class MemberController {

    private GroupService groupService;
    private UserService userService;

    @Autowired
    public MemberController(GroupService groupService, UserService userService) {
        this.groupService = groupService;
        this.userService = userService;
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

    @GetMapping("/group-members-locations")
    @Operation(description = "Returns some users location data in format { userId, { longitude, latitude }, timestamp } of your group")
    public List<Object> getCoordinates(List<Object> users, DateTime earliestTime) {
        return new ArrayList<>();
    }

    @GetMapping("/chats/{userEmail}") // Todo chats: user hinzufügen, editieren
    @Operation(description = "Returns all chats a user has in format { chatName }")
    public List<String> getChats(@PathVariable("userEmail") String userEmail) {
        return new ArrayList<>();
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
    public Object getChatMessages(@PathVariable("chatId") String chatName, int amount) {
        return new ArrayList<>();
    }

    @PostMapping("chat/{chatId}/")
    @Operation(description = "Adds a message in format { message } to a chat")
    public Object addChatMessage(@PathVariable("chatId") String chatId, String message) {
        return new ArrayList<>();
    }

}
