package htl.hl;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.List;

public class KeycloakUserPrinter {

    public static void main(String[] args) {
        // Keycloak Admin Client configuration
        String serverUrl = "http://localhost:8080";  // Keycloak 17+ URL
        String realm = "myrealm";                   // Your realm name
        String clientId = "admin-cli";              // Admin CLI client
        String username = "admin";                  // Admin username
        String password = "admin123";               // Admin password

        // Authenticate and get Keycloak admin client instance
        Keycloak keycloak = KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm("master")                    // Admin login should be in the "master" realm
                .grantType(OAuth2Constants.PASSWORD)
                .clientId(clientId)
                .username(username)
                .password(password)
                .build();

        // Get the users resource for the specified realm
        UsersResource usersResource = keycloak.realm(realm).users();

        // Retrieve all users in the specified realm
        List<UserRepresentation> users = usersResource.list();

        // Print all users
        System.out.println("Keycloak Users:");
        for (UserRepresentation user : users) {
            System.out.println("Username: " + user.getUsername());
            System.out.println("Email: " + user.getEmail());
            System.out.println("First Name: " + user.getFirstName());
            System.out.println("Last Name: " + user.getLastName());
            System.out.println("Enabled: " + user.isEnabled());
            System.out.println("--------------------------------------------------");
        }

        // Close the Keycloak client
        keycloak.close();
    }
}