package backend.rest.dtos;

import java.time.LocalDateTime;

public class ImageReportDto {

    private Long id;
    private String reason;
    private String explanation;
    private Boolean resolved;
    private LocalDateTime date;
    private Long userId;
    private Long imageReportedId;

    public ImageReportDto(Long id, String reason, String explanation, Boolean resolved, LocalDateTime date, Long userId, Long imageReportedId) {
        this.id = id;
        this.reason = reason;
        this.explanation = explanation;
        this.resolved = resolved;
        this.date = date;
        this.userId = userId;
        this.imageReportedId = imageReportedId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getImageReportedId() {
        return imageReportedId;
    }

    public void setImageReportedId(Long imageReportedId) {
        this.imageReportedId = imageReportedId;
    }
}
