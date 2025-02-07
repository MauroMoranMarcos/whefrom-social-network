package backend.model.entities;

import org.springframework.data.domain.Slice;

public interface CustomizedRewardDao {

    Slice<Reward> find(Long brandId, Boolean sameBrand, Reward.FilterType filterType, int page, int size);

}
