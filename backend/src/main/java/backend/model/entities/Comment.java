package backend.model.entities;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Comment {

    private Long id;
    private String text;
    private LocalDateTime date;
    private User user;
    private Image image;
    private Long numAnswers;
    private Comment commentAnswered;

    public Comment() {
    }

    public Comment(Long id, String text, LocalDateTime date, User user, Image image, Long numAnswers,
                   Comment commentAnswered) {
        this.id = id;
        this.text = text;
        this.date = date;
        this.user = user;
        this.image = image;
        this.numAnswers = numAnswers;
        this.commentAnswered = commentAnswered;
    }

    public Comment(String text, LocalDateTime date, User user, Image image, Long numAnswers, Comment commentAnswered) {
        this.text = text;
        this.date = date;
        this.user = user;
        this.image = image;
        this.numAnswers = numAnswers;
        this.commentAnswered = commentAnswered;
    }

    public Comment(String text, LocalDateTime date, User user, Image image, Long numAnswers) {
        this.text = text;
        this.date = date;
        this.user = user;
        this.image = image;
        this.numAnswers = numAnswers;
    }

    public Comment(String text, LocalDateTime date, User user, Image image) {
        this.text = text;
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

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
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

    public Long getNumAnswers() {
        return numAnswers;
    }

    public void setNumAnswers(Long numAnswers) {
        this.numAnswers = numAnswers;
    }

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "commentAnsweredId")
    public Comment getCommentAnswered() {
        return commentAnswered;
    }

    public void setCommentAnswered(Comment commentAnswered) {
        this.commentAnswered = commentAnswered;
    }
}
