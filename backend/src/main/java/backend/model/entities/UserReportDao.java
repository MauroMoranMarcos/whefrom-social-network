package backend.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface UserReportDao extends PagingAndSortingRepository<UserReport, Long>, CustomizedUserReportDao {

    boolean existsByUserAndUserReported(User user, User userReported);

    UserReport findByUserAndUserReported(User user, User userReported);

}
