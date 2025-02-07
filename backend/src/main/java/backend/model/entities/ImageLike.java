package backend.model.entities;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ImageLike {

    private Long id;
    private LocalDateTime date;
    private User user;
    private Image image;

    public ImageLike() {
    }

    public ImageLike(Long id, LocalDateTime date, User user, Image image) {
        this.id = id;
        this.date = date;
        this.user = user;
        this.image = image;
    }

    public ImageLike(LocalDateTime date, User user, Image image) {
        this.date = date;
        this.user = user;
        this.image = image;
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
    @JoinColumn(name = "imageId")
    public Image getImage() {
        return image;
    }

    public void setImage(Image image) {
        this.image = image;
    }
}
