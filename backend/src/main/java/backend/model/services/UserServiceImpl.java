package backend.model.services;

import backend.model.entities.*;
import backend.model.exceptions.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Slice;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.*;
import java.time.LocalDate;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final int RANDOM_INIT = 100000;
    private final int RANDOM_BOUND = 900000;

    private final String SENDER_EMAIL = "tfgwhefrom@gmail.com";

    private final Long MINIMUM_AGE = 16L;

    private final Long NUM_POINTS_PER_FOLLOW = 100L;

    private Properties properties = new Properties();
    private InputStream inputStream = null;

    @Autowired
    private PermissionChecker permissionChecker;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserSettingsDao userSettingsDao;

    @Autowired
    private UserPointsDao userPointsDao;

    @Autowired
    private UserPenaltyDao userPenaltyDao;

    @Autowired
    private PointsRegisterDao pointsRegisterDao;

    @Autowired
    private FollowDao followDao;

    @Autowired
    private FollowRequestDao followRequestDao;

    @Autowired
    private UserReportDao userReportDao;

    @Override
    public void signUp(User user) throws DuplicateInstanceException, InvalidBirthDateException {

        if (userDao.existsByUserName(user.getUserName())) {
            throw new DuplicateInstanceException("project.entities.user", user.getUserName());
        }

        if ((user.getRole() == User.RoleType.NORMAL_USER) &&
                user.getBirthDate().plusYears(MINIMUM_AGE).isAfter(LocalDate.now())) {
            throw new InvalidBirthDateException();
        }

        UserSettings userSettings = new UserSettings(user);

        UserPoints userPoints = new UserPoints(0L, LocalDateTime.now(), false, user);

        UserPenalty userPenalty = new UserPenalty(LocalDate.now().minusYears(1), LocalDate.now().minusYears(1), user);

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.setUserSettings(userSettings);
        user.setUserPoints(userPoints);
        user.setUserPenalty(userPenalty);

        userDao.save(user);
        userSettingsDao.save(userSettings);
        userPointsDao.save(userPoints);
        userPenaltyDao.save(userPenalty);

    }

    @Override
    @Transactional(readOnly = true)
    public User login(String userName, String password) throws IncorrectLoginException, BlockedException {

        Optional<User> user = userDao.findByUserName(userName);

        if (!user.isPresent()) {
            throw new IncorrectLoginException(userName, password);
        }

        if (!passwordEncoder.matches(password, user.get().getPassword())) {
            throw new IncorrectLoginException(userName, password);
        }

        if (user.get().getUserPenalty().getBlockedUntil().isAfter(LocalDate.now())) {
            throw new BlockedException();
        } else {
            user.get().setBlocked(false);
        }

        return user.get();

    }

    @Override
    @Transactional(readOnly=true)
    public User loginFromId(Long id) throws InstanceNotFoundException {
        return permissionChecker.checkUser(id);
    }

    @Override
    public User findUserById(Long userId) throws InstanceNotFoundException {

        Optional<User> user = userDao.findById(userId);

        if (!user.isPresent()) {
            throw new InstanceNotFoundException("User id", userId);
        }

        return user.get();

    }

    @Override
    public void addProfilePicture(Long userId, byte[] image) throws InstanceNotFoundException {

        if (!userDao.existsById(userId)) {
            throw new InstanceNotFoundException("User id", userId);
        }

        Optional<User> user = userDao.findById(userId);

        if (user.isPresent()) {
            user.get().setProfilePicture(image);
        }

    }

    @Override
    public User updateProfile(Long id, String firstName, String lastName, String email, String phoneNumber,
                              String about) throws InstanceNotFoundException {

        User user = permissionChecker.checkUser(id);

        user.setName(firstName);
        user.setSurname(lastName);
        user.setEmail(email);
        user.setPhoneNumber(phoneNumber);
        user.setAbout(about);

        return user;

    }

    @Override
    public void changePassword(Long id, String oldPassword, String newPassword)
            throws InstanceNotFoundException, IncorrectPasswordException {

        User user = permissionChecker.checkUser(id);

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IncorrectPasswordException();
        } else {
            user.setPassword(passwordEncoder.encode(newPassword));
        }

    }

    @Override
    public void restorePassword(String email, String verificationCode, String newPassword)
            throws InstanceNotFoundException, PermissionException {

        Optional<User> userOpt = userDao.findByEmail(email);

        if (!userOpt.isPresent()) {
            throw new InstanceNotFoundException("email", email);
        }

        User user = userOpt.get();

        if (!Objects.equals(user.getVerificationCode(), verificationCode)) {
            throw new PermissionException();
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        user.setVerificationCode("");

    }

    @Override
    public void sendVerificationCode(String email) throws EmailNotFoundException, IOException {

        Optional<User> user = userDao.findByEmail(email);

        Random random = new Random();

        String verificationCode = String.valueOf((RANDOM_INIT + random.nextInt(RANDOM_BOUND)));
        
        if (!user.isPresent()) {
            throw new EmailNotFoundException();
        }

        user.get().setVerificationCode(verificationCode);

        inputStream = new FileInputStream("src/main/resources/messages_en.properties");
        properties.load(inputStream);

        SimpleMailMessage mailMessage = new SimpleMailMessage();

        String mailBody = properties.getProperty("project.messages.mail.restorePasswordBody");
        String mailSubject = properties.getProperty("project.messages.mail.restorePasswordSubject");


        mailMessage.setFrom(SENDER_EMAIL);
        mailMessage.setTo(email);
        mailMessage.setText(mailBody + "\n\n" + verificationCode);
        mailMessage.setSubject(mailSubject);

        mailSender.send(mailMessage);

    }

    @Override
    public void enterVerificationCode(String email, String verificationCode) throws EmailNotFoundException,
            WrongVerificationCodeException {

        Optional<User> user = userDao.findByEmail(email);

        if (!user.isPresent()) {
            throw new EmailNotFoundException();
        }

        if (!Objects.equals(user.get().getVerificationCode(), verificationCode)) {
            throw new WrongVerificationCodeException();
        }
        
    }

    @Override
    public UserSettings findUserSettingsByUserId(Long userId) throws InstanceNotFoundException {

        Optional<User> userOpt = userDao.findById(userId);

        if (!userOpt.isPresent()) {
            throw new InstanceNotFoundException("userId", userId);
        }

        User user = userOpt.get();

        Optional<UserSettings> userSettingsOpt = userSettingsDao.findByUser(user);

        if (!userSettingsOpt.isPresent()) {
            throw new InstanceNotFoundException("user", user);
        }

        return userSettingsOpt.get();

    }

    @Override
    public UserSettings updateUserSettings(Long id, Boolean privacyPublic, Boolean notifyMe)
            throws InstanceNotFoundException {

        User user = permissionChecker.checkUser(id);

        Optional<UserSettings> userSettingsOpt = userSettingsDao.findByUser(user);

        if (!userSettingsOpt.isPresent()) {
            throw new InstanceNotFoundException("user", user);
        }

        UserSettings userSettings = userSettingsOpt.get();

        userSettings.setPrivacyPublic(privacyPublic);
        userSettings.setNotifyMe(notifyMe);

        return userSettings;

    }

    @Override
    public Block<User> findUsers(String keywords, Boolean onlyBrands, int page, int size) {

        Slice<User> slice = userDao.find(keywords, onlyBrands, page, size);

        return new Block<>(slice.getContent(), slice.hasNext());
        
    }

    @Override
    public Long followUser(Long userId, Long userFollowedId) throws InstanceNotFoundException,
            UserAlreadyFollowedException, PermissionException {

        if (userId.equals(userFollowedId)) {
            throw new PermissionException();
        }

        User user = permissionChecker.checkUser(userId);
        User userFollowed = permissionChecker.checkUser(userFollowedId);

        if (followDao.existsByUserAndFollowsUser(user, userFollowed)) {
            throw new UserAlreadyFollowedException();
        }

        Follow follow = new Follow(LocalDateTime.now(), user, userFollowed);

        followDao.save(follow);

        UserPoints userPoints = userFollowed.getUserPoints();

        userPoints.setPoints(userPoints.getPoints() + NUM_POINTS_PER_FOLLOW);

        PointsRegister pointsRegister = new PointsRegister(NUM_POINTS_PER_FOLLOW, LocalDateTime.now(), userFollowed,
                follow, null, null, null);

        pointsRegisterDao.save(pointsRegister);

        return follow.getId();

    }

    @Override
    public Boolean unFollowUser(Long userId, Long userUnFollowedId) throws InstanceNotFoundException,
            UserNotFollowedException, PermissionException {

        if (userId.equals(userUnFollowedId)) {
            throw new PermissionException();
        }

        User user = permissionChecker.checkUser(userId);
        User userUnFollowed = permissionChecker.checkUser(userUnFollowedId);

        if (!followDao.existsByUserAndFollowsUser(user, userUnFollowed)) {
            throw new UserNotFollowedException();
        }

        Follow follow = followDao.findByUserAndFollowsUser(user, userUnFollowed);

        followDao.delete(follow);

        UserPoints userPoints = userUnFollowed.getUserPoints();

        userPoints.setPoints(userPoints.getPoints() - NUM_POINTS_PER_FOLLOW);

        return !followDao.existsById(follow.getId());

    }

    @Override
    public Block<User> findUserFollowers(Long userId, Long userLoggedId, Boolean dateDesc, int page, int size)
            throws InstanceNotFoundException, PermissionException {

        User user = permissionChecker.checkUser(userId);

        UserSettings userSettings = permissionChecker.checkUserSettings(userId);

        User userLogged = new User();

        if (userLoggedId != 0) {
            userLogged = permissionChecker.checkUser(userLoggedId);
        }

        if (userLoggedId != 0 && userLogged.getRole().equals(User.RoleType.ADMIN_USER)) {
            Slice<User> slice = followDao.findFollowersByUserId(userId, dateDesc, page, size);

            return new Block<>(slice.getContent(), slice.hasNext());
        }

        if (userLoggedId == 0 && !userSettings.getPrivacyPublic()) {

            throw new PermissionException();

        } else if (userLoggedId == 0) {

            Slice<User> slice = followDao.findFollowersByUserId(userId, dateDesc, page, size);

            return new Block<>(slice.getContent(), slice.hasNext());

        }

        if (!userSettings.getPrivacyPublic() && !isUserFollowingUser(userLoggedId, user.getId())
                && !user.equals(userLogged)) {
            throw new PermissionException();
        }

        Slice<User> slice = followDao.findFollowersByUserId(userId, dateDesc, page, size);

        return new Block<>(slice.getContent(), slice.hasNext());

    }

    @Override
    public Block<User> findUserFollowed(Long userId, Long userLoggedId, Boolean dateDesc, int page, int size)
            throws InstanceNotFoundException, PermissionException {

        User user = permissionChecker.checkUser(userId);

        UserSettings userSettings = permissionChecker.checkUserSettings(userId);

        User userLogged = new User();

        if (userLoggedId != 0) {
            userLogged = permissionChecker.checkUser(userLoggedId);
        }

        if (userLoggedId != 0 && userLogged.getRole().equals(User.RoleType.ADMIN_USER)) {
            Slice<User> slice = followDao.findFollowsByUserId(userId, dateDesc, page, size);

            return new Block<>(slice.getContent(), slice.hasNext());
        }

        if (userLoggedId == 0 && !userSettings.getPrivacyPublic()) {

            throw new PermissionException();

        } else if (userLoggedId == 0) {

            Slice<User> slice = followDao.findFollowsByUserId(userId, dateDesc, page, size);

            return new Block<>(slice.getContent(), slice.hasNext());

        }

        if (!userSettings.getPrivacyPublic() && !isUserFollowingUser(userLoggedId, user.getId())
                && !user.equals(userLogged)) {
            throw new PermissionException();
        }

        Slice<User> slice = followDao.findFollowsByUserId(userId, dateDesc, page, size);

        return new Block<>(slice.getContent(), slice.hasNext());

    }

    @Override
    public Long getUserNumFollowers(Long userId) throws InstanceNotFoundException {

        User user = permissionChecker.checkUser(userId);

        return followDao.countByFollowsUser(user);

    }

    @Override
    public Long getUserNumFollowed(Long userId) throws InstanceNotFoundException {

        User user = permissionChecker.checkUser(userId);

        return followDao.countByUser(user);

    }

    @Override
    public Boolean isUserFollowingUser(Long userId, Long userFollowingId) throws InstanceNotFoundException {

        User user = permissionChecker.checkUser(userId);
        User userFollowing = permissionChecker.checkUser(userFollowingId);

        return followDao.existsByUserAndFollowsUser(user, userFollowing);

    }

    @Override
    public Long requestFollow(Long userId, Long userRequestedId) throws InstanceNotFoundException,
            UserAlreadyFollowedException, PermissionException, UserAlreadyRequestedException {

        if (userId.equals(userRequestedId)) {
            throw new PermissionException();
        }

        if (isUserFollowingUser(userId, userRequestedId)) {
            throw new UserAlreadyFollowedException();
        }

        User user = permissionChecker.checkUser(userId);

        User userRequested = permissionChecker.checkUser(userRequestedId);

        if (followRequestDao.existsByUserAndUserToFollow(user, userRequested)) {
            throw new UserAlreadyRequestedException();
        }

        UserSettings userSettings = userRequested.getUserSettings();

        if (userSettings.getPrivacyPublic()) {
            throw new PermissionException();
        }

        FollowRequest followRequest = new FollowRequest(user, userRequested);

        followRequestDao.save(followRequest);

        return followRequest.getId();

    }

    @Override
    public Boolean deleteRequestFollow(Long userId, Long userRequestedId) throws InstanceNotFoundException,
            FollowRequestNotFoundException, PermissionException {

        if (userId.equals(userRequestedId)) {
            throw new PermissionException();
        }

        User user = permissionChecker.checkUser(userId);

        User userRequested = permissionChecker.checkUser(userRequestedId);

        if (!followRequestDao.existsByUserAndUserToFollow(user, userRequested)) {
            throw new FollowRequestNotFoundException();
        }

        FollowRequest followRequest = followRequestDao.findByUserAndUserToFollow(user, userRequested);

        followRequestDao.delete(followRequest);

        return !followRequestDao.existsByUserAndUserToFollow(user, userRequested);

    }

    @Override
    public Block<User> findUserFollowRequests(Long userId, int page, int size)
            throws InstanceNotFoundException {

        permissionChecker.checkUser(userId);

        Slice<User> slice = followRequestDao.findFollowRequests(userId, page, size);

        return new Block<>(slice.getContent(), slice.hasNext());

    }

    @Override
    public Long getNumFollowRequests(Long userId) throws InstanceNotFoundException {

        User user = permissionChecker.checkUser(userId);

        return followRequestDao.countByUserToFollow(user);

    }

    @Override
    public Long acceptFollowRequest(Long userRequestingId, Long userId) throws InstanceNotFoundException,
            PermissionException, UserAlreadyFollowedException {

        User user = permissionChecker.checkUser(userId);

        User userRequesting = permissionChecker.checkUser(userRequestingId);

        if (!followRequestDao.existsByUserAndUserToFollow(userRequesting, user)) {
            throw new InstanceNotFoundException("project.entities.followRequest", userId);
        }

        FollowRequest followRequest = followRequestDao.findByUserAndUserToFollow(userRequesting, user);

        followRequestDao.delete(followRequest);

        if (followRequestDao.existsById(followRequest.getId())) {
            throw new PermissionException();
        }

        return followUser(followRequest.getUser().getId(), userId);

    }

    @Override
    public Boolean rejectFollowRequest(Long userRequestingId, Long userId) throws InstanceNotFoundException {

        User user = permissionChecker.checkUser(userId);

        User userRequesting = permissionChecker.checkUser(userRequestingId);

        if (!followRequestDao.existsByUserAndUserToFollow(userRequesting, user)) {
            throw new InstanceNotFoundException("project.entities.followRequest", userId);
        }

        FollowRequest followRequest = followRequestDao.findByUserAndUserToFollow(userRequesting, user);

        followRequestDao.delete(followRequest);

        return !followRequestDao.existsById(followRequest.getId());

    }

    @Override
    public Boolean hasUserRequestedToFollow(Long userId, Long userRequestedId) throws InstanceNotFoundException {

        User user = permissionChecker.checkUser(userId);

        User userRequested = permissionChecker.checkUser(userRequestedId);

        return followRequestDao.existsByUserAndUserToFollow(user, userRequested);

    }

    @Override
    public Long reportUser(Long userLoggedId, Long userReportedId, String reason, String explanation)
            throws InstanceNotFoundException, ReportAlreadyGivenException {

        User user = permissionChecker.checkUser(userLoggedId);

        User userReported = permissionChecker.checkUser(userReportedId);

        if (userReportDao.existsByUserAndUserReported(user, userReported)) {
            throw new ReportAlreadyGivenException();
        }

        UserReport userReport = new UserReport(
                null, explanation, false, LocalDateTime.now(), user, userReported);

        if (Objects.equals(reason, "IDENTITY_FRAUD")) {
            userReport.setReason(UserReport.Reason.IDENTITY_FRAUD);
        }

        if (Objects.equals(reason, "UNDER_16")) {
            userReport.setReason(UserReport.Reason.UNDER_16);
        }

        if (Objects.equals(reason, "SPAM")) {
            userReport.setReason(UserReport.Reason.SPAM);
        }

        if (Objects.equals(reason, "NAKED_OR_SEXUAL_ACTIVITY")) {
            userReport.setReason(UserReport.Reason.NAKED_OR_SEXUAL_ACTIVITY);
        }

        if (Objects.equals(reason, "VIOLENCE")) {
            userReport.setReason(UserReport.Reason.VIOLENCE);
        }

        if (Objects.equals(reason, "BULLYING")) {
            userReport.setReason(UserReport.Reason.BULLYING);
        }

        if (Objects.equals(reason, "FRAUD")) {
            userReport.setReason(UserReport.Reason.FRAUD);
        }

        userReportDao.save(userReport);

        return userReport.getId();

    }

    @Override
    public UserSettings dontShowAgainUplRewardHelp(Long userLoggedId) throws InstanceNotFoundException {

        User user = permissionChecker.checkUser(userLoggedId);

        UserSettings userSettings = user.getUserSettings();

        userSettings.setShowUplRewardHelp(false);

        return userSettings;

    }

    @Override
    public UserSettings dontShowAgainUplImageHelp(Long userLoggedId) throws InstanceNotFoundException {

        User user = permissionChecker.checkUser(userLoggedId);

        UserSettings userSettings = user.getUserSettings();

        userSettings.setShowUplImageHelp(false);

        return userSettings;

    }
}
