package backend.rest.dtos;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

public class CommentDto {

    private Long id;
    private String text;
    private LocalDateTime date;
    private Long userId;
    private Long imageId;
    private Long numAnswers;
    private Long commentAnsweredId;

    public CommentDto() {
    }

    public CommentDto(Long id, String text, LocalDateTime date, Long userId, Long imageId, Long numAnswers,
                      Long commentAnsweredId) {
        this.id = id;
        this.text = text;
        this.date = date;
        this.userId = userId;
        this.imageId = imageId;
        this.numAnswers = numAnswers;
        this.commentAnsweredId = commentAnsweredId;
    }

    public CommentDto(Long id, String text, LocalDateTime date, Long userId, Long imageId, Long numAnswers) {
        this.id = id;
        this.text = text;
        this.date = date;
        this.userId = userId;
        this.imageId = imageId;
        this.numAnswers = numAnswers;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @NotNull
    @Size(min = 1, max = 100)
    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    @NotNull
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @NotNull
    public Long getImageId() {
        return imageId;
    }

    public void setImageId(Long imageId) {
        this.imageId = imageId;
    }

    @NotNull
    public Long getNumAnswers() {
        return numAnswers;
    }

    public void setNumAnswers(Long numAnswers) {
        this.numAnswers = numAnswers;
    }

    public Long getCommentAnsweredId() {
        return commentAnsweredId;
    }

    public void setCommentAnsweredId(Long commentAnsweredId) {
        this.commentAnsweredId = commentAnsweredId;
    }
}
