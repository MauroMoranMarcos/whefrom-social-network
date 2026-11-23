package backend.model.entities;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Random;

@Entity
public class UserPoints {

    private Long id;
    private Long points;
    private LocalDateTime publicationTime;
    private Boolean publishedToday;
    private User user;

    public UserPoints() {
    }

    public static UserPoints createNew(User user) {
        return new UserPoints(user);
    }

    private UserPoints(User user) {
        this.user = user;
        this.points = 0L;
        this.publicationTime = LocalDateTime.now();
        this.publishedToday = false;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPoints() {
        return points;
    }

    public void setPoints(Long points) {
        this.points = points;
    }

    public LocalDateTime getPublicationTime() {
        return publicationTime;
    }

    private void setPublicationTime(LocalDateTime publicationTime) {
        this.publicationTime = publicationTime;
    }

    public Boolean getPublishedToday() {
        return publishedToday;
    }

    private void setPublishedToday(Boolean publishedToday) {
        this.publishedToday = publishedToday;
    }

    public void resetPublicationTime() {
        Random random = new Random();

        // Generar una hora aleatoria entre 0 y 23
        int hour = random.nextInt(24);

        // Generar minutos y segundos aleatorios entre 0 y 59
        int minute = random.nextInt(60);
        int second = random.nextInt(60);

        // Crear el LocalDateTime con la fecha actual y la hora generada aleatoriamente
        this.publicationTime = LocalDateTime.of(LocalDate.now(),
                java.time.LocalTime.of(hour, minute, second));
        this.publishedToday = false;
    }

    public void resetPublishedToday() {
        this.publishedToday = false;
    }

    public void publishedToday() {
        this.publishedToday = true;
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
