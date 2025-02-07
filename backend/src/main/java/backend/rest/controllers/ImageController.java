package backend.rest.controllers;

import backend.model.entities.Comment;
import backend.model.entities.Image;
import backend.model.entities.Tag;
import backend.model.entities.User;
import backend.model.exceptions.*;
import backend.model.services.Block;
import backend.model.services.ImageService;
import backend.rest.common.ErrorsDto;
import backend.rest.dtos.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.parameters.P;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

import static backend.rest.dtos.ImageConversor.toImageDto;
import static backend.rest.dtos.ImageConversor.toImageDtos;

import static backend.rest.dtos.TagConversor.toTagDto;
import static backend.rest.dtos.TagConversor.toTagDtos;

import static backend.rest.dtos.UserConversor.toUserDto;
import static backend.rest.dtos.UserConversor.toUserDtos;

import static backend.rest.dtos.CommentConversor.toCommentDto;
import static backend.rest.dtos.CommentConversor.toCommentDtos;

@RestController
@CrossOrigin(origins = "http://192.168.1.54:3000")
@RequestMapping("/images")
public class ImageController {

    private final String SILENCED_EXCEPTION_CODE = "project.exceptions.SilencedException";
    private final String IMAGE_ALREADY_HIDDEN_EXCEPTION_CODE = "project.exceptions.ImageAlreadyHiddenException";
    private final String IMAGE_NOT_HIDDEN_EXCEPTION_CODE = "project.exceptions.ImageNotHiddenException";
    private final String CATEGORY_NOT_ACTIVE_EXCEPTION_CODE = "project.exceptions.CategoryNotActiveException";
    private final String INVALID_LINK_EXCEPTION_CODE = "project.exceptions.InvalidLinkException";
    private final String IMAGE_ALREADY_LIKED_EXCEPTION_CODE = "project.exceptions.ImageAlreadyLikedException";
    private final String IMAGE_NOT_LIKED_EXCEPTION_CODE = "project.exceptions.ImageNotLikedException";
    private final String EMPTY_COMMENT_EXCEPTION_CODE = "project.exceptions.EmptyCommentException";
    private final String TAG_ALREADY_LIKED_EXCEPTION_CODE = "project.exceptions.TagAlreadyLikedException";
    private final String TAG_NOT_LIKED_EXCEPTION_CODE = "project.exceptions.TagNotLikedException";
    private final String REPORT_ALREADY_GIVEN_EXCEPTION_CODE = "project.exceptions.ReportImageAlreadyGivenException";

