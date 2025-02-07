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
public class CustomizedImageLikeDaoImpl implements CustomizedImageLikeDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Slice<Image> findImagesLikedByUser(Long userId, Boolean dateDesc, int page, int size) {

        String queryString = "SELECT i FROM ImageLike il JOIN Image i on il.image.id = i.id WHERE il.user.id = :userId";

        if (dateDesc != null && dateDesc) {
            queryString += " ORDER BY il.date DESC";
        } else if (dateDesc != null) {
            queryString += " ORDER BY il.date ASC";
        }

        Query query = entityManager.createQuery(queryString).setFirstResult(page * size).setMaxResults(size + 1);

        if (userId != null) {
            query.setParameter("userId", userId);
        }

        List<Image> images = query.getResultList();
        boolean hasNext = images.size() == (size+1);

        if (hasNext) {
            images.remove(images.size()-1);
        }

        return new SliceImpl<>(images, PageRequest.of(page, size), hasNext);

    }

    @Override
    public Slice<User> findUsersThatLikedImage(Long imageId, Boolean dateDesc, int page, int size) {

        String queryString = "SELECT u FROM ImageLike il JOIN User u on il.user.id = u.id WHERE il.image.id = :imageId";

        if (dateDesc != null && dateDesc) {
            queryString += " ORDER BY il.date DESC";
        } else if (dateDesc != null) {
            queryString += " ORDER BY il.date ASC";
        }

        Query query = entityManager.createQuery(queryString).setFirstResult(page * size).setMaxResults(size + 1);

        if (imageId != null) {
            query.setParameter("imageId", imageId);
        }

        List<User> users = query.getResultList();
        boolean hasNext = users.size() == (size+1);

        if (hasNext) {
            users.remove(users.size()-1);
        }

        return new SliceImpl<>(users, PageRequest.of(page, size), hasNext);

    }
}
