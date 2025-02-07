package backend.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface FollowDao extends PagingAndSortingRepository<Follow, Long>, CustomizedFollowDao {

    Long countByUser(User user);

    Long countByFollowsUser(User user);

    boolean existsByUserAndFollowsUser(User user, User followsUser);

    Follow findByUserAndFollowsUser(User user, User followsUser);

}
