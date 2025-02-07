package backend.model.entities;

import org.springframework.data.domain.Slice;

public interface CustomizedUserReportDao {

    Slice<UserReport> find(int page, int size);

}
