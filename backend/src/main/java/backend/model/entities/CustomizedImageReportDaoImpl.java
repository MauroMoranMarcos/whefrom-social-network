package backend.model.entities;

import backend.rest.dtos.ImageReportConversor;
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
public class CustomizedImageReportDaoImpl implements CustomizedImageReportDao {

    @PersistenceContext
    private EntityManager entityManager;


    @Override
    public Slice<ImageReport> find(int page, int size) {

        String queryString = "SELECT ir, COUNT(imageReported) AS cnt FROM ImageReport ir WHERE ir.resolved = false " +
                "GROUP BY ir.id, ir.date ORDER BY cnt DESC, ir.date ASC";

        Query query = entityManager.createQuery(queryString).setFirstResult(page * size).setMaxResults(size + 1);

        List<Object[]> results = query.getResultList();
        boolean hasNext = results.size() == (size + 1);

        if (hasNext) {
            results.remove(results.size() - 1);
        }

        List<ImageReport> imageReports = results.stream().map(result -> (ImageReport) result[0]).collect(Collectors.toList());

        return new SliceImpl<>(imageReports, PageRequest.of(page, size), hasNext);

    }
}
