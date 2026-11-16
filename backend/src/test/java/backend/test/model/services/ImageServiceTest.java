package backend.test.model.services;

import backend.model.entities.*;
import backend.model.exceptions.*;
import backend.model.services.Block;
import backend.model.services.ImageService;
import backend.model.services.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class ImageServiceTest {

    private final Long NON_EXISTENT_ID = Long.valueOf(-1);

    private final Long NUM_POINTS_PER_IMG_LIKE = 25L;

    private final Long NUM_POINTS_PER_TAG_LIKE = 50L;

    private final Long NUM_POINTS_PER_COMMENT = 75L;

    @Autowired
    private UserDao userDao;

    @Autowired
    private ImageDao imageDao;

    @Autowired
    private CategoryDao categoryDao;

    @Autowired
    private TagDao tagDao;

    @Autowired
    private ImageLikeDao imageLikeDao;

    @Autowired
    private TagLikeDao tagLikeDao;

    @Autowired
    private CommentDao commentDao;

    @Autowired
    private ImageReportDao imageReportDao;

    @Autowired
    private ImageService imageService;

    @Autowired
    private UserService userService;

    byte[] profilePicture = new byte[] {0x12, 0x34, 0x56, 0x78};
    byte[] imgFile = new byte[] {0x12, 0x34, 0x56, 0x78};

    private User createUser(String userName) {
        return new User(userName, "password", "name", "surname", "about", "email@email.com",
                LocalDate.now().minusYears(19), "111-111-111", profilePicture, User.RoleType.NORMAL_USER);
    }

    private Image imageExample(String title, String description, String location, byte[] imgFile, Long userId) {
        return new Image(title, description, location, imgFile, LocalDateTime.now(), userDao.findById(userId).get());
    }

    private Category createCategory(String categoryName) {
        return new Category(categoryName);
    }

    private Tag tagExample(String name, String link, int coordinateX, int coordinateY, Category category, Image image) {
        return new Tag(name, link, coordinateX, coordinateY, category, image);
    }

    @Test
    public void testUploadImage() throws InstanceNotFoundException, SilencedException, InvalidBirthDateException,
            DuplicateInstanceException, PermissionException {

        User user = createUser("userName");

        userService.signUp(user);

        Image image = imageService.uploadImage("image", "description", "location", imgFile, user.getId());

        Image createdImage = imageExample("image", "description", "location", imgFile, user.getId());

        assertEquals(image.getTitle(), createdImage.getTitle());
        assertEquals(image.getDescription(), createdImage.getDescription());
        assertEquals(image.getLocation(), createdImage.getLocation());
        assertEquals(image.getImgFile(), createdImage.getImgFile());
        assertEquals(image.getUser(), createdImage.getUser());
        assertEquals(image.getHidden(), createdImage.getHidden());
        assertEquals(image.getDate().toLocalDate(), createdImage.getDate().toLocalDate());

    }

    @Test
    public void testUploadImageWithNonExistentUserId() {

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.uploadImage("a", "a", "a", imgFile, NON_EXISTENT_ID));

    }

    @Test
    public void testUpdateImage() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, PermissionException, HiddenImageException, SilencedException {

        User user = createUser("user");
        userService.signUp(user);

        Image image = imageService.uploadImage(
                "image", "description", "location", imgFile, user.getId());

        image.setTitle('X' + image.getTitle());
        image.setDescription('X' + image.getDescription());
        image.setLocation('X' + image.getLocation());

        imageService.updateImage(image.getId(), 'X' + image.getTitle(), 'X' + image.getDescription(),
                'X' + image.getLocation(), user.getId());

        Image updatedImage = imageService.findImageById(image.getId(), user.getId());

        assertEquals(image, updatedImage);

    }

    @Test
    public void testUpdateImageWithNonExistentImageId() throws InvalidBirthDateException, DuplicateInstanceException {

        User user = createUser("user");
        userService.signUp(user);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.updateImage(NON_EXISTENT_ID, "a", "a", "a", user.getId()));

    }

    @Test
    public void testUpdateImageWithNonExistentUserId() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, SilencedException, PermissionException {

        User user = createUser("user");
        userService.signUp(user);

        Image image = imageService.uploadImage(
                "image", "description", "location", imgFile, user.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.updateImage(image.getId(), "a", "a", "a", NON_EXISTENT_ID));

    }

    @Test
    public void testUpdateImageWithWrongUser() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, SilencedException, PermissionException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image = imageService.uploadImage(
                "image", "description", "location", imgFile, user1.getId());

        assertThrows(PermissionException.class, () ->
                imageService.updateImage(image.getId(), "a", "a", "a", user2.getId()));

    }

    @Test
    public void testDeleteImage() throws InstanceNotFoundException, PermissionException, SilencedException,
            InvalidBirthDateException, DuplicateInstanceException {

        User user = createUser("userName");

        userService.signUp(user);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user.getId());

        assertTrue(imageDao.existsById(image.getId()));

        assertTrue(imageService.deleteImage(image.getId(), user.getId()));

    }

    @Test
    public void testDeleteImageWithNonExistentImageId() {

        User user = createUser("userName");

        userDao.save(user);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.deleteImage(NON_EXISTENT_ID, user.getId()));

    }

    @Test
    public void testDeleteImageWithNonExistentUserId() throws InstanceNotFoundException, SilencedException,
            InvalidBirthDateException, DuplicateInstanceException, PermissionException {

        User user = createUser("userName");

        userService.signUp(user);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.deleteImage(image.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testDeleteImageWithWrongUser() throws InstanceNotFoundException, SilencedException,
            InvalidBirthDateException, DuplicateInstanceException, PermissionException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        User user2 = createUser("userName2");
        userDao.save(user2);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user1.getId());

        assertThrows(PermissionException.class, () ->
                imageService.deleteImage(image.getId(), user2.getId()));

    }

    @Test
    public void testHideImage() throws InstanceNotFoundException, PermissionException, ImageAlreadyHiddenException,
            SilencedException, InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user1.getId());

        assertFalse(image.getHidden());

        imageService.hideImage(image.getId(), user1.getId());

        assertTrue(image.getHidden());

    }

    @Test
    public void testHideImageWithNonExistentImageId() {

        User user1 = createUser("userName1");
        userDao.save(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.hideImage(NON_EXISTENT_ID, user1.getId()));

    }

    @Test
    public void testHideImageWithNonExistentUserId() throws InstanceNotFoundException, SilencedException,
            InvalidBirthDateException, DuplicateInstanceException, PermissionException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user1.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.hideImage(image.getId(), NON_EXISTENT_ID));

    }
    @Test
    public void testHideImageWithWrongUser() throws InstanceNotFoundException, SilencedException,
            InvalidBirthDateException, DuplicateInstanceException, PermissionException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        User user2 = createUser("userName2");
        userDao.save(user2);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user1.getId());

        assertThrows(PermissionException.class, () ->
                imageService.hideImage(image.getId(), user2.getId()));

    }

    @Test
    public void testHideImageAlreadyHidden() throws InstanceNotFoundException, PermissionException,
            ImageAlreadyHiddenException, SilencedException, InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user1.getId());

        imageService.hideImage(image.getId(), user1.getId());

        assertThrows(ImageAlreadyHiddenException.class, () ->
                imageService.hideImage(image.getId(), user1.getId()));

    }

    @Test
    public void testShowImage() throws InstanceNotFoundException, PermissionException, ImageAlreadyHiddenException,
            ImageNotHiddenException, SilencedException, InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user1.getId());

        assertFalse(image.getHidden());

        imageService.hideImage(image.getId(), user1.getId());

        assertTrue(image.getHidden());

        imageService.showImage(image.getId(), user1.getId());

        assertFalse(image.getHidden());

    }

    @Test
    public void testShowImageWithNonExistentImageId() {

        User user1 = createUser("userName1");
        userDao.save(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.showImage(NON_EXISTENT_ID, user1.getId()));

    }

    @Test
    public void testShowImageWithNonExistentUserId() throws InstanceNotFoundException, PermissionException,
            ImageAlreadyHiddenException, SilencedException, InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user1.getId());

        imageService.hideImage(image.getId(), user1.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.showImage(image.getId(), NON_EXISTENT_ID));

    }
    @Test
    public void testShowImageWithWrongUser() throws InstanceNotFoundException, PermissionException,
            ImageAlreadyHiddenException, SilencedException, InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        User user2 = createUser("userName2");
        userDao.save(user2);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user1.getId());

        imageService.hideImage(image.getId(), user1.getId());

        assertThrows(PermissionException.class, () ->
                imageService.showImage(image.getId(), user2.getId()));

    }

    @Test
    public void testShowImageNotHidden() throws InstanceNotFoundException, SilencedException,
            InvalidBirthDateException, DuplicateInstanceException, PermissionException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user1.getId());

        assertThrows(ImageNotHiddenException.class, () ->
                imageService.showImage(image.getId(), user1.getId()));

    }

    @Test
    public void testTagImage() throws InstanceNotFoundException, PermissionException, CategoryNotActiveException,
            InvalidLinkException, SilencedException, InvalidBirthDateException, DuplicateInstanceException {

        User user = createUser("userName");

        userService.signUp(user);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user.getId());

        Category category = createCategory("category");
        categoryDao.save(category);

        Tag tag = imageService.tagImage("tag", "http://www.link.com", 50, 50,
                category.getId(), image.getId(), 0L, user.getId());

        Tag createdTag = tagExample("tag", "http://www.link.com", 50, 50, category, image);

        assertEquals(tag.getName(), createdTag.getName());
        assertEquals(tag.getLink(), createdTag.getLink());
        assertEquals(tag.getCoordinateX(), createdTag.getCoordinateX());
        assertEquals(tag.getCoordinateY(), createdTag.getCoordinateY());
        assertEquals(tag.getCategory(), createdTag.getCategory());
        assertEquals(tag.getImage(), createdTag.getImage());

    }

    @Test
    public void testTagImageWithNonExistentUserId() throws InstanceNotFoundException, SilencedException,
            InvalidBirthDateException, DuplicateInstanceException, PermissionException {

        User user = createUser("userName");

        userService.signUp(user);

        Category category = createCategory("category");
        categoryDao.save(category);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.tagImage("tag", "http://www.link.com",
                        50, 50, category.getId(), image.getId(),0L,  NON_EXISTENT_ID));

    }

    @Test
    public void testTagImageWithNonExistentCategoryId() throws InstanceNotFoundException, SilencedException,
            InvalidBirthDateException, DuplicateInstanceException, PermissionException {

        User user = createUser("userName");

        userService.signUp(user);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.tagImage("tag", "http://www.link.com",
                        50, 50, NON_EXISTENT_ID, image.getId(),0L,  user.getId()));

    }

    @Test
    public void testTagImageWithNonExistentImageId() {

        User user = createUser("userName");

        userDao.save(user);

        Category category = createCategory("category");
        categoryDao.save(category);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.tagImage("tag", "http://www.link.com",
                        50, 50, category.getId(), NON_EXISTENT_ID, 0L, user.getId()));

    }

    @Test
    public void testTagImageWithDifferentUserId() throws InstanceNotFoundException, SilencedException,
            InvalidBirthDateException, DuplicateInstanceException, PermissionException {

        User user = createUser("userName");
        userService.signUp(user);

        User wrongUser = createUser("wrong");
        userDao.save(wrongUser);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user.getId());

        Category category = createCategory("category");
        categoryDao.save(category);

        assertThrows(PermissionException.class, () ->
                imageService.tagImage("tag", "http://www.link.com",
                        50, 50, category.getId(), image.getId(), 0L, wrongUser.getId()));

    }

    @Test
    public void testTagImageWithNotActiveCategory() throws InstanceNotFoundException, SilencedException,
            InvalidBirthDateException, DuplicateInstanceException, PermissionException {

        User user = createUser("userName");

        userService.signUp(user);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user.getId());

        Category category = createCategory("category");
        category.setActive(false);
        categoryDao.save(category);

        assertThrows(CategoryNotActiveException.class, () ->
                imageService.tagImage("tag", "http://www.link.com", 50, 50,
                        category.getId(), image.getId(), 0L, user.getId()));

    }

    @Test
    public void testTagImageWithInvalidLink() throws InstanceNotFoundException, SilencedException,
            InvalidBirthDateException, DuplicateInstanceException, PermissionException {

        User user = createUser("userName");

        userService.signUp(user);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user.getId());

        Category category = createCategory("category");
        categoryDao.save(category);

        assertThrows(InvalidLinkException.class, () ->
                imageService.tagImage("tag", "invalidLink", 50, 50,
                        category.getId(), image.getId(), 0L, user.getId()));

    }

    @Test
    public void testUpdateTag() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, PermissionException, CategoryNotActiveException, InvalidLinkException,
            SilencedException {

        User user = createUser("user");
        userService.signUp(user);
        User brand = createUser("brand");
        brand.setRole(User.RoleType.BRAND_USER);
        userService.signUp(brand);

        Image image = imageService.uploadImage(
                "image", "description", "location", imgFile, user.getId());

        Category category1 = createCategory("category1");
        categoryDao.save(category1);
        Category category2 = createCategory("category2");
        categoryDao.save(category2);

        Tag tag = imageService.tagImage("tag", "http://www.link.com", 50, 50,
                category1.getId(), image.getId(), 0L, user.getId());

        tag.setName('X' + tag.getName());
        tag.setLink("http://www.linkupdated.com");
        tag.setCategory(category2);
        tag.setBrand(brand);

        imageService.updateTag(tag.getId(), 'X' + tag.getName(), "http://www.linkupdated.com", category2.getId(),
                brand.getId(), user.getId());

        Optional<Tag> updatedTag = tagDao.findById(tag.getId());

        assertEquals(tag, updatedTag.get());

    }

    @Test
    public void testUpdateTagWithNonExistentUserId() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, PermissionException, CategoryNotActiveException, InvalidLinkException, SilencedException {

        User user = createUser("user");
        userService.signUp(user);
        User brand = createUser("brand");
        brand.setRole(User.RoleType.BRAND_USER);
        userService.signUp(brand);

        Image image = imageService.uploadImage(
                "image", "description", "location", imgFile, user.getId());

        Category category1 = createCategory("category1");
        categoryDao.save(category1);

        Tag tag = imageService.tagImage("tag", "http://www.link.com", 50, 50,
                category1.getId(), image.getId(), 0L, user.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.updateTag(tag.getId(), "a", "http://www.link.com", category1.getId(),
                        brand.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testUpdateTagWithNonExistentCategoryId() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, PermissionException, CategoryNotActiveException, InvalidLinkException,
            SilencedException {

        User user = createUser("user");
        userService.signUp(user);
        User brand = createUser("brand");
        brand.setRole(User.RoleType.BRAND_USER);
        userService.signUp(brand);

        Image image = imageService.uploadImage(
                "image", "description", "location", imgFile, user.getId());

        Category category1 = createCategory("category1");
        categoryDao.save(category1);

        Tag tag = imageService.tagImage("tag", "http://www.link.com", 50, 50,
                category1.getId(), image.getId(), 0L, user.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.updateTag(tag.getId(), "a", "http://www.link.com", NON_EXISTENT_ID, brand.getId(),
                        user.getId()));

    }

    @Test
    public void testUpdateTagWithNonExistentBrandId() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, PermissionException, CategoryNotActiveException, InvalidLinkException,
            SilencedException {

        User user = createUser("user");
        userService.signUp(user);
        User brand = createUser("brand");
        brand.setRole(User.RoleType.BRAND_USER);
        userService.signUp(brand);

        Image image = imageService.uploadImage(
                "image", "description", "location", imgFile, user.getId());

        Category category1 = createCategory("category1");
        categoryDao.save(category1);

        Tag tag = imageService.tagImage("tag", "http://www.link.com", 50, 50,
                category1.getId(), image.getId(), 0L, user.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.updateTag(tag.getId(), "a", "http://www.link.com", category1.getId(),
                        NON_EXISTENT_ID, user.getId()));

    }

    @Test
    public void testUpdateTagWithWrongUser() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, PermissionException, CategoryNotActiveException, InvalidLinkException,
            SilencedException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User brand = createUser("brand");
        brand.setRole(User.RoleType.BRAND_USER);
        userService.signUp(brand);

        Image image = imageService.uploadImage(
                "image", "description", "location", imgFile, user1.getId());

        Category category1 = createCategory("category1");
        categoryDao.save(category1);

        Tag tag = imageService.tagImage("tag", "http://www.link.com", 50, 50,
                category1.getId(), image.getId(), 0L, user1.getId());

        assertThrows(PermissionException.class, () ->
                imageService.updateTag(tag.getId(), "a", "http://www.linkupdated.com", category1.getId(),
                        brand.getId(), user2.getId()));

    }

    @Test
    public void testUpdateTagWithNonExistentTagId() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, SilencedException, PermissionException {

        User user = createUser("user");
        userService.signUp(user);
        User brand = createUser("brand");
        brand.setRole(User.RoleType.BRAND_USER);
        userService.signUp(brand);

        imageService.uploadImage(
                "image", "description", "location", imgFile, user.getId());

        Category category1 = createCategory("category1");
        categoryDao.save(category1);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.updateTag(NON_EXISTENT_ID, "a", "http://www.link.com", category1.getId(),
                        brand.getId(), user.getId()));

    }

    @Test
    public void testUpdateTagWithInvalidLink() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, PermissionException, CategoryNotActiveException, InvalidLinkException,
            SilencedException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User brand = createUser("brand");
        brand.setRole(User.RoleType.BRAND_USER);
        userService.signUp(brand);

        Image image = imageService.uploadImage(
                "image", "description", "location", imgFile, user1.getId());

        Category category1 = createCategory("category1");
        categoryDao.save(category1);

        Tag tag = imageService.tagImage("tag", "http://www.link.com", 50, 50,
                category1.getId(), image.getId(), 0L, user1.getId());

        assertThrows(InvalidLinkException.class, () ->
                imageService.updateTag(tag.getId(), "a", "a", category1.getId(), brand.getId(), user1.getId()));

    }

    @Test
    public void testDeleteTagFromImage() throws InstanceNotFoundException, PermissionException,
            CategoryNotActiveException, InvalidLinkException, SilencedException, InvalidBirthDateException,
            DuplicateInstanceException {

        User user = createUser("userName");

        userService.signUp(user);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user.getId());

        Category category = createCategory("category");
        categoryDao.save(category);

        Tag tag = imageService.tagImage("tag", "http://www.link.com", 50, 50,
                category.getId(), image.getId(), 0L, user.getId());

        assertTrue(tagDao.existsById(tag.getId()));

        assertTrue(imageService.deleteTagFromImage(tag.getId(), image.getId(), user.getId()));

    }

    @Test
    public void testDeleteTagFromImageWithNonExistentTagId() throws InstanceNotFoundException, SilencedException,
            InvalidBirthDateException, DuplicateInstanceException, PermissionException {

        User user = createUser("userName");

        userService.signUp(user);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.deleteTagFromImage(NON_EXISTENT_ID, image.getId(), user.getId()));

    }

    @Test
    public void testDeleteTagFromImageWithNonExistentImageId() throws InstanceNotFoundException, PermissionException,
            CategoryNotActiveException, InvalidLinkException, SilencedException, InvalidBirthDateException,
            DuplicateInstanceException {

        User user = createUser("userName");

        userService.signUp(user);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user.getId());

        Category category = createCategory("category");
        categoryDao.save(category);

        Tag tag = imageService.tagImage("tag", "http://www.link.com", 50, 50,
                category.getId(), image.getId(), 0L, user.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.deleteTagFromImage(tag.getId(), NON_EXISTENT_ID, user.getId()));

    }

    @Test
    public void testDeleteTagFromImageWithNonExistentUserId() throws InstanceNotFoundException, PermissionException,
            CategoryNotActiveException, InvalidLinkException, SilencedException, InvalidBirthDateException,
            DuplicateInstanceException {

        User user = createUser("userName");

        userService.signUp(user);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user.getId());

        Category category = createCategory("category");
        categoryDao.save(category);

        Tag tag = imageService.tagImage("tag", "http://www.link.com", 50, 50,
                category.getId(), image.getId(), 0L, user.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.deleteTagFromImage(tag.getId(), image.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testDeleteTagFromImageWithWrongUser() throws InstanceNotFoundException, PermissionException,
            CategoryNotActiveException, InvalidLinkException, SilencedException, InvalidBirthDateException,
            DuplicateInstanceException {

        User user1 = createUser("userName1");

        userService.signUp(user1);

        User user2 = createUser("userName2");

        userDao.save(user2);

        Image image = imageService.uploadImage("image", "description", "location", imgFile,
                user1.getId());

        Category category = createCategory("category");
        categoryDao.save(category);

        Tag tag = imageService.tagImage("tag", "http://www.link.com", 50, 50,
                category.getId(), image.getId(), 0L, user1.getId());

        assertThrows(PermissionException.class, () ->
                imageService.deleteTagFromImage(tag.getId(), image.getId(), user2.getId()));

    }

    @Test
    public void testFindImagesByKeywords() throws InstanceNotFoundException, InvalidBirthDateException,
            DuplicateInstanceException, SilencedException, PermissionException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image1 = imageService.uploadImage("mountain incredible", "description", "location",
                imgFile, user1.getId());
        Image image2 = imageService.uploadImage("mountain amazing", "description", "location",
                imgFile, user2.getId());
        Image image3 = imageService.uploadImage("amazing outfit", "description", "location",
                imgFile, user3.getId());

        Block<Image> expectedBlock1 = new Block<>(Arrays.asList(image2, image1), false);
        Block<Image> expectedBlock2 = new Block<>(Arrays.asList(image3, image2), false);

        assertEquals(expectedBlock1, imageService.findImages(null, "mountain", 0, 2));
        assertEquals(expectedBlock2, imageService.findImages(null, "amazing", 0, 2));

    }

    @Test
    public void testFindImagesByCategory() throws InstanceNotFoundException, PermissionException,
            CategoryNotActiveException, InvalidBirthDateException, DuplicateInstanceException, InvalidLinkException,
            SilencedException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image1 = imageService.uploadImage("mountain incredible", "description", "location",
                imgFile, user1.getId());
        Image image2 = imageService.uploadImage("amazing outfit", "description", "location",
                imgFile, user2.getId());
        Image image3 = imageService.uploadImage("incredible desk", "description", "location",
                imgFile, user3.getId());

        Category category1 = createCategory("Clothes");
        Category category2 = createCategory("Cars");
        categoryDao.save(category1);
        categoryDao.save(category2);

        imageService.tagImage("Audi A8", "http://www.audi.com", 50, 50,
                category2.getId(), image1.getId(), 0L, user1.getId());
        imageService.tagImage("Peugeot 308", "http://www.peugeot.com", 50, 50,
                category2.getId(), image1.getId(), 0L, user1.getId());
        imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());

        imageService.tagImage("Nike shorts", "http://www.nike.com", 50, 50,
                category1.getId(), image2.getId(), 0L, user2.getId());
        imageService.tagImage("Rebook shoes", "http://www.rebook.com", 50, 50,
                category1.getId(), image2.getId(), 0L, user2.getId());

        Block<Image> expectedBlock1 = new Block<>(List.of(image1), false);
        Block<Image> expectedBlock2 = new Block<>(Arrays.asList(image2, image1), false);
        Block<Image> expectedBlock3 = new Block<>(Arrays.asList(image2, image3, image1), false);

        assertEquals(expectedBlock1, imageService.findImages(category2.getId(), "", 0, 2));
        assertEquals(expectedBlock2, imageService.findImages(category1.getId(), "", 0, 2));

        Tag tag6 = imageService.tagImage("6ixty4our jersey", "http://www.6ixty4our.com", 50, 50,
                category1.getId(), image3.getId(), 0L, user3.getId());

        assertEquals(expectedBlock3, imageService.findImages(category1.getId(), "", 0, 3));

    }

    @Test
    public void testFindImages() throws PermissionException, InstanceNotFoundException, CategoryNotActiveException,
            InvalidBirthDateException, DuplicateInstanceException, InvalidLinkException, SilencedException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image1 = imageService.uploadImage("mountain incredible", "description", "location",
                imgFile, user1.getId());
        Image image2 = imageService.uploadImage("incredible outfit", "description", "location",
                imgFile, user2.getId());
        imageService.uploadImage("incredible desk", "description", "location",
                imgFile, user3.getId());

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());

        imageService.tagImage("Nike shorts", "http://www.nike.com", 50, 50,
                category1.getId(), image2.getId(), 0L, user2.getId());
        imageService.tagImage("Rebook shoes", "http://www.rebook.com", 50, 50,
                category1.getId(), image2.getId(), 0L, user2.getId());

        Block<Image> expectedBlock = new Block<>(Arrays.asList(image2, image1), false);

        assertEquals(expectedBlock, imageService.findImages(category1.getId(), "incredible", 0, 3));

    }

    @Test
    public void testFindImagesWithPrivateUsers() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, PermissionException, CategoryNotActiveException, InvalidLinkException,
            SilencedException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image1 = imageService.uploadImage("mountain incredible", "description", "location",
                imgFile, user1.getId());
        Image image2 = imageService.uploadImage("incredible outfit", "description", "location",
                imgFile, user2.getId());
        imageService.uploadImage("incredible desk", "description", "location",
                imgFile, user2.getId());

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());

        imageService.tagImage("Nike shorts", "http://www.nike.com", 50, 50,
                category1.getId(), image2.getId(), 0L, user2.getId());
        imageService.tagImage("Rebook shoes", "http://www.rebook.com", 50, 50,
                category1.getId(), image2.getId(), 0L, user2.getId());

        Block<Image> expectedBlock = new Block<>(Arrays.asList(image2), false);

        assertEquals(expectedBlock, imageService.findImages(category1.getId(), "incredible", 0, 3));

    }

    @Test
    public void testFindImageById() throws InstanceNotFoundException, PermissionException, InvalidBirthDateException,
            DuplicateInstanceException, HiddenImageException {

        User user = createUser("user1");
        userService.signUp(user);

        Image image = imageExample("title", "description", "location", imgFile, user.getId());
        imageDao.save(image);

        assertEquals(image, imageService.findImageById(image.getId(), 0L));

    }

    @Test
    public void testFindImageByNonExistentId() {

        assertThrows(InstanceNotFoundException.class, () -> imageService.findImageById(NON_EXISTENT_ID, 0L));

    }

    @Test
    public void testFindImageWithPrivateAccount() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image = imageExample("title", "description", "location", imgFile, user1.getId());
        imageDao.save(image);

        assertThrows(PermissionException.class, () ->
                imageService.findImageById(image.getId(), user2.getId()));

    }

    @Test
    public void testFindImageWithPrivateAccountButFollowing() throws InvalidBirthDateException,
            DuplicateInstanceException, UserAlreadyFollowedException, PermissionException, InstanceNotFoundException,
            HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("user2");
        userService.signUp(user2);

        userService.followUser(user2.getId(), user1.getId());

        Image image = imageExample("title", "description", "location", imgFile, user1.getId());
        imageDao.save(image);

        assertEquals(image, imageService.findImageById(image.getId(), user2.getId()));

    }

    @Test
    public void testFindImageTags() throws PermissionException, InstanceNotFoundException, CategoryNotActiveException,
            InvalidBirthDateException, DuplicateInstanceException, HiddenImageException, InvalidLinkException {

        User user = createUser("user1");
        userService.signUp(user);

        Image image = imageExample("title", "description", "location", imgFile, user.getId());
        imageDao.save(image);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);
        Category category2 = createCategory("Cars");
        categoryDao.save(category2);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image.getId(), 0L, user.getId());
        Tag tag2 = imageService.tagImage("Audi car", "http://www.audi.com", 50, 50,
                category2.getId(), image.getId(), 0L, user.getId());
        Tag tag3 = imageService.tagImage("Lamborghini Urus", "http://www.lambo.com", 50, 50,
                category2.getId(), image.getId(), 0L, user.getId());

        List<Tag> expectedList = new ArrayList<>(Arrays.asList(tag1, tag2, tag3));

        assertEquals(expectedList, imageService.findImageTags(image.getId(), 0L));

    }

    @Test
    public void testFindImageTagsWithPrivateAccount() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, InstanceNotFoundException, CategoryNotActiveException, InvalidLinkException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image = imageExample("title", "description", "location", imgFile, user1.getId());
        imageDao.save(image);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);
        Category category2 = createCategory("Cars");
        categoryDao.save(category2);

        imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image.getId(), 0L, user1.getId());
        imageService.tagImage("Audi car", "http://www.audi.com", 50, 50,
                category2.getId(), image.getId(), 0L, user1.getId());
        imageService.tagImage("Lamborghini Urus", "http://www.lambo.com", 50, 50,
                category2.getId(), image.getId(), 0L, user1.getId());

        assertThrows(PermissionException.class, () ->
                imageService.findImageTags(image.getId(), user2.getId()));

    }

    @Test
    public void testFindImageTagsWithPrivateAccountButFollowing() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, InstanceNotFoundException, CategoryNotActiveException, UserAlreadyFollowedException,
            HiddenImageException, InvalidLinkException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("user2");
        userService.signUp(user2);

        userService.followUser(user2.getId(), user1.getId());

        Image image = imageExample("title", "description", "location", imgFile, user1.getId());
        imageDao.save(image);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);
        Category category2 = createCategory("Cars");
        categoryDao.save(category2);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image.getId(), 0L, user1.getId());
        Tag tag2 = imageService.tagImage("Audi car", "http://www.audi.com", 50, 50,
                category2.getId(), image.getId(), 0L, user1.getId());
        Tag tag3 = imageService.tagImage("Lamborghini Urus", "http://www.lambo.com", 50, 50,
                category2.getId(), image.getId(), 0L, user1.getId());

        List<Tag> expectedList = new ArrayList<>(Arrays.asList(tag1, tag2, tag3));

        assertEquals(expectedList, imageService.findImageTags(image.getId(), user2.getId()));

    }

    @Test
    public void testFindImagesByUserId() throws InstanceNotFoundException, PermissionException,
            InvalidBirthDateException, DuplicateInstanceException {

        User user = createUser("user1");
        userService.signUp(user);

        Image image1 = imageExample("abc", "description1", "location1", imgFile, user.getId());
        imageDao.save(image1);
        Image image2 = imageExample("def", "description2", "location2", imgFile, user.getId());
        imageDao.save(image2);
        Image image3 = imageExample("ghi", "description3", "location3", imgFile, user.getId());
        imageDao.save(image3);

        Block<Image> expectedBlock = new Block<>(Arrays.asList(image1, image2, image3), false);

        assertEquals(expectedBlock, imageService.findImagesByUserId(user.getId(), 0L, 0, 3));

    }

    @Test
    public void testFindImagesByUserIdWithNonExistentId() {

        User user = createUser("user1");
        userDao.save(user);

        Image image1 = imageExample("abc", "description1", "location1", imgFile, user.getId());
        imageDao.save(image1);
        Image image2 = imageExample("def", "description2", "location2", imgFile, user.getId());
        imageDao.save(image2);
        Image image3 = imageExample("ghi", "description3", "location3", imgFile, user.getId());
        imageDao.save(image3);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.findImagesByUserId(NON_EXISTENT_ID, 0L, 0, 3));

    }

    @Test
    public void testFindImagesByUserIdWithNonExistentUserLoggedId() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User user = createUser("user1");
        userService.signUp(user);

        Image image1 = imageExample("abc", "description1", "location1", imgFile, user.getId());
        imageDao.save(image1);
        Image image2 = imageExample("def", "description2", "location2", imgFile, user.getId());
        imageDao.save(image2);
        Image image3 = imageExample("ghi", "description3", "location3", imgFile, user.getId());
        imageDao.save(image3);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.findImagesByUserId(user.getId(), NON_EXISTENT_ID, 0, 3));

    }

    @Test
    public void testFindImagesByUserIdWithPrivateAccount() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        assertThrows(PermissionException.class, () ->
                imageService.findImagesByUserId(user1.getId(), 0L, 0, 3));

    }

    @Test
    public void testFindImagesByUserIdWithPrivateAccountButFollowing() throws InvalidBirthDateException,
            DuplicateInstanceException, UserAlreadyFollowedException, PermissionException, InstanceNotFoundException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("user2");
        userService.signUp(user2);

        userService.followUser(user2.getId(), user1.getId());

        Image image1 = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);
        Image image2 = imageExample("def", "description2", "location2", imgFile, user1.getId());
        imageDao.save(image2);
        Image image3 = imageExample("ghi", "description3", "location3", imgFile, user1.getId());
        imageDao.save(image3);

        Block<Image> expectedBlock = new Block<>(Arrays.asList(image1, image2, image3), false);

        assertEquals(expectedBlock, imageService.findImagesByUserId(user1.getId(), user2.getId(), 0, 3));

    }

    @Test
    public void testLikeImage() throws InstanceNotFoundException, ImageAlreadyLikedException, PermissionException,
            InvalidBirthDateException, DuplicateInstanceException, HiddenImageException {

        User user = createUser("user1");
        userService.signUp(user);

        Image image = imageExample("abc", "description1", "location1", imgFile, user.getId());
        imageDao.save(image);

        assertFalse(imageLikeDao.existsByUserAndImage(user, image));

        imageService.likeImage(user.getId(), image.getId());

        assertTrue(imageLikeDao.existsByUserAndImage(user, image));

    }

    @Test
    public void testLikeImageWithNonExistentUserId() {

        User user = createUser("user1");
        userDao.save(user);

        Image image = imageExample("abc", "description1", "location1", imgFile, user.getId());
        imageDao.save(image);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.likeImage(NON_EXISTENT_ID, image.getId()));

    }

    @Test
    public void testLikeImageWithNonExistentImageId() {

        User user = createUser("user1");
        userDao.save(user);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.likeImage(user.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testLikeImageAlreadyLiked() throws InstanceNotFoundException, ImageAlreadyLikedException,
            PermissionException, InvalidBirthDateException, DuplicateInstanceException, HiddenImageException {

        User user = createUser("user1");
        userService.signUp(user);

        Image image = imageExample("abc", "description1", "location1", imgFile, user.getId());
        imageDao.save(image);

        imageService.likeImage(user.getId(), image.getId());

        assertThrows(ImageAlreadyLikedException.class, () ->
                imageService.likeImage(user.getId(), image.getId()));

    }

    @Test
    public void testDeleteImageLike() throws InstanceNotFoundException, ImageAlreadyLikedException,
            ImageNotLikedException, PermissionException, InvalidBirthDateException, DuplicateInstanceException,
            HiddenImageException {

        User user = createUser("user1");
        userService.signUp(user);

        Image image = imageExample("abc", "description1", "location1", imgFile, user.getId());
        imageDao.save(image);

        imageService.likeImage(user.getId(), image.getId());

        assertTrue(imageLikeDao.existsByUserAndImage(user, image));

        imageService.deleteImageLike(user.getId(), image.getId());

        assertFalse(imageLikeDao.existsByUserAndImage(user, image));

    }

    @Test
    public void testDeleteImageLikeWithNonExistentUserId() {

        User user = createUser("user1");
        userDao.save(user);

        Image image = imageExample("abc", "description1", "location1", imgFile, user.getId());
        imageDao.save(image);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.deleteImageLike(NON_EXISTENT_ID, image.getId()));

    }

    @Test
    public void testDeleteImageLikeWithNonExistentImageId() {

        User user = createUser("user1");
        userDao.save(user);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.deleteImageLike(user.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testDeleteImageNotLiked() {

        User user = createUser("user1");
        userDao.save(user);

        Image image = imageExample("abc", "description1", "location1", imgFile, user.getId());
        imageDao.save(image);

        assertThrows(ImageNotLikedException.class, () ->
                imageService.deleteImageLike(user.getId(), image.getId()));

    }

    @Test
    public void testCheckPointsFromUserAfterLikes() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, InstanceNotFoundException, HiddenImageException, ImageAlreadyLikedException,
            ImageNotLikedException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        assertEquals(0L, user1.getUserPoints().getPoints());

        imageService.likeImage(user1.getId(), image.getId());
        imageService.likeImage(user2.getId(), image.getId());
        imageService.likeImage(user3.getId(), image.getId());

        assertEquals(NUM_POINTS_PER_IMG_LIKE * 3L, user1.getUserPoints().getPoints());

        imageService.deleteImageLike(user1.getId(), image.getId());

        assertEquals(NUM_POINTS_PER_IMG_LIKE * 2L, user1.getUserPoints().getPoints());

    }

    @Test
    public void testFindImagesLikedByUserRecentFirst() throws InstanceNotFoundException, ImageAlreadyLikedException,
            InterruptedException, PermissionException, InvalidBirthDateException, DuplicateInstanceException,
            HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user2.getId());
        imageDao.save(image1);
        Image image2 = imageExample("abc2", "description2", "location1", imgFile, user2.getId());
        imageDao.save(image2);
        Image image3 = imageExample("abc3", "description3", "location1", imgFile, user2.getId());
        imageDao.save(image3);

        imageService.likeImage(user1.getId(), image1.getId());
        Thread.sleep(1000);
        imageService.likeImage(user1.getId(), image3.getId());
        Thread.sleep(1000);
        imageService.likeImage(user1.getId(), image2.getId());

        Block<Image> expectedBlock = new Block<>(Arrays.asList(image2, image3, image1), false);

        assertEquals(expectedBlock, imageService.findImagesLikedByUser(
                user1.getId(), 0L, true, 0, 3));

    }

    @Test
    public void testFindImagesLikedByUserOldestFirst() throws InstanceNotFoundException, ImageAlreadyLikedException,
            InterruptedException, PermissionException, InvalidBirthDateException, DuplicateInstanceException,
            HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user2.getId());
        imageDao.save(image1);
        Image image2 = imageExample("abc2", "description2", "location1", imgFile, user2.getId());
        imageDao.save(image2);
        Image image3 = imageExample("abc3", "description3", "location1", imgFile, user2.getId());
        imageDao.save(image3);

        imageService.likeImage(user1.getId(), image1.getId());
        Thread.sleep(1000);
        imageService.likeImage(user1.getId(), image3.getId());
        Thread.sleep(1000);
        imageService.likeImage(user1.getId(), image2.getId());

        Block<Image> expectedBlock = new Block<>(Arrays.asList(image1, image3, image2), false);

        assertEquals(expectedBlock, imageService.findImagesLikedByUser(
                user1.getId(), 0L, false, 0, 3));

    }

    @Test
    public void testFindImagesLikedByUserWithNonExistentId() {

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.findImagesLikedByUser(NON_EXISTENT_ID, 0L, false, 0, 3));

    }

    @Test
    public void testFindImagesLikedByUserWithNonExistentUserLoggedId() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User user1 = createUser("user1");
        userService.signUp(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.findImagesLikedByUser(user1.getId(), NON_EXISTENT_ID, false, 0, 3));

    }

    @Test
    public void testFindImagesLikedByUserWithPrivateAccount() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        assertThrows(PermissionException.class, () ->
                imageService.findImagesLikedByUser(user1.getId(), 0L, false, 0, 3));

    }

    @Test
    public void testFindImagesLikedByUserWithPrivateAccountButFollowing() throws InvalidBirthDateException,
            DuplicateInstanceException, UserAlreadyFollowedException, PermissionException, InstanceNotFoundException,
            ImageAlreadyLikedException, InterruptedException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("user2");
        userService.signUp(user2);

        userService.followUser(user2.getId(), user1.getId());

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user2.getId());
        imageDao.save(image1);
        Image image2 = imageExample("abc2", "description2", "location1", imgFile, user2.getId());
        imageDao.save(image2);
        Image image3 = imageExample("abc3", "description3", "location1", imgFile, user2.getId());
        imageDao.save(image3);

        imageService.likeImage(user1.getId(), image1.getId());
        Thread.sleep(1000);
        imageService.likeImage(user1.getId(), image3.getId());
        Thread.sleep(1000);
        imageService.likeImage(user1.getId(), image2.getId());

        Block<Image> expectedBlock = new Block<>(Arrays.asList(image1, image3, image2), false);

        assertEquals(expectedBlock, imageService.findImagesLikedByUser(
                user1.getId(), user2.getId(), false, 0, 3));

    }

    @Test
    public void testGetNumImageLikes() throws InstanceNotFoundException, ImageAlreadyLikedException, PermissionException,
            InvalidBirthDateException, DuplicateInstanceException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        imageService.likeImage(user1.getId(), image1.getId());
        imageService.likeImage(user2.getId(), image1.getId());
        imageService.likeImage(user3.getId(), image1.getId());

        assertEquals(3, imageService.getNumImageLikes(image1.getId()));

    }

    @Test
    public void testGetNumImageLikesWithNonExistentId() {

        User user1 = createUser("user1");
        userDao.save(user1);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.getNumImageLikes(NON_EXISTENT_ID));

    }

    @Test
    public void testFindUsersThatLikedImageRecentFirst() throws InstanceNotFoundException, ImageAlreadyLikedException,
            InterruptedException, PermissionException, InvalidBirthDateException, DuplicateInstanceException,
            HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userDao.save(user2);
        User user3 = createUser("user3");
        userDao.save(user3);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        imageService.likeImage(user2.getId(), image1.getId());
        Thread.sleep(1000);
        imageService.likeImage(user1.getId(), image1.getId());
        Thread.sleep(1000);
        imageService.likeImage(user3.getId(), image1.getId());

        Block<User> expectedBlock = new Block<>(Arrays.asList(user3, user1, user2), false);

        assertEquals(expectedBlock, imageService.findUsersThatLikedImage(image1.getId(), 0L, true, 0, 3));

    }

    @Test
    public void testFindUsersThatLikedImageOldestFirst() throws InstanceNotFoundException, ImageAlreadyLikedException,
            InterruptedException, PermissionException, InvalidBirthDateException, DuplicateInstanceException,
            HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        imageService.likeImage(user2.getId(), image1.getId());
        Thread.sleep(1000);
        imageService.likeImage(user1.getId(), image1.getId());
        Thread.sleep(1000);
        imageService.likeImage(user3.getId(), image1.getId());

        Block<User> expectedBlock = new Block<>(Arrays.asList(user2, user1, user3), false);

        assertEquals(expectedBlock, imageService.findUsersThatLikedImage(image1.getId(), 0L, false, 0, 3));

    }

    @Test
    public void testFindUsersThatLikedImageWithNonExistentId() {

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.findUsersThatLikedImage(NON_EXISTENT_ID, 0L, false, 0, 0));

    }

    @Test
    public void testFindUsersThatLikedImageWithNonExistentUserLoggedId() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User user1 = createUser("user1");
        userService.signUp(user1);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.findUsersThatLikedImage(image1.getId(), NON_EXISTENT_ID, false, 0, 0));

    }

    @Test
    public void testFindUsersThatLikedImageWithPrivateAccount() throws InvalidBirthDateException,
            DuplicateInstanceException, PermissionException, InstanceNotFoundException, ImageAlreadyLikedException,
            HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userDao.save(user2);
        User user3 = createUser("user3");
        userDao.save(user3);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        imageService.likeImage(user2.getId(), image1.getId());
        imageService.likeImage(user1.getId(), image1.getId());
        imageService.likeImage(user3.getId(), image1.getId());

        user1.getUserSettings().setPrivacyPublic(false);

        assertThrows(PermissionException.class, () ->
                imageService.findUsersThatLikedImage(image1.getId(), user2.getId(), false, 0, 0));

    }

    @Test
    public void testFindUsersThatLikedImageWithPrivateAccountButFollowing() throws InvalidBirthDateException,
            DuplicateInstanceException, PermissionException, InstanceNotFoundException, ImageAlreadyLikedException,
            UserAlreadyFollowedException, InterruptedException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);
        User user2 = createUser("user2");
        userDao.save(user2);
        User user3 = createUser("user3");
        userDao.save(user3);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        userService.followUser(user2.getId(), user1.getId());
        userService.followUser(user3.getId(), user1.getId());

        imageService.likeImage(user2.getId(), image1.getId());
        Thread.sleep(1000);
        imageService.likeImage(user1.getId(), image1.getId());
        Thread.sleep(1000);
        imageService.likeImage(user3.getId(), image1.getId());

        Block<User> expectedBlock = new Block<>(Arrays.asList(user2, user1, user3), false);

        assertEquals(expectedBlock, imageService.findUsersThatLikedImage(
                image1.getId(), user2.getId(), false, 0, 3));

    }

    @Test
    public void testIsImageLikedByUser() throws InstanceNotFoundException, ImageAlreadyLikedException,
            PermissionException, InvalidBirthDateException, DuplicateInstanceException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        assertFalse(imageService.isImageLikedByUser(image1.getId(), user2.getId()));

        imageService.likeImage(user2.getId(), image1.getId());

        assertTrue(imageService.isImageLikedByUser(image1.getId(), user2.getId()));

    }

    @Test
    public void testIsImageLikedByUserWithNonExistentImageId() {

        User user1 = createUser("user1");
        userDao.save(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.isImageLikedByUser(NON_EXISTENT_ID, user1.getId()));

    }

    @Test
    public void testIsImageLikedByUserWithNonExistentUserId() {

        User user1 = createUser("user1");
        userDao.save(user1);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.isImageLikedByUser(image1.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testCommentImage() throws EmptyCommentException, InstanceNotFoundException, PermissionException,
            InvalidBirthDateException, DuplicateInstanceException, HiddenImageException {

        User user = createUser("user1");
        userService.signUp(user);

        Image image = imageExample("abc", "description1", "location1", imgFile, user.getId());
        imageDao.save(image);

        Long commentId = imageService.commentImage(user.getId(), image.getId(), "comment");

        assertTrue(commentDao.existsById(commentId));
        assertEquals(image, commentDao.findById(commentId).get().getImage());
        assertEquals(user, commentDao.findById(commentId).get().getUser());
        assertEquals("comment", commentDao.findById(commentId).get().getText());
        assertEquals(0L, commentDao.findById(commentId).get().getNumAnswers());

    }

    @Test
    public void testCommentImageWithNonExistentUserId() {

        User user = createUser("user1");
        userDao.save(user);

        Image image = imageExample("abc", "description1", "location1", imgFile, user.getId());
        imageDao.save(image);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.commentImage(NON_EXISTENT_ID, image.getId(), "comment"));

    }

    @Test
    public void testCommentImageWithNonExistentImageId() {

        User user = createUser("user1");
        userDao.save(user);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.commentImage(user.getId(), NON_EXISTENT_ID, "comment"));

    }

    @Test
    public void testCommentImageWithEmptyText() throws InvalidBirthDateException, DuplicateInstanceException {

        User user = createUser("user1");
        userService.signUp(user);

        Image image = imageExample("abc", "description1", "location1", imgFile, user.getId());
        imageDao.save(image);

        assertThrows(EmptyCommentException.class, () ->
                imageService.commentImage(user.getId(), image.getId(), ""));

    }

    @Test
    public void testCommentImageWithPrivateAccount() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("user2");
        userDao.save(user2);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        assertThrows(PermissionException.class, () ->
                imageService.commentImage(user2.getId(), image.getId(), "comment"));

    }

    @Test
    public void testCommentImageWithPrivateAccountButFollowing() throws InvalidBirthDateException,
            DuplicateInstanceException, UserAlreadyFollowedException, PermissionException, InstanceNotFoundException,
            EmptyCommentException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("user2");
        userDao.save(user2);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        userService.followUser(user2.getId(), user1.getId());

        Long commentId = imageService.commentImage(user2.getId(), image.getId(), "comment");

        assertTrue(commentDao.existsById(commentId));
        assertEquals(image, commentDao.findById(commentId).get().getImage());
        assertEquals(user2, commentDao.findById(commentId).get().getUser());
        assertEquals("comment", commentDao.findById(commentId).get().getText());
        assertEquals(0L, commentDao.findById(commentId).get().getNumAnswers());

    }

    @Test
    public void testDeleteComment() throws EmptyCommentException, InstanceNotFoundException, PermissionException,
            InvalidBirthDateException, DuplicateInstanceException, HiddenImageException {

        User user = createUser("user1");
        userService.signUp(user);

        Image image = imageExample("abc", "description1", "location1", imgFile, user.getId());
        imageDao.save(image);

        Long commentId = imageService.commentImage(user.getId(), image.getId(), "comment");

        assertTrue(commentDao.existsById(commentId));

        imageService.deleteComment(commentId, user.getId());

        assertFalse(commentDao.existsById(commentId));

    }

    @Test
    public void testDeleteCommentWithNonExistentCommentId() throws EmptyCommentException, InstanceNotFoundException,
            PermissionException, InvalidBirthDateException, DuplicateInstanceException, HiddenImageException {

        User user = createUser("user1");
        userService.signUp(user);

        Image image = imageExample("abc", "description1", "location1", imgFile, user.getId());
        imageDao.save(image);

        imageService.commentImage(user.getId(), image.getId(), "comment");

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.deleteComment(NON_EXISTENT_ID, user.getId()));

    }

    @Test
    public void testDeleteCommentWithNonExistentUserId() throws EmptyCommentException, InstanceNotFoundException,
            PermissionException, InvalidBirthDateException, DuplicateInstanceException, HiddenImageException {

        User user = createUser("user1");
        userService.signUp(user);

        Image image = imageExample("abc", "description1", "location1", imgFile, user.getId());
        imageDao.save(image);

        Long commentId = imageService.commentImage(user.getId(), image.getId(), "comment");

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.deleteComment(commentId, NON_EXISTENT_ID));

    }

    @Test
    public void testDeleteCommentWithDifferentUserId() throws EmptyCommentException, InstanceNotFoundException,
            PermissionException, InvalidBirthDateException, DuplicateInstanceException, HiddenImageException {

        User user = createUser("user1");
        userService.signUp(user);
        User wrongUser = createUser("user2");
        userDao.save(wrongUser);

        Image image = imageExample("abc", "description1", "location1", imgFile, user.getId());
        imageDao.save(image);

        Long commentId = imageService.commentImage(user.getId(), image.getId(), "comment");

        assertThrows(PermissionException.class, () ->
                imageService.deleteComment(commentId, wrongUser.getId()));

    }

    @Test
    public void testAnswerComment() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, EmptyCommentException, InstanceNotFoundException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        Long commentId = imageService.commentImage(user2.getId(), image.getId(), "comment");

        Long answerId = imageService.answerComment(user3.getId(), image.getId(), commentId, "answer");

        assertTrue(commentDao.existsById(answerId));
        assertEquals(image, commentDao.findById(answerId).get().getImage());
        assertEquals(user3, commentDao.findById(answerId).get().getUser());
        assertEquals("answer", commentDao.findById(answerId).get().getText());
        assertEquals(1L, commentDao.findById(commentId).get().getNumAnswers());

    }

    @Test
    public void testDeleteCommentWithAnswers() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, EmptyCommentException, InstanceNotFoundException, HiddenImageException {

        User user = createUser("user1");
        userService.signUp(user);

        Image image = imageExample("abc", "description1", "location1", imgFile, user.getId());
        imageDao.save(image);

        Long commentId = imageService.commentImage(user.getId(), image.getId(), "comment");
        Long answer1Id = imageService.answerComment(user.getId(), image.getId(), commentId, "answer1");
        Long answer2Id = imageService.answerComment(user.getId(), image.getId(), commentId, "answer2");

        assertTrue(commentDao.existsById(commentId));
        assertTrue(commentDao.existsById(answer1Id));
        assertTrue(commentDao.existsById(answer2Id));

        imageService.deleteComment(commentId, user.getId());

        assertFalse(commentDao.existsById(commentId));
        assertFalse(commentDao.existsById(answer1Id));
        assertFalse(commentDao.existsById(answer2Id));

    }

    @Test
    public void testDeleteAnswerFromComment() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, EmptyCommentException, InstanceNotFoundException, HiddenImageException {

        User user = createUser("user1");
        userService.signUp(user);

        Image image = imageExample("abc", "description1", "location1", imgFile, user.getId());
        imageDao.save(image);

        Long commentId = imageService.commentImage(user.getId(), image.getId(), "comment");
        Long answer1Id = imageService.answerComment(user.getId(), image.getId(), commentId, "answer1");
        Long answer2Id = imageService.answerComment(user.getId(), image.getId(), commentId, "answer2");

        assertEquals(2L, commentDao.findById(commentId).get().getNumAnswers());

        imageService.deleteComment(answer1Id, user.getId());

        assertEquals(1L, commentDao.findById(commentId).get().getNumAnswers());

    }

    @Test
    public void testAnswerCommentWithNonExistentUserId() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, EmptyCommentException, InstanceNotFoundException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        Long commentId = imageService.commentImage(user2.getId(), image.getId(), "comment");

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.answerComment(NON_EXISTENT_ID, image.getId(), commentId, "answer"));

    }

    @Test
    public void testAnswerCommentWithNonExistentImageId() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, EmptyCommentException, InstanceNotFoundException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        Long commentId = imageService.commentImage(user2.getId(), image.getId(), "comment");

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.answerComment(user3.getId(), NON_EXISTENT_ID, commentId, "answer"));

    }

    @Test
    public void testAnswerCommentWithNonExistentCommentId() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.answerComment(user3.getId(), image.getId(), NON_EXISTENT_ID, "answer"));

    }

    @Test
    public void testAnswerCommentWithEmptyText() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, EmptyCommentException, InstanceNotFoundException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        Long commentId = imageService.commentImage(user2.getId(), image.getId(), "comment");

        assertThrows(EmptyCommentException.class, () ->
                imageService.answerComment(user3.getId(), image.getId(), commentId, ""));

    }

    @Test
    public void testAnswerCommentWithPrivateAccount() throws InvalidBirthDateException, DuplicateInstanceException,
            UserAlreadyFollowedException, PermissionException, InstanceNotFoundException, EmptyCommentException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        userService.followUser(user2.getId(), user1.getId());

        Long commentId = imageService.commentImage(user2.getId(), image.getId(), "comment");

        assertThrows(PermissionException.class, () ->
                imageService.answerComment(user3.getId(), image.getId(), commentId, "answer"));

    }

    @Test
    public void testAnswerCommentWithPrivateAccountButFollowing() throws InvalidBirthDateException,
            DuplicateInstanceException, UserAlreadyFollowedException, PermissionException, InstanceNotFoundException,
            EmptyCommentException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        userService.followUser(user2.getId(), user1.getId());
        userService.followUser(user3.getId(), user1.getId());

        Long commentId = imageService.commentImage(user2.getId(), image.getId(), "comment");
        Long answerId = imageService.answerComment(user3.getId(), image.getId(), commentId, "answer");

        assertTrue(commentDao.existsById(answerId));
        assertEquals(image, commentDao.findById(answerId).get().getImage());
        assertEquals(user3, commentDao.findById(answerId).get().getUser());
        assertEquals("answer", commentDao.findById(answerId).get().getText());

    }

    @Test
    public void testCheckPointsFromUserAfterComments() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, InstanceNotFoundException, HiddenImageException, EmptyCommentException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        assertEquals(0L, user1.getUserPoints().getPoints());

        Long comment1Id = imageService.commentImage(user1.getId(), image.getId(), "comment1");
        Long comment2Id = imageService.commentImage(user2.getId(), image.getId(), "comment2");
        Long comment3Id = imageService.commentImage(user3.getId(), image.getId(), "comment3");

        assertEquals(NUM_POINTS_PER_COMMENT * 3L, user1.getUserPoints().getPoints());

        imageService.answerComment(user3.getId(), image.getId(), comment1Id, "answer");

        assertEquals(NUM_POINTS_PER_COMMENT * 4L, user1.getUserPoints().getPoints());

        imageService.deleteComment(comment1Id, user1.getId());

        assertEquals(NUM_POINTS_PER_COMMENT * 3L, user1.getUserPoints().getPoints());

    }

    @Test
    public void testFindCommentsFromImage() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, EmptyCommentException, InstanceNotFoundException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        Long comment1Id = imageService.commentImage(user1.getId(), image.getId(), "comment1");
        Long comment2Id = imageService.commentImage(user2.getId(), image.getId(), "comment2");
        Long comment3Id = imageService.commentImage(user3.getId(), image.getId(), "comment3");

        Optional<Comment> comment1 = commentDao.findById(comment1Id);
        Optional<Comment> comment2 = commentDao.findById(comment2Id);
        Optional<Comment> comment3 = commentDao.findById(comment3Id);

        Block<Comment> expectedBlock = new Block<>(Arrays.asList(
                comment1.get(), comment2.get(), comment3.get()), false);

        assertEquals(expectedBlock, imageService.findCommentsFromImage(image.getId(), user1.getId(), 0, 3));

    }

    @Test
    public void testFindCommentsFromImageWithAnswers() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, EmptyCommentException, InstanceNotFoundException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        Long comment1Id = imageService.commentImage(user1.getId(), image.getId(), "comment1");
        Long comment2Id = imageService.commentImage(user2.getId(), image.getId(), "comment2");
        Long comment3Id = imageService.commentImage(user3.getId(), image.getId(), "comment3");

        imageService.answerComment(user3.getId(), image.getId(), comment2Id, "answer1");
        imageService.answerComment(user3.getId(), image.getId(), comment2Id, "answer2");
        imageService.answerComment(user3.getId(), image.getId(), comment2Id, "answer3");
        imageService.answerComment(user3.getId(), image.getId(), comment3Id, "answer4");
        imageService.answerComment(user3.getId(), image.getId(), comment3Id, "answer5");
        imageService.answerComment(user3.getId(), image.getId(), comment1Id, "answer6");

        Optional<Comment> comment1 = commentDao.findById(comment1Id);
        Optional<Comment> comment2 = commentDao.findById(comment2Id);
        Optional<Comment> comment3 = commentDao.findById(comment3Id);

        Block<Comment> expectedBlock = new Block<>(Arrays.asList(
                comment2.get(), comment3.get(), comment1.get()), false);

        assertEquals(expectedBlock, imageService.findCommentsFromImage(image.getId(), user1.getId(), 0, 10));

    }

    @Test
    public void testFindCommentsFromImageWithNonExistentImageId() throws InvalidBirthDateException,
            DuplicateInstanceException, PermissionException, EmptyCommentException, InstanceNotFoundException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        imageService.commentImage(user1.getId(), image.getId(), "comment1");
        imageService.commentImage(user2.getId(), image.getId(), "comment2");
        imageService.commentImage(user3.getId(), image.getId(), "comment3");

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.findCommentsFromImage(NON_EXISTENT_ID, user1.getId(), 0, 3));

    }

    @Test
    public void testFindCommentsFromImageWithNonExistentUserId() throws PermissionException, EmptyCommentException,
            InstanceNotFoundException, InvalidBirthDateException, DuplicateInstanceException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        imageService.commentImage(user1.getId(), image.getId(), "comment1");
        imageService.commentImage(user2.getId(), image.getId(), "comment2");
        imageService.commentImage(user3.getId(), image.getId(), "comment3");

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.findCommentsFromImage(image.getId(), NON_EXISTENT_ID, 0, 3));

    }

    @Test
    public void testFindCommentsFromImageWithPrivateAccount() throws InvalidBirthDateException,
            DuplicateInstanceException, UserAlreadyFollowedException, PermissionException, InstanceNotFoundException,
            EmptyCommentException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        userService.followUser(user2.getId(), user1.getId());

        imageService.commentImage(user2.getId(), image.getId(), "comment");

        assertThrows(PermissionException.class, () ->
                imageService.findCommentsFromImage(image.getId(), user3.getId(), 0, 3));

    }

    @Test
    public void testFindCommentsFromImageWithPrivateAccountButFollowing() throws InvalidBirthDateException,
            DuplicateInstanceException, PermissionException, EmptyCommentException, InstanceNotFoundException,
            UserAlreadyFollowedException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        userService.followUser(user2.getId(), user1.getId());
        userService.followUser(user3.getId(), user1.getId());

        Long comment1Id = imageService.commentImage(user1.getId(), image.getId(), "comment1");
        Long comment2Id = imageService.commentImage(user2.getId(), image.getId(), "comment2");
        Long comment3Id = imageService.commentImage(user3.getId(), image.getId(), "comment3");

        Optional<Comment> comment1 = commentDao.findById(comment1Id);
        Optional<Comment> comment2 = commentDao.findById(comment2Id);
        Optional<Comment> comment3 = commentDao.findById(comment3Id);

        Block<Comment> expectedBlock = new Block<>(Arrays.asList(
                comment1.get(), comment2.get(), comment3.get()), false);

        assertEquals(expectedBlock, imageService.findCommentsFromImage(image.getId(), user3.getId(), 0, 3));

    }

    @Test
    public void testFindAnswersFromComment() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, EmptyCommentException, InstanceNotFoundException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        Long commentId = imageService.commentImage(user1.getId(), image.getId(), "comment1");
        Long answer1Id = imageService.answerComment(user2.getId(), image.getId(), commentId, "answer1");
        Long answer2Id = imageService.answerComment(user3.getId(), image.getId(), commentId, "answer2");
        Long answer3Id = imageService.answerComment(user3.getId(), image.getId(), commentId, "answer3");

        Optional<Comment> answer1 = commentDao.findById(answer1Id);
        Optional<Comment> answer2 = commentDao.findById(answer2Id);
        Optional<Comment> answer3 = commentDao.findById(answer3Id);

        Block<Comment> expectedBlock = new Block<>(Arrays.asList(
                answer1.get(), answer2.get(), answer3.get()), false);

        assertEquals(expectedBlock, imageService.findAnswersFromComment(commentId, user1.getId(), 0, 3));

    }

    @Test
    public void testFindAnswersFromCommentWithAnswers() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, EmptyCommentException, InstanceNotFoundException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        Long comment1Id = imageService.commentImage(user1.getId(), image.getId(), "comment1");

        Long answer1Id = imageService.answerComment(user3.getId(), image.getId(), comment1Id, "answer1");
        Long answer2Id = imageService.answerComment(user3.getId(), image.getId(), comment1Id, "answer2");
        Long answer3Id = imageService.answerComment(user3.getId(), image.getId(), comment1Id, "answer3");

        imageService.answerComment(user3.getId(), image.getId(), answer3Id, "answer4");
        imageService.answerComment(user3.getId(), image.getId(), answer3Id, "answer5");
        imageService.answerComment(user3.getId(), image.getId(), answer3Id, "answer6");
        imageService.answerComment(user3.getId(), image.getId(), answer1Id, "answer7");
        imageService.answerComment(user3.getId(), image.getId(), answer1Id, "answer8");
        imageService.answerComment(user3.getId(), image.getId(), answer2Id, "answer9");

        Optional<Comment> answer1 = commentDao.findById(answer1Id);
        Optional<Comment> answer2 = commentDao.findById(answer2Id);
        Optional<Comment> answer3 = commentDao.findById(answer3Id);

        Block<Comment> expectedBlock = new Block<>(Arrays.asList(
                answer3.get(), answer1.get(), answer2.get()), false);

        assertEquals(expectedBlock, imageService.findAnswersFromComment(comment1Id, user1.getId(), 0, 3));

    }

    @Test
    public void testFindAnswersFromCommentWithNonExistentCommentId() throws PermissionException, EmptyCommentException,
            InstanceNotFoundException, InvalidBirthDateException, DuplicateInstanceException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        Long commentId = imageService.commentImage(user1.getId(), image.getId(), "comment1");
        imageService.answerComment(user2.getId(), image.getId(), commentId, "answer1");
        imageService.answerComment(user3.getId(), image.getId(), commentId, "answer2");
        imageService.answerComment(user3.getId(), image.getId(), commentId, "answer3");

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.findAnswersFromComment(NON_EXISTENT_ID, user1.getId(), 0, 3));

    }

    @Test
    public void testFindAnswersFromCommentWithNonExistentUserId() throws PermissionException, EmptyCommentException,
            InstanceNotFoundException, InvalidBirthDateException, DuplicateInstanceException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        Long commentId = imageService.commentImage(user1.getId(), image.getId(), "comment1");
        imageService.answerComment(user2.getId(), image.getId(), commentId, "answer1");
        imageService.answerComment(user3.getId(), image.getId(), commentId, "answer2");
        imageService.answerComment(user3.getId(), image.getId(), commentId, "answer3");

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.findAnswersFromComment(commentId, NON_EXISTENT_ID, 0, 3));

    }

    @Test
    public void testFindAnswersFromCommentWithPrivateAccount() throws InvalidBirthDateException,
            DuplicateInstanceException, UserAlreadyFollowedException, PermissionException, InstanceNotFoundException,
            EmptyCommentException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        userService.followUser(user2.getId(), user1.getId());

        Long commentId = imageService.commentImage(user1.getId(), image.getId(), "comment1");
        imageService.answerComment(user2.getId(), image.getId(), commentId, "answer1");
        imageService.answerComment(user2.getId(), image.getId(), commentId, "answer2");
        imageService.answerComment(user2.getId(), image.getId(), commentId, "answer3");

        assertThrows(PermissionException.class, () ->
                imageService.findAnswersFromComment(commentId, user3.getId(), 0, 3));

    }

    @Test
    public void testFindAnswersFromCommentWithPrivateAccountButFollowing() throws InvalidBirthDateException,
            DuplicateInstanceException, PermissionException, EmptyCommentException, InstanceNotFoundException,
            UserAlreadyFollowedException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image = imageExample("abc", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image);

        userService.followUser(user2.getId(), user1.getId());
        userService.followUser(user3.getId(), user1.getId());

        Long commentId = imageService.commentImage(user1.getId(), image.getId(), "comment1");
        Long answer1Id = imageService.answerComment(user2.getId(), image.getId(), commentId, "answer1");
        Long answer2Id = imageService.answerComment(user2.getId(), image.getId(), commentId, "answer2");
        Long answer3Id = imageService.answerComment(user3.getId(), image.getId(), commentId, "answer3");

        Optional<Comment> answer1 = commentDao.findById(answer1Id);
        Optional<Comment> answer2 = commentDao.findById(answer2Id);
        Optional<Comment> answer3 = commentDao.findById(answer3Id);

        Block<Comment> expectedBlock = new Block<>(Arrays.asList(
                answer1.get(), answer2.get(), answer3.get()), false);

        assertEquals(expectedBlock, imageService.findAnswersFromComment(commentId, user3.getId(), 0, 3));

    }

    @Test
    public void testGetNumComments() throws InstanceNotFoundException, InvalidBirthDateException,
            DuplicateInstanceException, PermissionException, EmptyCommentException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        imageService.commentImage(user1.getId(), image1.getId(), "comment1");
        imageService.commentImage(user2.getId(), image1.getId(), "comment2");
        imageService.commentImage(user3.getId(), image1.getId(), "comment3");

        assertEquals(3, imageService.getNumCommentsFromImage(image1.getId(), user1.getId()));

    }

    @Test
    public void testGetNumCommentsWithNonExistentImageId() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User user1 = createUser("user1");
        userService.signUp(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.getNumCommentsFromImage(NON_EXISTENT_ID, user1.getId()));

    }

    @Test
    public void testGetNumCommentsWithNonExistentUserId() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("user1");
        userService.signUp(user1);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.getNumCommentsFromImage(image1.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testGetNumCommentsWithPrivateAccount() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        assertThrows(PermissionException.class, () ->
                imageService.getNumCommentsFromImage(image1.getId(), user2.getId()));

    }

    @Test
    public void testGetNumCommentsWithPrivateAccountButFollowing() throws InvalidBirthDateException,
            DuplicateInstanceException, PermissionException, EmptyCommentException, InstanceNotFoundException,
            UserAlreadyFollowedException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        userService.followUser(user2.getId(), user1.getId());
        userService.followUser(user3.getId(), user1.getId());

        imageService.commentImage(user1.getId(), image1.getId(), "comment1");
        imageService.commentImage(user2.getId(), image1.getId(), "comment2");
        imageService.commentImage(user3.getId(), image1.getId(), "comment3");

        assertEquals(3, imageService.getNumCommentsFromImage(image1.getId(), user2.getId()));
        assertEquals(3, imageService.getNumCommentsFromImage(image1.getId(), user3.getId()));

    }

    @Test
    public void testGetNumAnswers() throws InstanceNotFoundException, InvalidBirthDateException,
            DuplicateInstanceException, PermissionException, EmptyCommentException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        Long commentId = imageService.commentImage(user1.getId(), image1.getId(), "comment1");
        imageService.answerComment(user1.getId(), image1.getId(), commentId, "answer1");
        imageService.answerComment(user1.getId(), image1.getId(), commentId, "answer1");
        imageService.answerComment(user1.getId(), image1.getId(), commentId, "answer1");

        assertEquals(3, imageService.getNumAnswersFromComment(commentId, user1.getId()));

    }

    @Test
    public void testGetNumAnswersWithNonExistentCommentId() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User user1 = createUser("user1");
        userService.signUp(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.getNumAnswersFromComment(NON_EXISTENT_ID, user1.getId()));

    }

    @Test
    public void testGetNumAnswersWithNonExistentUserId() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, EmptyCommentException, InstanceNotFoundException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        Long commentId = imageService.commentImage(user1.getId(), image1.getId(), "comment1");

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.getNumAnswersFromComment(commentId, NON_EXISTENT_ID));

    }

    @Test
    public void testGetNumAnswersWithPrivateAccount() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, EmptyCommentException, InstanceNotFoundException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        Long commentId = imageService.commentImage(user1.getId(), image1.getId(), "comment1");

        assertThrows(PermissionException.class, () ->
                imageService.getNumAnswersFromComment(commentId, user2.getId()));

    }

    @Test
    public void testGetNumAnswersWithPrivateAccountButFollowing() throws InvalidBirthDateException,
            DuplicateInstanceException, PermissionException, EmptyCommentException, InstanceNotFoundException,
            UserAlreadyFollowedException, HiddenImageException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        userService.followUser(user2.getId(), user1.getId());
        userService.followUser(user3.getId(), user1.getId());

        Long commentId = imageService.commentImage(user2.getId(), image1.getId(), "comment");
        imageService.answerComment(user1.getId(), image1.getId(), commentId, "answer1");
        imageService.answerComment(user1.getId(), image1.getId(), commentId, "answer1");
        imageService.answerComment(user1.getId(), image1.getId(), commentId, "answer1");

        assertEquals(3, imageService.getNumAnswersFromComment(commentId, user2.getId()));
        assertEquals(3, imageService.getNumAnswersFromComment(commentId, user3.getId()));

    }

    @Test
    public void testLikeTag() throws InvalidBirthDateException, DuplicateInstanceException, PermissionException,
            InstanceNotFoundException, CategoryNotActiveException, TagAlreadyLikedException, HiddenImageException,
            InvalidLinkException {

        User user = createUser("user");
        userService.signUp(user);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user.getId());

        assertFalse(tagLikeDao.existsByUserAndTag(user, tag1));

        imageService.likeTag(user.getId(), tag1.getId());

        assertTrue(tagLikeDao.existsByUserAndTag(user, tag1));

    }

    @Test
    public void testLikeTagWithNonExistentUserId() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, InstanceNotFoundException, CategoryNotActiveException, InvalidLinkException {

        User user = createUser("user");
        userService.signUp(user);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.likeTag(NON_EXISTENT_ID, tag1.getId()));

    }

    @Test
    public void testLikeTagWithNonExistentTagId() throws InvalidBirthDateException, DuplicateInstanceException {

        User user = createUser("user");
        userService.signUp(user);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.likeTag(user.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testLikeTagAlreadyLiked() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, InstanceNotFoundException, CategoryNotActiveException, TagAlreadyLikedException,
            HiddenImageException, InvalidLinkException {

        User user = createUser("user");
        userService.signUp(user);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user.getId());

        imageService.likeTag(user.getId(), tag1.getId());

        assertThrows(TagAlreadyLikedException.class, () ->
                imageService.likeTag(user.getId(), tag1.getId()));

    }

    @Test
    public void testLikeTagWithPrivateAccount() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, InstanceNotFoundException, CategoryNotActiveException, InvalidLinkException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());

        assertThrows(PermissionException.class, () ->
                imageService.likeTag(user2.getId(), tag1.getId()));

    }

    @Test
    public void testLikeTagWithPrivateAccountButFollowing() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, InstanceNotFoundException, CategoryNotActiveException, TagAlreadyLikedException,
            UserAlreadyFollowedException, HiddenImageException, InvalidLinkException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());

        userService.followUser(user2.getId(), user1.getId());

        assertFalse(tagLikeDao.existsByUserAndTag(user2, tag1));

        imageService.likeTag(user2.getId(), tag1.getId());

        assertTrue(tagLikeDao.existsByUserAndTag(user2, tag1));

    }

    @Test
    public void testDeleteTagLike() throws InvalidBirthDateException, DuplicateInstanceException, PermissionException,
            InstanceNotFoundException, CategoryNotActiveException, TagAlreadyLikedException, TagNotLikedException,
            HiddenImageException, InvalidLinkException {

        User user = createUser("user");
        userService.signUp(user);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user.getId());

        imageService.likeTag(user.getId(), tag1.getId());

        assertTrue(tagLikeDao.existsByUserAndTag(user, tag1));

        imageService.deleteTagLike(user.getId(), tag1.getId());

        assertFalse(tagLikeDao.existsByUserAndTag(user, tag1));

    }

    @Test
    public void testDeleteTagLikeWithNonExistentUserId() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, InstanceNotFoundException, CategoryNotActiveException, TagAlreadyLikedException,
            HiddenImageException, InvalidLinkException {

        User user = createUser("user");
        userService.signUp(user);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user.getId());

        imageService.likeTag(user.getId(), tag1.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.deleteTagLike(NON_EXISTENT_ID, tag1.getId()));

    }

    @Test
    public void testDeleteTagLikeWithNonExistentTagId() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, InstanceNotFoundException, CategoryNotActiveException, TagAlreadyLikedException,
            HiddenImageException, InvalidLinkException {

        User user = createUser("user");
        userService.signUp(user);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user.getId());

        imageService.likeTag(user.getId(), tag1.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.deleteTagLike(user.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testDeleteTagLikeNotLiked() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, InstanceNotFoundException, CategoryNotActiveException, InvalidLinkException {

        User user = createUser("user");
        userService.signUp(user);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user.getId());

        assertThrows(TagNotLikedException.class, () ->
                imageService.deleteTagLike(user.getId(), tag1.getId()));

    }

    @Test
    public void testCheckPointsFromUserAfterTagLikes() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, InstanceNotFoundException, CategoryNotActiveException, TagAlreadyLikedException,
            HiddenImageException, TagNotLikedException, InvalidLinkException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());

        assertEquals(0L, user1.getUserPoints().getPoints());

        imageService.likeTag(user1.getId(), tag1.getId());
        imageService.likeTag(user2.getId(), tag1.getId());
        imageService.likeTag(user3.getId(), tag1.getId());

        assertEquals(NUM_POINTS_PER_TAG_LIKE * 3L, user1.getUserPoints().getPoints());

        imageService.deleteTagLike(user1.getId(), tag1.getId());

        assertEquals(NUM_POINTS_PER_TAG_LIKE * 2L, user1.getUserPoints().getPoints());

    }

    @Test
    public void testFindTagsLikedByUserRecentFirst() throws InstanceNotFoundException, InterruptedException,
            PermissionException, InvalidBirthDateException, DuplicateInstanceException,
            CategoryNotActiveException, TagAlreadyLikedException, HiddenImageException, InvalidLinkException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());
        Tag tag2 = imageService.tagImage("Pants", "http://www.pants.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());
        Tag tag3 = imageService.tagImage("Adidas cap", "http://www.cap.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());

        imageService.likeTag(user1.getId(), tag1.getId());
        Thread.sleep(1000);
        imageService.likeTag(user1.getId(), tag3.getId());
        Thread.sleep(1000);
        imageService.likeTag(user1.getId(), tag2.getId());

        Block<Tag> expectedBlock = new Block<>(Arrays.asList(tag2, tag3, tag1), false);

        assertEquals(expectedBlock, imageService.findTagsLikedByUser(
                user1.getId(), user2.getId(), true, 0, 3));

    }

    @Test
    public void testFindTagsLikedByUserOldestFirst() throws InstanceNotFoundException, InterruptedException,
            PermissionException, InvalidBirthDateException, DuplicateInstanceException,
            CategoryNotActiveException, TagAlreadyLikedException, HiddenImageException, InvalidLinkException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());
        Tag tag2 = imageService.tagImage("Pants", "http://www.pants.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());
        Tag tag3 = imageService.tagImage("Adidas cap", "http://www.cap.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());

        imageService.likeTag(user1.getId(), tag1.getId());
        Thread.sleep(1000);
        imageService.likeTag(user1.getId(), tag3.getId());
        Thread.sleep(1000);
        imageService.likeTag(user1.getId(), tag2.getId());

        Block<Tag> expectedBlock = new Block<>(Arrays.asList(tag1, tag3, tag2), false);

        assertEquals(expectedBlock, imageService.findTagsLikedByUser(
                user1.getId(), user2.getId(), false, 0, 3));

    }

    @Test
    public void testFindTagsLikedByUserWithNonExistentUserId() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User user1 = createUser("user1");
        userService.signUp(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.findTagsLikedByUser(NON_EXISTENT_ID, user1.getId(), true, 0, 3));

    }

    @Test
    public void testFindTagsLikedByUserWithNonExistentUserLoggedId() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User user1 = createUser("user1");
        userService.signUp(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.findTagsLikedByUser(user1.getId(), NON_EXISTENT_ID, true, 0, 3));

    }

    @Test
    public void testFindTagsLikedByUserWithPrivateAccount() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("user2");
        userService.signUp(user2);

        assertThrows(PermissionException.class, () ->
                imageService.findTagsLikedByUser(user1.getId(), user2.getId(), true, 0, 3));

    }

    @Test
    public void testFindTagsLikedByUserWithPrivateAccountButFollowing() throws InvalidBirthDateException,
            DuplicateInstanceException, PermissionException, InstanceNotFoundException, CategoryNotActiveException,
            TagAlreadyLikedException, InterruptedException, UserAlreadyFollowedException, HiddenImageException,
            InvalidLinkException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("user2");
        userService.signUp(user2);

        userService.followUser(user2.getId(), user1.getId());

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());
        Tag tag2 = imageService.tagImage("Pants", "http://www.pants.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());
        Tag tag3 = imageService.tagImage("Adidas cap", "http://www.cap.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());

        imageService.likeTag(user1.getId(), tag1.getId());
        Thread.sleep(1000);
        imageService.likeTag(user1.getId(), tag3.getId());
        Thread.sleep(1000);
        imageService.likeTag(user1.getId(), tag2.getId());

        Block<Tag> expectedBlock = new Block<>(Arrays.asList(tag2, tag3, tag1), false);

        assertEquals(expectedBlock, imageService.findTagsLikedByUser(
                user1.getId(), user2.getId(), true, 0, 3));

    }

    @Test
    public void testFindUsersThatLikedTagRecentFirst() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, InstanceNotFoundException, CategoryNotActiveException, TagAlreadyLikedException,
            InterruptedException, HiddenImageException, InvalidLinkException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());

        imageService.likeTag(user3.getId(), tag1.getId());
        Thread.sleep(1000);
        imageService.likeTag(user1.getId(), tag1.getId());
        Thread.sleep(1000);
        imageService.likeTag(user2.getId(), tag1.getId());

        Block<User> expectedBlock = new Block<>(Arrays.asList(user2, user1, user3), false);

        assertEquals(expectedBlock, imageService.findUsersThatLikedTag(
                tag1.getId(), user1.getId(), true, 0, 3));

    }

    @Test
    public void testFindUsersThatLikedTagOldestFirst() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, InstanceNotFoundException, CategoryNotActiveException, TagAlreadyLikedException,
            InterruptedException, HiddenImageException, InvalidLinkException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());

        imageService.likeTag(user3.getId(), tag1.getId());
        Thread.sleep(1000);
        imageService.likeTag(user1.getId(), tag1.getId());
        Thread.sleep(1000);
        imageService.likeTag(user2.getId(), tag1.getId());

        Block<User> expectedBlock = new Block<>(Arrays.asList(user3, user1, user2), false);

        assertEquals(expectedBlock, imageService.findUsersThatLikedTag(
                tag1.getId(), user1.getId(), false, 0, 3));

    }

    @Test
    public void testFindUsersThatLikedTagWithNonExistentTagId() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User user1 = createUser("user1");
        userService.signUp(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.findUsersThatLikedTag(NON_EXISTENT_ID, user1.getId(), true, 0, 3));

    }

    @Test
    public void testFindUsersThatLikedTagWithNonExistentUserLoggedId() throws InvalidBirthDateException,
            DuplicateInstanceException, PermissionException, InstanceNotFoundException, CategoryNotActiveException,
            InvalidLinkException {

        User user1 = createUser("user1");
        userService.signUp(user1);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.findUsersThatLikedTag(tag1.getId(), NON_EXISTENT_ID, true, 0, 3));

    }

    @Test
    public void testFindUsersThatLikedTagWithPrivateAccount() throws InvalidBirthDateException,
            DuplicateInstanceException, PermissionException, InstanceNotFoundException, CategoryNotActiveException,
            InvalidLinkException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());

        assertThrows(PermissionException.class, () ->
                imageService.findUsersThatLikedTag(tag1.getId(), user2.getId(), true, 0, 3));

    }

    @Test
    public void testFindUsersThatLikedTagWithPrivateAccountButFollowing() throws InvalidBirthDateException,
            DuplicateInstanceException, PermissionException, InstanceNotFoundException, CategoryNotActiveException,
            UserAlreadyFollowedException, TagAlreadyLikedException, InterruptedException, HiddenImageException,
            InvalidLinkException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        userService.followUser(user2.getId(), user1.getId());
        userService.followUser(user3.getId(), user1.getId());

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());

        imageService.likeTag(user3.getId(), tag1.getId());
        Thread.sleep(1000);
        imageService.likeTag(user1.getId(), tag1.getId());
        Thread.sleep(1000);
        imageService.likeTag(user2.getId(), tag1.getId());

        Block<User> expectedBlock = new Block<>(Arrays.asList(user2, user1, user3), false);

        assertEquals(expectedBlock, imageService.findUsersThatLikedTag(
                tag1.getId(), user2.getId(), true, 0, 3));
        assertEquals(expectedBlock, imageService.findUsersThatLikedTag(
                tag1.getId(), user3.getId(), true, 0, 3));

    }

    @Test
    public void testGetNumTagLikes() throws InvalidBirthDateException, DuplicateInstanceException, PermissionException,
            InstanceNotFoundException, CategoryNotActiveException, TagAlreadyLikedException, HiddenImageException, InvalidLinkException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(),0L, user1.getId());

        imageService.likeTag(user3.getId(), tag1.getId());
        imageService.likeTag(user1.getId(), tag1.getId());
        imageService.likeTag(user2.getId(), tag1.getId());

        assertEquals(3L, imageService.getNumTagLikes(tag1.getId(), user1.getId()));

    }

    @Test
    public void testGetNumTagLikesWithNonExistentTagId() throws InvalidBirthDateException, DuplicateInstanceException {

        User user1 = createUser("user1");
        userService.signUp(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.getNumTagLikes(NON_EXISTENT_ID, user1.getId()));

    }

    @Test
    public void testGetNumTagLikesWithNonExistentUserId() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, InstanceNotFoundException, CategoryNotActiveException, InvalidLinkException {

        User user1 = createUser("user1");
        userService.signUp(user1);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.getNumTagLikes(tag1.getId(), NON_EXISTENT_ID));

    }

    @Test
    public void testGetNumTagLikesWithPrivateAccount() throws InvalidBirthDateException, DuplicateInstanceException,
            PermissionException, InstanceNotFoundException, CategoryNotActiveException, InvalidLinkException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("user2");
        userService.signUp(user2);

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());

        assertThrows(PermissionException.class, () ->
                imageService.getNumTagLikes(tag1.getId(), user2.getId()));

    }

    @Test
    public void testGetNumTagLikesWithPrivateAccountButFollowing() throws InvalidBirthDateException,
            DuplicateInstanceException, PermissionException, InstanceNotFoundException, CategoryNotActiveException,
            UserAlreadyFollowedException, TagAlreadyLikedException, HiddenImageException, InvalidLinkException {

        User user1 = createUser("user1");
        userService.signUp(user1);
        user1.getUserSettings().setPrivacyPublic(false);

        User user2 = createUser("user2");
        userService.signUp(user2);
        User user3 = createUser("user3");
        userService.signUp(user3);

        userService.followUser(user2.getId(), user1.getId());
        userService.followUser(user3.getId(), user1.getId());

        Image image1 = imageExample("abc1", "description1", "location1", imgFile, user1.getId());
        imageDao.save(image1);

        Category category1 = createCategory("Clothes");
        categoryDao.save(category1);

        Tag tag1 = imageService.tagImage("Adidas shirt", "http://www.adidas.com", 50, 50,
                category1.getId(), image1.getId(), 0L, user1.getId());

        imageService.likeTag(user3.getId(), tag1.getId());
        imageService.likeTag(user1.getId(), tag1.getId());
        imageService.likeTag(user2.getId(), tag1.getId());

        assertEquals(3L, imageService.getNumTagLikes(tag1.getId(), user2.getId()));
        assertEquals(3L, imageService.getNumTagLikes(tag1.getId(), user3.getId()));

    }

    @Test
    public void testReportImage() throws InvalidBirthDateException, DuplicateInstanceException, InstanceNotFoundException,
            ReportAlreadyGivenException, SilencedException, PermissionException {

        User user1 = createUser("userName1");
        userService.signUp(user1);
        User user2 = createUser("userName2");
        userService.signUp(user2);

        Image image = imageService.uploadImage(
                "image", "description", "location", imgFile, user2.getId());

        assertFalse(imageReportDao.existsByUserAndImageReported(user1, image));
        assertFalse(imageReportDao.existsByUserAndImageReported(user2, image));

        imageService.reportImage(user1.getId(), image.getId(), "FRAUD", "explanation");

        ImageReport imageReport = imageReportDao.findByUserAndImageReported(user1, image);

        assertEquals(UserReport.Reason.FRAUD, imageReport.getReason());
        assertEquals("explanation", imageReport.getExplanation());
        assertFalse(imageReport.getResolved());
        assertEquals(LocalDateTime.now().toLocalDate(), imageReport.getDate().toLocalDate());
        assertEquals(user1, imageReport.getUser());
        assertEquals(image, imageReport.getImageReported());

        assertTrue(imageReportDao.existsByUserAndImageReported(user1, image));
        assertFalse(imageReportDao.existsByUserAndImageReported(user2, image));

    }

    @Test
    public void testReportImageWithNonExistentUserId() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, SilencedException, PermissionException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        Image image = imageService.uploadImage(
                "image", "description", "location", imgFile, user1.getId());

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.reportImage(NON_EXISTENT_ID, image.getId(), "FRAUD", "explanation"));

    }

    @Test
    public void testReportUserWithNonExistentImageReportedId() throws InvalidBirthDateException,
            DuplicateInstanceException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        assertThrows(InstanceNotFoundException.class, () ->
                imageService.reportImage(user1.getId(), NON_EXISTENT_ID, "FRAUD", "explanation"));

    }

    @Test
    public void testReportImageAlreadyReported() throws InvalidBirthDateException, DuplicateInstanceException,
            InstanceNotFoundException, ReportAlreadyGivenException, SilencedException, PermissionException {

        User user1 = createUser("userName1");
        userService.signUp(user1);

        Image image = imageService.uploadImage(
                "image", "description", "location", imgFile, user1.getId());

        imageService.reportImage(user1.getId(), image.getId(), "FRAUD", "explanation");

        assertThrows(ReportAlreadyGivenException.class, () ->
                imageService.reportImage(user1.getId(), image.getId(), "FRAUD", "explanation"));

    }

}
