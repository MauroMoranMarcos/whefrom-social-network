package backend.model.entities;

import org.springframework.data.domain.Slice;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ImageDao extends PagingAndSortingRepository<Image, Long>, CustomizedImageDao {
}
