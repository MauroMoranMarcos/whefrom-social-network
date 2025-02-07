package backend.rest.dtos;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class CommentImageParamsDto {

    private String text;
    private Long commentAnsweredId;

    @NotNull
    @Size(min=1, max=100)
    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Long getCommentAnsweredId() {
        return commentAnsweredId;
    }

    public void setCommentAnsweredId(Long commentAnsweredId) {
        this.commentAnsweredId = commentAnsweredId;
    }
}
