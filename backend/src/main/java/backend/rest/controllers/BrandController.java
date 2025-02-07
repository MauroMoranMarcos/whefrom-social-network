package backend.rest.controllers;

import backend.model.entities.Reward;
import backend.model.entities.User;
import backend.model.exceptions.*;
import backend.model.services.Block;
import backend.model.services.BrandService;
import backend.rest.common.ErrorsDto;
import backend.rest.common.JwtGenerator;
import backend.rest.common.JwtInfo;
import backend.rest.dtos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.io.IOException;
import java.net.URI;
import java.util.Locale;

import static backend.rest.dtos.RewardConversor.toRewardDto;
import static backend.rest.dtos.RewardConversor.toRewardDtos;
import static backend.rest.dtos.UserConversor.toUser;
import static backend.rest.dtos.UserConversor.toAuthenticatedUserDto;
import static backend.rest.dtos.UserConversor.toUserDtos;

@RestController
@CrossOrigin(origins = "http://192.168.1.54:3000")
@RequestMapping("/brands")
public class BrandController {

    private final String BRAND_NOT_VERIFIED_EXCEPTION_CODE = "project.exceptions.BrandNotVerifiedException";
    private final String INVALID_END_DATE_EXCEPTION_CODE = "project.exceptions.InvalidEndDateException";
    private final String REWARD_ALREADY_HIDDEN_EXCEPTION_CODE = "project.exceptions.RewardAlreadyHiddenException";
    private final String REWARD_NOT_HIDDEN_EXCEPTION_CODE = "project.exceptions.RewardNotHiddenExceptionCode";
    private final String HIDDEN_REWARD_EXCEPTION_CODE = "project.exceptions.HiddenRewardException";
    private final String REWARD_NOT_CLAIMABLE_EXCEPTION_CODE = "project.exceptions.RewardNotClaimableException";
    private final String VERIFICATION_REQUEST_ALREADY_EXISTS_EXCEPTION_CODE = "project.exceptions.VerificationRequestAlreadyExistsException";

