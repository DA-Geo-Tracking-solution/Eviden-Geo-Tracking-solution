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
    @Operation(description = "Creates new user in format { userEmail, username, firstname, lastname, temporaryPassword } in Group")
    public String createUser(@RequestBody User userModel){
        userModel.getLastname();
        try {
            throw new Exception("not implemented");
            //userService.addUser(userModel);
        } catch (Exception e) {
            return "Failed to Add User!";
        }
        //return "User Added Successfully.";
    }


    @PostMapping("/subgroup")
    @Operation(description = "")
    public String createSubGroup(@RequestBody Group group) {
        return "not Successful";
    }

    @GetMapping("/subgroups")
    @Operation(description = "optionally")
    public Object getSubGroups() {
        return "get all subgroups as a tree";
    }
}
