package backend.model.entities;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Image {

    private Long id;
    private String title;
    private String description;
    private String location;
    private byte[] imgFile;
    private LocalDateTime date;
    private Boolean hidden;
    private User user;

    public Image() {
    }

    public Image(Long id, String title, String description, String location, byte[] imgFile, LocalDateTime date, Boolean hidden, User user) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.imgFile = imgFile;
        this.date = date;
        this.hidden = hidden;
        this.user = user;
    }

    public Image(Long id, String title, String description, String location, byte[] imgFile, LocalDateTime date, User user) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.imgFile = imgFile;
        this.date = date;
        this.user = user;
        this.hidden = false;
    }

    public Image(String title, String description, String location, byte[] imgFile, LocalDateTime date, User user) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.imgFile = imgFile;
        this.date = date;
        this.user = user;
        this.hidden = false;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public byte[] getImgFile() {
        return imgFile;
    }

    public void setImgFile(byte[] imgFile) {
        this.imgFile = imgFile;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Boolean getHidden() {
        return hidden;
    }

    public void setHidden(Boolean hidden) {
        this.hidden = hidden;
    }

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
