package at.htlhl.keycloak.repositories;


import java.util.List;
import java.util.UUID;

import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.stereotype.Repository;
import at.htlhl.keycloak.model.UserByChat;
import at.htlhl.keycloak.model.UserByChat.UserByChatKey;

@Repository
public interface UserByChatRepository extends CassandraRepository<UserByChat, UserByChatKey> {

    @Query("SELECT user_email FROM users_by_chat WHERE chat_id = ?0")
    List<UserByChat> getUsersInChat(UUID chatId);

    @Query("SELECT user_email FROM users_by_chat WHERE chat_id = ?0 AND user_email = ?1 LIMIT 1")
    List<UserByChat> isUserInChat(UUID chatId, String userEmail);

}
