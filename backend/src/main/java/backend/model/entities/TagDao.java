package backend.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface TagDao extends PagingAndSortingRepository<Tag, Long> {

    List<Tag> findByImageId(Long imageId);

    int countByCategoryId(Long categoryId);
    
}
