package backend.model.entities;

import org.springframework.data.domain.Slice;

public interface CustomizedRewardClaimedDao {

    Slice<User> findUsersThatClaimedReward(Long rewardId, int page, int size);

}
