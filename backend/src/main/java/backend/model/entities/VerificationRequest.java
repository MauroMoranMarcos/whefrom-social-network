package backend.model.entities;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class VerificationRequest {

    private Long id;
    private LocalDateTime date;
    private User brand;

    public VerificationRequest() {
    }

    public VerificationRequest(Long id, LocalDateTime date, User brand) {
        this.id = id;
        this.date = date;
        this.brand = brand;
    }

    public VerificationRequest(LocalDateTime date, User brand) {
        this.date = date;
        this.brand = brand;
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
    @JoinColumn(name = "brandId")
    public User getBrand() {
        return brand;
    }

    public void setBrand(User brand) {
        this.brand = brand;
    }
}
