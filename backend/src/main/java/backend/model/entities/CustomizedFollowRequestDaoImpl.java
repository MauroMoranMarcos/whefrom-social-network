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
public class CustomizedFollowRequestDaoImpl implements CustomizedFollowRequestDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Slice<User> findFollowRequests(Long userId, int page, int size) {

        String queryString = "SELECT u FROM FollowRequest fr JOIN User u on fr.user.id = u.id WHERE fr.userToFollow.id = :userId";

        Query query = entityManager.createQuery(queryString).setFirstResult(page * size).setMaxResults(size + 1);

        if (userId != null) {
            query.setParameter("userId", userId);
        }

        List<User> usersThatRequested = query.getResultList();
        boolean hasNext = usersThatRequested.size() == (size+1);

        if (hasNext) {
            usersThatRequested.remove(usersThatRequested.size()-1);
        }

        return new SliceImpl<>(usersThatRequested, PageRequest.of(page, size), hasNext);

    }
}
