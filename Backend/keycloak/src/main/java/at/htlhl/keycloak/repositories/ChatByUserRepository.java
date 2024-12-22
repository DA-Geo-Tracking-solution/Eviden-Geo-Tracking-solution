package at.htlhl.keycloak.repositories;


import java.util.List;

import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.stereotype.Repository;

import at.htlhl.keycloak.model.ChatByUser;
import at.htlhl.keycloak.model.ChatByUser.ChatByUserKey;

@Repository
public interface ChatByUserRepository extends CassandraRepository<ChatByUser, ChatByUserKey> {

    @Query("SELECT * FROM chats_by_user WHERE user_email = ?0")
    List<ChatByUser> getChatsFromUser(String user_email);

}
