package backend.model.entities;

import org.springframework.data.domain.Slice;

public interface CustomizedTagLikeDao {

    Slice<Tag> findTagsLikedByUser(Long userId, Boolean dateDesc, int page, int size);

    Slice<User> findUsersThatLikedTag(Long tagId, Boolean dateDesc, int page, int size);

}
