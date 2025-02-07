package backend.model.entities;

import javax.persistence.*;

@Entity
public class ImageSeenInFeed {

    private Long id;
    private User user;
    private Image image;

    public ImageSeenInFeed() {
    }

    public ImageSeenInFeed(User user, Image image) {
        this.user = user;
        this.image = image;
    }

    public ImageSeenInFeed(Long id, User user, Image image) {
        this.id = id;
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
