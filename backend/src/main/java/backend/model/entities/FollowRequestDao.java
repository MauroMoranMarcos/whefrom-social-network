package backend.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface FollowRequestDao extends PagingAndSortingRepository<FollowRequest, Long>, CustomizedFollowRequestDao {

    Long countByUserToFollow(User userToFollow);

    boolean existsByUserAndUserToFollow(User user, User userToFollow);

    FollowRequest findByUserAndUserToFollow(User user, User userToFollow);

}
