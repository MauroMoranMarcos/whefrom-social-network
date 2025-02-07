package backend.model.entities;

import org.springframework.data.domain.Slice;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface CategoryDao extends PagingAndSortingRepository<Category, Long> {

    boolean existsByName(String name);

    Optional<Category> findByName(String name);

    Slice<Category> findByActiveOrderByNameAsc(Boolean active);

}
