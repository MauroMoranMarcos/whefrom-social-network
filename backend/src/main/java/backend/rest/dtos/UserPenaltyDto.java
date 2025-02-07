package backend.rest.dtos;

import java.time.LocalDate;

public class UserPenaltyDto {

    private Long id;
    private LocalDate silencedUntil;
    private LocalDate blockedUntil;

    public UserPenaltyDto(Long id, LocalDate silencedUntil, LocalDate blockedUntil) {
        this.id = id;
        this.silencedUntil = silencedUntil;
        this.blockedUntil = blockedUntil;
    }

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
}
