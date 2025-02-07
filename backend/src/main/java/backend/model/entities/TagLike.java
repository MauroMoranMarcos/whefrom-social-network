package backend.model.entities;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class TagLike {

    private Long id;
    private LocalDateTime date;
    private User user;
    private Tag tag;

    public TagLike() {
    }

    public TagLike(Long id, LocalDateTime date, User user, Tag tag) {
        this.id = id;
        this.date = date;
        this.user = user;
        this.tag = tag;
    }

    public TagLike(LocalDateTime date, User user, Tag tag) {
        this.date = date;
        this.user = user;
        this.tag = tag;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
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
    @JoinColumn(name = "tagId")
    public Tag getTag() {
        return tag;
    }

    public void setTag(Tag tag) {
        this.tag = tag;
    }
    
}
