package backend.model.entities;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;

public class CustomizedRewardClaimedDaoImpl implements CustomizedRewardClaimedDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Slice<User> findUsersThatClaimedReward(Long rewardId, int page, int size) {

        String queryString = "SELECT u FROM RewardClaimed rc JOIN User u on rc.user.id = u.id WHERE rc.reward.id = :rewardId";

        Query query = entityManager.createQuery(queryString).setFirstResult(page * size).setMaxResults(size + 1);

        if (rewardId != null) {
            query.setParameter("rewardId", rewardId);
        }

        List<User> users = query.getResultList();
        boolean hasNext = users.size() == (size+1);

        if (hasNext) {
            users.remove(users.size()-1);
        }

        return new SliceImpl<>(users, PageRequest.of(page, size), hasNext);

    }
}
