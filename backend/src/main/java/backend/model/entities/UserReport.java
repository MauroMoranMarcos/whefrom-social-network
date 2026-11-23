package backend.model.entities;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class UserReport {

    public enum Reason {IDENTITY_FRAUD, UNDER_16, SPAM, NAKED_OR_SEXUAL_ACTIVITY, VIOLENCE, BULLYING, FRAUD};

    private Long id;
    private Reason reason;
    private String explanation;
    private Boolean resolved;
    private LocalDateTime date;
    private User user;
    private User userReported;

    public UserReport() {
    }

    public UserReport(Long id, Reason reason, String explanation, Boolean resolved, LocalDateTime date, User user, User userReported) {
        this.id = id;
        this.reason = reason;
        this.explanation = explanation;
        this.resolved = resolved;
        this.date = date;
        this.user = user;
        this.userReported = userReported;
    }

    public UserReport(Reason reason, String explanation, Boolean resolved, LocalDateTime date, User user, User userReported) {
        this.reason = reason;
        this.explanation = explanation;
        this.resolved = resolved;
        this.date = date;
        this.user = user;
        this.userReported = userReported;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Reason getReason() {
        return reason;
    }

    public void setReason(Reason reason) {
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

    private void setResolved(Boolean resolved) {
        this.resolved = resolved;
    }

    public void resolve() {
        this.resolved = true;
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
    @JoinColumn(name = "userReportedId")
    public User getUserReported() {
        return userReported;
    }

    public void setUserReported(User userReported) {
        this.userReported = userReported;
    }
}
