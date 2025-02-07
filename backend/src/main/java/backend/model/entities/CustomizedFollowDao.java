package backend.model.entities;

import org.springframework.data.domain.Slice;

public interface CustomizedFollowDao {

    Slice<User> findFollowersByUserId(Long userId, Boolean dateDesc, int page, int size);

    Slice<User> findFollowsByUserId(Long userId, Boolean dateDesc, int page, int size);

}
