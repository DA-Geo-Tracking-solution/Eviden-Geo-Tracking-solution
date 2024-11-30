package at.htlhl.keycloak.controller;

import at.htlhl.keycloak.model.Group;
import at.htlhl.keycloak.model.User;
import at.htlhl.keycloak.service.GroupService;
import at.htlhl.keycloak.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/groupmaster")
public class GroupmasterController {

    private GroupService groupService;
    private UserService userService;

    @Autowired
    public GroupmasterController(GroupService groupService, UserService userService) {
        this.groupService = groupService;
        this.userService = userService;
    }

    @PostMapping("/user")
    @Operation(description = "Creates new user in format { {username, userEmail, firstname, lastname}, temporaryPassword } in group")
    public String createUser(@RequestBody Map<String, Object> request) {
        
        User userModel = User.MapToUser((Map<String, Object>) request.get("user"));
        String temporaryPassword = (String) request.get("temporaryPassword");

        return "{ \"message\": \"" + userService.createUser(userModel.getUserRepresentation(temporaryPassword)) + "\" }";
    }

    @PostMapping("/subgroup")
    @Operation(description = "Creates new subrgoup in format { name, groupmasterEmail } and adds a groupmaster")
    public String createSubGroup(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        String groupmasterEmail = (String) request.get("groupmasterEmail");
        try {
            groupService.createSubGroupWithRoles(name, groupmasterEmail);
        } catch (Exception e) {
            return e.getMessage();
        }
        return "not completely implemented";
    }

    @GetMapping("/subgroups")
    @Operation(description = "optionally")
    public Object getSubGroups() {
        return "get all subgroups as a tree (not implemented)";
    }
}