    @ExceptionHandler(SilencedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorsDto handleSilencedException(SilencedException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(SILENCED_EXCEPTION_CODE, null,
                SILENCED_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(ImageAlreadyHiddenException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorsDto handleImageAlreadyHiddenException(ImageAlreadyHiddenException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(IMAGE_ALREADY_HIDDEN_EXCEPTION_CODE, null,
                IMAGE_ALREADY_HIDDEN_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(ImageNotHiddenException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorsDto handleImageNotHiddenException(ImageNotHiddenException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(IMAGE_NOT_HIDDEN_EXCEPTION_CODE, null,
                IMAGE_NOT_HIDDEN_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(CategoryNotActiveException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorsDto handleCategoryNotActive(CategoryNotActiveException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(CATEGORY_NOT_ACTIVE_EXCEPTION_CODE, null,
                CATEGORY_NOT_ACTIVE_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(InvalidLinkException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorsDto handleInvalidLinkException(InvalidLinkException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(INVALID_LINK_EXCEPTION_CODE, null,
                INVALID_LINK_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(ImageAlreadyLikedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorsDto handleImageAlreadyLiked(ImageAlreadyLikedException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(IMAGE_ALREADY_LIKED_EXCEPTION_CODE, null,
                IMAGE_ALREADY_LIKED_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(ImageNotLikedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorsDto handleImageNotLikedException(ImageNotLikedException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(IMAGE_NOT_LIKED_EXCEPTION_CODE, null,
                IMAGE_NOT_LIKED_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(EmptyCommentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorsDto handleEmptyCommentException(EmptyCommentException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(EMPTY_COMMENT_EXCEPTION_CODE, null,
                EMPTY_COMMENT_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(TagAlreadyLikedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorsDto handleTagAlreadyLikedException(TagAlreadyLikedException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(TAG_ALREADY_LIKED_EXCEPTION_CODE, null,
                TAG_ALREADY_LIKED_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(TagNotLikedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorsDto handleTagNotLikedException(TagNotLikedException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(TAG_NOT_LIKED_EXCEPTION_CODE, null,
                TAG_NOT_LIKED_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(ReportAlreadyGivenException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorsDto handleReportAlreadyGivenException(ReportAlreadyGivenException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(REPORT_ALREADY_GIVEN_EXCEPTION_CODE, null,
                REPORT_ALREADY_GIVEN_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private ImageService imageService;

    @PostMapping("/upload")
    public ImageDto uploadImage(@ModelAttribute UploadImageParamsDto params) throws InstanceNotFoundException,
            IOException, SilencedException, PermissionException {

        Image image = imageService.uploadImage(params.getTitle(), params.getDescription(), params.getLocation(),
                params.getImgFile().getBytes(), params.getUserId());

        return toImageDto(image);

    }

    @PutMapping("/updateImage/{id}")
    public ImageDto updateImage(@RequestAttribute Long userId, @PathVariable Long id,
                                @RequestBody UpdateImageParamsDto params)
            throws PermissionException, InstanceNotFoundException {

        return toImageDto(imageService.updateImage(id, params.getTitle(), params.getDescription(),
                params.getLocation(), userId));

    }

    @PostMapping("/deleteImage/{id}")
    public Boolean deleteImage(@RequestAttribute Long userId, @PathVariable Long id) throws PermissionException,
            InstanceNotFoundException {

        return imageService.deleteImage(id, userId);

    }

    @PostMapping("/hideImage/{id}")
    public Boolean hideImage(@RequestAttribute Long userId, @PathVariable Long id) throws PermissionException,
            ImageAlreadyHiddenException, InstanceNotFoundException {

        return imageService.hideImage(id, userId);

    }

    @PostMapping("/showImage/{id}")
    public Boolean showImage(@RequestAttribute Long userId, @PathVariable Long id) throws PermissionException,
            InstanceNotFoundException, ImageNotHiddenException {

        return imageService.showImage(id, userId);

    }

    @PostMapping("/tagging")
    public TagDto tagImage(@RequestBody TagImageParamsDto params)
            throws InstanceNotFoundException, PermissionException, CategoryNotActiveException, InvalidLinkException {

        Tag tag = imageService.tagImage(params.getName(), params.getLink(), params.getCoordinateX(),
                params.getCoordinateY(), params.getCategoryId(), params.getImageId(), params.getBrandId(),
                params.getUserId());

        return toTagDto(tag);

    }

    @PutMapping("/updateTag/{id}")
    public TagDto updateTag(@RequestAttribute Long userId, @PathVariable Long id,
                            @RequestBody UpdateTagParamsDto params)
            throws PermissionException, InstanceNotFoundException, InvalidLinkException {

        return toTagDto(imageService.updateTag(id, params.getName(), params.getLink(), params.getCategoryId(),
                params.getBrandId(), userId));

    }

    @PostMapping("/deleteTag/{id}")
    public Boolean deleteTagFromImage(@RequestAttribute Long userId, @PathVariable Long id,
                                      @RequestBody DeleteTagParamsDto params)
            throws PermissionException, InstanceNotFoundException {

        return imageService.deleteTagFromImage(id, params.getImageId(), userId);

    }

    @GetMapping("/search")
    public BlockDto<ImageDto> findImages(
            @RequestParam(required=false) Long categoryId,
            @RequestParam String keywords,
            @RequestParam(defaultValue = "0") int page) {

        Block<Image> imageBlock = imageService.findImages(categoryId, keywords.trim(), page, 12);

        return new BlockDto<>(toImageDtos(imageBlock.getItems()), imageBlock.getExistMoreItems());

    }

    @GetMapping("{id}")
    public ImageDto findImageById(@PathVariable Long id, @RequestParam Long userLoggedId)
            throws InstanceNotFoundException, PermissionException, HiddenImageException {

        return toImageDto(imageService.findImageById(id, userLoggedId));

    }

    @GetMapping("{id}/findTags")
    public List<TagDto> findImageTags(@PathVariable Long id, @RequestParam Long userLoggedId)
            throws PermissionException, InstanceNotFoundException, HiddenImageException {

        return toTagDtos(imageService.findImageTags(id, userLoggedId));

    }

    @GetMapping("/search/user")
    public BlockDto<ImageDto> findImagesFromUser(
            @RequestParam Long userId,
            @RequestParam Long userLoggedId,
            @RequestParam(defaultValue = "0") int page) throws InstanceNotFoundException, PermissionException {

        Block<Image> imageBlock = imageService.findImagesByUserId(userId, userLoggedId, page, 12);

        return new BlockDto<>(toImageDtos(imageBlock.getItems()), imageBlock.getExistMoreItems());

    }

    @PostMapping("/{id}/like")
    public Long likeImage(@RequestAttribute Long userId,
                          @PathVariable Long id)
            throws InstanceNotFoundException, ImageAlreadyLikedException, PermissionException, HiddenImageException {

        return imageService.likeImage(userId, id);

    }

    @PostMapping("/{id}/deleteLike")
    public Boolean deleteImageLike(@RequestAttribute Long userId,
                                   @PathVariable Long id)
            throws ImageNotLikedException, InstanceNotFoundException, PermissionException, HiddenImageException {

        return imageService.deleteImageLike(userId, id);

    }

    @GetMapping("/{id}/getNumImageLikes")
    public Long getNumImageLikes(@PathVariable Long id) throws InstanceNotFoundException {

        return imageService.getNumImageLikes(id);

    }

    @GetMapping("/search/likedByUser")
    public BlockDto<ImageDto> findImagesLikedByUser(
            @RequestParam Long userId,
            @RequestParam Long userLoggedId,
            @RequestParam Boolean dateDesc,
            @RequestParam(defaultValue = "0") int page) throws InstanceNotFoundException, PermissionException {

        Block<Image> imageBlock = imageService.findImagesLikedByUser(userId, userLoggedId, dateDesc, page, 12);

        return new BlockDto<>(toImageDtos(imageBlock.getItems()), imageBlock.getExistMoreItems());

    }

    @GetMapping("/search/usersThatLiked")
    public BlockDto<UserDto> findUsersThatLikedImage(
            @RequestParam Long imageId,
            @RequestParam Long userLoggedId,
            @RequestParam Boolean dateDesc,
            @RequestParam(defaultValue = "0") int page) throws InstanceNotFoundException, PermissionException {

        Block<User> userBlock = imageService.findUsersThatLikedImage(imageId, userLoggedId, dateDesc, page, 10);

        return new BlockDto<>(toUserDtos(userBlock.getItems()), userBlock.getExistMoreItems());

    }

    @GetMapping("/{id}/isImageLikedByUser")
    public Boolean isImageLikedByUser(@PathVariable Long id, @RequestAttribute Long userId)
            throws InstanceNotFoundException {

        return imageService.isImageLikedByUser(id, userId);

    }

    @PostMapping("/{id}/comment")
    public Long commentImage(@RequestAttribute Long userId,
                          @PathVariable Long id, @RequestBody CommentImageParamsDto params)
            throws InstanceNotFoundException, PermissionException, EmptyCommentException, HiddenImageException {

        if (params.getCommentAnsweredId() == null) {

            return imageService.commentImage(userId, id, params.getText());

        } else {

            return imageService.answerComment(userId, id, params.getCommentAnsweredId(), params.getText());

        }

    }

    @PostMapping("/{id}/deleteComment")
    public Boolean deleteCommentImage(@RequestAttribute Long userId,
                                   @PathVariable Long id) throws InstanceNotFoundException, PermissionException {

        return imageService.deleteComment(id, userId);

    }

    @GetMapping("/search/commentsFromImage")
    public BlockDto<CommentDto> findCommentsFromImage(
            @RequestParam Long userId,
            @RequestParam Long imageId,
            @RequestParam(defaultValue = "0") int page)
            throws InstanceNotFoundException, PermissionException, HiddenImageException {

        Block<Comment> commentBlock = imageService.findCommentsFromImage(imageId, userId, page, 10);

        return new BlockDto<>(toCommentDtos(commentBlock.getItems()), commentBlock.getExistMoreItems());

    }

    @GetMapping("/search/answersFromComment")
    public BlockDto<CommentDto> findAnswersFromComment(
            @RequestParam Long userId,
            @RequestParam Long commentId,
            @RequestParam(defaultValue = "0") int page)
            throws InstanceNotFoundException, PermissionException, HiddenImageException {

        Block<Comment> commentBlock = imageService.findAnswersFromComment(commentId, userId, page, 10);

        return new BlockDto<>(toCommentDtos(commentBlock.getItems()), commentBlock.getExistMoreItems());

    }

    @GetMapping("/{id}/getNumImageComments")
    public Long getNumImageComments(@PathVariable Long id, @RequestParam Long userId) throws InstanceNotFoundException,
            PermissionException {

        return imageService.getNumCommentsFromImage(id, userId);

    }

    @GetMapping("/{id}/getNumCommentAnswers")
    public Long getNumCommentAnswers(@PathVariable Long id, @RequestParam Long userId) throws InstanceNotFoundException,
            PermissionException {

        return imageService.getNumAnswersFromComment(id, userId);

    }

    @PostMapping("/tagging/{id}/likeTag")
    public Long likeTag(@RequestAttribute Long userId, @PathVariable Long id) throws PermissionException,
            TagAlreadyLikedException, InstanceNotFoundException, HiddenImageException {

        return imageService.likeTag(userId, id);

    }

    @PostMapping("/tagging/{id}/deleteTagLike")
    public Boolean deleteTagLike(@RequestAttribute Long userId, @PathVariable Long id) throws PermissionException,
            TagNotLikedException, InstanceNotFoundException {

        return imageService.deleteTagLike(userId, id);

    }

    @GetMapping("/search/tagsLikedByUser")
    public BlockDto<TagDto> findTagsLikedByUser(
            @RequestParam Long userId,
            @RequestParam Long userLoggedId,
            @RequestParam Boolean dateDesc,
            @RequestParam(defaultValue = "0") int page) throws PermissionException, InstanceNotFoundException {

        Block<Tag> tagBlock = imageService.findTagsLikedByUser(userId, userLoggedId, dateDesc, page, 21);

        return new BlockDto<>(toTagDtos(tagBlock.getItems()), tagBlock.getExistMoreItems());

    }

    @GetMapping("/search/usersThatLikedTag")
    public BlockDto<UserDto> findUsersThatLikedTag(
            @RequestParam Long userLoggedId,
            @RequestParam Long tagId,
            @RequestParam Boolean dateDesc,
            @RequestParam(defaultValue = "0") int page) throws PermissionException, InstanceNotFoundException {

        Block<User> userBlock = imageService.findUsersThatLikedTag(tagId, userLoggedId, dateDesc, page, 10);

        return new BlockDto<>(toUserDtos(userBlock.getItems()), userBlock.getExistMoreItems());

    }

    @GetMapping("/search/tagging/{id}/getNumTagLikes")
    public Long getNumTagLikes(@PathVariable Long id, @RequestParam Long userId) throws PermissionException,
            InstanceNotFoundException {

        return imageService.getNumTagLikes(id, userId);

    }

    @GetMapping("/search/tagging/{id}/isTagLikedByUser")
    public Boolean isTagLikedByUser(@PathVariable Long id, @RequestParam Long userId) throws InstanceNotFoundException {

        return imageService.isTagLikedByUser(id, userId);

    }

    @GetMapping("/search/getFeed")
    public BlockDto<ImageDto> getFeed(@RequestParam(defaultValue = "0") Long userLoggedId,
                                      @RequestParam(defaultValue = "0") int page)
            throws PermissionException, InstanceNotFoundException, HiddenImageException {

        Block<Image> imageBlock = imageService.getFeed(userLoggedId, page, 12);

        return new BlockDto<>(toImageDtos(imageBlock.getItems()), imageBlock.getExistMoreItems());

    }

    @PostMapping("/search/getFeed/markImageAsSeen")
    public Long markImageAsSeen(@RequestAttribute Long userId,
                                @RequestBody MarkImageAsSeenParamsDto params)
            throws PermissionException, InstanceNotFoundException {

        if (!userId.equals(params.getUserId())) {
            throw new PermissionException();
        }

        return imageService.markImageAsSeen(userId, params.getImageId());

    }

    @PostMapping("/{id}/reportImage")
    public Long reportImage(@RequestAttribute Long userId, @PathVariable Long id, @RequestBody ReportParamsDto params)
            throws InstanceNotFoundException, ReportAlreadyGivenException {

        return imageService.reportImage(userId, id, params.getReason(), params.getExplanation());

    }

}
