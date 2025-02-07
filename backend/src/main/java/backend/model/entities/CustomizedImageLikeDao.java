package backend.model.entities;

import org.springframework.data.domain.Slice;

public interface CustomizedImageLikeDao {

    Slice<Image> findImagesLikedByUser(Long userId, Boolean dateDesc, int page, int size);

    Slice<User> findUsersThatLikedImage(Long imageId, Boolean dateDesc, int page, int size);

}
