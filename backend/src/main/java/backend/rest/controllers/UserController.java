package backend.rest.controllers;

import static backend.rest.dtos.UserConversor.toAuthenticatedUserDto;
import static backend.rest.dtos.UserConversor.toUser;
import static backend.rest.dtos.UserConversor.toUserDto;
import static backend.rest.dtos.UserConversor.toUserDtos;

import static backend.rest.dtos.UserSettingsConversor.toUserSettingsDto;

import backend.model.entities.UserSettings;
import backend.model.exceptions.*;
import backend.model.services.Block;
import backend.rest.common.ErrorsDto;
import backend.rest.common.JwtInfo;
import backend.rest.dtos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import backend.model.services.UserService;
import backend.model.entities.User;

import backend.rest.common.JwtGenerator;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.Locale;

@RestController
@CrossOrigin(origins = "http://192.168.1.54:3000")
@RequestMapping("/users")
public class UserController {

    private final String REPORT_ALREADY_GIVEN_EXCEPTION_CODE = "project.exceptions.ReportAlreadyGivenException";
    private final String FOLLOW_REQUEST_NOT_FOUND_EXCEPTION_CODE = "project.exceptions.FollowRequestNotFoundException";
    private final String USER_ALREADY_REQUESTED_EXCEPTION_CODE = "project.exceptions.UserAlreadyRequestedException";
    private final String USER_NOT_FOLLOWED_EXCEPTION_CODE = "project.exceptions.UserNotFollowedException";
    private final String USER_ALREADY_FOLLOWED_EXCEPTION_CODE = "project.exceptions.UserAlreadyFollowedException";
    private final String WRONG_VERIFICATION_CODE_EXCEPTION_CODE = "project.exceptions.WrongVerificationCodeException";
    private final String EMAIL_NOT_FOUND_EXCEPTION_CODE = "project.exceptions.EmailNotFoundException";
    private final String INCORRECT_PASSWORD_EXCEPTION_CODE = "project.exceptions.IncorrectPasswordException";
    private final String BLOCKED_EXCEPTION_CODE = "project.exceptions.BlockedExceptionCode";
    private final String INCORRECT_LOGIN_EXCEPTION_CODE = "project.exceptions.IncorrectLoginException";
    private final String INVALID_BIRTH_DATE_EXCEPTION_CODE = "project.exceptions.InvalidBirthDateException";

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private JwtGenerator jwtGenerator;

    @Autowired
    private UserService userService;

    //TODO: ExceptionHandlers

