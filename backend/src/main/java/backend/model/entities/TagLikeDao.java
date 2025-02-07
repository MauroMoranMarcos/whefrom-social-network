package backend.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface TagLikeDao extends PagingAndSortingRepository<TagLike, Long>, CustomizedTagLikeDao {

    boolean existsByUserAndTag(User user, Tag tag);

    TagLike findByUserAndTag(User user, Tag tag);

    Long countByTag(Tag tag);

}
