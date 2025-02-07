package backend.model.entities;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class UserPoints {

    private Long id;
    private Long points;
    private LocalDateTime publicationTime;
    private Boolean publishedToday;
    private User user;

    public UserPoints() {
    }

    public UserPoints(Long id, Long points, LocalDateTime publicationTime, Boolean publishedToday, User user) {
        this.id = id;
        this.points = points;
        this.publicationTime = publicationTime;
        this.publishedToday = publishedToday;
        this.user = user;
    }

    public UserPoints(Long points, LocalDateTime publicationTime, Boolean publishedToday, User user) {
        this.points = points;
        this.publicationTime = publicationTime;
        this.publishedToday = publishedToday;
        this.user = user;
    }

    public UserPoints(Long id, Long points, LocalDateTime publicationTime, Boolean publishedToday) {
        this.id = id;
        this.points = points;
        this.publicationTime = publicationTime;
        this.publishedToday = publishedToday;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPoints() {
        return points;
    }

    public void setPoints(Long points) {
        this.points = points;
    }

    public LocalDateTime getPublicationTime() {
        return publicationTime;
    }

    public void setPublicationTime(LocalDateTime publicationTime) {
        this.publicationTime = publicationTime;
    }

    public Boolean getPublishedToday() {
        return publishedToday;
    }

    public void setPublishedToday(Boolean publishedToday) {
        this.publishedToday = publishedToday;
    }

    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
