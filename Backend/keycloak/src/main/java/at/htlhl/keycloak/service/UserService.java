package at.htlhl.keycloak.service;

import at.htlhl.keycloak.config.KeycloakConfig;
import at.htlhl.keycloak.model.User;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private Keycloak keycloak;

    public void addUser(User userModel) throws Exception{
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

    public List<UserRepresentation> getUser(String userName){
        RealmResource realmResource = keycloak.realm(KeycloakConfig.realm);
        UsersResource usersResource = realmResource.users();
        return usersResource.search(userName, true);
    }

    public static CredentialRepresentation createPasswordCredentials(String password) {
        CredentialRepresentation passwordCredentials = new CredentialRepresentation();
        passwordCredentials.setTemporary(false);
        passwordCredentials.setType(CredentialRepresentation.PASSWORD);
        passwordCredentials.setValue(password);
        return passwordCredentials;
    }
}
