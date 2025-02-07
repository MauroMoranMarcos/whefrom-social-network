package backend.model.entities;

import javax.persistence.*;

@Entity
public class FollowRequest {

    private Long id;
    private User user;
    private User userToFollow;

    public FollowRequest() {
    }

    public FollowRequest(Long id, User user, User userToFollow) {
        this.id = id;
        this.user = user;
        this.userToFollow = userToFollow;
    }

    public FollowRequest(User user, User userToFollow) {
        this.user = user;
        this.userToFollow = userToFollow;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "userToFollowId")
    public User getUserToFollow() {
        return userToFollow;
    }

    public void setUserToFollow(User userToFollow) {
        this.userToFollow = userToFollow;
    }
}
