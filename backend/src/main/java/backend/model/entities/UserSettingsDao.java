package backend.model.entities;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface UserSettingsDao extends PagingAndSortingRepository<UserSettings, Long> {

    Optional<UserSettings> findByUser(User user);

}
