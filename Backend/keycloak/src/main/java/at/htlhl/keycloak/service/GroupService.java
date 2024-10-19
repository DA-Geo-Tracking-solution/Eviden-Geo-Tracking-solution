package at.htlhl.keycloak.service;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GroupService {

    @Autowired
    private Keycloak keycloak;

    public void addUserToGroup(String userId, String groupId, String realm) {
        // Assign the user to the group
        keycloak.realm(realm).users().get(userId).joinGroup(groupId);
    }

    public void createGroup(String groupName, String realm) {
        GroupRepresentation group = new GroupRepresentation();
        group.setName(groupName);

        // Create the group in the realm
        keycloak.realm(realm).groups().add(group);
    }
}
