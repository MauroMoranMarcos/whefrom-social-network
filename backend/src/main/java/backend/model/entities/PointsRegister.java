package backend.model.entities;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class PointsRegister {

    private Long id;
    private Long pointsGiven;
    private LocalDateTime date;
    private User user;
    private Follow follow;
    private ImageLike imageLike;
    private TagLike tagLike;
    private Comment comment;

    public PointsRegister() {
    }

    public PointsRegister(Long id, Long pointsGiven, LocalDateTime date, User user, Follow follow, ImageLike imageLike,
                          TagLike tagLike, Comment comment) {
        this.id = id;
        this.pointsGiven = pointsGiven;
        this.date = date;
        this.user = user;
        this.follow = follow;
        this.imageLike = imageLike;
        this.tagLike = tagLike;
        this.comment = comment;
    }

    public PointsRegister(Long pointsGiven, LocalDateTime date, User user, Follow follow, ImageLike imageLike,
                          TagLike tagLike, Comment comment) {
        this.pointsGiven = pointsGiven;
        this.date = date;
        this.user = user;
        this.follow = follow;
        this.imageLike = imageLike;
        this.tagLike = tagLike;
        this.comment = comment;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPointsGiven() {
        return pointsGiven;
    }

    public void setPointsGiven(Long pointsGiven) {
        this.pointsGiven = pointsGiven;
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
    @JoinColumn(name = "followId")
    public Follow getFollow() {
        return follow;
    }

    public void setFollow(Follow follow) {
        this.follow = follow;
    }

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "imgLikeId")
    public ImageLike getImageLike() {
        return imageLike;
    }

    public void setImageLike(ImageLike imageLike) {
        this.imageLike = imageLike;
    }

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "tagLikeId")
    public TagLike getTagLike() {
        return tagLike;
    }

    public void setTagLike(TagLike tagLike) {
        this.tagLike = tagLike;
    }

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "commentId")
    public Comment getComment() {
        return comment;
    }

    public void setComment(Comment comment) {
        this.comment = comment;
    }
}
