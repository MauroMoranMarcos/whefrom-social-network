package backend.model.services;

import backend.model.entities.*;
import backend.model.exceptions.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class ImageServiceImpl implements ImageService {

    private final Long NUM_POINTS_PER_IMG_LIKE = 25L;

    private final Long NUM_POINTS_PER_TAG_LIKE = 50L;

    private final Long NUM_POINTS_PER_COMMENT = 75L;

    private final Long NUM_POINTS_PUBLICATION_HALF_HOUR = 5L;

    private final Long NUM_POINTS_PUBLICATION_HOUR = 10L;

    @Autowired
    private PermissionChecker permissionChecker;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserSettingsDao userSettingsDao;

    @Autowired
    private PointsRegisterDao pointsRegisterDao;

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
    private ImageSeenInFeedDao imageSeenInFeedDao;

    @Autowired
    private ImageReportDao imageReportDao;

    @Autowired
    private UserService userService;

    @Override
    public Image uploadImage(String title, String description, String location, byte[] imgFile, Long userId)
            throws InstanceNotFoundException, SilencedException, PermissionException {

        Optional<User> userOpt = userDao.findById(userId);

        if (!userOpt.isPresent()) {
            throw new InstanceNotFoundException("User id", userId);
        }

        if (userOpt.get().getUserPenalty().getSilencedUntil().isAfter(LocalDate.now())) {
            throw new SilencedException();
        } else {
            userOpt.get().unsilence();
        }

        UserPoints userPoints = userOpt.get().getUserPoints();

        if (userOpt.get().getRole().equals(User.RoleType.NORMAL_USER) && (userPoints.getPublishedToday() ||
                userPoints.getPublicationTime().isAfter(LocalDateTime.now()))) {
            throw new PermissionException();
        }

        if (userOpt.get().getRole().equals(User.RoleType.BRAND_USER) && !userOpt.get().getVerified() &&
                (userPoints.getPublishedToday() || userPoints.getPublicationTime().isAfter(LocalDateTime.now()))) {
            throw new PermissionException();
        }

        LocalDateTime halfHour = userPoints.getPublicationTime().plusMinutes(30);
        LocalDateTime oneHour = userPoints.getPublicationTime().plusMinutes(60);

        if (LocalDateTime.now().isBefore(oneHour)) {
            userPoints.setPoints(userPoints.getPoints() + NUM_POINTS_PUBLICATION_HOUR);
        }

        if (LocalDateTime.now().isBefore(halfHour)) {
            userPoints.setPoints(userPoints.getPoints() + NUM_POINTS_PUBLICATION_HALF_HOUR);
        }

        Image image = new Image(title, description, location, imgFile, LocalDateTime.now(), userOpt.get());
        image.setHidden(false);

        imageDao.save(image);
        userPoints.publishedToday();

        return image;
    }

    @Override
    public Image updateImage(Long imageId, String title, String description, String location, Long userId)
            throws InstanceNotFoundException, PermissionException {

        User user = permissionChecker.checkUser(userId);

        Image image = permissionChecker.checkImage(imageId);

        if (!user.equals(image.getUser())) {
            throw new PermissionException();
        }

        image.setTitle(title);
        image.setDescription(description);
        image.setLocation(location);

        return image;

    }

    @Override
    public Boolean deleteImage(Long imageId, Long userId) throws InstanceNotFoundException, PermissionException {

        User user = permissionChecker.checkUser(userId);

        Image image = permissionChecker.checkImage(imageId);

        if (!user.equals(image.getUser())) {
            throw new PermissionException();
        }

        imageDao.delete(image);

        return !imageDao.existsById(imageId);

    }

    @Override
    public Boolean hideImage(Long imageId, Long userId) throws InstanceNotFoundException, PermissionException,
            ImageAlreadyHiddenException{

        User user = permissionChecker.checkUser(userId);

        Image image = permissionChecker.checkImage(imageId);

        if (!user.equals(image.getUser())) {
            throw new PermissionException();
        }

        if (image.getHidden()) {
            throw new ImageAlreadyHiddenException();
        }

        image.setHidden(true);

        return image.getHidden();

    }

    @Override
    public Boolean showImage(Long imageId, Long userId) throws InstanceNotFoundException, PermissionException,
            ImageNotHiddenException{

        User user = permissionChecker.checkUser(userId);

        Image image = permissionChecker.checkImage(imageId);

        if (!user.equals(image.getUser())) {
            throw new PermissionException();
        }

        if (!image.getHidden()) {
            throw new ImageNotHiddenException();
        }

        image.setHidden(false);

        return image.getHidden();

    }

    private boolean isValidURL(String url) {
        try {
            new URL(url).toURI();
            return true;
        } catch (MalformedURLException | URISyntaxException e) {
            return false;
        }
    }

    @Override
    public Tag tagImage(String name, String link, int coordinateX, int coordinateY,
                        Long categoryId, Long imageId, Long brandId, Long userId)
            throws InstanceNotFoundException, PermissionException, CategoryNotActiveException, InvalidLinkException {

        Optional<Category> categoryOpt = categoryDao.findById(categoryId);

        Optional<Image> imageOpt = imageDao.findById(imageId);

        Optional<User> userOpt = userDao.findById(userId);

        User brand = brandId != 0 ? permissionChecker.checkUser(brandId) : null;

        if (!userOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.user", userId);
        }

        if (!categoryOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.category", categoryId);
        }

        if (!imageOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.image", imageId);
        }

        if (!Objects.equals(userOpt.get().getId(), imageOpt.get().getUser().getId())) {
            throw new PermissionException();
        }

        if (!categoryOpt.get().getActive()) {
            throw new CategoryNotActiveException();
        }

        if (link != null && !isValidURL(link)) {
            throw new InvalidLinkException();
        }

        Tag tag;

        if (brandId != 0) {
            if (link != null) {
                tag = new Tag(name, link, coordinateX, coordinateY, categoryOpt.get(), imageOpt.get(), brand);
            } else {
                tag = new Tag(name, coordinateX, coordinateY, categoryOpt.get(), imageOpt.get(), brand);
            }
        } else {
            if (link != null) {
                tag = new Tag(name, link, coordinateX, coordinateY, categoryOpt.get(), imageOpt.get());
            } else {
                tag = new Tag(name, coordinateX, coordinateY, categoryOpt.get(), imageOpt.get());
            }
        }

        tagDao.save(tag);

        return tag;

    }

    @Override
    public Tag updateTag(Long tagId, String name, String link, Long categoryId, Long brandId, Long userId)
            throws InstanceNotFoundException, PermissionException, InvalidLinkException {

        User user = permissionChecker.checkUser(userId);

        Optional<Tag> tagOptional = tagDao.findById(tagId);

        Optional<Category> categoryOpt = categoryDao.findById(categoryId);

        User brand = brandId != 0 ? permissionChecker.checkUser(brandId) : null;

        if (!tagOptional.isPresent()) {
            throw new InstanceNotFoundException("project.entities.tag", tagId);
        }

        if (!categoryOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.category", categoryId);
        }

        if (!isValidURL(link)) {
            throw new InvalidLinkException();
        }

        Tag tag = tagOptional.get();

        if (!user.getId().equals(tag.getImage().getUser().getId())) {
            throw new PermissionException();
        }

        tag.setName(name);
        tag.setLink(link);
        tag.setCategory(categoryOpt.get());

        if (brandId != 0) {
            tag.setBrand(brand);
        }

        if (brandId == 0 && tag.getBrand() != null) {
            tag.setBrand(null);
        }

        return tag;

    }

    @Override
    public Boolean deleteTagFromImage(Long tagId, Long imageId, Long userId) throws InstanceNotFoundException, PermissionException {

        User user = permissionChecker.checkUser(userId);

        Image image = permissionChecker.checkImage(imageId);

        Optional<Tag> tagOpt = tagDao.findById(tagId);

        if (!tagOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.tag", tagId);
        }

        if (!user.equals(image.getUser()) || !image.getId().equals(tagOpt.get().getImage().getId())) {
            throw new PermissionException();
        }

        Tag tag = tagOpt.get();

        tagDao.delete(tag);

        return !tagDao.existsById(tagId);

    }

    @Override
    public Block<Image> findImages(Long categoryId, String keywords, int page, int size) {

        Slice<Image> slice = imageDao.find(categoryId, keywords, page, size);

        return new Block<>(slice.getContent(), slice.hasNext());

    }

    @Override
    public Image findImageById(Long id, Long userLoggedId) throws InstanceNotFoundException, PermissionException,
            HiddenImageException {

        Optional<Image> image = imageDao.findById(id);

        if (!image.isPresent()) {
            throw new InstanceNotFoundException("project.entities.image", id);
        }

        User userLogged = userLoggedId != 0 ? permissionChecker.checkUser(userLoggedId) : null;

        if (userLoggedId != 0 && userLogged.getRole().equals(User.RoleType.ADMIN_USER)) {
            return image.get();
        }

        if (image.get().getHidden() && !userLoggedId.equals(image.get().getUser().getId())) {
            throw new HiddenImageException();
        }

        if (userLoggedId == 0 && !image.get().getUser().getUserSettings().getPrivacyPublic()) {

            throw new PermissionException();

        } else if (userLoggedId == 0) {

            return image.get();

        }

        if (!image.get().getUser().getUserSettings().getPrivacyPublic()
                && !userService.isUserFollowingUser(userLoggedId, image.get().getUser().getId())
                && !image.get().getUser().getId().equals(userLogged.getId())) {
            throw new PermissionException();
        }

        return image.get();
        
    }

    @Override
    public List<Tag> findImageTags(Long id, Long userLoggedId) throws InstanceNotFoundException, PermissionException,
            HiddenImageException {

        Optional<Image> image = imageDao.findById(id);

        if (!image.isPresent()) {
            throw new InstanceNotFoundException("project.entities.image", id);
        }

        User userLogged = userLoggedId != 0 ? permissionChecker.checkUser(userLoggedId) : null;

        if (userLoggedId != 0 && userLogged.getRole().equals(User.RoleType.ADMIN_USER)) {
            return tagDao.findByImageId(id);
        }

        if (image.get().getHidden() && !userLoggedId.equals(image.get().getUser().getId())) {
            throw new HiddenImageException();
        }

        if (userLoggedId == 0 && !image.get().getUser().getUserSettings().getPrivacyPublic()) {

            throw new PermissionException();

        } else if (userLoggedId == 0) {

            return tagDao.findByImageId(id);

        }

        if (!image.get().getUser().getUserSettings().getPrivacyPublic()
                && !userService.isUserFollowingUser(userLoggedId, image.get().getUser().getId())
                && !image.get().getUser().getId().equals(userLogged.getId())) {
            throw new PermissionException();
        }

        return tagDao.findByImageId(id);
        
    }

    @Override
    public Block<Image> findImagesByUserId(Long userId, Long userLoggedId, int page, int size)
            throws InstanceNotFoundException, PermissionException {

        User user = permissionChecker.checkUser(userId);

        User userLogged = userLoggedId != 0 ? permissionChecker.checkUser(userLoggedId) : null;

        if (userLoggedId != 0 && userLogged.getRole().equals(User.RoleType.ADMIN_USER)) {
            Slice<Image> slice = imageDao.findByUserId(userId, user.equals(userLogged), page, size);

            return new Block<>(slice.getContent(), slice.hasNext());
        }

        if (userLoggedId == 0 && !user.getUserSettings().getPrivacyPublic()) {

            throw new PermissionException();

        } else if (userLoggedId == 0) {

            Slice<Image> slice = imageDao.findByUserId(userId, false, page, size);

            return new Block<>(slice.getContent(), slice.hasNext());

        }

        if (!user.getUserSettings().getPrivacyPublic() && !userService.isUserFollowingUser(userLoggedId, user.getId())
                && !user.equals(userLogged)) {
            throw new PermissionException();
        }

        Slice<Image> slice = imageDao.findByUserId(userId, user.equals(userLogged), page, size);

        return new Block<>(slice.getContent(), slice.hasNext());

    }

    @Override
    public Long likeImage(Long userId, Long imageId) throws InstanceNotFoundException, ImageAlreadyLikedException,
            PermissionException, HiddenImageException {

        User user = permissionChecker.checkUser(userId);

        Optional<Image> image = imageDao.findById(imageId);

        if (!image.isPresent()) {
            throw new InstanceNotFoundException("project.entities.image", imageId);
        }

        if (image.get().getHidden() && !user.equals(image.get().getUser())) {
            throw new HiddenImageException();
        }

        if (imageLikeDao.existsByUserAndImage(user, image.get())) {
            throw new ImageAlreadyLikedException();
        }

        User userLiked = image.get().getUser();

        if (!userLiked.getUserSettings().getPrivacyPublic() && !userService.isUserFollowingUser(userId, userLiked.getId())
                && !user.equals(userLiked)) {
            throw new PermissionException();
        }

        ImageLike imageLike = new ImageLike(LocalDateTime.now(), user, image.get());

        imageLikeDao.save(imageLike);

        UserPoints userPoints = userLiked.getUserPoints();

        userPoints.setPoints(userPoints.getPoints() + NUM_POINTS_PER_IMG_LIKE);

        PointsRegister pointsRegister = new PointsRegister(NUM_POINTS_PER_IMG_LIKE, LocalDateTime.now(), userLiked,
                null, imageLike, null, null);

        pointsRegisterDao.save(pointsRegister);

        return imageLike.getId();

    }

    @Override
    public Boolean deleteImageLike(Long userId, Long imageId) throws InstanceNotFoundException, ImageNotLikedException,
            PermissionException, HiddenImageException {

        User user = permissionChecker.checkUser(userId);

        Optional<Image> image = imageDao.findById(imageId);

        if (!image.isPresent()) {
            throw new InstanceNotFoundException("project.entities.image", imageId);
        }

        if (image.get().getHidden() && !user.equals(image.get().getUser())) {
            throw new HiddenImageException();
        }

        if (!imageLikeDao.existsByUserAndImage(user, image.get())) {
            throw new ImageNotLikedException();
        }

        User userLiked = image.get().getUser();

        if (!userLiked.getUserSettings().getPrivacyPublic() && !userService.isUserFollowingUser(userId, userLiked.getId())
                && !user.equals(userLiked)) {
            throw new PermissionException();
        }

        ImageLike imageLike = imageLikeDao.findByUserAndImage(user, image.get());

        imageLikeDao.delete(imageLike);

        UserPoints userPoints = userLiked.getUserPoints();

        userPoints.setPoints(userPoints.getPoints() - NUM_POINTS_PER_IMG_LIKE);

        return !imageLikeDao.existsById(imageLike.getId());

    }

    @Override
    public Block<Image> findImagesLikedByUser(Long userId, Long userLoggedId, Boolean dateDesc, int page, int size)
            throws InstanceNotFoundException, PermissionException {

        User user = permissionChecker.checkUser(userId);

        User userLogged = userLoggedId != 0 ? permissionChecker.checkUser(userLoggedId) : null;

        if (userLoggedId == 0 && !user.getUserSettings().getPrivacyPublic()) {

            throw new PermissionException();

        } else if (userLoggedId == 0) {

            Slice<Image> slice = imageLikeDao.findImagesLikedByUser(userId, dateDesc, page, size);

            List<Image> images = slice.getContent();
            List<Image> imagesFiltered = new ArrayList<>();

            for (Image image : images) {
                if (image.getUser().getUserSettings().getPrivacyPublic() && !image.getHidden()) {
                    imagesFiltered.add(image);
                }
            }

            Slice<Image> sliceModified = new SliceImpl<>(imagesFiltered, PageRequest.of(page, size), slice.hasNext());

            return new Block<>(sliceModified.getContent(), sliceModified.hasNext());

        }

        if (!user.getUserSettings().getPrivacyPublic() && !userLogged.getRole().equals(User.RoleType.ADMIN_USER) &&
                !userService.isUserFollowingUser(userLoggedId, user.getId()) && !user.equals(userLogged)) {
            throw new PermissionException();
        }

        Slice<Image> slice = imageLikeDao.findImagesLikedByUser(userId, dateDesc, page, size);

        List<Image> images = slice.getContent();
        List<Image> imagesFiltered = new ArrayList<>();

        for (Image image : images) {
            if (userLogged.getRole().equals(User.RoleType.ADMIN_USER) ||
                    image.getUser().getUserSettings().getPrivacyPublic() ||
                    userService.isUserFollowingUser(userLoggedId, image.getUser().getId()) ||
                    userLogged.equals(image.getUser())) {
                imagesFiltered.add(image);
            }
        }

        Slice<Image> sliceModified = new SliceImpl<>(imagesFiltered, PageRequest.of(page, size), slice.hasNext());

        return new Block<>(sliceModified.getContent(), sliceModified.hasNext());

    }

    @Override
    public Long getNumImageLikes(Long imageId) throws InstanceNotFoundException {

        Optional<Image> image = imageDao.findById(imageId);

        if (!image.isPresent()) {
            throw new InstanceNotFoundException("project.entities.image", imageId);
        }

        return imageLikeDao.countByImage(image.get());

    }

    @Override
    public Block<User> findUsersThatLikedImage(Long imageId, Long userLoggedId, Boolean dateDesc, int page, int size)
            throws InstanceNotFoundException, PermissionException {

        Optional<Image> image = imageDao.findById(imageId);

        if (!image.isPresent()) {
            throw new InstanceNotFoundException("project.entities.image", imageId);
        }

        User userLogged = userLoggedId != 0 ? permissionChecker.checkUser(userLoggedId) : null;

        if (userLoggedId != 0 && userLogged.getRole().equals(User.RoleType.ADMIN_USER)) {
            Slice<User> slice = imageLikeDao.findUsersThatLikedImage(imageId, dateDesc, page, size);

            return new Block<>(slice.getContent(), slice.hasNext());
        }

        if (userLoggedId == 0 && !image.get().getUser().getUserSettings().getPrivacyPublic()) {

            throw new PermissionException();

        } else if (userLoggedId == 0) {

            Slice<User> slice = imageLikeDao.findUsersThatLikedImage(imageId, dateDesc, page, size);

            return new Block<>(slice.getContent(), slice.hasNext());

        }

        if (!image.get().getUser().getUserSettings().getPrivacyPublic() && !userService.isUserFollowingUser(
                userLoggedId, image.get().getUser().getId())
                && !image.get().getUser().getId().equals(userLogged.getId())) {
            throw new PermissionException();
        }

        Slice<User> slice = imageLikeDao.findUsersThatLikedImage(imageId, dateDesc, page, size);

        return new Block<>(slice.getContent(), slice.hasNext());

    }

    @Override
    public Boolean isImageLikedByUser(Long imageId, Long userId) throws InstanceNotFoundException {

        Optional<Image> image = imageDao.findById(imageId);

        User user = permissionChecker.checkUser(userId);

        if (!image.isPresent()) {
            throw new InstanceNotFoundException("project.entities.image", imageId);
        }

        return imageLikeDao.existsByUserAndImage(user, image.get());
        
    }

    @Override
    public Long commentImage(Long userId, Long imageId, String text)
            throws InstanceNotFoundException, EmptyCommentException, PermissionException, HiddenImageException {

        User user = permissionChecker.checkUser(userId);

        Image image = permissionChecker.checkImage(imageId);

        if (image.getHidden()) {
            throw new HiddenImageException();
        }

        User userCommented = image.getUser();

        UserSettings userSettings = userCommented.getUserSettings();

        if (!userSettings.getPrivacyPublic() && !userService.isUserFollowingUser(userId, userCommented.getId())
                && !user.equals(userCommented)) {
            throw new PermissionException();
        }

        if (text.isEmpty()) {
            throw new EmptyCommentException();
        }

        Comment comment = new Comment(text, LocalDateTime.now(), user, image, 0L);

        commentDao.save(comment);

        UserPoints userPoints = userCommented.getUserPoints();

        userPoints.setPoints(userPoints.getPoints() + NUM_POINTS_PER_COMMENT);

        PointsRegister pointsRegister = new PointsRegister(NUM_POINTS_PER_COMMENT, LocalDateTime.now(), userCommented,
                null, null, null, comment);

        pointsRegisterDao.save(pointsRegister);

        return comment.getId();

    }

    @Override
    public Boolean deleteComment(Long commentId, Long userId) throws InstanceNotFoundException, PermissionException {

        User user = permissionChecker.checkUser(userId);

        Optional<Comment> comment = commentDao.findById(commentId);

        if (!comment.isPresent()) {
            throw new InstanceNotFoundException("project.entities.comment", commentId);
        }

        if (!user.getId().equals(comment.get().getUser().getId())) {
            throw new PermissionException();
        }

        Comment commentAnswered = comment.get().getCommentAnswered();

        if (commentAnswered != null) {
            commentAnswered.setNumAnswers(commentAnswered.getNumAnswers() - 1);
        }

        Image imageCommented = comment.get().getImage();

        User userCommentDeleted = imageCommented.getUser();

        commentDao.delete(comment.get());

        UserPoints userPoints = userCommentDeleted.getUserPoints();

        userPoints.setPoints(userPoints.getPoints() - NUM_POINTS_PER_COMMENT);

        return !commentDao.existsById(commentId);

    }

    @Override
    public Long answerComment(Long userId, Long imageId, Long commentId, String text)
            throws InstanceNotFoundException, EmptyCommentException, PermissionException {

        User user = permissionChecker.checkUser(userId);

        Image image = permissionChecker.checkImage(imageId);

        Optional<Comment> comment = commentDao.findById(commentId);

        if (!comment.isPresent()) {
            throw new InstanceNotFoundException("project.entities.comment", commentId);
        }

        User userCommented = image.getUser();

        UserSettings userSettings = userCommented.getUserSettings();

        if (!userSettings.getPrivacyPublic() && !userService.isUserFollowingUser(userId, userCommented.getId())
                && !user.equals(userCommented)) {
            throw new PermissionException();
        }

        if (text.isEmpty()) {
            throw new EmptyCommentException();
        }

        Comment answer = new Comment(text, LocalDateTime.now(), user, image, 0L, comment.get());

        commentDao.save(answer);

        comment.get().setNumAnswers(comment.get().getNumAnswers() + 1);

        UserPoints userPoints = userCommented.getUserPoints();

        userPoints.setPoints(userPoints.getPoints() + NUM_POINTS_PER_COMMENT);

        PointsRegister pointsRegister = new PointsRegister(NUM_POINTS_PER_COMMENT, LocalDateTime.now(), userCommented,
                null, null, null, answer);

        pointsRegisterDao.save(pointsRegister);

        return answer.getId();

    }

    @Override
    public Block<Comment> findCommentsFromImage(Long imageId, Long userLoggedId, int page, int size)
            throws InstanceNotFoundException, PermissionException, HiddenImageException {

        User userLogged = userLoggedId != 0 ? permissionChecker.checkUser(userLoggedId) : null;

        Image image = permissionChecker.checkImage(imageId);

        if (userLoggedId != 0 && userLogged.getRole().equals(User.RoleType.ADMIN_USER)) {
            Slice<Comment> slice = commentDao.findCommentsByImage(imageId, page, size);

            return new Block<>(slice.getContent(), slice.hasNext());
        }

        if (image.getHidden() && !userLogged.equals(image.getUser())) {
            throw new HiddenImageException();
        }

        User user = image.getUser();

        UserSettings userSettings = user.getUserSettings();


        if (userLoggedId == 0 && !userSettings.getPrivacyPublic()) {

            throw new PermissionException();

        } else if (userLoggedId == 0) {

            Slice<Comment> slice = commentDao.findCommentsByImage(imageId, page, size);

            return new Block<>(slice.getContent(), slice.hasNext());

        }

        if (!userSettings.getPrivacyPublic() && !userService.isUserFollowingUser(userLoggedId, user.getId())
                && !user.equals(userLogged)) {
            throw new PermissionException();
        }

        Slice<Comment> slice = commentDao.findCommentsByImage(imageId, page, size);

        return new Block<>(slice.getContent(), slice.hasNext());

    }

    @Override
    public Block<Comment> findAnswersFromComment(Long commentId, Long userLoggedId, int page, int size)
            throws InstanceNotFoundException, PermissionException, HiddenImageException {

        User userLogged = userLoggedId != 0 ? permissionChecker.checkUser(userLoggedId) : null;

        Optional<Comment> comment = commentDao.findById(commentId);

        if (!comment.isPresent()) {
            throw new InstanceNotFoundException("project.entities.comment", commentId);
        }

        if (userLoggedId != 0 && userLogged.getRole().equals(User.RoleType.ADMIN_USER)) {
            Slice<Comment> slice = commentDao.findCommentAnswers(commentId, page, size);

            return new Block<>(slice.getContent(), slice.hasNext());
        }

        if (comment.get().getImage().getHidden()) {
            throw new HiddenImageException();
        }

        User user = comment.get().getImage().getUser();

        UserSettings userSettings = user.getUserSettings();

        if (userLoggedId == 0 && !userSettings.getPrivacyPublic()) {

            throw new PermissionException();

        } else if (userLoggedId == 0) {

            Slice<Comment> slice = commentDao.findCommentAnswers(commentId, page, size);

            return new Block<>(slice.getContent(), slice.hasNext());

        }

        if (!userSettings.getPrivacyPublic() && !userService.isUserFollowingUser(userLoggedId, user.getId())
                && !user.equals(userLogged)) {
            throw new PermissionException();
        }

        Slice<Comment> slice = commentDao.findCommentAnswers(commentId, page, size);

        return new Block<>(slice.getContent(), slice.hasNext());

    }

    @Override
    public Long getNumCommentsFromImage(Long imageId, Long userLoggedId)
            throws InstanceNotFoundException, PermissionException {

        User userLogged = userLoggedId != 0 ? permissionChecker.checkUser(userLoggedId) : null;

        Image image = permissionChecker.checkImage(imageId);

        if (userLoggedId != 0 && userLogged.getRole().equals(User.RoleType.ADMIN_USER)) {
            return commentDao.countByImage(image);
        }

        User user = image.getUser();

        UserSettings userSettings = user.getUserSettings();

        if (userLoggedId == 0 && !userSettings.getPrivacyPublic()) {

            throw new PermissionException();

        } else if (userLoggedId == 0) {

            return commentDao.countByImage(image);

        }

        if (!userSettings.getPrivacyPublic() && !userService.isUserFollowingUser(userLoggedId, user.getId())
                && !user.equals(userLogged)) {
            throw new PermissionException();
        }

        return commentDao.countByImage(image);

    }

    @Override
    public Long getNumAnswersFromComment(Long commentId, Long userLoggedId)
            throws InstanceNotFoundException, PermissionException {

        User userLogged = userLoggedId != 0 ? permissionChecker.checkUser(userLoggedId) : null;

        Optional<Comment> comment = commentDao.findById(commentId);

        if (!comment.isPresent()) {
            throw new InstanceNotFoundException("project.entities.comment", commentId);
        }

        if (userLoggedId != 0 && userLogged.getRole().equals(User.RoleType.ADMIN_USER)) {
            return commentDao.countByCommentAnswered(comment.get());
        }

        User user = comment.get().getImage().getUser();

        UserSettings userSettings = user.getUserSettings();

        if (userLoggedId == 0 && !userSettings.getPrivacyPublic()) {

            throw new PermissionException();

        } else if (userLoggedId == 0) {

            return commentDao.countByCommentAnswered(comment.get());

        }

        if (!userSettings.getPrivacyPublic() && !userService.isUserFollowingUser(userLoggedId, user.getId())
                && !user.equals(userLogged)) {
            throw new PermissionException();
        }

        return commentDao.countByCommentAnswered(comment.get());

    }

    @Override
    public Long likeTag(Long userId, Long tagId) throws InstanceNotFoundException, TagAlreadyLikedException,
            PermissionException, HiddenImageException {

        User user = permissionChecker.checkUser(userId);

        Optional<Tag> tag = tagDao.findById(tagId);

        if (!tag.isPresent()) {
            throw new InstanceNotFoundException("project.entities.tag", tagId);
        }

        if (tag.get().getImage().getHidden()) {
            throw new HiddenImageException();
        }

        User userLiked = tag.get().getImage().getUser();

        if (!userLiked.getUserSettings().getPrivacyPublic() &&
                !userService.isUserFollowingUser(userId, userLiked.getId()) && !user.equals(userLiked)) {
            throw new PermissionException();
        }

        if (tagLikeDao.existsByUserAndTag(user, tag.get())) {
            throw new TagAlreadyLikedException();
        }

        TagLike tagLike = new TagLike(LocalDateTime.now(), user, tag.get());

        tagLikeDao.save(tagLike);

        UserPoints userPoints = userLiked.getUserPoints();

        userPoints.setPoints(userPoints.getPoints() + NUM_POINTS_PER_TAG_LIKE);

        PointsRegister pointsRegister = new PointsRegister(NUM_POINTS_PER_TAG_LIKE, LocalDateTime.now(), userLiked,
                null, null, tagLike, null);

        pointsRegisterDao.save(pointsRegister);

        return tagLike.getId();

    }

    @Override
    public Boolean deleteTagLike(Long userId, Long tagId) throws InstanceNotFoundException, TagNotLikedException,
            PermissionException {

        User user = permissionChecker.checkUser(userId);

        Optional<Tag> tag = tagDao.findById(tagId);

        if (!tag.isPresent()) {
            throw new InstanceNotFoundException("project.entities.tag", tagId);
        }

        User userLikeDeleted = tag.get().getImage().getUser();

        if (!userLikeDeleted.getUserSettings().getPrivacyPublic() &&
                !userService.isUserFollowingUser(userId, userLikeDeleted.getId())  && !user.equals(userLikeDeleted)) {
            throw new PermissionException();
        }

        if (!tagLikeDao.existsByUserAndTag(user, tag.get())) {
            throw new TagNotLikedException();
        }

        TagLike tagLike = tagLikeDao.findByUserAndTag(user, tag.get());

        tagLikeDao.delete(tagLike);

        UserPoints userPoints = userLikeDeleted.getUserPoints();

        userPoints.setPoints(userPoints.getPoints() - NUM_POINTS_PER_TAG_LIKE);

        return !tagLikeDao.existsById(tagLike.getId());

    }

    @Override
    public Block<Tag> findTagsLikedByUser(Long userId, Long userLoggedId, Boolean dateDesc, int page, int size)
            throws InstanceNotFoundException, PermissionException {

        User user = permissionChecker.checkUser(userId);

        User userLogged = userLoggedId != 0 ? permissionChecker.checkUser(userLoggedId) : null;

        if (userLoggedId == 0 && !user.getUserSettings().getPrivacyPublic()) {

            throw new PermissionException();

        } else if (userLoggedId == 0) {

            Slice<Tag> slice = tagLikeDao.findTagsLikedByUser(userId, dateDesc, page, size);

            List<Tag> tags = slice.getContent();
            List<Tag> tagsFiltered = new ArrayList<>();

            for (Tag tag : tags) {
                if (tag.getImage().getUser().getUserSettings().getPrivacyPublic()) {
                    tagsFiltered.add(tag);
                }
            }

            Slice<Tag> sliceModified = new SliceImpl<>(tagsFiltered, PageRequest.of(page, size), slice.hasNext());

            return new Block<>(sliceModified.getContent(), sliceModified.hasNext());

        }

        if (!user.getUserSettings().getPrivacyPublic() && !userLogged.getRole().equals(User.RoleType.ADMIN_USER) &&
                !userService.isUserFollowingUser(userLoggedId, userId) && !user.equals(userLogged)) {
            throw new PermissionException();
        }

        Slice<Tag> slice = tagLikeDao.findTagsLikedByUser(userId, dateDesc, page, size);

        List<Tag> tags = slice.getContent();
        List<Tag> tagsFiltered = new ArrayList<>();

        for (Tag tag : tags) {
            if (userLogged.getRole().equals(User.RoleType.ADMIN_USER) ||
                    tag.getImage().getUser().getUserSettings().getPrivacyPublic() ||
                    userService.isUserFollowingUser(userLoggedId, tag.getImage().getUser().getId()) ||
                    userLogged.equals(tag.getImage().getUser())) {
                tagsFiltered.add(tag);
            }
        }

        Slice<Tag> sliceModified = new SliceImpl<>(tagsFiltered, PageRequest.of(page, size), slice.hasNext());

        return new Block<>(sliceModified.getContent(), sliceModified.hasNext());

    }

    @Override
    public Block<User> findUsersThatLikedTag(Long tagId, Long userLoggedId, Boolean dateDesc, int page, int size)
            throws InstanceNotFoundException, PermissionException {

        Optional<Tag> tag = tagDao.findById(tagId);

        if (!tag.isPresent()) {
            throw new InstanceNotFoundException("project.entities.tag", tagId);
        }

        User user = tag.get().getImage().getUser();

        User userLogged = userLoggedId != 0 ? permissionChecker.checkUser(userLoggedId) : null;

        if (userLoggedId != 0 && userLogged.getRole().equals(User.RoleType.ADMIN_USER)) {
            Slice<User> slice = tagLikeDao.findUsersThatLikedTag(tagId, dateDesc, page, size);

            return new Block<>(slice.getContent(), slice.hasNext());
        }

        if (userLoggedId == 0 && !user.getUserSettings().getPrivacyPublic()) {

            throw new PermissionException();

        } else if (userLoggedId == 0) {

            Slice<User> slice = tagLikeDao.findUsersThatLikedTag(tagId, dateDesc, page, size);

            return new Block<>(slice.getContent(), slice.hasNext());

        }

        if (!user.getUserSettings().getPrivacyPublic() && !userService.isUserFollowingUser(
                userLoggedId, user.getId()) && !user.getId().equals(userLogged.getId())) {
            throw new PermissionException();
        }

        Slice<User> slice = tagLikeDao.findUsersThatLikedTag(tagId, dateDesc, page, size);

        return new Block<>(slice.getContent(), slice.hasNext());

    }

    @Override
    public Long getNumTagLikes(Long tagId, Long userLoggedId) throws InstanceNotFoundException, PermissionException {

        User userLogged = userLoggedId != 0 ? permissionChecker.checkUser(userLoggedId) : null;

        Optional<Tag> tag = tagDao.findById(tagId);

        if (!tag.isPresent()) {
            throw new InstanceNotFoundException("project.entities.tag", tagId);
        }

        if (userLoggedId != 0 && userLogged.getRole().equals(User.RoleType.ADMIN_USER)) {
            return tagLikeDao.countByTag(tag.get());
        }

        User user = tag.get().getImage().getUser();

        if (userLoggedId == 0 && !user.getUserSettings().getPrivacyPublic()) {

            throw new PermissionException();

        } else if (userLoggedId == 0) {

            return tagLikeDao.countByTag(tag.get());

        }

        if (!user.getUserSettings().getPrivacyPublic() && !userService.isUserFollowingUser(
                userLoggedId, user.getId()) && !user.getId().equals(userLogged.getId())) {
            throw new PermissionException();
        }

        return tagLikeDao.countByTag(tag.get());

    }

    @Override
    public Boolean isTagLikedByUser(Long tagId, Long userId) throws InstanceNotFoundException {

        User user = permissionChecker.checkUser(userId);

        Optional<Tag> tag = tagDao.findById(tagId);

        if (!tag.isPresent()) {
            throw new InstanceNotFoundException("project.entities.tag", tagId);
        }

        return tagLikeDao.existsByUserAndTag(user, tag.get());
        
    }

    @Override
    public Block<Image> getFeed(Long userId, int page, int size) throws InstanceNotFoundException, PermissionException,
            HiddenImageException {

        User user = userId != 0 ? permissionChecker.checkUser(userId) : null;

        List<Image> allImages = new ArrayList<>();
        List<Category> categories = new ArrayList<>();
        List<ImageWithLikes> imagesWithLikes = new ArrayList<>();
        List<Image> allImagesSorted = new ArrayList<>();
        List<ImageWithLikes> otherImagesWithLikes = new ArrayList<>();
        List<Image> otherImages = new ArrayList<>();

        if (userId != 0) {

            // Get followed users
            Block<User> userFollowedBlock = userService.findUserFollowed(userId, userId, true, 0, 100000);
            List<User> userFollowed = userFollowedBlock.getItems();

            for (User followed : userFollowed) {
                Block<Image> imagesFromUserBlock = findImagesByUserId(followed.getId(), userId, 0, 100000);
                List<Image> imagesFromUser = imagesFromUserBlock.getItems();
                for (Image image : imagesFromUser) {
                    if (!imageSeenInFeedDao.existsByUserAndImage(user, image)) {
                        allImages.add(image);
                    }
                }
            }

            // Get liked images by user
            Block<Image> imagesLikedBlock = findImagesLikedByUser(userId, userId, true, 0, 100000);
            List<Image> imagesLiked = imagesLikedBlock.getItems();
            for (Image image : imagesLiked) {
                if (!image.getHidden()) {
                    List<Tag> tags = findImageTags(image.getId(), userId);
                    for (Tag tag : tags) {
                        if (!categories.contains(tag.getCategory())) {
                            categories.add(tag.getCategory());
                        }
                    }
                }
            }

            // Get liked tags by user
            Block<Tag> tagsLikedBlock = findTagsLikedByUser(userId, userId, true, 0, 100000);
            List<Tag> tagsLiked = tagsLikedBlock.getItems();
            for (Tag tag : tagsLiked) {
                if (!tag.getImage().getHidden()) {
                    if (!categories.contains(tag.getCategory())) {
                        categories.add(tag.getCategory());
                    }
                }
            }

            // Get images from categories of interest
            for (Category category : categories) {
                Block<Image> imagesInterestedBlock = findImages(category.getId(), "", 0, 100000);
                List<Image> imagesInterested = imagesInterestedBlock.getItems();
                for (Image image : imagesInterested) {
                    if (!allImages.contains(image) && !imageSeenInFeedDao.existsByUserAndImage(user, image)) {
                        allImages.add(image);
                    }
                }
            }

            for (Image image : allImages) {
                Long numImageLikes = getNumImageLikes(image.getId());
                imagesWithLikes.add(new ImageWithLikes(image, numImageLikes));
            }

            Collections.sort(imagesWithLikes, Comparator.comparingLong(ImageWithLikes::getNumImageLikes).reversed());

            for (ImageWithLikes imageWithLikes : imagesWithLikes) {
                allImagesSorted.add(imageWithLikes.getImage());
            }

        }

        Block<Image> otherImagesBlock = findImages(null, "", 0, 1000);
        otherImages = otherImagesBlock.getItems();

        for (Image image : otherImages) {
            if (!allImagesSorted.contains(image) &&
                    (userId != 0 ? !imageSeenInFeedDao.existsByUserAndImage(user, image) : true)) {
                Long numImageLikes = getNumImageLikes(image.getId());
                otherImagesWithLikes.add(new ImageWithLikes(image, numImageLikes));
            }
        }

        Collections.sort(otherImagesWithLikes, Comparator.comparingLong(ImageWithLikes::getNumImageLikes).reversed());

        for (ImageWithLikes imageWithLikes : otherImagesWithLikes) {
            allImagesSorted.add(imageWithLikes.getImage());
        }

        // Apply pagination after gathering all images
        int start = Math.min(page * size, allImagesSorted.size());

        int end = Math.min((page + 1) * size, allImagesSorted.size());

        List<Image> pagedImages = allImagesSorted.subList(start, end);

        boolean hasNext = end < allImagesSorted.size();

        return new Block<>(pagedImages, hasNext);

    }



    @Override
    public Long markImageAsSeen(Long userId, Long imageId) throws InstanceNotFoundException, PermissionException {

        User user = permissionChecker.checkUser(userId);

        Image image = permissionChecker.checkImage(imageId);

        if (imageSeenInFeedDao.existsByUserAndImage(user, image)) {
            throw new PermissionException();
        }

        ImageSeenInFeed imageSeenInFeed = new ImageSeenInFeed(user, image);

        imageSeenInFeedDao.save(imageSeenInFeed);

        return imageSeenInFeed.getId();

    }

    @Override
    public Long reportImage(Long userLoggedId, Long imageReportedId, String reason, String explanation)
            throws InstanceNotFoundException, ReportAlreadyGivenException {

        User user = permissionChecker.checkUser(userLoggedId);

        Image imageReported = permissionChecker.checkImage(imageReportedId);

        if (imageReportDao.existsByUserAndImageReported(user, imageReported)) {
            throw new ReportAlreadyGivenException();
        }

        ImageReport imageReport = new ImageReport(
                null, explanation, false, LocalDateTime.now(), user, imageReported);

        if (Objects.equals(reason, "IDENTITY_FRAUD")) {
            imageReport.setReason(UserReport.Reason.IDENTITY_FRAUD);
        }

        if (Objects.equals(reason, "UNDER_16")) {
            imageReport.setReason(UserReport.Reason.UNDER_16);
        }

        if (Objects.equals(reason, "SPAM")) {
            imageReport.setReason(UserReport.Reason.SPAM);
        }

        if (Objects.equals(reason, "NAKED_OR_SEXUAL_ACTIVITY")) {
            imageReport.setReason(UserReport.Reason.NAKED_OR_SEXUAL_ACTIVITY);
        }

        if (Objects.equals(reason, "VIOLENCE")) {
            imageReport.setReason(UserReport.Reason.VIOLENCE);
        }

        if (Objects.equals(reason, "BULLYING")) {
            imageReport.setReason(UserReport.Reason.BULLYING);
        }

        if (Objects.equals(reason, "FRAUD")) {
            imageReport.setReason(UserReport.Reason.FRAUD);
        }

        imageReportDao.save(imageReport);

        return imageReport.getId();

    }
}
