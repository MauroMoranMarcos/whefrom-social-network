package backend.model.entities;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.List;

@Component
public class CustomizedCommentDaoImpl implements CustomizedCommentDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Slice<Comment> findCommentsByImage(Long imageId, int page, int size) {

        String queryString = "SELECT c FROM Comment c WHERE c.image.id = :imageId";

        queryString += " ORDER BY c.numAnswers DESC";

        Query query = entityManager.createQuery(queryString).setFirstResult(page * size).setMaxResults(size + 1);

        if (imageId != null) {
            query.setParameter("imageId", imageId);
        }

        List<Comment> comments = query.getResultList();

        List<Comment> commentsNotAnswers = new ArrayList<>();

        for (Comment comment : comments) {
            if (comment.getCommentAnswered() == null) {
                commentsNotAnswers.add(comment);
            }
        }

        boolean hasNext = commentsNotAnswers.size() == (size+1);

        if (hasNext) {
            commentsNotAnswers.remove(commentsNotAnswers.size()-1);
        }

        return new SliceImpl<>(commentsNotAnswers, PageRequest.of(page, size), hasNext);

    }

    @Override
    public Slice<Comment> findCommentAnswers(Long commentId, int page, int size) {

        String queryString = "SELECT c FROM Comment c WHERE c.commentAnswered.id = :commentId";

        queryString += " ORDER BY c.numAnswers DESC";

        Query query = entityManager.createQuery(queryString).setFirstResult(page * size).setMaxResults(size + 1);

        if (commentId != null) {
            query.setParameter("commentId", commentId);
        }

        List<Comment> comments = query.getResultList();
        boolean hasNext = comments.size() == (size+1);

        if (hasNext) {
            comments.remove(comments.size()-1);
        }

        return new SliceImpl<>(comments, PageRequest.of(page, size), hasNext);

    }
}
