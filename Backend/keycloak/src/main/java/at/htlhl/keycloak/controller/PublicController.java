package at.htlhl.keycloak.controller;

import at.htlhl.keycloak.service.GroupService;
import at.htlhl.keycloak.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/public")
public class PublicController {

    @GetMapping("/hello")
    public String sayHello() {
        return "{\"String\": \"Hallo Welt\"}";
    }

}
