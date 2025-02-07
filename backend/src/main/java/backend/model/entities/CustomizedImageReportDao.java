package backend.model.entities;

import org.springframework.data.domain.Slice;

public interface CustomizedImageReportDao {

    Slice<ImageReport> find(int page, int size);

}
