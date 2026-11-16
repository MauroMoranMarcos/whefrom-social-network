package backend.test.model.services;

import backend.model.entities.*;

import backend.model.exceptions.*;
import backend.model.services.AdminService;

import backend.model.services.Block;
import backend.model.services.ImageService;
import backend.model.services.UserService;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AdminServiceTest {

    private final Long NON_EXISTENT_CATEGORY_ID = Long.valueOf(-1);

    private final Long NON_EXISTENT_ID = Long.valueOf(-1);

    @Autowired
    private CategoryDao categoryDao;

    @Autowired
    private UserReportDao userReportDao;

    @Autowired
    private UserPenaltyDao userPenaltyDao;

    @Autowired
    private ImageReportDao imageReportDao;

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserService userService;

    @Autowired
    private ImageService imageService;

    private final byte[] profilePicture = new byte[] {0x12, 0x34, 0x56, 0x78};

    private Category createCategory(String name) {
        return new Category(name);
    }

    private User createAdmin(String userName) {
        return new User(userName, "password", "admin", "about", "email@email.com",
                "111-111-111", profilePicture, User.RoleType.ADMIN_USER);
    }

    private User createUser(String userName) {
        return new User(userName, "password", "name", "surname", "about", "email@email.com",
                LocalDate.now().minusYears(19), "111-111-111", profilePicture, User.RoleType.NORMAL_USER);
    }

    @Test
    public void testCreateCategory() throws DuplicateInstanceException {

        Category category = adminService.createCategory("category", null);
        Category categoryNotActive = adminService.createCategory("category not active", false);

        Optional<Category> categoryOpt = categoryDao.findByName("category");
        Optional<Category> categoryNotActiveOpt = categoryDao.findByName("category not active");

        assertEquals(category.getId(), categoryOpt.get().getId());
        assertEquals(category.getName(), categoryOpt.get().getName());
        assertEquals(category.getActive(), categoryOpt.get().getActive());

        assertEquals(category, categoryOpt.get());

        assertFalse(categoryNotActiveOpt.get().getActive());

    }

    @Test
    public void testCreateDuplicatedCategory() throws DuplicateInstanceException {

        adminService.createCategory("category", null);

        assertThrows(DuplicateInstanceException.class, () -> adminService.createCategory("category", null));

    }

    @Test
    public void testFindAllCategories() {

        Category category1 = createCategory("category1");
        Category category2 = createCategory("category2");
        Category category3 = createCategory("category3");

        categoryDao.save(category1);
        categoryDao.save(category3);
        categoryDao.save(category2);

        assertEquals(Arrays.asList(category1, category2, category3), adminService.findAllCategories());

    }

    @Test
    public void testFindActiveCategories() {

        Category category1 = createCategory("category1");
        Category category2 = createCategory("category2");
        Category category3 = createCategory("category3");

        category1.setActive(false);

        categoryDao.save(category1);
        categoryDao.save(category3);
        categoryDao.save(category2);

        assertEquals(Arrays.asList(category2, category3), adminService.findActiveCategories(true));

        assertEquals(Arrays.asList(category1), adminService.findActiveCategories(false));

    }

    @Test
    public void testUpdateCategoryStatus() throws InstanceNotFoundException {

        Category category1 = createCategory("category1");
        Category category2 = createCategory("category2");
        Category category3 = createCategory("category3");

        category1.setActive(false);

        categoryDao.save(category1);
        categoryDao.save(category3);
        categoryDao.save(category2);

        assertFalse(category1.getActive());
        assertTrue(category2.getActive());
        assertTrue(category3.getActive());

        Category category1Updated = adminService.updateCategoryStatus(category1.getId(),
                "category1updated", true);
        Category category2Updated = adminService.updateCategoryStatus(category2.getId(),
                "category2updated", false);
        Category category3Updated = adminService.updateCategoryStatus(category3.getId(),
                "category3updated", false);

        assertEquals("category1updated", category1Updated.getName());
        assertEquals("category2updated", category2Updated.getName());
        assertEquals("category3updated", category3Updated.getName());

        assertTrue(category1Updated.getActive());
        assertFalse(category2Updated.getActive());
        assertFalse(category3Updated.getActive());

    }

    @Test
    public void testUpdateCategoryStatusWithNonExistentId() {

        Category category1 = createCategory("category1");

        categoryDao.save(category1);

        assertThrows(InstanceNotFoundException.class, () ->
                adminService.updateCategoryStatus(NON_EXISTENT_CATEGORY_ID, "category1", true));

    }

    @Test
    public void testGetCategoryName() throws InstanceNotFoundException {

        Category category = createCategory("categoryName");
        categoryDao.save(category);

        Category obtainedCategory = adminService.findCategoryById(category.getId());

        assertEquals(category.getId(), obtainedCategory.getId());
        assertEquals(category.getName(), obtainedCategory.getName());
        assertEquals(category.getActive(), obtainedCategory.getActive());

    }

    @Test
    public void testGetCategoryNameWithNonExistentId() {

        Category category = createCategory("categoryName");
        categoryDao.save(category);

        assertThrows(InstanceNotFoundException.class, () ->
                adminService.findCategoryById(NON_EXISTENT_CATEGORY_ID));

    }

    @Test
    public void testFindUserReports() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException, InterruptedException, PermissionException {

        User admin = createAdmin("admin");
        userService.signUp(admin);
        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);
        User user4 = createUser("user4");
        userService.signUp(user4);

        Long userReport1Id = userService.reportUser(user1.getId(), user4.getId(), "SPAM", "explanation1");
        Thread.sleep(500);
        Long userReport2Id = userService.reportUser(user2.getId(), user4.getId(), "SPAM", "explanation2");
        Thread.sleep(500);
        Long userReport3Id = userService.reportUser(user3.getId(), user4.getId(), "SPAM", "explanation3");
        Thread.sleep(500);

        Long userReport4Id = userService.reportUser(user1.getId(), user2.getId(), "SPAM", "explanation4");
        Thread.sleep(500);
        Long userReport5Id = userService.reportUser(user3.getId(), user2.getId(), "SPAM", "explanation5");
        Thread.sleep(500);

        Long userReport6Id = userService.reportUser(user2.getId(), user1.getId(), "SPAM", "explanation6");

        UserReport userReport1 = userReportDao.findById(userReport1Id).get();
        UserReport userReport2 = userReportDao.findById(userReport2Id).get();
        UserReport userReport3 = userReportDao.findById(userReport3Id).get();
        UserReport userReport4 = userReportDao.findById(userReport4Id).get();
        UserReport userReport5 = userReportDao.findById(userReport5Id).get();
        UserReport userReport6 = userReportDao.findById(userReport6Id).get();

        Block<UserReport> expectedBlock = new Block<>(Arrays.asList(
                userReport6, userReport5, userReport4, userReport3, userReport2, userReport1), false);

        //TODO
        //assertEquals(expectedBlock, adminService.findUserReports(admin.getId(), 0, 6));

    }

    @Test
    public void testFindUserReportsWithNonExistentUserLoggedId() {

        assertThrows(InstanceNotFoundException.class, () ->
                adminService.findUserReports(NON_EXISTENT_ID, 0, 5));

    }

    @Test
    public void testFindUserReportsWithUserNotAdmin() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("user1");
        userService.signUp(user1);

        assertThrows(PermissionException.class, () ->
                adminService.findUserReports(user1.getId(), 0, 5));

    }

    @Test
    public void testFindImageReports() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException, InterruptedException, SilencedException, PermissionException {

        User admin = createAdmin("admin");
        userService.signUp(admin);
        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image1 = imageService.uploadImage(
                "title1", "description1", "location1", profilePicture, user1.getId());
        Image image3 = imageService.uploadImage(
                "title3", "description3", "location3", profilePicture, user2.getId());
        Image image4 = imageService.uploadImage(
                "title4", "description4", "location4", profilePicture, user3.getId());

        Long imageReport1Id = imageService.reportImage(user1.getId(), image4.getId(), "SPAM", "explanation1");
        Thread.sleep(500);
        Long imageReport2Id = imageService.reportImage(user2.getId(), image4.getId(), "SPAM", "explanation2");
        Thread.sleep(500);
        Long imageReport3Id = imageService.reportImage(user3.getId(), image3.getId(), "SPAM", "explanation3");
        Thread.sleep(500);

        ImageReport imageReport1 = imageReportDao.findById(imageReport1Id).get();
        ImageReport imageReport2 = imageReportDao.findById(imageReport2Id).get();
        ImageReport imageReport3 = imageReportDao.findById(imageReport3Id).get();

        Block<ImageReport> expectedBlock = new Block<>(Arrays.asList(
                imageReport3, imageReport2, imageReport1), false);

        //TODO
        //assertEquals(expectedBlock, adminService.findImageReports(admin.getId(), 0, 3));

    }

    @Test
    public void testFindImageReportsWithNonExistentUserLoggedId() {

        assertThrows(InstanceNotFoundException.class, () ->
                adminService.findImageReports(NON_EXISTENT_ID, 0, 5));

    }

    @Test
    public void testFindImageReportsWithUserNotAdmin() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("user1");
        userService.signUp(user1);

        assertThrows(PermissionException.class, () ->
                adminService.findImageReports(user1.getId(), 0, 5));

    }

    @Test
    public void testFindUserReportById() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException, PermissionException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User admin = createAdmin("admin");
        userService.signUp(admin);

        Long userReportId = userService.reportUser(user1.getId(), user2.getId(), "SPAM", "explanation");

        UserReport userReport = userReportDao.findById(userReportId).get();

        assertEquals(userReport, adminService.findUserReportById(admin.getId(), userReportId));

    }

    @Test
    public void testFindUserReportByIdWithNonExistentUserLoggedId() throws InvalidBirthDateException,
            DuplicateInstanceException, InstanceNotFoundException, ReportAlreadyGivenException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Long userReportId = userService.reportUser(user1.getId(), user2.getId(), "SPAM", "explanation");

        assertThrows(InstanceNotFoundException.class, () ->
                adminService.findUserReportById(NON_EXISTENT_ID, userReportId));

    }

    @Test
    public void testFindUserReportByIdWithNonAdminUser() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Long userReportId = userService.reportUser(user1.getId(), user2.getId(), "SPAM", "explanation");

        assertThrows(PermissionException.class, () ->
                adminService.findUserReportById(user1.getId(), userReportId));

    }

    @Test
    public void testFindUserReportByIdWithNonExistentUserReportId() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User admin = createAdmin("admin");
        userService.signUp(admin);

        assertThrows(InstanceNotFoundException.class, () ->
                adminService.findUserReportById(admin.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testFindImageReportById() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException, PermissionException, SilencedException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User admin = createAdmin("admin");
        userService.signUp(admin);

        Image image = imageService.uploadImage(
                "title1", "description1", "location1", profilePicture, user1.getId());

        Long imageReportId = imageService.reportImage(user1.getId(), image.getId(), "SPAM", "explanation");

        ImageReport imageReport = imageReportDao.findById(imageReportId).get();

        assertEquals(imageReport, adminService.findImageReportById(admin.getId(), imageReportId));

    }

    @Test
    public void testFindImageReportByIdWithNonExistentUserLoggedId() throws InvalidBirthDateException,
            DuplicateInstanceException, InstanceNotFoundException, ReportAlreadyGivenException, SilencedException, PermissionException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image = imageService.uploadImage(
                "title1", "description1", "location1", profilePicture, user1.getId());

        Long imageReportId = imageService.reportImage(user1.getId(), image.getId(), "SPAM", "explanation");

        assertThrows(InstanceNotFoundException.class, () ->
                adminService.findImageReportById(NON_EXISTENT_ID, imageReportId));

    }

    @Test
    public void testFindImageReportByIdWithNonAdminUser() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException, SilencedException, PermissionException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image = imageService.uploadImage(
                "title1", "description1", "location1", profilePicture, user1.getId());

        Long imageReportId = imageService.reportImage(user1.getId(), image.getId(), "SPAM", "explanation");

        assertThrows(PermissionException.class, () ->
                adminService.findImageReportById(user1.getId(), imageReportId));

    }

    @Test
    public void testFindImageReportByIdWithNonExistentUserReportId() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User admin = createAdmin("admin");
        userService.signUp(admin);

        assertThrows(InstanceNotFoundException.class, () ->
                adminService.findImageReportById(admin.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testWarnUserReportWithEmail() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException, PermissionException, IOException {

        User admin = createAdmin("admin");
        userService.signUp(admin);
        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        user2.setEmail("mauro.moranm@gmail.com");
        userService.signUp(user2);

        Long userReportId = userService.reportUser(user1.getId(), user2.getId(), "SPAM", "explanation");

        adminService.warnUserReportWithEmail(admin.getId(), userReportId, "Pórtate bien anda");

    }

    @Test
    public void testWarnUserReportWithNonAdminUser() throws InvalidBirthDateException, DuplicateInstanceException, InstanceNotFoundException, ReportAlreadyGivenException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        user2.setEmail("mauro.moranm@gmail.com");
        userService.signUp(user2);

        Long userReportId = userService.reportUser(user1.getId(), user2.getId(), "SPAM", "explanation");

        assertThrows(PermissionException.class, () ->
                adminService.warnUserReportWithEmail(user1.getId(), userReportId, "Pórtate bien anda"));

    }

    @Test
    public void testWarnUserReportWithNonExistentUserReportId() throws InvalidBirthDateException, DuplicateInstanceException {

        User admin = createAdmin("admin");
        userService.signUp(admin);
        User user1 = createUser("user1");
        userService.signUp(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                adminService.warnUserReportWithEmail(admin.getId(), NON_EXISTENT_ID, "Pórtate bien anda"));

    }

    @Test
    public void testWarnImageReportWithEmail() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException, PermissionException, IOException, SilencedException {

        User admin = createAdmin("admin");
        userService.signUp(admin);
        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        user2.setEmail("mauro.moranm@gmail.com");
        userService.signUp(user2);

        Image image = imageService.uploadImage(
                "title1", "description1", "location1", profilePicture, user2.getId());

        Long imageReportId = imageService.reportImage(user1.getId(), image.getId(), "SPAM", "explanation");

        adminService.warnImageReportWithEmail(admin.getId(), imageReportId, "Pórtate bien con las fotos anda");

    }

    @Test
    public void testWarnImageReportWithNonAdminUser() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException, SilencedException, PermissionException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        user2.setEmail("mauro.moranm@gmail.com");
        userService.signUp(user2);

        Image image = imageService.uploadImage(
                "title1", "description1", "location1", profilePicture, user2.getId());

        Long imageReportId = imageService.reportImage(user1.getId(), image.getId(), "SPAM", "explanation");

        assertThrows(PermissionException.class, () ->
                adminService.warnImageReportWithEmail(user1.getId(), imageReportId, "Pórtate bien con las fotos anda"));

    }

    @Test
    public void testWarnImageReportWithNonExistentImageReportId() throws InvalidBirthDateException, DuplicateInstanceException {

        User admin = createAdmin("admin");
        userService.signUp(admin);
        User user1 = createUser("user1");
        userService.signUp(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                adminService.warnUserReportWithEmail(admin.getId(), NON_EXISTENT_ID, "Pórtate bien con las fotos anda"));

    }

    @Test
    public void testSilenceUserReport() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException, PermissionException {

        User admin = createAdmin("admin");
        userService.signUp(admin);
        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Long userReportId = userService.reportUser(user1.getId(), user2.getId(), "SPAM", "explanation");

        assertFalse(user2.getSilenced());

        Boolean silenced = adminService.silenceUserReport(admin.getId(), userReportId, LocalDate.now().plusDays(1));

        Optional<UserPenalty> userPenalty = userPenaltyDao.findByUser(user2);

        assertTrue(silenced);
        assertTrue(user2.getSilenced());
        assertEquals(LocalDateTime.now().plusDays(1).toLocalDate(), userPenalty.get().getSilencedUntil());

    }

    @Test
    public void testTryToUploadImageBeingUserReportSilenced() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException, PermissionException {

        User admin = createAdmin("admin");
        userService.signUp(admin);
        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Long userReportId = userService.reportUser(user1.getId(), user2.getId(), "SPAM", "explanation");

        adminService.silenceUserReport(admin.getId(), userReportId, LocalDate.now().plusDays(1));

        assertThrows(SilencedException.class, () ->
                imageService.uploadImage("title1", "description1", "location1", profilePicture, user2.getId()));

    }

    @Test
    public void testSilenceUserReportWithNonAdminUser() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Long userReportId = userService.reportUser(user1.getId(), user2.getId(), "SPAM", "explanation");

        assertThrows(PermissionException.class, () ->
                adminService.silenceUserReport(user1.getId(), userReportId, LocalDate.now().plusDays(1)));

    }

    @Test
    public void testSilenceUserReportWithNonExistentUserReportId() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User admin = createAdmin("admin");
        userService.signUp(admin);

        assertThrows(InstanceNotFoundException.class, () ->
                adminService.silenceUserReport(admin.getId(), NON_EXISTENT_ID, LocalDate.now().plusDays(1)));

    }

    @Test
    public void testSilenceImageReport() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException, PermissionException, SilencedException {

        User admin = createAdmin("admin");
        userService.signUp(admin);
        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image = imageService.uploadImage(
                "title1", "description1", "location1", profilePicture, user2.getId());

        Long imageReportId = imageService.reportImage(user1.getId(), image.getId(), "SPAM", "explanation");

        assertFalse(user2.getSilenced());

        Boolean silenced = adminService.silenceImageReport(admin.getId(), imageReportId, LocalDate.now().plusDays(1));

        Optional<UserPenalty> userPenalty = userPenaltyDao.findByUser(user2);

        assertTrue(silenced);
        assertTrue(user2.getSilenced());
        assertEquals(LocalDateTime.now().plusDays(1).toLocalDate(), userPenalty.get().getSilencedUntil());

    }

    @Test
    public void testTryToUploadImageBeingImageReportSilenced() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException, PermissionException, SilencedException {

        User admin = createAdmin("admin");
        userService.signUp(admin);
        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image = imageService.uploadImage(
                "title1", "description1", "location1", profilePicture, user2.getId());

        Long imageReportId = imageService.reportImage(user1.getId(), image.getId(), "SPAM", "explanation");

        adminService.silenceImageReport(admin.getId(), imageReportId, LocalDate.now().plusDays(1));

        assertThrows(SilencedException.class, () ->
                imageService.uploadImage("title1", "description1", "location1", profilePicture, user2.getId()));

    }

    @Test
    public void testSilenceImageReportWithNonAdminUser() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException, SilencedException, PermissionException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image = imageService.uploadImage(
                "title1", "description1", "location1", profilePicture, user2.getId());

        Long imageReportId = imageService.reportImage(user1.getId(), image.getId(), "SPAM", "explanation");

        assertThrows(PermissionException.class, () ->
                adminService.silenceImageReport(user1.getId(), imageReportId, LocalDate.now().plusDays(1)));

    }

    @Test
    public void testSilenceImageReportWithNonExistentImageReportId() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User admin = createAdmin("admin");
        userService.signUp(admin);

        assertThrows(InstanceNotFoundException.class, () ->
                adminService.silenceImageReport(admin.getId(), NON_EXISTENT_ID, LocalDate.now().plusDays(1)));

    }

    @Test
    public void testBlockUserReport() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException, PermissionException {

        User admin = createAdmin("admin");
        userService.signUp(admin);
        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Long userReportId = userService.reportUser(user1.getId(), user2.getId(), "SPAM", "explanation");

        assertFalse(user2.getSilenced());

        Boolean blocked = adminService.blockUserReport(admin.getId(), userReportId, LocalDate.now().plusDays(1));

        Optional<UserPenalty> userPenalty = userPenaltyDao.findByUser(user2);

        assertTrue(blocked);
        assertTrue(user2.getBlocked());
        assertEquals(LocalDateTime.now().plusDays(1).toLocalDate(), userPenalty.get().getBlockedUntil());

    }

    @Test
    public void testTryToLoginBeingUserReportBlocked() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException, PermissionException {

        User admin = createAdmin("admin");
        userService.signUp(admin);
        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        String clearPassword = user2.getPassword();
        userService.signUp(user2);

        Long userReportId = userService.reportUser(user1.getId(), user2.getId(), "SPAM", "explanation");

        adminService.blockUserReport(admin.getId(), userReportId, LocalDate.now().plusDays(1));

        assertThrows(BlockedException.class, () ->
                userService.login(user2.getUserName(), clearPassword));

    }

    @Test
    public void testBlockUserReportWithNonAdminUser() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Long userReportId = userService.reportUser(user1.getId(), user2.getId(), "SPAM", "explanation");

        assertThrows(PermissionException.class, () ->
                adminService.blockImageReport(user1.getId(), userReportId, LocalDate.now().plusDays(1)));

    }

    @Test
    public void testBlockUserReportWithNonExistentUserReportId() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User admin = createAdmin("admin");
        userService.signUp(admin);

        assertThrows(InstanceNotFoundException.class, () ->
                adminService.blockUserReport(admin.getId(), NON_EXISTENT_ID, LocalDate.now().plusDays(1)));

    }

    @Test
    public void testBlockImageReport() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException, PermissionException, SilencedException {

        User admin = createAdmin("admin");
        userService.signUp(admin);
        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image = imageService.uploadImage(
                "title1", "description1", "location1", profilePicture, user2.getId());

        Long imageReportId = imageService.reportImage(user1.getId(), image.getId(), "SPAM", "explanation");

        assertFalse(user2.getSilenced());

        Boolean blocked = adminService.blockImageReport(admin.getId(), imageReportId, LocalDate.now().plusDays(1));

        Optional<UserPenalty> userPenalty = userPenaltyDao.findByUser(user2);

        assertTrue(blocked);
        assertTrue(user2.getBlocked());
        assertEquals(LocalDateTime.now().plusDays(1).toLocalDate(), userPenalty.get().getBlockedUntil());

    }

    @Test
    public void testTryToLoginBeingImageReportBlocked() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException, PermissionException, SilencedException {

        User admin = createAdmin("admin");
        userService.signUp(admin);
        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        String clearPassword = user2.getPassword();
        userService.signUp(user2);

        Image image = imageService.uploadImage(
                "title1", "description1", "location1", profilePicture, user2.getId());

        Long imageReportId = imageService.reportImage(user1.getId(), image.getId(), "SPAM", "explanation");

        adminService.blockImageReport(admin.getId(), imageReportId, LocalDate.now().plusDays(1));

        assertThrows(BlockedException.class, () ->
                userService.login(user2.getUserName(), clearPassword));

    }

    @Test
    public void testBlockImageReportWithNonAdminUser() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException, SilencedException, PermissionException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image = imageService.uploadImage(
                "title1", "description1", "location1", profilePicture, user2.getId());

        Long imageReportId = imageService.reportImage(user1.getId(), image.getId(), "SPAM", "explanation");

        assertThrows(PermissionException.class, () ->
                adminService.blockImageReport(user1.getId(), imageReportId, LocalDate.now().plusDays(1)));

    }

    @Test
    public void testBlockImageReportWithNonExistentImageReportId() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User admin = createAdmin("admin");
        userService.signUp(admin);

        assertThrows(InstanceNotFoundException.class, () ->
                adminService.blockImageReport(admin.getId(), NON_EXISTENT_ID, LocalDate.now().plusDays(1)));

    }

    @Test
    public void testMarkReportAsResolved() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, SilencedException, ReportAlreadyGivenException, PermissionException,
            ReportAlreadyResolvedException {

        User admin = createAdmin("admin");
        userService.signUp(admin);
        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image = imageService.uploadImage(
                "title1", "description1", "location1", profilePicture, user2.getId());

        Long imageReportId = imageService.reportImage(user1.getId(), image.getId(), "SPAM", "explanation");

        Long userReportId = userService.reportUser(user1.getId(), user2.getId(), "SPAM", "explanation");

        Optional<ImageReport> imageReportOpt = imageReportDao.findById(imageReportId);
        Optional<UserReport> userReportOpt = userReportDao.findById(userReportId);

        assertFalse(imageReportOpt.get().getResolved());
        assertFalse(userReportOpt.get().getResolved());

        adminService.markImageReportAsResolved(admin.getId(), imageReportId);
        adminService.markUserReportAsResolved(admin.getId(), userReportId);

        assertTrue(imageReportOpt.get().getResolved());
        assertTrue(userReportOpt.get().getResolved());

    }


}
