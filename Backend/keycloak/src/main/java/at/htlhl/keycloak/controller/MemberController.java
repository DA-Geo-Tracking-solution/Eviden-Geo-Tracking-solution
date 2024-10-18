package at.htlhl.keycloak.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/member")
public class MemberController {

    @GetMapping("/hello")
    public String sayHello() {
        return "{\"String\": \"Hallo Member\"}";
    }

}
