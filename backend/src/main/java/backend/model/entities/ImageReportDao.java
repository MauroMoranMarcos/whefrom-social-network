package backend.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface ImageReportDao extends PagingAndSortingRepository<ImageReport, Long>, CustomizedImageReportDao {

    boolean existsByUserAndImageReported(User user, Image imageReported);

    ImageReport findByUserAndImageReported(User user, Image imageReported);

}
