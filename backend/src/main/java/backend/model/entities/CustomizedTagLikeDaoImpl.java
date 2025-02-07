package backend.model.entities;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;

@Component
public class CustomizedTagLikeDaoImpl implements CustomizedTagLikeDao {

    @PersistenceContext
    EntityManager entityManager;

    @Override
    public Slice<Tag> findTagsLikedByUser(Long userId, Boolean dateDesc, int page, int size) {

        String queryString = "SELECT t FROM TagLike tl JOIN Tag t on tl.tag.id = t.id WHERE tl.user.id = :userId";

        if (dateDesc != null && dateDesc) {
            queryString += " ORDER BY tl.date DESC";
        } else if (dateDesc != null) {
            queryString += " ORDER BY tl.date ASC";
        }

        Query query = entityManager.createQuery(queryString).setFirstResult(page * size).setMaxResults(size + 1);

        if (userId != null) {
            query.setParameter("userId", userId);
        }

        List<Tag> tags = query.getResultList();
        boolean hasNext = tags.size() == (size+1);

        if (hasNext) {
            tags.remove(tags.size()-1);
        }

        return new SliceImpl<>(tags, PageRequest.of(page, size), hasNext);

    }

    @Override
    public Slice<User> findUsersThatLikedTag(Long tagId, Boolean dateDesc, int page, int size) {

        String queryString = "SELECT u FROM TagLike tl JOIN User u on tl.user.id = u.id WHERE tl.tag.id = :tagId";

        if (dateDesc != null && dateDesc) {
            queryString += " ORDER BY tl.date DESC";
        } else if (dateDesc != null) {
            queryString += " ORDER BY tl.date ASC";
        }

        Query query = entityManager.createQuery(queryString).setFirstResult(page * size).setMaxResults(size + 1);

        if (tagId != null) {
            query.setParameter("tagId", tagId);
        }

        List<User> users = query.getResultList();
        boolean hasNext = users.size() == (size+1);

        if (hasNext) {
            users.remove(users.size()-1);
        }

        return new SliceImpl<>(users, PageRequest.of(page, size), hasNext);

    }
}
