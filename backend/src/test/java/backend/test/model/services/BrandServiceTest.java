package backend.test.model.services;

import backend.model.entities.*;
import backend.model.exceptions.*;
import backend.model.services.Block;
import backend.model.services.BrandService;
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

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class BrandServiceTest {

    private final Long NON_EXISTENT_ID = Long.valueOf(-1);

    private final String NON_EXISTENT_EMAIL = "aaa";

    @Autowired
    private BrandService brandService;

    @Autowired
    private UserService userService;

    @Autowired
    private ImageService imageService;

    @Autowired
    private UserDao userDao;

    @Autowired
    private RewardDao rewardDao;

    @Autowired
    private RewardClaimedDao rewardClaimedDao;

    @Autowired
    private CategoryDao categoryDao;

    byte[] profilePicture = new byte[] {0x12, 0x34, 0x56, 0x78};

    byte[] imgFile = new byte[] {0x12, 0x34, 0x56, 0x78};

    private User createUser(String userName) {
        return new User(userName, "password", "brandName", "about", "email@email.com",
                "111-111-111", profilePicture, User.RoleType.BRAND_USER);
    }

    private User createNormalUser(String userName) {
        return new User(userName, "password", "name", "surname", "about", "email@email.com",
                LocalDate.now().minusYears(19), "111-111-111", profilePicture, User.RoleType.NORMAL_USER);
    }

    private Reward rewardExample(String name, String description, Long pointsCost, Long stock, byte[] imgFile, Long brandId) {
        return new Reward(name, description, LocalDateTime.now(), LocalDate.now().plusYears(1), pointsCost,
                stock, imgFile, false, userDao.findById(brandId).get());
    }

    private Category createCategory(String categoryName) {
        return Category.createNew(categoryName);
    }

    @Test
    public void testSignUpAndLoginFromId() throws DuplicateInstanceException, InstanceNotFoundException {

        User user = createUser("brand");

        brandService.signUp(user);

        User loggedInUser = brandService.loginFromId(user.getId());

        assertEquals(user, loggedInUser);
        assertEquals(User.RoleType.BRAND_USER, user.getRole());
        assertEquals(user, user.getUserSettings().getUser());

    }

    @Test
    public void testSignUpDuplicatedUserName() throws DuplicateInstanceException {

        User user = createUser("brand");

        brandService.signUp(user);
        assertThrows(DuplicateInstanceException.class, () -> brandService.signUp(user));

    }

    @Test
    public void testLoginFromNonExistentId() {
        assertThrows(InstanceNotFoundException.class, () -> brandService.loginFromId(NON_EXISTENT_ID));
    }

    @Test
    public void testLogin() throws DuplicateInstanceException, IncorrectLoginException {

        User user = createUser("brand");
        String clearPassword = user.getPassword();

        brandService.signUp(user);

        User loggedInUser = brandService.login(user.getUserName(), clearPassword);

        assertEquals(user, loggedInUser);

    }

    @Test
    public void testLoginWithIncorrectPassword() throws DuplicateInstanceException {

        User user = createUser("brand");
        String clearPassword = user.getPassword();

        brandService.signUp(user);
        assertThrows(IncorrectLoginException.class, () ->
                brandService.login(user.getUserName(), 'X' + clearPassword));

    }

    @Test
    public void testLoginWithNonExistentUserName() {
        assertThrows(IncorrectLoginException.class, () -> brandService.login("X", "Y"));
    }

    @Test
    public void testUploadReward() throws PermissionException, InstanceNotFoundException, InvalidEndDateException,
            BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userDao.save(brand);

        Reward reward = brandService.uploadReward("name", "description",
                LocalDate.now().plusYears(1), 1000L, 0L, 50L, imgFile, brand.getId());

        Reward createdReward = rewardExample("name", "description", 1000L, 50L, imgFile,
                brand.getId());

        assertEquals(reward.getName(), createdReward.getName());
        assertEquals(reward.getDescription(), createdReward.getDescription());
        assertEquals(reward.getPointsCost(), createdReward.getPointsCost());
        assertEquals(reward.getStock(), createdReward.getStock());
        assertEquals(reward.getImgFile(), createdReward.getImgFile());
        assertEquals(reward.getBrand(), createdReward.getBrand());
        assertEquals(reward.getCreationDate().toLocalDate(), createdReward.getCreationDate().toLocalDate());

    }

    @Test
    public void testUploadRewardWithNonExistentBrandId() {

        assertThrows(InstanceNotFoundException.class, () ->
                brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                        1000L, 0L, 50L, imgFile, NON_EXISTENT_ID));

    }

    @Test
    public void testUploadRewardWithNormalUser() {

        User brand = createUser("brand");
        brand.setRole(User.RoleType.NORMAL_USER);

        userDao.save(brand);

        assertThrows(PermissionException.class, () ->
                brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                        1000L, 0L, 50L, imgFile, brand.getId()));

    }

    @Test
    public void testUploadRewardWithInvalidEndDate() {

        User brand = createUser("brand");
        brand.verify();
        userDao.save(brand);

        assertThrows(InvalidEndDateException.class, () ->
                brandService.uploadReward("name", "description", LocalDate.now().minusDays(1),
                        1000L, 0L, 50L, imgFile, brand.getId()));

    }

    @Test
    public void testHideReward() throws InstanceNotFoundException, PermissionException, RewardAlreadyHiddenException,
            InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userDao.save(brand);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        assertFalse(reward.getHidden());

        brandService.hideReward(reward.getId(), brand.getId());

        assertTrue(reward.getHidden());

    }

    @Test
    public void testHideRewardWithNonExistentRewardId() {

        User brand = createUser("brand");

        userDao.save(brand);

        assertThrows(InstanceNotFoundException.class, () ->
                brandService.hideReward(NON_EXISTENT_ID, brand.getId()));

    }

    @Test
    public void testHideRewardWithNonExistentBrandId() throws InstanceNotFoundException, PermissionException,
            InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userDao.save(brand);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                brandService.hideReward(reward.getId(), NON_EXISTENT_ID));

    }
    @Test
    public void testHideRewardWithWrongBrand() throws InstanceNotFoundException, PermissionException,
            InvalidEndDateException, BrandNotVerifiedException {

        User brand1 = createUser("brand1");
        brand1.verify();
        userDao.save(brand1);
        User brand2 = createUser("brand2");
        userDao.save(brand2);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand1.getId());

        assertThrows(PermissionException.class, () ->
                brandService.hideReward(reward.getId(), brand2.getId()));

    }

    @Test
    public void testHideRewardAlreadyHidden() throws InstanceNotFoundException, PermissionException,
            RewardAlreadyHiddenException, InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userDao.save(brand);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        brandService.hideReward(reward.getId(), brand.getId());

        assertThrows(RewardAlreadyHiddenException.class, () ->
                brandService.hideReward(reward.getId(), brand.getId()));

    }

    @Test
    public void testHideRewardWithNormalUser() throws PermissionException, InstanceNotFoundException,
            InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userDao.save(brand);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        brand.setRole(User.RoleType.NORMAL_USER);

        assertThrows(PermissionException.class, () ->
                brandService.hideReward(reward.getId(), brand.getId()));

    }

    @Test
    public void testShowReward() throws InstanceNotFoundException, PermissionException, RewardAlreadyHiddenException,
            RewardNotHiddenException, InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userDao.save(brand);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        assertFalse(reward.getHidden());

        brandService.hideReward(reward.getId(), brand.getId());

        assertTrue(reward.getHidden());

        brandService.showReward(reward.getId(), brand.getId());

        assertFalse(reward.getHidden());

    }

    @Test
    public void testShowRewardWithNonExistentRewardId() {

        User brand = createUser("brand");
        userDao.save(brand);

        assertThrows(InstanceNotFoundException.class, () ->
                brandService.showReward(NON_EXISTENT_ID, brand.getId()));

    }

    @Test
    public void testShowRewardWithNonExistentBrandId() throws InstanceNotFoundException, PermissionException,
            RewardAlreadyHiddenException, InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userDao.save(brand);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        brandService.hideReward(reward.getId(), brand.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                brandService.showReward(reward.getId(), NON_EXISTENT_ID));

    }
    @Test
    public void testShowRewardWithWrongBrand() throws InstanceNotFoundException, PermissionException,
            RewardAlreadyHiddenException, InvalidEndDateException, BrandNotVerifiedException {

        User brand1 = createUser("brand1");
        brand1.verify();
        userDao.save(brand1);
        User brand2 = createUser("brand2");
        userDao.save(brand2);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand1.getId());

        brandService.hideReward(reward.getId(), brand1.getId());

        assertThrows(PermissionException.class, () ->
                brandService.showReward(reward.getId(), brand2.getId()));

    }

    @Test
    public void testShowRewardNotHidden() throws InstanceNotFoundException, PermissionException, InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userDao.save(brand);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        assertThrows(RewardNotHiddenException.class, () ->
                brandService.showReward(reward.getId(), brand.getId()));

    }

    @Test
    public void testShowRewardWithNormalUser() throws PermissionException, InstanceNotFoundException,
            RewardAlreadyHiddenException, InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userDao.save(brand);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        brandService.hideReward(reward.getId(), brand.getId());

        brand.setRole(User.RoleType.NORMAL_USER);

        assertThrows(PermissionException.class, () ->
                brandService.showReward(reward.getId(), brand.getId()));

    }

    @Test
    public void testDeleteReward() throws InstanceNotFoundException, PermissionException, InvalidEndDateException,
            BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userDao.save(brand);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        assertTrue(rewardDao.existsById(reward.getId()));

        assertTrue(brandService.deleteReward(reward.getId(), brand.getId()));

    }

    @Test
    public void testDeleteRewardWithNonExistentRewardId() {

        User brand = createUser("brand");
        userDao.save(brand);

        assertThrows(InstanceNotFoundException.class, () ->
                brandService.deleteReward(NON_EXISTENT_ID, brand.getId()));

    }

    @Test
    public void testDeleteRewardWithNonExistentBrandId() throws InstanceNotFoundException, PermissionException,
            InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userDao.save(brand);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                brandService.deleteReward(reward.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testDeleteRewardWithWrongBrand() throws InstanceNotFoundException, PermissionException,
            InvalidEndDateException, BrandNotVerifiedException {

        User brand1 = createUser("brand1");
        brand1.verify();
        userDao.save(brand1);
        User brand2 = createUser("brand2");
        userDao.save(brand2);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand1.getId());

        assertThrows(PermissionException.class, () ->
                brandService.deleteReward(reward.getId(), brand2.getId()));

    }

    @Test
    public void testDeleteRewardWithNormalUser() throws InstanceNotFoundException, PermissionException,
            InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userDao.save(brand);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        brand.setRole(User.RoleType.NORMAL_USER);

        assertThrows(PermissionException.class, () ->
                brandService.deleteReward(reward.getId(), brand.getId()));

    }

    @Test
    public void testFindRewardById() throws PermissionException, InstanceNotFoundException, HiddenRewardException,
            InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userDao.save(brand);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        assertEquals(reward, brandService.findRewardById(reward.getId(), 0L));

    }

    @Test
    public void testFindRewardByNonExistentId() {

        assertThrows(InstanceNotFoundException.class, () -> brandService.findRewardById(NON_EXISTENT_ID, 0L));

    }

    @Test
    public void testFindRewardHidden() throws PermissionException, InstanceNotFoundException,
            RewardAlreadyHiddenException, InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userDao.save(brand);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        brandService.hideReward(reward.getId(), brand.getId());

        assertThrows(HiddenRewardException.class, () ->
                brandService.findRewardById(reward.getId(), 0L));

    }

    @Test
    public void testFindRewardHiddenLoggedUser() throws PermissionException, InstanceNotFoundException,
            RewardAlreadyHiddenException, InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userDao.save(brand);

        User user = createUser("user");
        user.setRole(User.RoleType.NORMAL_USER);
        userDao.save(user);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        brandService.hideReward(reward.getId(), brand.getId());

        assertThrows(HiddenRewardException.class, () ->
                brandService.findRewardById(reward.getId(), user.getId()));

    }

    @Test
    public void testFindRewardHiddenButSameBrand() throws PermissionException, InstanceNotFoundException,
            HiddenRewardException, RewardAlreadyHiddenException, InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userDao.save(brand);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        brandService.hideReward(reward.getId(), brand.getId());

        assertEquals(reward, brandService.findRewardById(reward.getId(), brand.getId()));

    }

    @Test
    public void testFindRewards() throws PermissionException, InstanceNotFoundException, InterruptedException,
            InvalidBirthDateException, DuplicateInstanceException, RewardAlreadyClaimedException,
            RewardNotClaimableException, IOException, HiddenImageException, InvalidEndDateException, BrandNotVerifiedException {

        User brand1 = createUser("brand1");
        brand1.verify();
        userDao.save(brand1);
        User brand2 = createUser("brand2");
        brand2.verify();
        userDao.save(brand2);
        User user = createNormalUser("user");
        userService.signUp(user);
        user.getUserPoints().setPoints(100000L);
        User user2 = createNormalUser("user2");
        userService.signUp(user2);
        user2.getUserPoints().setPoints(1501L);

        Reward reward1 = brandService.uploadReward("name1", "description1", LocalDate.now().plusYears(1),
                1000L, 0L, 501L, imgFile, brand1.getId());
        Thread.sleep(1000);
        Reward reward2 = brandService.uploadReward("name2", "description2", LocalDate.now().plusYears(1),
                500L, 0L, 502L, imgFile, brand2.getId());
        Thread.sleep(1000);
        Reward reward3 = brandService.uploadReward("name3", "description3", LocalDate.now().plusYears(1),
                10003L, 0L, 503L, imgFile, brand1.getId());

        Block<Reward> expectedBlockRecentFirst = new Block<>(Arrays.asList(reward3, reward2, reward1), false);
        Block<Reward> expectedBlockOldestFirst = new Block<>(Arrays.asList(reward1, reward2, reward3), false);
        Block<Reward> expectedBlockPointsDesc = new Block<>(Arrays.asList(reward3, reward1, reward2), false);
        Block<Reward> expectedBlockPointsAsc = new Block<>(Arrays.asList(reward2, reward1, reward3), false);
        Block<Reward> expectedBlockStockDesc = new Block<>(Arrays.asList(reward3, reward2, reward1), false);
        Block<Reward> expectedBlockStockAsc = new Block<>(Arrays.asList(reward1, reward2, reward3), false);

        assertEquals(expectedBlockRecentFirst, brandService.findRewards(
                0L, 0L, "CREATION_DATE_DESC", false, 0, 3));
        assertEquals(expectedBlockOldestFirst, brandService.findRewards(
                0L, 0L, "CREATION_DATE_ASC", false, 0, 3));
        assertEquals(expectedBlockPointsDesc, brandService.findRewards(
                0L, 0L, "POINTS_COST_DESC", false, 0, 3));
        assertEquals(expectedBlockPointsAsc, brandService.findRewards(
                0L, 0L, "POINTS_COST_ASC", false, 0, 3));
        assertEquals(expectedBlockStockDesc, brandService.findRewards(
                0L, 0L, "STOCK_DESC", false, 0, 3));
        assertEquals(expectedBlockStockAsc, brandService.findRewards(
                0L, 0L, "STOCK_ASC", false, 0, 3));

        reward3.setStock(0L);
        Block<Reward> expectedBlockStockAscOnlyInStock = new Block<>(Arrays.asList(reward1, reward2), false);

        assertEquals(expectedBlockStockAscOnlyInStock, brandService.findRewards(
                0L, 0L, "STOCK_ASC_ONLY_IN_STOCK", false, 0, 3));

        brandService.claimReward(user.getId(), reward1.getId());

        Block<Reward> expectedBlockStockAscOnlyInStockNoClaimed = new Block<>(Arrays.asList(reward2), false);

        assertEquals(expectedBlockStockAscOnlyInStockNoClaimed, brandService.findRewards(
                0L, user.getId(), "STOCK_ASC_ONLY_IN_STOCK", false, 0, 3));

    }

    @Test
    public void testFindRewardsOnlyClaimable() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, InstanceNotFoundException, InterruptedException, RewardAlreadyClaimedException,
            RewardNotClaimableException, IOException, HiddenImageException, InvalidEndDateException, BrandNotVerifiedException {

        User brand1 = createUser("brand1");
        brand1.verify();
        userDao.save(brand1);
        User brand2 = createUser("brand2");
        brand2.verify();
        userDao.save(brand2);
        User user = createNormalUser("user");
        userService.signUp(user);
        user.getUserPoints().setPoints(1502L);

        Reward reward1 = brandService.uploadReward("name1", "description1", LocalDate.now().plusYears(1),
                1000L, 0L, 501L, imgFile, brand1.getId());
        Thread.sleep(1000);
        Reward reward2 = brandService.uploadReward("name2", "description2", LocalDate.now().plusYears(1),
                500L, 0L, 502L, imgFile, brand2.getId());
        Thread.sleep(1000);
        Reward reward3 = brandService.uploadReward("name3", "description3", LocalDate.now().plusYears(1),
                10003L, 0L, 503L, imgFile, brand1.getId());
        Thread.sleep(1000);
        Reward reward4 = brandService.uploadReward("name4", "description4", LocalDate.now().plusYears(1),
                1L, 0L, 503L, imgFile, brand1.getId());

        brandService.claimReward(user.getId(), reward4.getId());

        Block<Reward> expectedBlockRecentFirst = new Block<>(Arrays.asList(reward2, reward1), false);
        Block<Reward> expectedBlockOldestFirst = new Block<>(Arrays.asList(reward1, reward2), false);
        Block<Reward> expectedBlockPointsDesc = new Block<>(Arrays.asList(reward1, reward2), false);
        Block<Reward> expectedBlockPointsAsc = new Block<>(Arrays.asList(reward2, reward1), false);
        Block<Reward> expectedBlockStockDesc = new Block<>(Arrays.asList(reward2, reward1), false);
        Block<Reward> expectedBlockStockAsc = new Block<>(Arrays.asList(reward1, reward2), false);

        assertEquals(expectedBlockRecentFirst, brandService.findRewards(
                0L, user.getId(), "CREATION_DATE_DESC", true, 0, 4));
        assertEquals(expectedBlockOldestFirst, brandService.findRewards(
                0L, user.getId(), "CREATION_DATE_ASC", true, 0, 4));
        assertEquals(expectedBlockPointsDesc, brandService.findRewards(
                0L, user.getId(), "POINTS_COST_DESC", true, 0, 4));
        assertEquals(expectedBlockPointsAsc, brandService.findRewards(
                0L, user.getId(), "POINTS_COST_ASC", true, 0, 4));
        assertEquals(expectedBlockStockDesc, brandService.findRewards(
                0L, user.getId(), "STOCK_DESC", true, 0, 4));
        assertEquals(expectedBlockStockAsc, brandService.findRewards(
                0L, user.getId(), "STOCK_ASC", true, 0, 4));

    }

    @Test
    public void testFindRewardsFromBrand() throws PermissionException, InstanceNotFoundException, InterruptedException,
            RewardAlreadyHiddenException, InvalidEndDateException, HiddenImageException, BrandNotVerifiedException {

        User brand1 = createUser("brand1");
        brand1.verify();
        userDao.save(brand1);
        User brand2 = createUser("brand2");
        brand2.verify();
        userDao.save(brand2);

        Reward reward1 = brandService.uploadReward("name1", "description1", LocalDate.now().plusYears(1),
                1000L, 0L, 501L, imgFile, brand1.getId());
        Thread.sleep(1000);
        Reward reward2 = brandService.uploadReward("name2", "description2", LocalDate.now().plusYears(1),
                500L, 0L, 502L, imgFile, brand1.getId());
        Thread.sleep(1000);
        Reward reward3 = brandService.uploadReward("name3", "description3", LocalDate.now().plusYears(1),
                10003L, 0L, 503L, imgFile, brand1.getId());
        Thread.sleep(1000);
        Reward reward4 = brandService.uploadReward("name4", "description4", LocalDate.now().plusYears(1),
                1L, 0L, 2L, imgFile, brand2.getId());

        Reward hiddenReward = brandService.uploadReward("hidden", "description3", LocalDate.now().plusYears(1),
                2L, 0L, 504L, imgFile, brand1.getId());
        brandService.hideReward(hiddenReward.getId(), brand1.getId());

        Block<Reward> expectedBlockRecentFirst = new Block<>(Arrays.asList(reward3, reward2, reward1), false);
        Block<Reward> expectedBlockOldestFirst = new Block<>(Arrays.asList(reward1, reward2, reward3), false);
        Block<Reward> expectedBlockPointsDesc = new Block<>(Arrays.asList(reward3, reward1, reward2), false);
        Block<Reward> expectedBlockPointsAsc = new Block<>(Arrays.asList(reward2, reward1, reward3), false);
        Block<Reward> expectedBlockStockDesc = new Block<>(Arrays.asList(reward3, reward2, reward1), false);
        Block<Reward> expectedBlockStockAsc = new Block<>(Arrays.asList(reward1, reward2, reward3), false);

        Block<Reward> expectedBlockBrand2 = new Block<>(Arrays.asList(reward4), false);

        Block<Reward> expectedBlockRecentFirstHidden = new Block<>(
                Arrays.asList(hiddenReward, reward3, reward2, reward1), false);
        Block<Reward> expectedBlockOldestFirstHidden = new Block<>(
                Arrays.asList(reward1, reward2, reward3, hiddenReward), false);
        Block<Reward> expectedBlockPointsDescHidden = new Block<>(
                Arrays.asList(reward3, reward1, reward2, hiddenReward), false);
        Block<Reward> expectedBlockPointsAscHidden = new Block<>(
                Arrays.asList(hiddenReward, reward2, reward1, reward3), false);
        Block<Reward> expectedBlockStockDescHidden = new Block<>(
                Arrays.asList(hiddenReward, reward3, reward2, reward1), false);
        Block<Reward> expectedBlockStockAscHidden = new Block<>(
                Arrays.asList(reward1, reward2, reward3, hiddenReward), false);

        assertEquals(expectedBlockRecentFirst, brandService.findRewards(
                brand1.getId(), 0L, "CREATION_DATE_DESC", false, 0, 4));
        assertEquals(expectedBlockOldestFirst, brandService.findRewards(
                brand1.getId(), 0L, "CREATION_DATE_ASC", false, 0, 4));
        assertEquals(expectedBlockPointsDesc, brandService.findRewards(
                brand1.getId(), 0L, "POINTS_COST_DESC", false, 0, 4));
        assertEquals(expectedBlockPointsAsc, brandService.findRewards(
                brand1.getId(), 0L, "POINTS_COST_ASC", false, 0, 4));
        assertEquals(expectedBlockStockDesc, brandService.findRewards(
                brand1.getId(), 0L, "STOCK_DESC", false, 0, 4));
        assertEquals(expectedBlockStockAsc, brandService.findRewards(
                brand1.getId(), 0L, "STOCK_ASC", false, 0, 4));

        assertEquals(expectedBlockBrand2, brandService.findRewards(
                brand2.getId(), 0L, "STOCK_ASC", false, 0, 3));

        assertEquals(expectedBlockRecentFirstHidden, brandService.findRewards(
                brand1.getId(), brand1.getId(), "CREATION_DATE_DESC", false, 0, 4));
        assertEquals(expectedBlockOldestFirstHidden, brandService.findRewards(
                brand1.getId(), brand1.getId(), "CREATION_DATE_ASC", false, 0, 4));
        assertEquals(expectedBlockPointsDescHidden, brandService.findRewards(
                brand1.getId(), brand1.getId(), "POINTS_COST_DESC", false, 0, 4));
        assertEquals(expectedBlockPointsAscHidden, brandService.findRewards(
                brand1.getId(), brand1.getId(), "POINTS_COST_ASC", false, 0, 4));
        assertEquals(expectedBlockStockDescHidden, brandService.findRewards(
                brand1.getId(), brand1.getId(), "STOCK_DESC", false, 0, 4));
        assertEquals(expectedBlockStockAscHidden, brandService.findRewards(
                brand1.getId(), brand1.getId(), "STOCK_ASC", false, 0, 4));

    }

    @Test
    public void testClaimReward() throws PermissionException, InstanceNotFoundException, RewardAlreadyClaimedException,
            RewardNotClaimableException, InvalidBirthDateException, DuplicateInstanceException, IOException,
            HiddenImageException, InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userService.signUp(brand);
        User user = createNormalUser("user");
        userService.signUp(user);
        user.getUserPoints().setPoints(2000L);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        assertFalse(rewardClaimedDao.existsByUserAndReward(user, reward));

        brandService.claimReward(user.getId(), reward.getId());

        assertEquals(1000L, user.getUserPoints().getPoints());
        assertEquals(49L, reward.getStock());
        assertTrue(rewardClaimedDao.existsByUserAndReward(user, reward));

    }

    @Test
    public void testClaimRewardWithNonExistentUserId() throws PermissionException, InstanceNotFoundException,
            InvalidBirthDateException, DuplicateInstanceException, InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userService.signUp(brand);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                brandService.claimReward(NON_EXISTENT_ID, reward.getId()));

    }

    @Test
    public void testClaimRewardWithNonExistentRewardId() throws InvalidBirthDateException, DuplicateInstanceException {

        User user = createNormalUser("user");
        userService.signUp(user);

        assertThrows(InstanceNotFoundException.class, () ->
                brandService.claimReward(user.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testClaimRewardWithNotEnoughPoints() throws PermissionException, InstanceNotFoundException,
            InvalidBirthDateException, DuplicateInstanceException, InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userService.signUp(brand);
        User user = createNormalUser("user");
        userService.signUp(user);
        user.getUserPoints().setPoints(500L);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        assertThrows(RewardNotClaimableException.class, () ->
                brandService.claimReward(user.getId(), reward.getId()));

    }

    @Test
    public void testClaimRewardWithNoStock() throws PermissionException, InstanceNotFoundException,
            InvalidBirthDateException, DuplicateInstanceException, InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        userService.signUp(brand);
        brand.verify();
        User user = createNormalUser("user");
        userService.signUp(user);
        user.getUserPoints().setPoints(2000L);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 0L, imgFile, brand.getId());

        assertThrows(RewardNotClaimableException.class, () ->
                brandService.claimReward(user.getId(), reward.getId()));

    }

    @Test
    public void testClaimHiddenReward() throws PermissionException, InstanceNotFoundException,
            RewardAlreadyHiddenException, InvalidBirthDateException, DuplicateInstanceException, InvalidEndDateException,
            BrandNotVerifiedException {

        User brand = createUser("brand");
        userService.signUp(brand);
        brand.verify();
        User user = createNormalUser("user");
        userService.signUp(user);
        user.getUserPoints().setPoints(2000L);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        brandService.hideReward(reward.getId(), brand.getId());

        assertThrows(RewardNotClaimableException.class, () ->
                brandService.claimReward(user.getId(), reward.getId()));

    }

    @Test
    public void testClaimRewardAlreadyClaimed() throws PermissionException, InstanceNotFoundException,
            RewardAlreadyClaimedException, RewardNotClaimableException, InvalidBirthDateException,
            DuplicateInstanceException, IOException, HiddenImageException, InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userService.signUp(brand);
        User user = createNormalUser("user");
        userService.signUp(user);
        user.getUserPoints().setPoints(2000L);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        brandService.claimReward(user.getId(), reward.getId());

        assertThrows(RewardAlreadyClaimedException.class, () ->
                brandService.claimReward(user.getId(), reward.getId()));

    }

    @Test
    public void testClaimRewardWithPublicationsNeeded() throws PermissionException, InstanceNotFoundException,
            RewardAlreadyClaimedException, RewardNotClaimableException, InvalidBirthDateException,
            DuplicateInstanceException, IOException, HiddenImageException, CategoryNotActiveException,
            InvalidLinkException, InvalidEndDateException, SilencedException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userService.signUp(brand);
        User user = createNormalUser("user");
        userService.signUp(user);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 2L, 50L, imgFile, brand.getId());

        Image image1 = imageService.uploadImage("title1", "description1", "location1", imgFile,
                user.getId());

        user.getUserPoints().setPublishedToday(false);

        Image image2 = imageService.uploadImage("title2", "description2", "location2", imgFile,
                user.getId());

        Category category = createCategory("category");
        categoryDao.save(category);

        imageService.tagImage("tag1", "http://www.link1.com", 50, 50, category.getId(),
                image1.getId(), brand.getId(), user.getId());
        imageService.tagImage("tag2", "http://www.link2.com", 50, 50, category.getId(),
                image2.getId(), brand.getId(), user.getId());
        imageService.tagImage("tag3", "http://www.link3.com", 50, 50, category.getId(),
                image2.getId(), brand.getId(), user.getId());

        assertFalse(rewardClaimedDao.existsByUserAndReward(user, reward));

        user.getUserPoints().setPoints(2000L);

        brandService.claimReward(user.getId(), reward.getId());

        assertEquals(1000L, user.getUserPoints().getPoints());
        assertEquals(49L, reward.getStock());
        assertTrue(rewardClaimedDao.existsByUserAndReward(user, reward));

    }

    @Test
    public void testClaimRewardWithNotEnoughPublicationsNeeded() throws PermissionException, InstanceNotFoundException,
            InvalidBirthDateException, DuplicateInstanceException, CategoryNotActiveException, InvalidLinkException,
            InvalidEndDateException, SilencedException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userService.signUp(brand);
        User user = createNormalUser("user");
        userService.signUp(user);
        user.getUserPoints().setPoints(2000L);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 2L, 50L, imgFile, brand.getId());

        Image image1 = imageService.uploadImage("title1", "description1", "location1", imgFile,
                user.getId());

        Category category = createCategory("category");
        categoryDao.save(category);

        imageService.tagImage("tag1", "http://www.link.com", 50, 50, category.getId(),
                image1.getId(), brand.getId(), user.getId());

        assertThrows(RewardNotClaimableException.class, () ->
                brandService.claimReward(user.getId(), reward.getId()));

    }

    @Test
    public void testClaimRewardThatEnded() throws PermissionException, InstanceNotFoundException,
            InvalidBirthDateException, DuplicateInstanceException, RewardAlreadyClaimedException, HiddenImageException,
            RewardNotClaimableException, IOException, InvalidEndDateException, InterruptedException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userService.signUp(brand);
        User user = createNormalUser("user");
        userService.signUp(user);
        user.getUserPoints().setPoints(2000L);

        Reward reward1 = brandService.uploadReward("name", "description", LocalDate.now(),
                1000L, 0L, 50L, imgFile, brand.getId());

        reward1.setEndDate(LocalDate.now().minusDays(1));

        Reward reward2 = brandService.uploadReward("name", "description", LocalDate.now(),
                1000L, 0L, 50L, imgFile, brand.getId());

        brandService.claimReward(user.getId(), reward2.getId());

        assertThrows(RewardNotClaimableException.class, () ->
                brandService.claimReward(user.getId(), reward1.getId()));

    }

    @Test
    public void testIsRewardClaimedByUser() throws PermissionException, InstanceNotFoundException,
            RewardAlreadyClaimedException, RewardNotClaimableException, InvalidBirthDateException,
            DuplicateInstanceException, IOException, HiddenImageException, InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userService.signUp(brand);
        User user = createNormalUser("user");
        userService.signUp(user);
        user.getUserPoints().setPoints(2000L);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        assertFalse(brandService.isRewardClaimedByUser(user.getId(), reward.getId()));

        brandService.claimReward(user.getId(), reward.getId());

        assertTrue(brandService.isRewardClaimedByUser(user.getId(), reward.getId()));

    }

    @Test
    public void testIsRewardClaimedByUserWithNonExistentUserId() throws PermissionException, InstanceNotFoundException,
            InvalidBirthDateException, DuplicateInstanceException, InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userService.signUp(brand);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                brandService.isRewardClaimedByUser(NON_EXISTENT_ID, reward.getId()));

    }

    @Test
    public void testIsRewardClaimedByUserWithNonExistentRewardId() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User user = createNormalUser("user");
        userService.signUp(user);

        assertThrows(InstanceNotFoundException.class, () ->
                brandService.isRewardClaimedByUser(user.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testFindUsersThatClaimedReward() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, InstanceNotFoundException, RewardAlreadyClaimedException, RewardNotClaimableException,
            IOException, HiddenImageException, InvalidEndDateException, BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userService.signUp(brand);
        User user1 = createNormalUser("user1");
        userService.signUp(user1);
        user1.getUserPoints().setPoints(10000L);
        User user2 = createNormalUser("user2");
        userService.signUp(user2);
        user2.getUserPoints().setPoints(10000L);
        User user3 = createNormalUser("user3");
        userService.signUp(user3);
        user3.getUserPoints().setPoints(10000L);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        brandService.claimReward(user1.getId(), reward.getId());

        Block<User> expectedBlockOneUser = new Block<>(Arrays.asList(user1), false);

        assertEquals(expectedBlockOneUser, brandService.findUsersThatClaimedReward(
                brand.getId(), reward.getId(), 0, 3));

        brandService.claimReward(user2.getId(), reward.getId());

        Block<User> expectedBlockTwoUsers = new Block<>(Arrays.asList(user1, user2), false);

        assertEquals(expectedBlockTwoUsers, brandService.findUsersThatClaimedReward(
                brand.getId(), reward.getId(), 0, 3));

        brandService.claimReward(user3.getId(), reward.getId());

        Block<User> expectedBlockThreeUsers = new Block<>(Arrays.asList(user1, user2, user3), false);

        assertEquals(expectedBlockThreeUsers, brandService.findUsersThatClaimedReward(
                brand.getId(), reward.getId(), 0, 3));

    }

    @Test
    public void testFindUsersThatClaimedRewardWithNonExistentBrandId() throws InvalidBirthDateException,
            DuplicateInstanceException, PermissionException, InstanceNotFoundException, InvalidEndDateException,
            BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userService.signUp(brand);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                brandService.findUsersThatClaimedReward(NON_EXISTENT_ID, reward.getId(), 0, 3));

    }

    @Test
    public void testFindUsersThatClaimedRewardWithNonExistentRewardId() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User brand = createUser("brand");
        userService.signUp(brand);

        assertThrows(InstanceNotFoundException.class, () ->
                brandService.findUsersThatClaimedReward(brand.getId(), NON_EXISTENT_ID, 0, 3));

    }

    @Test
    public void testFindUsersThatClaimedRewardWithNotBrandUser() throws InvalidBirthDateException,
            DuplicateInstanceException, PermissionException, InstanceNotFoundException, InvalidEndDateException,
            BrandNotVerifiedException {

        User brand = createUser("brand");
        brand.verify();
        userService.signUp(brand);
        User user1 = createNormalUser("user1");
        userService.signUp(user1);

        Reward reward = brandService.uploadReward("name", "description", LocalDate.now().plusYears(1),
                1000L, 0L, 50L, imgFile, brand.getId());

        assertThrows(PermissionException.class, () ->
                brandService.findUsersThatClaimedReward(user1.getId(), reward.getId(), 0, 3));

    }

    @Test
    public void testGetNumPublicationsWithBrand() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, PermissionException, InvalidLinkException, CategoryNotActiveException,
            HiddenImageException, SilencedException {

        User brand1 = createUser("brand1");
        userService.signUp(brand1);
        User brand2 = createUser("brand2");
        userService.signUp(brand2);
        User user = createUser("user");
        user.setRole(User.RoleType.NORMAL_USER);
        user.setBirthDate(LocalDate.now().minusYears(20));
        userService.signUp(user);

        Image image1 = imageService.uploadImage(
                "title1", "description1", "location1", imgFile, user.getId());

        user.getUserPoints().setPublishedToday(false);

        Image image2 = imageService.uploadImage(
                "title2", "description2", "location2", imgFile, user.getId());

        user.getUserPoints().setPublishedToday(false);

        Image image3 = imageService.uploadImage(
                "title3", "description3", "location3", imgFile, user.getId());

        Category category = createCategory("category");
        categoryDao.save(category);

        imageService.tagImage("tag1", "http://www.link1.com", 50, 50, category.getId(),
                image1.getId(), brand1.getId(), user.getId());
        imageService.tagImage("tag2", "http://www.link2.com", 50, 50, category.getId(),
                image2.getId(), brand1.getId(), user.getId());
        imageService.tagImage("tag3", "http://www.link3.com", 50, 50, category.getId(),
                image2.getId(), brand2.getId(), user.getId());
        imageService.tagImage("tag4", "http://www.link4.com", 50, 50, category.getId(),
                image3.getId(), brand2.getId(), user.getId());

        assertEquals(2L, brandService.getNumPublicationsWithBrand(user.getId(), brand1.getId()));
        assertEquals(2L, brandService.getNumPublicationsWithBrand(user.getId(), brand2.getId()));

    }

    @Test
    public void testGetNumPublicationsWithBrandWithNonExistentUserId() throws InvalidBirthDateException,
            DuplicateInstanceException{

        User brand1 = createUser("brand1");
        userService.signUp(brand1);

        assertThrows(InstanceNotFoundException.class, () ->
                brandService.getNumPublicationsWithBrand(NON_EXISTENT_ID, brand1.getId()));

    }

    @Test
    public void testGetNumPublicationsWithBrandWithNonExistentBrandId() throws InvalidBirthDateException,
            DuplicateInstanceException{

        User user = createUser("user");
        user.setRole(User.RoleType.NORMAL_USER);
        user.setBirthDate(LocalDate.now().minusYears(20));
        userService.signUp(user);

        assertThrows(InstanceNotFoundException.class, () ->
                brandService.getNumPublicationsWithBrand(user.getId(), NON_EXISTENT_ID));

    }

}