    @ExceptionHandler(ReportAlreadyGivenException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorsDto handleReportAlreadyGivenException(ReportAlreadyGivenException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(REPORT_ALREADY_GIVEN_EXCEPTION_CODE, null,
                REPORT_ALREADY_GIVEN_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(FollowRequestNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public ErrorsDto handleFollowRequestNotFoundException(FollowRequestNotFoundException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(FOLLOW_REQUEST_NOT_FOUND_EXCEPTION_CODE, null,
                FOLLOW_REQUEST_NOT_FOUND_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(UserAlreadyRequestedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorsDto handleUserAlreadyRequestedException(UserAlreadyRequestedException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(USER_ALREADY_REQUESTED_EXCEPTION_CODE, null,
                USER_ALREADY_REQUESTED_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(UserNotFollowedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorsDto handleUserNotFollowedException(UserNotFollowedException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(USER_NOT_FOLLOWED_EXCEPTION_CODE, null,
                USER_NOT_FOLLOWED_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(UserAlreadyFollowedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorsDto handleUserAlreadyFollowedException(UserAlreadyFollowedException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(USER_ALREADY_FOLLOWED_EXCEPTION_CODE, null,
                USER_ALREADY_FOLLOWED_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(WrongVerificationCodeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorsDto handleWrongVerificationCodeException(WrongVerificationCodeException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(WRONG_VERIFICATION_CODE_EXCEPTION_CODE, null,
                WRONG_VERIFICATION_CODE_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(EmailNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public ErrorsDto handleEmailNotFoundException(EmailNotFoundException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(EMAIL_NOT_FOUND_EXCEPTION_CODE, null,
                EMAIL_NOT_FOUND_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(IncorrectPasswordException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorsDto handleIncorrectPasswordException(IncorrectPasswordException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(INCORRECT_PASSWORD_EXCEPTION_CODE, null,
                INCORRECT_PASSWORD_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(BlockedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorsDto handleBlockedException(BlockedException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(BLOCKED_EXCEPTION_CODE, null,
                BLOCKED_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(IncorrectLoginException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorsDto handleIncorrectLoginException(IncorrectLoginException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(INCORRECT_LOGIN_EXCEPTION_CODE, null,
                INCORRECT_LOGIN_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(InvalidBirthDateException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public ErrorsDto handleInvalidBirthDateException(InvalidBirthDateException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(INVALID_BIRTH_DATE_EXCEPTION_CODE, null,
                INVALID_BIRTH_DATE_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @PostMapping("/signUp")
    public ResponseEntity<AuthenticatedUserDto> signUp(
            @Validated({UserDto.AllValidations.class}) @RequestBody UserDto userDto)
            throws DuplicateInstanceException, InvalidBirthDateException {

        User user = toUser(userDto);

        userService.signUp(user);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{id}")
                .buildAndExpand(user.getId()).toUri();

        return ResponseEntity.created(location).body(toAuthenticatedUserDto(generateServiceToken(user), user));

    }

    @PostMapping("/login")
    public AuthenticatedUserDto login(@Validated @RequestBody LoginParamsDto params)
            throws IncorrectLoginException, BlockedException {

        User user = userService.login(params.getUserName(), params.getPassword());

        return toAuthenticatedUserDto(generateServiceToken(user), user);

    }

    @PostMapping("/loginFromServiceToken")
    public AuthenticatedUserDto loginFromServiceToken(@RequestAttribute Long userId,
                                                      @RequestAttribute String serviceToken) throws InstanceNotFoundException {

        User user = userService.loginFromId(userId);

        return toAuthenticatedUserDto(serviceToken, user);

    }

    @PutMapping("/updateProfile/{id}/addProfilePicture")
    public UserDto addProfilePicture(@RequestAttribute Long userId, @PathVariable Long id,
                                     @RequestParam(value = "image", required = false) MultipartFile image)
            throws InstanceNotFoundException, PermissionException, IOException {

        if (!id.equals(userId)) {
            throw new PermissionException();
        }

        User user = userService.findUserById(userId);

        if (image != null) {
            userService.addProfilePicture(userId, image.getBytes());
        } else {
            userService.addProfilePicture(userId, null);
        }

        return toUserDto(user);

    }

    @PutMapping("/updateProfile/{id}")
    public UserDto updateProfile(@RequestAttribute Long userId, @PathVariable Long id,
                                 @Validated({UserDto.UpdateValidations.class}) @RequestBody UserDto userDto)
            throws InstanceNotFoundException, PermissionException {

        if (!id.equals(userId)) {
            throw new PermissionException();
        }

        return toUserDto(userService.updateProfile(id, userDto.getName(), userDto.getSurname(),
                userDto.getEmail(), userDto.getPhoneNumber(), userDto.getAbout()));

    }

    @GetMapping("/userSettings/{userId}")
    public UserSettingsDto findUserSettingsByUserId(@PathVariable Long userId) throws InstanceNotFoundException {

        return toUserSettingsDto(userService.findUserSettingsByUserId(userId));

    }

    @PutMapping("/updateUserSettings/{id}")
    public UserSettingsDto updateUserSettings(@RequestAttribute Long userId, @PathVariable Long id,
                                 @Validated @RequestBody UserSettingsDto userSettingsDto)
            throws InstanceNotFoundException, PermissionException {

        if (!id.equals(userId)) {
            throw new PermissionException();
        }

        return toUserSettingsDto(userService.updateUserSettings(id, userSettingsDto.getPrivacyPublic(),
                userSettingsDto.getNotifyMe()));

    }

    @PostMapping("/updateProfile/{id}/changePassword")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(@RequestAttribute Long userId, @PathVariable Long id,
                               @Validated @RequestBody ChangePasswordParamsDto params)
            throws PermissionException, InstanceNotFoundException, IncorrectPasswordException {

        if (!id.equals(userId)) {
            throw new PermissionException();
        }

        userService.changePassword(id, params.getOldPassword(), params.getNewPassword());

    }

    @PostMapping("/forgottenPassword")
    public void sendVerificationCode(@Validated @RequestBody SendVerificationCodeParamsDto params)
            throws EmailNotFoundException, IOException {

        userService.sendVerificationCode(params.getEmail());

    }

    @PostMapping("/forgottenPassword/verificationCode")
    public void enterVerificationCode(@Validated @RequestBody EnterVerificationCodeParamsDto params)
            throws EmailNotFoundException, WrongVerificationCodeException {

        userService.enterVerificationCode(params.getEmail(), params.getVerificationCode());

    }

    @PostMapping("/forgottenPassword/restorePassword")
    public void restorePassword(@Validated @RequestBody RestorePasswordParamsDto params)
            throws InstanceNotFoundException, PermissionException {

        userService.restorePassword(params.getEmail(), params.getVerificationCode(), params.getNewPassword());

    }

    @GetMapping("/search")
    public BlockDto<UserDto> findUsers(@RequestParam String keywords,
                                       @RequestParam(defaultValue = "false") Boolean onlyBrands,
                                       @RequestParam(defaultValue = "0") int page) {

        Block<User> userBlock = userService.findUsers(keywords.trim(), onlyBrands, page, 10);

        return new BlockDto<>(toUserDtos(userBlock.getItems()), userBlock.getExistMoreItems());

    }

    @GetMapping("{id}")
    public UserDto findUserById(@PathVariable Long id) throws InstanceNotFoundException {

        return toUserDto(userService.findUserById(id));

    }

    @PostMapping("/follow/{id}")
    public Long followUser(@RequestAttribute Long userId, @PathVariable Long id,
                           @Validated @RequestBody FollowParamsDto params)
            throws UserAlreadyFollowedException, InstanceNotFoundException, PermissionException {

        if (!id.equals(userId)) {
            throw new PermissionException();
        }

        return userService.followUser(params.getUserId(), params.getUserFollowedId());

    }

    @PostMapping("/unfollow/{id}")
    public Boolean unFollowUser(@RequestAttribute Long userId, @PathVariable Long id,
                             @Validated @RequestBody FollowParamsDto params)
            throws InstanceNotFoundException, UserNotFollowedException, PermissionException {

        if (!id.equals(userId)) {
            throw new PermissionException();
        }

        return userService.unFollowUser(params.getUserId(), params.getUserFollowedId());

    }

    @GetMapping("/{id}/followers")
    public BlockDto<UserDto> findUserFollowers(@PathVariable Long id,
                                               @RequestParam Long userLoggedId,
                                               @RequestParam Boolean dateDesc,
                                               @RequestParam(defaultValue = "0") int page)
            throws InstanceNotFoundException, PermissionException {

        Block<User> userBlock = userService.findUserFollowers(id, userLoggedId, dateDesc, page, 10);

        return new BlockDto<>(toUserDtos(userBlock.getItems()), userBlock.getExistMoreItems());

    }

    @GetMapping("/{id}/followed")
    public BlockDto<UserDto> findUserFollowed(@PathVariable Long id,
                                               @RequestParam Long userLoggedId,
                                               @RequestParam Boolean dateDesc,
                                               @RequestParam(defaultValue = "0") int page)
            throws InstanceNotFoundException, PermissionException {

        Block<User> userBlock = userService.findUserFollowed(id, userLoggedId, dateDesc, page, 10);

        return new BlockDto<>(toUserDtos(userBlock.getItems()), userBlock.getExistMoreItems());

    }

    @GetMapping("/{id}/numFollowers")
    public Long getUserNumFollowers(@PathVariable Long id) throws InstanceNotFoundException {

        return userService.getUserNumFollowers(id);

    }

    @GetMapping("/{id}/numFollowed")
    public Long getUserNumFollowed(@PathVariable Long id) throws InstanceNotFoundException {

        return userService.getUserNumFollowed(id);

    }

    @GetMapping("/{id}/isFollowing")
    public Boolean isUserFollowingUser(@PathVariable Long id, @RequestParam Long userFollowingId)
            throws InstanceNotFoundException {

        return userService.isUserFollowingUser(id, userFollowingId);

    }

    @PostMapping("/requestFollow/{id}")
    public Long requestFollow(@RequestAttribute Long userId,
                              @PathVariable Long id,
                              @RequestBody FollowParamsDto params) throws PermissionException,
            UserAlreadyFollowedException, InstanceNotFoundException, UserAlreadyRequestedException {

        if (!userId.equals(id)) {
            throw new PermissionException();
        }

        return userService.requestFollow(params.getUserId(), params.getUserFollowedId());

    }

    @PostMapping("/deleteRequestFollow/{id}")
    public Boolean deleteRequestFollow(@RequestAttribute Long userId,
                                       @PathVariable Long id,
                                       @RequestBody FollowParamsDto params) throws PermissionException,
            FollowRequestNotFoundException, InstanceNotFoundException {

        if (!userId.equals(id)) {
            throw new PermissionException();
        }

        return userService.deleteRequestFollow(params.getUserId(), params.getUserFollowedId());

    }

    @GetMapping("/followRequests/{id}")
    public BlockDto<UserDto> findUserFollowRequests(@RequestAttribute Long userId,
                                                    @PathVariable Long id,
                                                    @RequestParam(defaultValue = "0") int page)
            throws PermissionException, InstanceNotFoundException {

        if (!userId.equals(id)) {
            throw new PermissionException();
        }

        Block<User> userBlock = userService.findUserFollowRequests(userId, page, 10);

        return new BlockDto<>(toUserDtos(userBlock.getItems()), userBlock.getExistMoreItems());

    }

    @GetMapping("/getNumFollowRequests/{id}")
    public Long getNumFollowRequests(@RequestAttribute Long userId,
                                     @PathVariable Long id) throws PermissionException, InstanceNotFoundException {

        if (!userId.equals(id)) {
            throw new PermissionException();
        }

        return userService.getNumFollowRequests(userId);

    }

    @PostMapping("/acceptFollowRequest/{id}")
    public Long acceptFollowRequest(@RequestAttribute Long userId,
                                    @PathVariable Long id,
                                    @RequestBody ResolveRequestParamsDto params) throws PermissionException,
            UserAlreadyFollowedException, InstanceNotFoundException {

        if (!userId.equals(id)) {
            throw new PermissionException();
        }

        return userService.acceptFollowRequest(params.getUserRequestingId(), userId);

    }

    @PostMapping("/rejectFollowRequest/{id}")
    public Boolean rejectFollowRequest(@RequestAttribute Long userId,
                                       @PathVariable Long id,
                                       @RequestBody ResolveRequestParamsDto params) throws PermissionException,
            InstanceNotFoundException {

        if (!userId.equals(id)) {
            throw new PermissionException();
        }

        return userService.rejectFollowRequest(params.getUserRequestingId(), userId);

    }

    @GetMapping("/hasRequested/{id}")
    public Boolean hasUserRequestedToFollow(@PathVariable Long id, @RequestParam Long userRequestedId)
            throws InstanceNotFoundException {

        return userService.hasUserRequestedToFollow(id, userRequestedId);

    }

    @PostMapping("/{id}/reportUser")
    public Long reportUser(@RequestAttribute Long userId, @PathVariable Long id, @RequestBody ReportParamsDto params)
            throws InstanceNotFoundException, ReportAlreadyGivenException {

        return userService.reportUser(userId, id, params.getReason(), params.getExplanation());

    }

    @PostMapping("/userSettings/{id}/dontShowUplRewardHelp")
    public UserSettingsDto dontShowUplRewardHelp(@RequestAttribute Long userId, @PathVariable Long id)
            throws PermissionException, InstanceNotFoundException {

        if (!id.equals(userId)) {
            throw new PermissionException();
        }

        return toUserSettingsDto(userService.dontShowAgainUplRewardHelp(userId));

    }

    @PostMapping("/userSettings/{id}/dontShowUplImageHelp")
    public UserSettingsDto dontShowUplImageHelp(@RequestAttribute Long userId, @PathVariable Long id)
            throws PermissionException, InstanceNotFoundException {

        if (!id.equals(userId)) {
            throw new PermissionException();
        }

        return toUserSettingsDto(userService.dontShowAgainUplImageHelp(userId));

    }

    private String generateServiceToken(User user) {

        JwtInfo jwtInfo = new JwtInfo(user.getId(), user.getUserName(), user.getRole().toString());

        return jwtGenerator.generate(jwtInfo);

    }
}
