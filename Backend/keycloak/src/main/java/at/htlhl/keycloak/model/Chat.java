package at.htlhl.keycloak.model;

import java.util.Arrays;
import java.util.List;

public class Chat {
    private String chatId;
    private String chatName;
    private List<String> userEmails;

    public Chat (String chatId, String chatName, String[] userEmails ) {
        this.chatId = chatId;
        this.chatName = chatName;
        this.userEmails = Arrays.asList(userEmails);
    }

    public String getChatId() {
        return this.chatId;
    }

    public void setChatId(String chatId) {
        this.chatId = chatId;
    }

    public String getChatName() {
        return this.chatName;
    }

    public void setChatName(String chatName) {
        this.chatName = chatName;
    }

    public List<String> getUserEmails() {
        return this.userEmails;
    }

    public void setUserEmails(List<String> userEmails) {
        this.userEmails = userEmails;
    }

}
