package backend.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface RewardDao extends PagingAndSortingRepository<Reward, Long>, CustomizedRewardDao {

    List<Reward> findByBrandOrderByStock(User brand);

    List<Reward> findByBrandOrderByPointsCost(User brand);

}
