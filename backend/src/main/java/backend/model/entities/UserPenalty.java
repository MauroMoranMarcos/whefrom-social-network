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

    public static UserPenalty createNew(User user) {
        return new UserPenalty(user);
    }

    private UserPenalty(User user) {
        this.user = user;
        this.silencedUntil = LocalDate.now().minusYears(1);
        this.blockedUntil = LocalDate.now().minusYears(1);
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

    private void setSilencedUntil(LocalDate silencedUntil) {
        this.silencedUntil = silencedUntil;
    }

    public void silenceUntil(LocalDate silencedUntil) {
        this.silencedUntil = silencedUntil;
    }

    public void resetSilence() {
        this.silencedUntil = LocalDate.now().minusYears(1);
    }

    public LocalDate getBlockedUntil() {
        return blockedUntil;
    }

    private void setBlockedUntil(LocalDate blockedUntil) {
        this.blockedUntil = blockedUntil;
    }

    public void blockUntil(LocalDate blockedUntil) {
        this.blockedUntil = blockedUntil;
    }

    public void resetBlock() {
        this.blockedUntil = LocalDate.now().minusYears(1);
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
