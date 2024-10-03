package htl.hl;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.authorization.client.AuthzClient;
import org.keycloak.representations.AccessToken;
import org.keycloak.representations.idm.UserRepresentation;
import org.keycloak.representations.idm.authorization.AuthorizationRequest;
import org.keycloak.representations.idm.authorization.AuthorizationResponse;

import java.util.List;

public class KeycloakUserPrinter {

    public static void main(String[] args) {
        AuthzClient authzClient = AuthzClient.create();
        // create an authorization request
        AuthorizationRequest request = new AuthorizationRequest();

        // send the entitlement request to the server in order to
        // obtain an RPT with all permissions granted to the user
        AuthorizationResponse response = authzClient.authorization("admin", "password").authorize(request);
        String rpt = response.getToken();

        System.out.println("You got an RPT: " + rpt);
    }
}