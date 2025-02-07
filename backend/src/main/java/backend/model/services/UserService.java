package backend.model.services;

import backend.model.entities.User;
import backend.model.entities.UserSettings;
import backend.model.exceptions.*;

import java.io.IOException;

public interface UserService {

    void signUp(User user) throws DuplicateInstanceException, InvalidBirthDateException;

    User login(String userName, String password) throws IncorrectLoginException, BlockedException;

    User loginFromId(Long id) throws InstanceNotFoundException;

    User findUserById(Long userId) throws InstanceNotFoundException;

    void addProfilePicture(Long userId, byte[] image) throws InstanceNotFoundException;

    User updateProfile(Long id, String name, String surname, String email, String phoneNumber,
                       String about) throws InstanceNotFoundException;

    void changePassword(Long id, String oldPassword, String newPassword)
            throws InstanceNotFoundException, IncorrectPasswordException;

    void restorePassword(String email, String verificationCode, String newPassword) throws InstanceNotFoundException,
            PermissionException;

    void sendVerificationCode(String email) throws EmailNotFoundException, IOException;

    void enterVerificationCode(String email, String verificationCode) throws EmailNotFoundException,
            WrongVerificationCodeException;

    UserSettings findUserSettingsByUserId(Long userId) throws InstanceNotFoundException;

    UserSettings updateUserSettings(Long id, Boolean privacyPublic, Boolean notifyMe) throws InstanceNotFoundException;

    Block<User> findUsers(String keywords, Boolean onlyBrands, int page, int size);

    Long followUser(Long userId, Long userFollowedId) throws InstanceNotFoundException, UserAlreadyFollowedException,
            PermissionException;

    Boolean unFollowUser(Long userId, Long userUnFollowedId) throws InstanceNotFoundException, UserNotFollowedException,
            PermissionException;

    Block<User> findUserFollowers(Long userId, Long userLoggedId, Boolean dateDesc, int page, int size)
            throws InstanceNotFoundException, PermissionException;

    Block<User> findUserFollowed(Long userId, Long userLoggedId, Boolean dateDesc, int page, int size)
            throws InstanceNotFoundException, PermissionException;

    Long getUserNumFollowers(Long userId) throws InstanceNotFoundException;

    Long getUserNumFollowed(Long userId) throws InstanceNotFoundException;

    Boolean isUserFollowingUser(Long userId, Long userFollowingId) throws InstanceNotFoundException;

    Long requestFollow(Long userId, Long userRequestedId) throws InstanceNotFoundException, UserAlreadyFollowedException,
            PermissionException, UserAlreadyRequestedException;

    Boolean deleteRequestFollow(Long userId, Long userRequestedId) throws InstanceNotFoundException,
            FollowRequestNotFoundException, PermissionException;

    Block<User> findUserFollowRequests(Long userId, int page, int size) throws InstanceNotFoundException;

    Long getNumFollowRequests(Long userId) throws InstanceNotFoundException;

    Long acceptFollowRequest(Long userRequestingId, Long userId) throws InstanceNotFoundException, PermissionException,
            UserAlreadyFollowedException;

    Boolean rejectFollowRequest(Long userRequestingId, Long userId) throws InstanceNotFoundException;

    Boolean hasUserRequestedToFollow(Long userId, Long userRequestedId) throws InstanceNotFoundException;

    Long reportUser(Long userLoggedId, Long userReportedId, String reason, String explanation)
            throws InstanceNotFoundException, ReportAlreadyGivenException;

    UserSettings dontShowAgainUplRewardHelp(Long userLoggedId) throws InstanceNotFoundException;

    UserSettings dontShowAgainUplImageHelp(Long userLoggedId) throws InstanceNotFoundException;

}
