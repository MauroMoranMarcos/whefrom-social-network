package backend.model.entities;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Follow {

    private Long id;
    private LocalDateTime since;
    private User user;
    private User followsUser;

    public Follow() {
    }

    public Follow(Long id, LocalDateTime since, User user, User followsUser) {
        this.id = id;
        this.since = since;
        this.user = user;
        this.followsUser = followsUser;
    }

    public Follow(LocalDateTime since, User user, User followsUser) {
        this.since = since;
        this.user = user;
        this.followsUser = followsUser;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getSince() {
        return since;
    }

    public void setSince(LocalDateTime since) {
        this.since = since;
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
    @JoinColumn(name = "followsUserId")
    public User getFollowsUser() {
        return followsUser;
    }

    public void setFollowsUser(User followsUser) {
        this.followsUser = followsUser;
    }
}
