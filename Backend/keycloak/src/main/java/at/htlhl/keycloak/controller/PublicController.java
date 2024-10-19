package at.htlhl.keycloak.controller;

import at.htlhl.keycloak.service.GroupService;
import at.htlhl.keycloak.service.UserService;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/public")
public class PublicController {

    private GroupService groupService;
    private UserService userService;

    @Autowired
    public PublicController(GroupService groupService, UserService userService) {
        this.groupService = groupService;
        this.userService = userService;
    }

    @GetMapping("/hello")
    public String sayHello() {
        return "{\"String\": \"Hallo Welt\"}";
    }

    @GetMapping(path = "/user/{userName}")
    public List<UserRepresentation> getUser(@PathVariable("userName") String userName){
        List<UserRepresentation> user = userService.getUser(userName);
        return user;
    }
}
