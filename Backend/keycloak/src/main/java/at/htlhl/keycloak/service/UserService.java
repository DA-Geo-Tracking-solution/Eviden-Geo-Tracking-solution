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


@Service
public class UserService {

    @Autowired
    private Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    public UserRepresentation getUserByEmail(String userEmail) {
        System.out.println(userEmail);
        List<UserRepresentation> users = keycloak.realm(realm).users().searchByEmail(userEmail, true);
        return users.stream().findFirst().orElse(null);
    }


    public String createUser(UserRepresentation user) {
        Response response = keycloak.realm(realm).users().create(user);
        try {
            if (response.getStatus() == 201) {
                //String userId = response.getLocation().getPath().replaceAll(".*/([^/]+)$", "$1");
                return "Successful created user";
            } else {
                return ("Failed to create user: " + response.getStatus());
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

    public String getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (String) ((Jwt) authentication.getPrincipal()).getClaims().get(StandardClaimNames.SUB);
    }

    public List<GroupRepresentation> getUserGroups() {
        return keycloak.realm(realm).users().get(getUserId()).groups();
    }

    public List<UserRepresentation> getGroupMembers() {
        List<GroupRepresentation> groups = getUserGroups();

        if (!groups.isEmpty()) {
            String groupId = groups.get(0).getId();
            return keycloak.realm(realm).groups().group(groupId).members();
        }
        return List.of();
    }

    /*public void addUser(User userModel) throws Exception{
        CredentialRepresentation credential = createPasswordCredentials(userModel.getPassword());
        UserRepresentation user = new UserRepresentation();
        user.setUsername(userModel.getUserName());
        user.setFirstName(userModel.getFirstname());
        user.setLastName(userModel.getLastName());
        user.setEmail(userModel.getEmailId());
        user.setCredentials(Collections.singletonList(credential));
        user.setEnabled(true);

        RealmResource realmResource = keycloak.realm(KeycloakConfig.realm);
        UsersResource usersResource = realmResource.users();


        usersResource.create(user);
    }


    public static CredentialRepresentation createPasswordCredentials(String password) {
        CredentialRepresentation passwordCredentials = new CredentialRepresentation();
        passwordCredentials.setTemporary(false);
        passwordCredentials.setType(CredentialRepresentation.PASSWORD);
        passwordCredentials.setValue(password);
        return passwordCredentials;
    }*/
}
