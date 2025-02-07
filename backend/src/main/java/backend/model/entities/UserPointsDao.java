package backend.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface UserPointsDao extends PagingAndSortingRepository<UserPoints, Long> {

    Optional<UserPoints> findByUser(User user);

}
