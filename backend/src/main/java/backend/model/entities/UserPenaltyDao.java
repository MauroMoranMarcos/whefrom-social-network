package backend.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface UserPenaltyDao extends PagingAndSortingRepository<UserPenalty, Long> {

    Optional<UserPenalty> findByUser(User user);
    
}
