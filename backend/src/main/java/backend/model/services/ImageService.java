package backend.model.services;

import backend.model.entities.Comment;
import backend.model.entities.Image;
import backend.model.entities.Tag;
import backend.model.entities.User;
import backend.model.exceptions.*;

import java.util.List;

public interface ImageService {

    Image uploadImage(String title, String description, String location, byte[] imgFile, Long userId)
            throws InstanceNotFoundException, SilencedException, PermissionException;

    Image updateImage(Long imageId, String title, String description, String location, Long userId)
            throws InstanceNotFoundException, PermissionException;

    Boolean deleteImage(Long imageId, Long userId) throws InstanceNotFoundException, PermissionException;

    Boolean hideImage(Long imageId, Long userId) throws InstanceNotFoundException, PermissionException,
            ImageAlreadyHiddenException;

    Boolean showImage(Long imageId, Long userId) throws InstanceNotFoundException, PermissionException,
            ImageNotHiddenException;

    Tag tagImage(String name, String link, int coordinateX, int coordinateY, Long categoryId, Long imageId, Long brandId,
                 Long userId)
            throws InstanceNotFoundException, PermissionException, CategoryNotActiveException, InvalidLinkException;

    Tag updateTag(Long tagId, String name, String link, Long categoryId, Long brandId, Long userId)
            throws InstanceNotFoundException, PermissionException, InvalidLinkException;

    Boolean deleteTagFromImage(Long tagId, Long imageId, Long userId) throws InstanceNotFoundException,
            PermissionException;

    Block<Image> findImages(Long categoryId, String keywords, int page, int size);

    Image findImageById(Long id, Long userLoggedId) throws InstanceNotFoundException, PermissionException,
            HiddenImageException;

    List<Tag> findImageTags(Long id, Long userLoggedId) throws InstanceNotFoundException, PermissionException,
            HiddenImageException;

    Block<Image> findImagesByUserId(Long userId, Long userLoggedId, int page, int size)
            throws InstanceNotFoundException, PermissionException;

    Long likeImage(Long userId, Long imageId) throws InstanceNotFoundException, ImageAlreadyLikedException,
            PermissionException, HiddenImageException;

    Boolean deleteImageLike(Long userId, Long imageId) throws InstanceNotFoundException, ImageNotLikedException,
            PermissionException, HiddenImageException;

    Block<Image> findImagesLikedByUser(Long userId, Long userLoggedId, Boolean dateDesc, int page, int size)
            throws InstanceNotFoundException, PermissionException;

    Long getNumImageLikes(Long imageId) throws InstanceNotFoundException;

    Block<User> findUsersThatLikedImage(Long imageId, Long userLoggedId, Boolean dateDesc, int page, int size)
            throws InstanceNotFoundException, PermissionException;

    Boolean isImageLikedByUser(Long imageId, Long userId) throws InstanceNotFoundException;

    Long commentImage(Long userId, Long imageId, String text) throws InstanceNotFoundException, EmptyCommentException,
            PermissionException, HiddenImageException;

    Boolean deleteComment(Long commentId, Long userId) throws InstanceNotFoundException, PermissionException;

    Long answerComment(Long userId, Long imageId, Long commentId, String text)
            throws InstanceNotFoundException, EmptyCommentException, PermissionException;

    Block<Comment> findCommentsFromImage(Long imageId, Long userLoggedId, int page, int size)
            throws InstanceNotFoundException, PermissionException, HiddenImageException;

    Block<Comment> findAnswersFromComment(Long commentId, Long userLoggedId, int page, int size)
            throws InstanceNotFoundException, PermissionException, HiddenImageException;

    Long getNumCommentsFromImage(Long imageId, Long userLoggedId) throws InstanceNotFoundException, PermissionException;

    Long getNumAnswersFromComment(Long commentId, Long userLoggedId)
            throws InstanceNotFoundException, PermissionException;

    Long likeTag(Long userId, Long tagId) throws InstanceNotFoundException, TagAlreadyLikedException,
            PermissionException, HiddenImageException;

    Boolean deleteTagLike(Long userId, Long tagId) throws InstanceNotFoundException, TagNotLikedException,
            PermissionException;

    Block<Tag> findTagsLikedByUser(Long userId, Long userLoggedId, Boolean dateDesc, int page, int size)
            throws InstanceNotFoundException, PermissionException;

    Block<User> findUsersThatLikedTag(Long tagId, Long userLoggedId, Boolean dateDesc, int page, int size)
            throws InstanceNotFoundException, PermissionException;

    Long getNumTagLikes(Long tagId, Long userLoggedId) throws InstanceNotFoundException, PermissionException;

    Boolean isTagLikedByUser(Long tagId, Long userId) throws InstanceNotFoundException;

    Block<Image> getFeed(Long userId, int page, int size) throws InstanceNotFoundException, PermissionException, HiddenImageException;

    Long markImageAsSeen(Long userId, Long imageId) throws InstanceNotFoundException, PermissionException;

    Long reportImage(Long userLoggedId, Long imageReportedId, String reason, String explanation)
            throws InstanceNotFoundException, ReportAlreadyGivenException;

}
