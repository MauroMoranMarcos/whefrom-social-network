package backend.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface RewardClaimedDao extends PagingAndSortingRepository<RewardClaimed, Long>, CustomizedRewardClaimedDao {

    boolean existsByUserAndReward(User user, Reward reward);

}
