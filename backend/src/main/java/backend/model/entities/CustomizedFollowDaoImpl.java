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
public class CustomizedFollowDaoImpl implements CustomizedFollowDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Slice<User> findFollowersByUserId(Long userId, Boolean dateDesc, int page, int size) {

        String queryString = "SELECT u FROM Follow f JOIN User u on f.user.id = u.id WHERE f.followsUser.id = :userId";

        if (dateDesc != null && dateDesc) {
            queryString += " ORDER BY f.since DESC";
        } else if (dateDesc != null) {
            queryString += " ORDER BY f.since ASC";
        }

        Query query = entityManager.createQuery(queryString).setFirstResult(page * size).setMaxResults(size + 1);

        if (userId != null) {
            query.setParameter("userId", userId);
        }

        List<User> followers = query.getResultList();
        boolean hasNext = followers.size() == (size+1);

        if (hasNext) {
            followers.remove(followers.size()-1);
        }

        return new SliceImpl<>(followers, PageRequest.of(page, size), hasNext);

    }

    @Override
    public Slice<User> findFollowsByUserId(Long userId, Boolean dateDesc, int page, int size) {

        String queryString = "SELECT u FROM Follow f JOIN User u ON f.followsUser.id = u.id WHERE f.user.id = :userId";

        if (dateDesc != null && dateDesc) {
            queryString += " ORDER BY f.since DESC";
        } else {
            queryString += " ORDER BY f.since ASC";
        }

        Query query = entityManager.createQuery(queryString).setFirstResult(page * size).setMaxResults(size + 1);

        if (userId != null) {
            query.setParameter("userId", userId);
        }

        List<User> followers = query.getResultList();
        boolean hasNext = followers.size() == (size+1);

        if (hasNext) {
            followers.remove(followers.size()-1);
        }

        return new SliceImpl<>(followers, PageRequest.of(page, size), hasNext);

    }
}
