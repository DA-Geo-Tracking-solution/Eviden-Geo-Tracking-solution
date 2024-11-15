package at.htlhl.keycloak.service;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupService {

    @Value("${keycloak.realm}")
    private String realm;

    @Autowired
    private Keycloak keycloak;

    public void addUserToGroup(String userId, String groupId, String realm) {
        // Assign the user to the group
        keycloak.realm(realm).users().get(userId).joinGroup(groupId);
    }

    public GroupRepresentation createGroupWithRoles(String groupName, List<String> roleNames) {
        GroupRepresentation group = new GroupRepresentation();
        group.setName(groupName);

        keycloak.realm(realm).groups().add(group);

        // Retrieve the created group by name to get the ID
        List<GroupRepresentation> groups = keycloak.realm(realm).groups().groups(groupName, 0, 1);
        if (groups.isEmpty()) {
            throw new RuntimeException("Group creation failed");
        }
        GroupRepresentation createdGroup = groups.get(0);

        // Add roles to the group
        List<RoleRepresentation> roles = keycloak.realm(realm).roles().list().stream()
                .filter(role -> roleNames.contains(role.getName()))
                .toList();
        keycloak.realm(realm).groups().group(createdGroup.getId()).roles().realmLevel().add(roles);

        return createdGroup;
    }
}
