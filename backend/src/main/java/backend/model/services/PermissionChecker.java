package backend.model.services;

import backend.model.entities.Image;
import backend.model.entities.User;
import backend.model.entities.UserSettings;
import backend.model.exceptions.InstanceNotFoundException;

public interface PermissionChecker {

    void checkUserExists(Long userId) throws InstanceNotFoundException;

    User checkUser(Long userId) throws InstanceNotFoundException;

    UserSettings checkUserSettings(Long userId) throws InstanceNotFoundException;

    Image checkImage(Long imageId) throws InstanceNotFoundException;

}
