package backend.model.entities;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CustomizedUserReportDaoImpl implements CustomizedUserReportDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Slice<UserReport> find(int page, int size) {

        String queryString = "SELECT ur, COUNT(userReported) AS cnt FROM UserReport ur WHERE ur.resolved = false " +
                "GROUP BY ur.id, ur.date ORDER BY cnt DESC, ur.date ASC";

        Query query = entityManager.createQuery(queryString).setFirstResult(page * size).setMaxResults(size + 1);

        List<Object[]> results = query.getResultList();
        boolean hasNext = results.size() == (size + 1);

        if (hasNext) {
            results.remove(results.size() - 1);
        }

        List<UserReport> userReports = results.stream().map(result -> (UserReport) result[0]).collect(Collectors.toList());

        return new SliceImpl<>(userReports, PageRequest.of(page, size), hasNext);

    }
}