    @ExceptionHandler(BrandNotVerifiedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorsDto handleBrandNotVerifiedException(BrandNotVerifiedException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(BRAND_NOT_VERIFIED_EXCEPTION_CODE, null,
                BRAND_NOT_VERIFIED_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(InvalidEndDateException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorsDto handleInvalidEndDateException(InvalidEndDateException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(INVALID_END_DATE_EXCEPTION_CODE, null,
                INVALID_END_DATE_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(RewardAlreadyHiddenException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorsDto handleRewardAlreadyHiddenException(RewardAlreadyHiddenException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(REWARD_ALREADY_HIDDEN_EXCEPTION_CODE, null,
                REWARD_ALREADY_HIDDEN_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(RewardNotHiddenException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorsDto handleRewardNotHiddenException(RewardNotHiddenException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(REWARD_NOT_HIDDEN_EXCEPTION_CODE, null,
                REWARD_NOT_HIDDEN_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(HiddenRewardException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorsDto handleHiddenRewardException(HiddenRewardException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(HIDDEN_REWARD_EXCEPTION_CODE, null,
                HIDDEN_REWARD_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(RewardNotClaimableException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorsDto handleRewardNotClaimableException(RewardNotClaimableException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(REWARD_NOT_CLAIMABLE_EXCEPTION_CODE, null,
                REWARD_NOT_CLAIMABLE_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @ExceptionHandler(VerificationRequestAlreadyExists.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorsDto handleVerificationRequestAlreadyExistsException(VerificationRequestAlreadyExists exception, Locale locale) {

        String errorMessage = messageSource.getMessage(VERIFICATION_REQUEST_ALREADY_EXISTS_EXCEPTION_CODE, null,
                VERIFICATION_REQUEST_ALREADY_EXISTS_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private JwtGenerator jwtGenerator;

    @Autowired
    private BrandService brandService;

    @PostMapping("/signUp")
    public ResponseEntity<AuthenticatedUserDto> signUp(
            @Validated({UserDto.AllValidations.class}) @RequestBody UserDto userDto)
            throws DuplicateInstanceException {

        User user = toUser(userDto);

        brandService.signUp(user);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{id}")
                .buildAndExpand(user.getId()).toUri();

        return ResponseEntity.created(location).body(toAuthenticatedUserDto(generateServiceToken(user), user));

    }

    @PostMapping("/login")
    public AuthenticatedUserDto login(@Validated @RequestBody LoginParamsDto params)
            throws IncorrectLoginException {

        User user = brandService.login(params.getUserName(), params.getPassword());

        return toAuthenticatedUserDto(generateServiceToken(user), user);

    }

    @PostMapping("/loginFromServiceToken")
    public AuthenticatedUserDto loginFromServiceToken(@RequestAttribute Long userId,
                                                      @RequestAttribute String serviceToken)
            throws InstanceNotFoundException {

        User user = brandService.loginFromId(userId);

        return toAuthenticatedUserDto(serviceToken, user);

    }

    @PostMapping("/upload")
    public RewardDto uploadReward(@Valid @ModelAttribute UploadRewardParamsDto params) throws InstanceNotFoundException,
            IOException, PermissionException, InvalidEndDateException, BrandNotVerifiedException {

        Reward reward = brandService.uploadReward(params.getName(), params.getDescription(), params.getEndDate(),
                params.getPointsCost(), params.getPublicationsNeeded(), params.getStock(),
                params.getImgFile().getBytes(), params.getBrandId());

        return toRewardDto(reward);

    }

    @PostMapping("/hideReward/{id}")
    public Boolean hideReward(@RequestAttribute Long userId, @PathVariable Long id) throws PermissionException,
            InstanceNotFoundException, RewardAlreadyHiddenException {

        return brandService.hideReward(id, userId);

    }

    @PostMapping("/showReward/{id}")
    public Boolean showReward(@RequestAttribute Long userId, @PathVariable Long id) throws PermissionException,
            InstanceNotFoundException, RewardNotHiddenException {

        return brandService.showReward(id, userId);

    }

    @PostMapping("/deleteReward/{id}")
    public Boolean deleteReward(@RequestAttribute Long userId, @PathVariable Long id) throws PermissionException,
            InstanceNotFoundException {

        return brandService.deleteReward(id, userId);

    }

    @GetMapping("{id}")
    public RewardDto findRewardById(@PathVariable Long id, @RequestParam(defaultValue = "0") Long userLoggedId)
            throws InstanceNotFoundException, HiddenRewardException {

        return toRewardDto(brandService.findRewardById(id, userLoggedId));

    }

    @GetMapping("/search")
    public BlockDto<RewardDto> findBrands(
            @RequestParam(defaultValue = "0") Long brandId,
            @RequestParam(defaultValue = "0") Long userLoggedId,
            @RequestParam(defaultValue = "CREATION_DATE_DESC") String filterType,
            @RequestParam(defaultValue = "false") Boolean showOnlyClaimable,
            @RequestParam(defaultValue = "0") int page)
            throws InstanceNotFoundException, PermissionException, HiddenImageException {

        Block<Reward> rewardBlock = brandService.findRewards(brandId, userLoggedId, filterType, showOnlyClaimable,
                page, 10);

        return new BlockDto<>(toRewardDtos(rewardBlock.getItems()), rewardBlock.getExistMoreItems());

    }

    @PostMapping("/{id}/claimReward")
    public Long claimReward(@RequestAttribute Long userId, @PathVariable Long id) throws RewardAlreadyClaimedException,
            InstanceNotFoundException, RewardNotClaimableException, IOException, PermissionException,
            HiddenImageException {

        return brandService.claimReward(userId, id);

    }

    @GetMapping("/{id}/isRewardClaimedByUser")
    public Boolean isRewardClaimedByUser(@RequestAttribute Long userId, @PathVariable Long id)
            throws InstanceNotFoundException {

        return brandService.isRewardClaimedByUser(userId, id);

    }

    @GetMapping("/{id}/findUsersThatClaimedReward")
    public BlockDto<UserDto> findUsersThatClaimedReward(
            @RequestAttribute Long userId,
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page) throws PermissionException, InstanceNotFoundException {

        Block<User> userBlock = brandService.findUsersThatClaimedReward(userId, id, page, 10);

        return new BlockDto<>(toUserDtos(userBlock.getItems()), userBlock.getExistMoreItems());

    }

    @GetMapping("/{id}/getNumPublicationsWithBrand")
    public Long getNumPublicationsWithBrand(@RequestAttribute Long userId, @PathVariable Long id)
            throws PermissionException, InstanceNotFoundException, HiddenImageException {

        return brandService.getNumPublicationsWithBrand(userId, id);

    }

    @PostMapping("/requestVerification")
    public Long requestVerification(@RequestAttribute Long userId) throws PermissionException,
            VerificationRequestAlreadyExists, InstanceNotFoundException {

        return brandService.requestVerification(userId);

    }

    @GetMapping("/hasRequestedVerification")
    public Boolean hasBrandRequestedVerification(@RequestAttribute Long userId)
            throws PermissionException, InstanceNotFoundException {

        return brandService.hasBrandRequestedVerification(userId);

    }

    private String generateServiceToken(User user) {

        JwtInfo jwtInfo = new JwtInfo(user.getId(), user.getUserName(), user.getRole().toString());

        return jwtGenerator.generate(jwtInfo);

    }
}
