package backend.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface ImageSeenInFeedDao extends PagingAndSortingRepository<ImageSeenInFeed, Long> {

    List<ImageSeenInFeed> findByUser(User user);

    boolean existsByUserAndImage(User user, Image image);
    
}
