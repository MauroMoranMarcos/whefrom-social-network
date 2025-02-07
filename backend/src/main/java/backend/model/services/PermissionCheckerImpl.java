package backend.model.services;

import backend.model.entities.*;
import backend.model.exceptions.InstanceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class PermissionCheckerImpl implements PermissionChecker {

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserSettingsDao userSettingsDao;

    @Autowired
    private ImageDao imageDao;

    @Override
    public void checkUserExists(Long userId) throws InstanceNotFoundException {

        if (!userDao.existsById(userId)) {
            throw new InstanceNotFoundException("project.entities.user", userId);
        }

    }

    @Override
    public User checkUser(Long userId) throws InstanceNotFoundException {

        Optional<User> user = userDao.findById(userId);

        if (!user.isPresent()) {
            throw new InstanceNotFoundException("project.entities.user", userId);
        }

        return user.get();

    }

    @Override
    public UserSettings checkUserSettings(Long userId) throws InstanceNotFoundException {

        User user = checkUser(userId);

        Optional<UserSettings> userSettings = userSettingsDao.findByUser(user);

        if (!userSettings.isPresent()) {
            throw new InstanceNotFoundException("project.entities.userSettings", userId);
        }

        return userSettings.get();

    }

    @Override
    public Image checkImage(Long imageId) throws InstanceNotFoundException {

        Optional<Image> image = imageDao.findById(imageId);

        if (!image.isPresent()) {
            throw new InstanceNotFoundException("project.entities.image", image);
        }

        return image.get();

    }
}
