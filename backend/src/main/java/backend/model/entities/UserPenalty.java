package backend.model.entities;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class UserPenalty {

    private Long id;
    private LocalDate silencedUntil;
    private LocalDate blockedUntil;
    private User user;

    public UserPenalty() {
    }

    public UserPenalty(Long id, LocalDate silencedUntil, LocalDate blockedUntil, User user) {
        this.id = id;
        this.silencedUntil = silencedUntil;
        this.blockedUntil = blockedUntil;
        this.user = user;
    }

    public UserPenalty(LocalDate silencedUntil, LocalDate blockedUntil, User user) {
        this.silencedUntil = silencedUntil;
        this.blockedUntil = blockedUntil;
        this.user = user;
    }

    public UserPenalty(Long id, LocalDate silencedUntil, LocalDate blockedUntil) {
        this.id = id;
        this.silencedUntil = silencedUntil;
        this.blockedUntil = blockedUntil;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getSilencedUntil() {
        return silencedUntil;
    }

    public void setSilencedUntil(LocalDate silencedUntil) {
        this.silencedUntil = silencedUntil;
    }

    public LocalDate getBlockedUntil() {
        return blockedUntil;
    }

    public void setBlockedUntil(LocalDate blockedUntil) {
        this.blockedUntil = blockedUntil;
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
