package at.htlhl.keycloak.model;

import java.util.List;

public class Chat {
    private String chatId;
    private List<String> usersEmails;

    public List<String> getUsersEmails() {
        return usersEmails;
    }

    public void setUsersEmails(List<String> usersEmails) {
        this.usersEmails = usersEmails;
    }

    public String getChatId() {
        return chatId;
    }

    public void setChatId(String chatId) {
        this.chatId = chatId;
    }


}
