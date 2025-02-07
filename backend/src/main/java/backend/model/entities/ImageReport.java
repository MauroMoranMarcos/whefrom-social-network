package backend.model.entities;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ImageReport {

    private Long id;
    private UserReport.Reason reason;
    private String explanation;
    private Boolean resolved;
    private LocalDateTime date;
    private User user;
    private Image imageReported;

    public ImageReport() {
    }

    public ImageReport(Long id, UserReport.Reason reason, String explanation, Boolean resolved, LocalDateTime date, User user, Image imageReported) {
        this.id = id;
        this.reason = reason;
        this.explanation = explanation;
        this.resolved = resolved;
        this.date = date;
        this.user = user;
        this.imageReported = imageReported;
    }

    public ImageReport(UserReport.Reason reason, String explanation, Boolean resolved, LocalDateTime date, User user, Image imageReported) {
        this.reason = reason;
        this.explanation = explanation;
        this.resolved = resolved;
        this.date = date;
        this.user = user;
        this.imageReported = imageReported;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserReport.Reason getReason() {
        return reason;
    }

    public void setReason(UserReport.Reason reason) {
        this.reason = reason;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public Boolean getResolved() {
        return resolved;
    }

    public void setResolved(Boolean resolved) {
        this.resolved = resolved;
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
    @JoinColumn(name = "imageReportedId")
    public Image getImageReported() {
        return imageReported;
    }

    public void setImageReported(Image imageReported) {
        this.imageReported = imageReported;
    }
}
