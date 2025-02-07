package backend.model.entities;

import org.springframework.data.domain.Slice;

public interface CustomizedCommentDao {

    Slice<Comment> findCommentsByImage(Long imageId, int page, int size);

    Slice<Comment> findCommentAnswers(Long commentId, int page, int size);

}
