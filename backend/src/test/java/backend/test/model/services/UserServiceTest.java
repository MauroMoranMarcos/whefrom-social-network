package backend.test.model.services;

import backend.model.entities.*;
import backend.model.exceptions.*;
import backend.model.services.Block;
import backend.model.services.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.event.EventListener;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class UserServiceTest {

    private final Long NON_EXISTENT_ID = Long.valueOf(-1);

    private final String NON_EXISTENT_EMAIL = "aaa";

    private final String NON_EXISTENT_VERIFICATION_CODE = "bbb";

    private final Long NUM_POINTS_PER_FOLLOW = 100L;

    @Autowired
    private UserService userService;

    @Autowired
    private UserDao userDao;

    @Autowired
    private FollowDao followDao;

    @Autowired
    private FollowRequestDao followRequestDao;

    @Autowired
    private UserReportDao userReportDao;

    byte[] profilePicture = new byte[] {0x12, 0x34, 0x56, 0x78};

    private User createUser(String userName) {
        return new User(userName, "password", "name", "surname", "about", "email@email.com",
                LocalDate.now().minusYears(19), "111-111-111", profilePicture, User.RoleType.NORMAL_USER);
    }

    @Test
    public void testSignUpAndLoginFromId() throws DuplicateInstanceException, InstanceNotFoundException,
            InvalidBirthDateException {

        User user = createUser("user");

        userService.signUp(user);

        User loggedInUser = userService.loginFromId(user.getId());

        assertEquals(user, loggedInUser);
        assertEquals(User.RoleType.NORMAL_USER, user.getRole());
        assertEquals(user, user.getUserSettings().getUser());

    }

    @Test
    public void testSignUpDuplicatedUserName() throws DuplicateInstanceException, InvalidBirthDateException {

        User user = createUser("user");

        userService.signUp(user);
        assertThrows(DuplicateInstanceException.class, () -> userService.signUp(user));

    }

    @Test
    public void testSignUpInvalidBirthDate() {

        User user = createUser("user");
        user.setBirthDate(LocalDate.now().minusYears(15));

        assertThrows(InvalidBirthDateException.class, () -> userService.signUp(user));

    }

    @Test
    public void testLoginFromNonExistentId() {
        assertThrows(InstanceNotFoundException.class, () -> userService.loginFromId(NON_EXISTENT_ID));
    }

    @Test
    public void testLogin() throws DuplicateInstanceException, IncorrectLoginException, InvalidBirthDateException, BlockedException {

        User user = createUser("user");
        String clearPassword = user.getPassword();

        userService.signUp(user);

        User loggedInUser = userService.login(user.getUserName(), clearPassword);

        assertEquals(user, loggedInUser);

    }

    @Test
    public void testLoginWithIncorrectPassword() throws DuplicateInstanceException, InvalidBirthDateException {

        User user = createUser("user");
        String clearPassword = user.getPassword();

        userService.signUp(user);
        assertThrows(IncorrectLoginException.class, () ->
                userService.login(user.getUserName(), 'X' + clearPassword));

    }

    @Test
    public void testLoginWithNonExistentUserName() {
        assertThrows(IncorrectLoginException.class, () -> userService.login("X", "Y"));
    }

    @Test
    public void testAddProfilePicture() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException {

        User user = createUser("user");
        userService.signUp(user);

        byte[] profilePictureBefore = user.getProfilePicture();

        byte[] newProfilePicture = new byte[] {0x24, 0x68, 0x72, 0x78};

        userService.addProfilePicture(user.getId(), newProfilePicture);

        assertEquals(newProfilePicture, user.getProfilePicture());
        assertNotEquals(profilePictureBefore, user.getProfilePicture());

    }

    @Test
    public void testAddProfilePictureWithNonExistentId() throws InvalidBirthDateException, DuplicateInstanceException {

        User user = createUser("user");
        userService.signUp(user);

        byte[] newProfilePicture = new byte[] {0x24, 0x68, 0x72, 0x78};

        assertThrows(InstanceNotFoundException.class, () ->
                userService.addProfilePicture(NON_EXISTENT_ID, newProfilePicture));

    }

    @Test
    public void testUpdateProfile() throws InstanceNotFoundException, DuplicateInstanceException,
            InvalidBirthDateException {

        User user = createUser("user");

        userService.signUp(user);

        user.setName('X' + user.getName());
        user.setSurname('X' + user.getSurname());
        user.setEmail('X' + user.getEmail());
        user.setPhoneNumber('X' + user.getPhoneNumber());
        user.setAbout('X' + user.getAbout());

        userService.updateProfile(user.getId(), 'X' + user.getName(), 'X' + user.getSurname(),
                'X' + user.getEmail(), 'X' + user.getPhoneNumber(),
                'X' + user.getAbout());

        User updatedUser = userService.loginFromId(user.getId());

        assertEquals(user, updatedUser);

    }

    @Test
    public void testUpdateProfileWithNonExistentId() {
        assertThrows(InstanceNotFoundException.class, () ->
                userService.updateProfile(NON_EXISTENT_ID, "X", "X", "X", "X", "X"));
    }

    @Test
    public void testRestorePassword() throws InstanceNotFoundException, IncorrectLoginException, PermissionException,
            BlockedException, InvalidBirthDateException, DuplicateInstanceException {

        User user = createUser("user");
        user.setVerificationCode("123456");
        userService.signUp(user);

        String oldPassword = user.getPassword();
        String newPassword = 'X' + oldPassword;

        userService.restorePassword(user.getEmail(), "123456", newPassword);
        userService.login(user.getUserName(), newPassword);

        assertTrue(user.getVerificationCode().isBlank());

    }

    @Test
    public void testRestorePasswordWithNonExistentEmail() {

        User user = createUser("user");
        user.setVerificationCode("123456");

        String oldPassword = user.getPassword();
        String newPassword = 'X' + oldPassword;

        assertThrows(InstanceNotFoundException.class, () ->
                userService.restorePassword(NON_EXISTENT_EMAIL, "123456", newPassword));

    }

    @Test
    public void testRestorePasswordWithWrongVerificationCode() {

        User user = createUser("user");
        user.setVerificationCode("123456");

        userDao.save(user);

        String oldPassword = user.getPassword();
        String newPassword = 'X' + oldPassword;

        assertThrows(PermissionException.class, () ->
                userService.restorePassword(user.getEmail(), NON_EXISTENT_VERIFICATION_CODE, newPassword));

    }

    @Test
    @EventListener(ApplicationReadyEvent.class)
    public void testSendVerificationCode() throws DuplicateInstanceException, EmailNotFoundException,
            IOException, InvalidBirthDateException {

        User user = createUser("user");
        user.setEmail("mauro.moranm@gmail.com");

        userService.signUp(user);

        userService.sendVerificationCode(user.getEmail());

        assertFalse(user.getVerificationCode().isBlank());

    }

    @Test
    @EventListener(ApplicationReadyEvent.class)
    public void testSendVerificationCodeWithNonExistentEmail() throws DuplicateInstanceException,
            InvalidBirthDateException {

        User user = createUser("user");

        userService.signUp(user);

        assertThrows(EmailNotFoundException.class, () -> userService.sendVerificationCode(NON_EXISTENT_EMAIL));

    }

    @Test
    @EventListener(ApplicationReadyEvent.class)
    public void testEnterVerificationCode() throws DuplicateInstanceException, EmailNotFoundException, IOException,
            WrongVerificationCodeException, InvalidBirthDateException {

        User user = createUser("user");

        userService.signUp(user);

        userService.sendVerificationCode(user.getEmail());

        userService.enterVerificationCode(user.getEmail(), user.getVerificationCode());

    }

    @Test
    public void testEnterVerificationCodeWithNonExistentEmail() throws DuplicateInstanceException,
            InvalidBirthDateException {

        User user = createUser("user");

        userService.signUp(user);

        assertThrows(EmailNotFoundException.class, () ->
                userService.enterVerificationCode(NON_EXISTENT_EMAIL, user.getVerificationCode()));
    }

    @Test
    public void testEnterVerificationCodeWithWrongVerificationCode() throws DuplicateInstanceException,
            InvalidBirthDateException {

        User user = createUser("user");

        userService.signUp(user);

        assertThrows(WrongVerificationCodeException.class, () ->
                userService.enterVerificationCode(user.getEmail(), NON_EXISTENT_VERIFICATION_CODE));

    }

    @Test
    public void testFindUserSettingsByUserId() throws InstanceNotFoundException, DuplicateInstanceException,
            InvalidBirthDateException {

        User user = createUser("user");

        userService.signUp(user);

        UserSettings userSettings = userService.findUserSettingsByUserId(user.getId());

        assertEquals(user.getId(), userSettings.getUser().getId());
        assertEquals(user, userSettings.getUser());

    }

    @Test
    public void testFindUserSettingsByNonExistentUserId() throws DuplicateInstanceException, InvalidBirthDateException {

        User user = createUser("user");

        userService.signUp(user);

        assertThrows(InstanceNotFoundException.class, () ->
                userService.findUserSettingsByUserId(NON_EXISTENT_ID));

    }

    @Test
    public void testUpdateUserSettings() throws DuplicateInstanceException, InstanceNotFoundException,
            InvalidBirthDateException {

        User user = createUser("user");

        userService.signUp(user);

        UserSettings userSettings = user.getUserSettings();

        assertTrue(userSettings.getPrivacyPublic());
        assertTrue(userSettings.getNotifyMe());

        userSettings.setPrivacyPublic(false);
        userSettings.setNotifyMe(false);

        userService.updateUserSettings(user.getId(), false, false);

        User updatedUser = userService.loginFromId(user.getId());

        UserSettings updatedUserSettings = updatedUser.getUserSettings();

        assertFalse(updatedUserSettings.getPrivacyPublic());
        assertFalse(updatedUserSettings.getNotifyMe());

    }

    @Test
    public void testUpdateUserSettingsWithNonExistentId() {
        assertThrows(InstanceNotFoundException.class, () ->
                userService.updateUserSettings(NON_EXISTENT_ID, true, true));
    }

    @Test
    public void testFindUsersByKeywordsSearchingByUserName() {

        User user1 = createUser("userName1");
        User user2 = createUser("userName2");

        userDao.save(user1);
        userDao.save(user2);

        Block<User> expectedBlock1 = new Block<>(Arrays.asList(user1, user2), false);

        assertEquals(expectedBlock1, userService.findUsers("user", false, 0, 2));

    }

    @Test
    public void testFindUsersByKeywordsSearchingByName() {

        User user1 = createUser("userCrazy22");
        user1.setName("Mark");
        User user2 = createUser("jumper88");
        user2.setName("Mark");
        User user3 = createUser("mark_evans999");
        user3.setName("Mark");
        User user4 = createUser("userName4");

        userDao.save(user1);
        userDao.save(user2);
        userDao.save(user3);
        userDao.save(user4);

        Block<User> expectedBlock1 = new Block<>(Arrays.asList(user2, user3, user1), false);

        assertEquals(expectedBlock1, userService.findUsers("Mark", false, 0, 3));

    }

    @Test
    public void testFindBrandsByKeywordsSearchingByUserName() {

        User user = createUser("userNameNotBrand");

        userDao.save(user);

        User brand1 = createUser("brand1");
        User brand2 = createUser("brand2");

        brand1.setRole(User.RoleType.BRAND_USER);
        brand2.setRole(User.RoleType.BRAND_USER);

        userDao.save(brand1);
        userDao.save(brand2);

        Block<User> expectedBlock1 = new Block<>(Arrays.asList(brand1, brand2), false);

        assertEquals(expectedBlock1, userService.findUsers("brand", true, 0, 3));

    }

    @Test
    public void testFindBrandsByKeywordsSearchingByName() {

        User user1 = createUser("userCrazy22");
        user1.setName("Mark");
        User user2 = createUser("jumper88");
        user2.setName("Mark");
        User user3 = createUser("mark_evans999");
        user3.setName("Mark");
        User user4 = createUser("userName4");

        User brand1 = createUser("brand_mark");
        brand1.setName("Mark");
        brand1.setRole(User.RoleType.BRAND_USER);
        User brand2 = createUser("mark_the_brand");
        brand2.setName("Mark");
        brand2.setRole(User.RoleType.BRAND_USER);

        userDao.save(user1);
        userDao.save(user2);
        userDao.save(user3);
        userDao.save(user4);
        userDao.save(brand1);
        userDao.save(brand2);

        Block<User> expectedBlock1 = new Block<>(Arrays.asList(brand1, brand2), false);

        assertEquals(expectedBlock1, userService.findUsers("Mark", true, 0, 6));

    }

    @Test
    public void testFindUserById() throws InstanceNotFoundException {

        User user = createUser("userName1");
        userDao.save(user);

        User expectedUser = userService.findUserById(user.getId());

        assertEquals(expectedUser.getId(), user.getId());
        assertEquals(expectedUser.getUserName(), user.getUserName());
        assertEquals(expectedUser.getName(), user.getName());
        assertEquals(expectedUser.getSurname(), user.getSurname());
        assertEquals(expectedUser.getAbout(), user.getAbout());
        assertEquals(expectedUser.getEmail(), user.getEmail());
        assertEquals(expectedUser.getPassword(), user.getPassword());
        assertEquals(expectedUser.getPhoneNumber(), user.getPhoneNumber());
        assertEquals(expectedUser.getBirthDate(), user.getBirthDate());
        assertEquals(expectedUser.getProfilePicture(), user.getProfilePicture());
        assertEquals(expectedUser.getBlocked(), user.getBlocked());
        assertEquals(expectedUser.getSilenced(), user.getSilenced());
        assertEquals(expectedUser.getVerified(), user.getVerified());
        assertEquals(expectedUser.getVerificationCode(), user.getVerificationCode());
        assertEquals(expectedUser, user);

    }

    @Test
    public void testFindUserByIdWithNonExistentId() {

        User user = createUser("userName1");
        userDao.save(user);

        assertThrows(InstanceNotFoundException.class, () ->
                userService.findUserById(NON_EXISTENT_ID));

    }

    @Test
    public void testFollowUser() throws UserAlreadyFollowedException, InstanceNotFoundException, PermissionException,
            InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        User user2 = createUser("userName2");
        userService.signUp(user1);
        userService.signUp(user2);

        userService.followUser(user1.getId(), user2.getId());
        userService.followUser(user2.getId(), user1.getId());

        assertTrue(followDao.existsByUserAndFollowsUser(user1, user2));
        assertTrue(followDao.existsByUserAndFollowsUser(user2, user1));

    }

    @Test
    public void testFollowUserWithNonExistentId() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                userService.followUser(user1.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testGetFollowedByNonExistentId() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                userService.followUser(NON_EXISTENT_ID, user1.getId()));

    }

    @Test
    public void testFollowUserAlreadyFollowed() throws UserAlreadyFollowedException, InstanceNotFoundException,
            PermissionException, InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        User user2 = createUser("userName2");
        userService.signUp(user1);
        userService.signUp(user2);

        userService.followUser(user1.getId(), user2.getId());

        assertThrows(UserAlreadyFollowedException.class, () ->
                userService.followUser(user1.getId(), user2.getId()));

    }

    @Test
    public void testFollowUserHimself() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        assertThrows(PermissionException.class, () ->
                userService.followUser(user1.getId(), user1.getId()));

    }

    @Test
    public void testUnFollowUser() throws UserAlreadyFollowedException, InstanceNotFoundException,
            UserNotFollowedException, PermissionException, InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        User user2 = createUser("userName2");
        userService.signUp(user1);
        userService.signUp(user2);

        userService.followUser(user1.getId(), user2.getId());
        userService.followUser(user2.getId(), user1.getId());

        userService.unFollowUser(user1.getId(), user2.getId());

        assertFalse(followDao.existsByUserAndFollowsUser(user1, user2));
        assertTrue(followDao.existsByUserAndFollowsUser(user2, user1));

    }

    @Test
    public void testUnFollowUserWithNonExistentId() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                userService.unFollowUser(user1.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testGetUnFollowedByNonExistentId() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                userService.unFollowUser(NON_EXISTENT_ID, user1.getId()));

    }

    @Test
    public void testUnFollowUserNotFollowed() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        User user2 = createUser("userName2");
        userService.signUp(user1);
        userService.signUp(user2);

        assertThrows(UserNotFollowedException.class, () ->
                userService.unFollowUser(user1.getId(), user2.getId()));

    }

    @Test
    public void testUnfollowUserHimself() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        assertThrows(PermissionException.class, () ->
                userService.unFollowUser(user1.getId(), user1.getId()));

    }

    @Test
    public void testCheckPointsFromUserAfterFollows() throws UserAlreadyFollowedException, PermissionException,
            InstanceNotFoundException, InvalidBirthDateException, DuplicateInstanceException, UserNotFollowedException {

        User user1 = createUser("userName1");
        User user2 = createUser("userName2");
        User user3 = createUser("userName3");
        User user4 = createUser("userName4");
        userService.signUp(user1);
        userService.signUp(user2);
        userService.signUp(user3);
        userService.signUp(user4);

        assertEquals(0L, user1.getUserPoints().getPoints());

        userService.followUser(user2.getId(), user1.getId());
        userService.followUser(user3.getId(), user1.getId());
        userService.followUser(user4.getId(), user1.getId());

        assertEquals(NUM_POINTS_PER_FOLLOW * 3L, user1.getUserPoints().getPoints());

        userService.unFollowUser(user2.getId(), user1.getId());

        assertEquals(NUM_POINTS_PER_FOLLOW * 2L, user1.getUserPoints().getPoints());

    }

    @Test
    public void testFindUserFollowersRecentFirst() throws UserAlreadyFollowedException, InstanceNotFoundException,
            InterruptedException, PermissionException, InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        User user2 = createUser("userName2");
        User user3 = createUser("userName3");
        User user4 = createUser("userName4");
        userService.signUp(user1);
        userDao.save(user2);
        userDao.save(user3);
        userDao.save(user4);

        userService.followUser(user2.getId(), user1.getId());
        Thread.sleep(1000);
        userService.followUser(user3.getId(), user1.getId());
        Thread.sleep(1000);
        userService.followUser(user4.getId(), user1.getId());

        Block<User> expectedBlock = new Block<>(Arrays.asList(user4, user3, user2), false);

        assertEquals(expectedBlock, userService.findUserFollowers(
                user1.getId(), 0L, true, 0, 3));

    }

    @Test
    public void testFindUserFollowersOldestFirst() throws UserAlreadyFollowedException, InstanceNotFoundException,
            InterruptedException, PermissionException, InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        User user2 = createUser("userName2");
        User user3 = createUser("userName3");
        User user4 = createUser("userName4");
        userService.signUp(user1);
        userDao.save(user2);
        userDao.save(user3);
        userDao.save(user4);

        userService.followUser(user2.getId(), user1.getId());
        Thread.sleep(1000);
        userService.followUser(user3.getId(), user1.getId());
        Thread.sleep(1000);
        userService.followUser(user4.getId(), user1.getId());

        Block<User> expectedBlock = new Block<>(Arrays.asList(user2, user3, user4), false);

        assertEquals(expectedBlock, userService.findUserFollowers(
                user1.getId(), 0L, false, 0, 3));

    }

    @Test
    public void testFindUserFollowersWithPrivateAccount() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("userName2");
        userService.signUp(user2);

        assertThrows(PermissionException.class, () ->
                userService.findUserFollowers(user1.getId(), 0L, true, 0, 3));
        assertThrows(PermissionException.class, () ->
                userService.findUserFollowers(user1.getId(), user2.getId(), true, 0, 3));

    }

    @Test
    public void testFindUserFollowersWithPrivateAccountButFollowing() throws InvalidBirthDateException,
            DuplicateInstanceException, UserAlreadyFollowedException, PermissionException, InstanceNotFoundException,
            InterruptedException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("userName2");
        userService.signUp(user2);

        User user3 = createUser("userName3");
        User user4 = createUser("userName4");
        userDao.save(user3);
        userDao.save(user4);

        userService.followUser(user2.getId(), user1.getId());
        Thread.sleep(1000);
        userService.followUser(user3.getId(), user1.getId());
        Thread.sleep(1000);
        userService.followUser(user4.getId(), user1.getId());

        Block<User> expectedBlock = new Block<>(Arrays.asList(user4, user3, user2), false);

        assertEquals(expectedBlock, userService.findUserFollowers(
                user1.getId(), user2.getId(), true, 0, 3));

    }

    @Test
    public void testFindUserFollowedRecentFirst() throws UserAlreadyFollowedException, InstanceNotFoundException,
            InterruptedException, PermissionException, InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        User user2 = createUser("userName2");
        User user3 = createUser("userName3");
        User user4 = createUser("userName4");
        userService.signUp(user1);
        userService.signUp(user2);
        userService.signUp(user3);
        userService.signUp(user4);

        userService.followUser(user1.getId(), user2.getId());
        Thread.sleep(1000);
        userService.followUser(user1.getId(), user3.getId());
        Thread.sleep(1000);
        userService.followUser(user1.getId(), user4.getId());

        Block<User> expectedBlock = new Block<>(Arrays.asList(user4, user3, user2), false);

        assertEquals(expectedBlock, userService.findUserFollowed(
                user1.getId(), 0L, true, 0, 3));

    }

    @Test
    public void testFindUserFollowedOldestFirst() throws UserAlreadyFollowedException, InstanceNotFoundException,
            InterruptedException, PermissionException, InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        User user2 = createUser("userName2");
        User user3 = createUser("userName3");
        User user4 = createUser("userName4");
        userService.signUp(user1);
        userService.signUp(user2);
        userService.signUp(user3);
        userService.signUp(user4);

        userService.followUser(user1.getId(), user2.getId());
        Thread.sleep(1000);
        userService.followUser(user1.getId(), user3.getId());
        Thread.sleep(1000);
        userService.followUser(user1.getId(), user4.getId());

        Block<User> expectedBlock = new Block<>(Arrays.asList(user2, user3, user4), false);

        assertEquals(expectedBlock, userService.findUserFollowed(
                user1.getId(), 0L, false, 0, 3));

    }

    @Test
    public void testFindUserFollowedWithPrivateAccount() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("userName2");
        userService.signUp(user2);

        assertThrows(PermissionException.class, () ->
                userService.findUserFollowed(user1.getId(), 0L, true, 0, 3));
        assertThrows(PermissionException.class, () ->
                userService.findUserFollowed(user1.getId(), user2.getId(), true, 0, 3));

    }

    @Test
    public void testFindUserFollowedWithPrivateAccountButFollowing() throws InvalidBirthDateException,
            DuplicateInstanceException, UserAlreadyFollowedException, PermissionException, InstanceNotFoundException, InterruptedException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("userName2");
        userService.signUp(user2);
        User user3 = createUser("userName3");
        User user4 = createUser("userName4");
        userService.signUp(user3);
        userService.signUp(user4);

        userService.followUser(user1.getId(), user2.getId());
        Thread.sleep(1000);
        userService.followUser(user1.getId(), user3.getId());
        Thread.sleep(1000);
        userService.followUser(user1.getId(), user4.getId());

        userService.followUser(user2.getId(), user1.getId());

        Block<User> expectedBlock = new Block<>(Arrays.asList(user4, user3, user2), false);

        assertEquals(expectedBlock, userService.findUserFollowed(
                user1.getId(), user2.getId(), true, 0, 3));

    }

    @Test
    public void testGetUserNumFollowers() throws UserAlreadyFollowedException, InstanceNotFoundException,
            PermissionException, InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        User user2 = createUser("userName2");
        User user3 = createUser("userName3");
        User user4 = createUser("userName4");
        userService.signUp(user1);
        userService.signUp(user2);
        userService.signUp(user3);
        userService.signUp(user4);

        userService.followUser(user2.getId(), user1.getId());
        userService.followUser(user3.getId(), user1.getId());
        userService.followUser(user4.getId(), user1.getId());

        assertEquals(3, userService.getUserNumFollowers(user1.getId()));

    }

    @Test
    public void testGetUserNumFollowed() throws UserAlreadyFollowedException, InstanceNotFoundException,
            PermissionException, InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        User user2 = createUser("userName2");
        User user3 = createUser("userName3");
        User user4 = createUser("userName4");
        userService.signUp(user1);
        userService.signUp(user2);
        userService.signUp(user3);
        userService.signUp(user4);

        userService.followUser(user1.getId(), user2.getId());
        userService.followUser(user1.getId(), user3.getId());
        userService.followUser(user1.getId(), user4.getId());

        assertEquals(3, userService.getUserNumFollowed(user1.getId()));

    }

    @Test
    public void testGetUserNumFollowersWithNonExistentId() {

        User user1 = createUser("userName1");
        userDao.save(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                userService.getUserNumFollowers(NON_EXISTENT_ID));

    }

    @Test
    public void testGetUserNumFollowedWithNonExistentId() {

        User user1 = createUser("userName1");
        userDao.save(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                userService.getUserNumFollowed(NON_EXISTENT_ID));

    }

    @Test
    public void testIsUserFollowingUser() throws UserAlreadyFollowedException, InstanceNotFoundException,
            PermissionException, InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        User user2 = createUser("userName2");
        userService.signUp(user2);

        userService.followUser(user1.getId(), user2.getId());

        assertTrue(userService.isUserFollowingUser(user1.getId(), user2.getId()));
        assertFalse(userService.isUserFollowingUser(user2.getId(), user1.getId()));

    }

    @Test
    public void testIsUserFollowingUserWithNonExistentId() {

        User user1 = createUser("userName1");
        userDao.save(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                userService.isUserFollowingUser(NON_EXISTENT_ID, user1.getId()));

        assertThrows(InstanceNotFoundException.class, () ->
                userService.isUserFollowingUser(user1.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testRequestFollow() throws InvalidBirthDateException, DuplicateInstanceException,
            UserAlreadyFollowedException, PermissionException, InstanceNotFoundException, UserAlreadyRequestedException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("userName2");
        userService.signUp(user2);

        userService.requestFollow(user2.getId(), user1.getId());

        assertTrue(followRequestDao.existsByUserAndUserToFollow(user2, user1));

    }

    @Test
    public void testRequestFollowWithNonExistentUserId() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        assertThrows(InstanceNotFoundException.class, () ->
                userService.requestFollow(NON_EXISTENT_ID, user1.getId()));

    }

    @Test
    public void testRequestFollowWithNonExistentUserRequestedId() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                userService.requestFollow(user1.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testRequestFollowToHimself() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        assertThrows(PermissionException.class, () ->
                userService.requestFollow(user1.getId(), user1.getId()));

    }

    @Test
    public void testRequestFollowToAlreadyFollowedUser() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("userName2");
        userService.signUp(user2);

        Follow follow = new Follow(LocalDateTime.now(), user2, user1);
        followDao.save(follow);

        assertThrows(UserAlreadyFollowedException.class, () ->
                userService.requestFollow(user2.getId(), user1.getId()));

    }

    @Test
    public void testRequestFollowToPublicAccount() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        User user2 = createUser("userName2");
        userService.signUp(user2);

        assertThrows(PermissionException.class, () ->
                userService.requestFollow(user2.getId(), user1.getId()));

    }

    @Test
    public void testRequestFollowToUserAlreadyRequested() throws InvalidBirthDateException, DuplicateInstanceException,
            UserAlreadyFollowedException, PermissionException, UserAlreadyRequestedException, InstanceNotFoundException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("userName2");
        userService.signUp(user2);

        userService.requestFollow(user2.getId(), user1.getId());

        assertThrows(UserAlreadyRequestedException.class, () ->
                userService.requestFollow(user2.getId(), user1.getId()));

    }

    @Test
    public void testDeleteRequestFollow() throws InvalidBirthDateException, DuplicateInstanceException,
            UserAlreadyFollowedException, PermissionException, InstanceNotFoundException, FollowRequestNotFoundException,
            UserAlreadyRequestedException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("userName2");
        userService.signUp(user2);

        userService.requestFollow(user2.getId(), user1.getId());

        assertTrue(followRequestDao.existsByUserAndUserToFollow(user2, user1));

        userService.deleteRequestFollow(user2.getId(), user1.getId());

        assertFalse(followRequestDao.existsByUserAndUserToFollow(user2, user1));

    }

    @Test
    public void testDeleteRequestFollowWithNonExistentUserId() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        assertThrows(InstanceNotFoundException.class, () ->
                userService.deleteRequestFollow(NON_EXISTENT_ID, user1.getId()));

    }

    @Test
    public void testDeleteRequestFollowWithNonExistentUserRequestedId() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                userService.deleteRequestFollow(user1.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testDeleteRequestFollowToHimself() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        assertThrows(PermissionException.class, () ->
                userService.deleteRequestFollow(user1.getId(), user1.getId()));

    }

    @Test
    public void testDeleteRequestFollowThatDontExist() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("userName2");
        userService.signUp(user2);

        assertThrows(FollowRequestNotFoundException.class, () ->
                userService.deleteRequestFollow(user2.getId(), user1.getId()));

    }

    @Test
    public void testFindUserFollowRequests() throws InvalidBirthDateException, DuplicateInstanceException,
            UserAlreadyFollowedException, PermissionException, InstanceNotFoundException, UserAlreadyRequestedException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("userName2");
        userService.signUp(user2);
        User user3 = createUser("userName3");
        userService.signUp(user3);
        User user4 = createUser("userName4");
        userService.signUp(user4);

        userService.requestFollow(user2.getId(), user1.getId());
        userService.requestFollow(user3.getId(), user1.getId());
        userService.requestFollow(user4.getId(), user1.getId());

        Block<User> expectedBlock = new Block<>(Arrays.asList(user2, user3, user4), false);

        assertEquals(expectedBlock, userService.findUserFollowRequests(user1.getId(), 0, 3));

    }

    @Test
    public void testFindUserFollowRequestsWithNonExistentUserId() {

        assertThrows(InstanceNotFoundException.class, () ->
                userService.findUserFollowRequests(NON_EXISTENT_ID, 0, 3));

    }

    @Test
    public void testGetNumFollowRequests() throws InvalidBirthDateException, DuplicateInstanceException,
            UserAlreadyFollowedException, PermissionException, InstanceNotFoundException, UserAlreadyRequestedException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("userName2");
        userService.signUp(user2);
        User user3 = createUser("userName3");
        userService.signUp(user3);
        User user4 = createUser("userName4");
        userService.signUp(user4);

        userService.requestFollow(user2.getId(), user1.getId());
        userService.requestFollow(user3.getId(), user1.getId());
        userService.requestFollow(user4.getId(), user1.getId());

        assertEquals(3L, userService.getNumFollowRequests(user1.getId()));

    }

    @Test
    public void testAcceptFollowRequest() throws InvalidBirthDateException, DuplicateInstanceException,
            UserAlreadyFollowedException, PermissionException, InstanceNotFoundException, UserAlreadyRequestedException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("userName2");
        userService.signUp(user2);

        userService.requestFollow(user2.getId(), user1.getId());

        assertTrue(followRequestDao.existsByUserAndUserToFollow(user2, user1));
        assertFalse(followDao.existsByUserAndFollowsUser(user2, user1));

        userService.acceptFollowRequest(user2.getId(), user1.getId());

        assertFalse(followRequestDao.existsByUserAndUserToFollow(user2, user1));
        assertTrue(followDao.existsByUserAndFollowsUser(user2, user1));

    }

    @Test
    public void testAcceptFollowRequestWithNonExistentUserId() throws InvalidBirthDateException,
            DuplicateInstanceException, UserAlreadyFollowedException, PermissionException, InstanceNotFoundException,
            UserAlreadyRequestedException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("userName2");
        userService.signUp(user2);

        userService.requestFollow(user2.getId(), user1.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                userService.acceptFollowRequest(user2.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testAcceptFollowRequestWithNonExistentUserRequestingId() throws InvalidBirthDateException,
            DuplicateInstanceException, UserAlreadyFollowedException, PermissionException, InstanceNotFoundException,
            UserAlreadyRequestedException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("userName2");
        userService.signUp(user2);

        userService.requestFollow(user2.getId(), user1.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                userService.acceptFollowRequest(NON_EXISTENT_ID, user1.getId()));

    }

    @Test
    public void testAcceptFollowRequestWithWrongUser() throws InvalidBirthDateException, DuplicateInstanceException,
            UserAlreadyFollowedException, PermissionException, InstanceNotFoundException, UserAlreadyRequestedException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("userName2");
        userService.signUp(user2);

        userService.requestFollow(user2.getId(), user1.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                userService.acceptFollowRequest(user2.getId(), user2.getId()));

    }

    @Test
    public void testRejectFollowRequest() throws InvalidBirthDateException, DuplicateInstanceException,
            UserAlreadyFollowedException, PermissionException, InstanceNotFoundException, UserAlreadyRequestedException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("userName2");
        userService.signUp(user2);

        userService.requestFollow(user2.getId(), user1.getId());

        assertTrue(followRequestDao.existsByUserAndUserToFollow(user2, user1));

        userService.rejectFollowRequest(user2.getId(), user1.getId());

        assertFalse(followRequestDao.existsByUserAndUserToFollow(user2, user1));

    }

    @Test
    public void testRejectFollowRequestWithNonExistentUserId() throws InvalidBirthDateException,
            DuplicateInstanceException, UserAlreadyFollowedException, PermissionException, InstanceNotFoundException,
            UserAlreadyRequestedException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("userName2");
        userService.signUp(user2);

        userService.requestFollow(user2.getId(), user1.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                userService.rejectFollowRequest(user2.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testRejectFollowRequestWithNonExistentUserRequestingId() throws InvalidBirthDateException,
            DuplicateInstanceException, UserAlreadyFollowedException, PermissionException, InstanceNotFoundException,
            UserAlreadyRequestedException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("userName2");
        userService.signUp(user2);

        userService.requestFollow(user2.getId(), user1.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                userService.rejectFollowRequest(NON_EXISTENT_ID, user1.getId()));

    }

    @Test
    public void testRejectFollowRequestWithWrongUser() throws InvalidBirthDateException, DuplicateInstanceException,
            UserAlreadyFollowedException, PermissionException, InstanceNotFoundException, UserAlreadyRequestedException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("userName2");
        userService.signUp(user2);

        userService.requestFollow(user2.getId(), user1.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                userService.rejectFollowRequest(user2.getId(), user2.getId()));

    }

    @Test
    public void testReportUser() throws InvalidBirthDateException, DuplicateInstanceException, InstanceNotFoundException,
            ReportAlreadyGivenException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        User user2 = createUser("userName2");
        userService.signUp(user2);

        assertFalse(userReportDao.existsByUserAndUserReported(user1, user2));
        assertFalse(userReportDao.existsByUserAndUserReported(user2, user1));

        userService.reportUser(user1.getId(), user2.getId(), "FRAUD", "explanation");

        UserReport userReport = userReportDao.findByUserAndUserReported(user1, user2);

        assertEquals(UserReport.Reason.FRAUD, userReport.getReason());
        assertEquals("explanation", userReport.getExplanation());
        assertFalse(userReport.getResolved());
        assertEquals(LocalDateTime.now().toLocalDate(), userReport.getDate().toLocalDate());
        assertEquals(user1, userReport.getUser());
        assertEquals(user2, userReport.getUserReported());

        assertTrue(userReportDao.existsByUserAndUserReported(user1, user2));
        assertFalse(userReportDao.existsByUserAndUserReported(user2, user1));

    }

    @Test
    public void testReportUserWithNonExistentUserId() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                userService.reportUser(NON_EXISTENT_ID, user1.getId(), "FRAUD", "explanation"));

    }

    @Test
    public void testReportUserWithNonExistentUserReportedId() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                userService.reportUser(user1.getId(), NON_EXISTENT_ID, "FRAUD", "explanation"));

    }

    @Test
    public void testReportUserAlreadyReported() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        User user2 = createUser("userName2");
        userService.signUp(user2);

        userService.reportUser(user1.getId(), user2.getId(), "FRAUD", "explanation");

        assertThrows(ReportAlreadyGivenException.class, () ->
                userService.reportUser(user1.getId(), user2.getId(), "FRAUD", "explanation"));

    }

}

