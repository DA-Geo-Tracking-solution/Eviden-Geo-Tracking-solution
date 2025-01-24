package at.htlhl.keycloak.service;

import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.core.oidc.StandardClaimNames;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
//import javax.ws.rs.core.Response;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    public List<UserRepresentation> getGroupMembers() {
        List<GroupRepresentation> groups = getUserGroups();

        if (!groups.isEmpty()) {
            String groupId = groups.get(0).getId();
            return keycloak.realm(realm).groups().group(groupId).members().stream()
                .filter(user -> !user.getEmail().equals(getUserEmail()))
                .collect(Collectors.toList());
        }
        return List.of();
    }


    public UserRepresentation getUserByEmail(String userEmail) {
        System.out.println(userEmail);
        List<UserRepresentation> users = keycloak.realm(realm).users().searchByEmail(userEmail, true);
        return users.stream().findFirst().orElse(null);
    }

    public String createUser(UserRepresentation user) {
        List<GroupRepresentation> groups = getUserGroups();
        if (groups.isEmpty()) {
            return "Invalid Request! User is in no group! >8[)";
        }
        List<String> groupNames = List.of(groups.get(0).getName());
        user.setGroups(groupNames);

        Response response = keycloak.realm(realm).users().create(user);
        try {
            int status = response.getStatus();
            if (status == 400) {
                return ("Wrong User Input!");
            } else if (status == 409) {
                return ("Username or Email already in Use!");
            } else if (status == 201) {
                return "Successful created user :)";
                // String userId = response.getLocation().getPath().replaceAll(".*/([^/]+)$",
                // "$1");
            } else {
                String errorResponse = response.readEntity(String.class);
                System.err.println("Error response from Keycloak: " + errorResponse);
                return "Keycloak: " + status + " - " + errorResponse;
            }
        } finally {
            response.close();
        }
    }

    public void updateUser(String userId, UserRepresentation user) {
        keycloak.realm(realm).users().get(userId).update(user);
    }

    public void deleteUser(String userId) {
        keycloak.realm(realm).users().get(userId).remove();
    }

    private String getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        return (String) jwt.getClaims().get(StandardClaimNames.SUB);
    }

    public String getUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        return (String) jwt.getClaims().get("email");
    }

    public String getUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        return (String) jwt.getClaims().get("preferred_username");
    }

    public List<GroupRepresentation> getUserGroups() {
        return keycloak.realm(realm).users().get(getUserId()).groups();
    }
}
