package backend.rest.controllers;

import static backend.rest.dtos.CategoryConversor.toCategoryDtos;
import static backend.rest.dtos.CategoryConversor.toCategoryDto;
import static backend.rest.dtos.UserConversor.toUserDtos;
import static backend.rest.dtos.UserReportConversor.toUserReportDto;
import static backend.rest.dtos.UserReportConversor.toUserReportDtos;
import static backend.rest.dtos.ImageReportConversor.toImageReportDto;
import static backend.rest.dtos.ImageReportConversor.toImageReportDtos;
import static backend.rest.dtos.UserPenaltyConversor.toUserPenaltyDto;

import backend.model.entities.*;
import backend.model.exceptions.*;
import backend.model.services.AdminService;
import backend.model.services.Block;
import backend.rest.common.ErrorsDto;
import backend.rest.common.JwtGenerator;

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

@RestController
@CrossOrigin(origins = "http://192.168.1.54:3000")
@RequestMapping("/admin")
public class AdminController {

    private final String REPORT_ALREADY_RESOLVED_EXCEPTION_CODE = "project.exceptions.ReportAlreadyResolvedException";

    @ExceptionHandler(ReportAlreadyResolvedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorsDto handleReportAlreadyResolvedException(ReportAlreadyResolvedException exception, Locale locale) {

        String errorMessage = messageSource.getMessage(REPORT_ALREADY_RESOLVED_EXCEPTION_CODE, null,
                REPORT_ALREADY_RESOLVED_EXCEPTION_CODE, locale);

        return new ErrorsDto(errorMessage);

    }

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private JwtGenerator jwtGenerator;

    @Autowired
    private AdminService adminService;

    @GetMapping("/categories")
    public List<CategoryDto> findCategories(@RequestParam(required = false) Boolean active) {

        if (active == null) {

            return toCategoryDtos(adminService.findAllCategories());

        } else {

            return toCategoryDtos(adminService.findActiveCategories(active));

        }

    }

    @PostMapping("/categories/create")
    public CategoryDto createCategory(@Validated @RequestBody CreateCategoryParamsDto params)
            throws DuplicateInstanceException {

        Category category = adminService.createCategory(params.getName(), params.getActive());

        return toCategoryDto(category);

    }

    @PutMapping("/categories/update/{id}")
    public CategoryDto updateCategoryStatus(@PathVariable Long id,
                                            @Validated @RequestBody UpdateCategoryStatusParamsDto params)
            throws InstanceNotFoundException {

        Category category = adminService.updateCategoryStatus(id, params.getName(), params.getActive());

        return toCategoryDto(category);

    }

    @GetMapping("/categories/{id}")
    public CategoryDto findCategoryById(@PathVariable Long id) throws InstanceNotFoundException {

        return toCategoryDto(adminService.findCategoryById(id));

    }

    @GetMapping("/categories/{id}/numTimesUsed")
    public Long getCategoryNumTimesUsed(@RequestAttribute Long userId, @PathVariable Long id)
            throws PermissionException, InstanceNotFoundException, HiddenImageException {

        return adminService.getCategoryNumTimesUsed(userId, id);

    }

    @GetMapping("/reports/userReports")
    public BlockDto<UserReportDto> findUserReports(
            @RequestAttribute Long userId,
            @RequestParam(defaultValue = "0") int page) throws PermissionException, InstanceNotFoundException {

        Block<UserReport> userReportBlock = adminService.findUserReports(userId, page, 10);

        return new BlockDto<>(toUserReportDtos(userReportBlock.getItems()), userReportBlock.getExistMoreItems());

    }

    @GetMapping("/reports/userReports/{id}")
    public UserReportDto findUserReportById(@RequestAttribute Long userId, @PathVariable Long id)
            throws PermissionException, InstanceNotFoundException {

        return toUserReportDto(adminService.findUserReportById(userId, id));

    }

    @GetMapping("/reports/imageReports")
    public BlockDto<ImageReportDto> findImageReports(
            @RequestAttribute Long userId,
            @RequestParam(defaultValue = "0") int page) throws PermissionException, InstanceNotFoundException {

        Block<ImageReport> imageReportBlock = adminService.findImageReports(userId, page, 10);

        return new BlockDto<>(toImageReportDtos(imageReportBlock.getItems()), imageReportBlock.getExistMoreItems());

    }

    @GetMapping("/reports/imageReports/{id}")
    public ImageReportDto findImageReportById(@RequestAttribute Long userId, @PathVariable Long id)
            throws PermissionException, InstanceNotFoundException {

        return toImageReportDto(adminService.findImageReportById(userId, id));

    }

    @PostMapping("/reports/userReports/{id}/warning")
    public void warnUserReportWithEmail(@RequestAttribute Long userId, @PathVariable Long id,
                                        @RequestBody WarnUserWithEmailParamsDto params) throws PermissionException,
            InstanceNotFoundException, IOException {

        adminService.warnUserReportWithEmail(userId, id, params.getWarning());

    }

    @PostMapping("/reports/imageReports/{id}/warning")
    public void warnImageReportWithEmail(@RequestAttribute Long userId, @PathVariable Long id,
                                        @RequestBody WarnUserWithEmailParamsDto params) throws PermissionException,
            InstanceNotFoundException, IOException {

        adminService.warnImageReportWithEmail(userId, id, params.getWarning());

    }

    @PostMapping("/reports/userReports/{id}/silence")
    public Boolean silenceUserReport(@RequestAttribute Long userId,
                                     @PathVariable Long id,
                                     @ModelAttribute SilenceAndBlockUserParamsDto params) throws PermissionException,
            InstanceNotFoundException {

        return adminService.silenceUserReport(userId, id, params.getUntil());

    }

    @PostMapping("/reports/imageReports/{id}/silence")
    public Boolean silenceImageReport(@RequestAttribute Long userId,
                                     @PathVariable Long id,
                                     @ModelAttribute SilenceAndBlockUserParamsDto params) throws PermissionException,
            InstanceNotFoundException {

        return adminService.silenceImageReport(userId, id, params.getUntil());

    }

    @PostMapping("/reports/userReports/{id}/block")
    public Boolean blockUserReport(@RequestAttribute Long userId,
                                     @PathVariable Long id,
                                     @ModelAttribute SilenceAndBlockUserParamsDto params) throws PermissionException,
            InstanceNotFoundException {

        return adminService.blockUserReport(userId, id, params.getUntil());

    }

    @PostMapping("/reports/imageReports/{id}/block")
    public Boolean blockImageReport(@RequestAttribute Long userId,
                                   @PathVariable Long id,
                                   @ModelAttribute SilenceAndBlockUserParamsDto params) throws PermissionException,
            InstanceNotFoundException {

        return adminService.blockImageReport(userId, id, params.getUntil());

    }

    @PutMapping("/reports/userReports/{id}/markAsResolved")
    public Boolean markUserReportAsResolved(@RequestAttribute Long userId, @PathVariable Long id)
            throws PermissionException, InstanceNotFoundException, ReportAlreadyResolvedException {

        return adminService.markUserReportAsResolved(userId, id);

    }

    @PutMapping("/reports/imageReports/{id}/markAsResolved")
    public Boolean markImageReportAsResolved(@RequestAttribute Long userId, @PathVariable Long id)
            throws PermissionException, InstanceNotFoundException, ReportAlreadyResolvedException {

        return adminService.markImageReportAsResolved(userId, id);

    }

    @GetMapping("/reports/userPenalty/{id}")
    public UserPenaltyDto findUserPenaltyByUserId(@RequestAttribute Long userId, @PathVariable Long id)
            throws PermissionException, InstanceNotFoundException {

        return toUserPenaltyDto(adminService.findUserPenaltyByUserId(userId, id));

    }

    @PutMapping("/reports/userPenalty/{id}/removeSilence")
    public Boolean removeSilenceFromUser(@RequestAttribute Long userId, @PathVariable Long id)
            throws PermissionException, InstanceNotFoundException {

        return adminService.removeSilenceFromUser(userId, id);

    }

    @PutMapping("/reports/userPenalty/{id}/removeBlock")
    public Boolean removeBlockFromUser(@RequestAttribute Long userId, @PathVariable Long id)
            throws PermissionException, InstanceNotFoundException {

        return adminService.removeBlockFromUser(userId, id);

    }

    @PostMapping("/reports/{id}/silenceUser")
    public Boolean silenceUser(@RequestAttribute Long userId,
                               @PathVariable Long id,
                               @ModelAttribute SilenceAndBlockUserParamsDto params)
            throws PermissionException, InstanceNotFoundException {

        return adminService.silenceUser(userId, id, params.getUntil());

    }

    @PostMapping("/reports/{id}/blockUser")
    public Boolean blockUser(@RequestAttribute Long userId,
                               @PathVariable Long id,
                               @ModelAttribute SilenceAndBlockUserParamsDto params)
            throws PermissionException, InstanceNotFoundException {

        return adminService.blockUser(userId, id, params.getUntil());

    }

    @GetMapping("/verificationRequests")
    public BlockDto<UserDto> findVerificationRequests(
            @RequestAttribute Long userId,
            @RequestParam(defaultValue = "0") int page) throws PermissionException, InstanceNotFoundException {

        Block<User> userBlock = adminService.findVerificationRequests(userId, page, 10);

        return new BlockDto<>(toUserDtos(userBlock.getItems()), userBlock.getExistMoreItems());

    }

    @PutMapping("/verificationRequests/accept")
    public Boolean acceptVerificationRequest(@RequestAttribute Long userId, @RequestBody ResolveRequestParamsDto params)
            throws PermissionException, InstanceNotFoundException {

        return adminService.acceptVerificationRequest(userId, params.getUserRequestingId());

    }

    @PutMapping("/verificationRequests/reject")
    public Boolean rejectVerificationRequest(@RequestAttribute Long userId, @RequestBody ResolveRequestParamsDto params)
            throws PermissionException, InstanceNotFoundException {

        return adminService.rejectVerificationRequest(userId, params.getUserRequestingId());

    }

    @GetMapping("/verificationRequests/exists/{id}")
    public Boolean hasBrandRequestedVerification(@RequestAttribute Long userId, @PathVariable Long id)
            throws PermissionException, InstanceNotFoundException {

        return adminService.hasBrandRequestedVerification(userId, id);

    }

}
