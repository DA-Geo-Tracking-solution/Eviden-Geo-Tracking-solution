![alt text](image.png)


fix:
 - docker stop $(docker ps -aq)
 - docker rm $(docker ps -aq)
 - docker volume rm $(docker volume ls -q)


complete keycloak Export:
 - docker-compose up -d keycloak
 - docker ps
 - docker exec -it <KeycloakContainerId> /opt/keycloak/bin/kc.sh export --dir /opt/keycloak/data/export --users realm_file --realm geo-tracking-solution
 - docker cp <KeycloakContainerId>:/opt/keycloak/data/export ./realm-config/exported-keycloak-data
// the file is copied in this folder: ./realm-config/exported-keycloak-data
// -> so you have to rename it and move it in the right directory