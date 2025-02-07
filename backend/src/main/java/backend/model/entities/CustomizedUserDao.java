package backend.model.entities;

import org.springframework.data.domain.Slice;

public interface CustomizedUserDao {

    Slice<User> find(String text, Boolean onlyBrands, int page, int size);

}
