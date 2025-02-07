package backend.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface CommentDao extends PagingAndSortingRepository<Comment, Long>, CustomizedCommentDao {

    Comment findByUserAndImage(User user, Image image);

    Long countByImage(Image image);

    Long countByCommentAnswered(Comment comment);

}
