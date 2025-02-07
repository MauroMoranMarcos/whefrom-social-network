package backend.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface ImageLikeDao extends PagingAndSortingRepository<ImageLike, Long>, CustomizedImageLikeDao {

    boolean existsByUserAndImage(User user, Image image);

    ImageLike findByUserAndImage(User user, Image image);

    Long countByImage(Image image);

}
