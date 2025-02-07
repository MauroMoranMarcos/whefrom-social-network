package backend.rest.dtos;

import backend.model.entities.User;

import java.time.LocalDateTime;

public class UserPointsDto {

    private Long id;
    private Long points;
    private LocalDateTime publicationTime;
    private Boolean publishedToday;

    public UserPointsDto(Long id, Long points, LocalDateTime publicationTime, Boolean publishedToday) {
        this.id = id;
        this.points = points;
        this.publicationTime = publicationTime;
        this.publishedToday = publishedToday;
    }

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

    public void setPublicationTime(LocalDateTime publicationTime) {
        this.publicationTime = publicationTime;
    }

    public Boolean getPublishedToday() {
        return publishedToday;
    }

    public void setPublishedToday(Boolean publishedToday) {
        this.publishedToday = publishedToday;
    }
}
