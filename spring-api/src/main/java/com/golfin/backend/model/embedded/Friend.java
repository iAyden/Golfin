package com.golfin.backend.model.embedded;

import org.springframework.data.mongodb.core.mapping.Field;

public class Friend {

    @Field("friend_id")
    private String friendId;   // ID del usuario amigo

    @Field("username")
    private String username;   // Nombre de usuario del amigo (opcional para fácil referencia)

    @Field("photo_url")
    private String photoUrl;   // URL de la foto del amigo (opcional)

    public Friend() {}

    public Friend(String friendId, String username, String photoUrl) {
        this.friendId = friendId;
        this.username = username;
        this.photoUrl = photoUrl;
    }

    public String getFriendId() {
        return friendId;
    }

    public void setFriendId(String friendId) {
        this.friendId = friendId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
}
