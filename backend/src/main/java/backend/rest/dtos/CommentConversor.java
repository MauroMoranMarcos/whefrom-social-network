package backend.rest.dtos;

import backend.model.entities.Comment;

import java.util.List;
import java.util.stream.Collectors;

public class CommentConversor {

    private CommentConversor() {}

    public final static CommentDto toCommentDto(Comment comment) {
        return new CommentDto(comment.getId(), comment.getText(), comment.getDate(), comment.getUser().getId(),
                comment.getImage().getId(), comment.getNumAnswers(),
                comment.getCommentAnswered() == null ? null : comment.getCommentAnswered().getId());
    }

    public final static List<CommentDto> toCommentDtos(List<Comment> comments) {

        return comments.stream().map(u -> toCommentDto(u)).collect(Collectors.toList());

    }

}
