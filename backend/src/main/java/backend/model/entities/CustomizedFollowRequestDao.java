package backend.model.entities;

import org.springframework.data.domain.Slice;

public interface CustomizedFollowRequestDao {

    Slice<User> findFollowRequests(Long userId, int page, int size);

}
