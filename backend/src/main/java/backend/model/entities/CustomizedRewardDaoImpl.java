package backend.model.entities;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;

public class CustomizedRewardDaoImpl implements CustomizedRewardDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Slice<Reward> find(Long brandId, Boolean sameBrand, Reward.FilterType filterType, int page, int size) {

        String queryString;

        if (brandId != 0) {
            if (!sameBrand) {
                queryString = "SELECT r FROM Reward r WHERE r.brand.id = :brandId AND r.hidden = false";
            } else {
                queryString = "SELECT r FROM Reward r WHERE r.brand.id = :brandId";
            }
        } else {
            if (!sameBrand) {
                queryString = "SELECT r FROM Reward r WHERE r.hidden = false";
            } else {
                queryString = "SELECT r FROM Reward r";
            }
        }

        switch (filterType) {
            case CREATION_DATE_DESC -> queryString += " ORDER BY r.creationDate DESC";
            case CREATION_DATE_ASC -> queryString += " ORDER BY r.creationDate ASC";
            case POINTS_COST_DESC -> queryString += " ORDER BY r.pointsCost DESC";
            case POINTS_COST_ASC -> queryString += " ORDER BY r.pointsCost ASC";
            case STOCK_DESC -> queryString += " ORDER BY r.stock DESC";
            case STOCK_ASC -> queryString += " ORDER BY r.stock ASC";
            case STOCK_ASC_ONLY_IN_STOCK -> {
                if (brandId == 0 && sameBrand) {
                    queryString += " WHERE r.stock > 0 ORDER BY r.stock ASC";
                } else {
                    queryString += " AND r.stock > 0 ORDER BY r.stock ASC";
                }
            }
        }

        Query query = entityManager.createQuery(queryString).setFirstResult(page * size).setMaxResults(size + 1);

        if (brandId != 0) {
            query.setParameter("brandId", brandId);
        }

        List<Reward> rewards = query.getResultList();
        boolean hasNext = rewards.size() == (size+1);

        if (hasNext) {
            rewards.remove(rewards.size()-1);
        }

        return new SliceImpl<>(rewards, PageRequest.of(page, size), hasNext);

    }

}
