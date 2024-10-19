package at.htlhl.keycloak.controller;

import at.htlhl.keycloak.model.Chat;
import at.htlhl.keycloak.service.GroupService;
import at.htlhl.keycloak.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.james.mime4j.dom.datetime.DateTime;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

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
    @Operation(description = "Returns all users in format { Firstname, Lastname } of your group")
    public List<Object> getGroupMembers() {
        return new ArrayList<>();
    }

    @GetMapping(path = "/user/{userEmail}")
    @Operation(description = "Returns data of specific User")
    public List<UserRepresentation> getUser(@PathVariable("userEmail") String userName){
        List<UserRepresentation> user = userService.getUser(userName);
        return user;
    }

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
