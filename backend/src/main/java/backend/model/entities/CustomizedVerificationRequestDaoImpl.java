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
public class CustomizedVerificationRequestDaoImpl implements CustomizedVerificationRequestDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Slice<User> findVerificationRequests(int page, int size) {

        String queryString = "SELECT u FROM VerificationRequest vr JOIN User u on vr.brand.id = u.id" +
                " ORDER BY vr.date";

        Query query = entityManager.createQuery(queryString).setFirstResult(page * size).setMaxResults(size + 1);

        List<User> usersThatRequested = query.getResultList();
        boolean hasNext = usersThatRequested.size() == (size+1);

        if (hasNext) {
            usersThatRequested.remove(usersThatRequested.size()-1);
        }

        return new SliceImpl<>(usersThatRequested, PageRequest.of(page, size), hasNext);

    }
}
