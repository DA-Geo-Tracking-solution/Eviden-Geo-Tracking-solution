package at.htlhl.keycloak.service;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.StandardClaimNames;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupService {

    @Value("${keycloak.realm}")
    private String realm;

    @Autowired
    private Keycloak keycloak;


    public static final List<String> ALL_ROLE_NAMES = Arrays.asList("groupmaster", "squadmaster", "member");


    public void addUserToGroupByUseremail(String userEmail, GroupRepresentation group, List<String> roleNames) throws Exception {
        RealmResource realmResource = keycloak.realm(realm);

        // Add User to Group
        //List<UserRepresentation> users = realmResource.users().searchByEmail(userEmail, true);
        List<UserRepresentation> users = getGroupMembers().stream()
            .filter(user -> user.getEmail().equals(userEmail))
            .collect(Collectors.toList());
        if (users.isEmpty()) {
            throw new Exception("User with email " + userEmail + " in this group not found.");
        }
        UserResource userResource = realmResource.users().get(users.get(0).getId());
        List<GroupRepresentation> currentGroups = userResource.groups();
        for (GroupRepresentation currentGroup : currentGroups) {
            userResource.leaveGroup(currentGroup.getId());
            System.out.println("User removed from group: " + group.getName());
        }
        userResource.joinGroup(group.getId());

        // Assign roles to the user
        List<RoleRepresentation> roles = rolesByRoleNames(roleNames);
        userResource.roles().realmLevel().add(roles);

        System.out.println("User " + userEmail + " has been added to group " + group.getName() + " and assigned roles.");
    }

    public GroupRepresentation createSubGroupWithRoles(String groupName, String groupmasterEmail) throws Exception{
        // Create new Subgroup
        GroupRepresentation group = new GroupRepresentation();
        group.setName(groupName);
        List<GroupRepresentation> groups = getUserGroups();
        if (groups.isEmpty()) {
            throw new Exception("Invalid Request! User is in no group! >8[)");
        }
        if (groups.get(0).getSubGroups().stream().filter(subgroup -> subgroup.getName().equals(groupName)).toList().isEmpty()) {
            throw new Exception("Subgroup already exists!");
        }
        group.setParentId(groups.get(0).getId());
        keycloak.realm(realm).groups().add(group);

        // Add Roles To Group
        GroupRepresentation createdGroup = getGroupFromName(groupName);
        List<RoleRepresentation> roles = rolesByRoleNames(ALL_ROLE_NAMES);
        keycloak.realm(realm).groups().group(createdGroup.getId()).roles().realmLevel().add(roles);

        //Add Groupmaster to Subgroup
        addUserToGroupByUseremail(groupmasterEmail, createdGroup, ALL_ROLE_NAMES);

        return createdGroup;
    }

    public List<GroupRepresentation> getSubGroupsOf(GroupRepresentation parentGroup) {
            return parentGroup.getSubGroups();
    }

    private List<UserRepresentation> getGroupMembers() {
        List<GroupRepresentation> groups = getUserGroups();

        if (!groups.isEmpty()) {
            String groupId = groups.get(0).getId();
            return keycloak.realm(realm).groups().group(groupId).members();
        }
        return List.of();
    }

    private List<RoleRepresentation> rolesByRoleNames(List<String> roleNames) {
        return keycloak.realm(realm).roles().list().stream()
                .filter(role -> roleNames.contains(role.getName()))
                .toList();
    }

    private GroupRepresentation getGroupFromName(String groupName) throws Exception{
        List<GroupRepresentation> groups = keycloak.realm(realm).groups().groups(groupName, 0, 1);
        if (groups.isEmpty()) {
            throw new Exception("Group with name " + groupName + " not found.");
        }
        return groups.get(0);
    }

    private String getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (String) ((Jwt) authentication.getPrincipal()).getClaims().get(StandardClaimNames.SUB);
    }

    private List<GroupRepresentation> getUserGroups() {
        return keycloak.realm(realm).users().get(getUserId()).groups();
    }
}
