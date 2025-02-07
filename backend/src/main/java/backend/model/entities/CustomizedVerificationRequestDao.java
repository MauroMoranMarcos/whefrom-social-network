package backend.model.entities;

import org.springframework.data.domain.Slice;

public interface CustomizedVerificationRequestDao {

    Slice<User> findVerificationRequests(int page, int size);

}
