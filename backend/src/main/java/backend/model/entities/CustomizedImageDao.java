package backend.model.entities;

import org.springframework.data.domain.Slice;

public interface CustomizedImageDao {

    Slice<Image> find(Long categoryId, String text, int page, int size);

    Slice<Image> findByUserId(Long userId, Boolean sameUser, int page, int size);

}
