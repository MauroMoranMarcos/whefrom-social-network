package backend.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface VerificationRequestDao extends PagingAndSortingRepository<VerificationRequest, Long>, CustomizedVerificationRequestDao {

    boolean existsByBrand(User brand);

    Optional<VerificationRequest> findByBrand(User brand);

}
