package backend.model.services;

import backend.model.entities.*;

import backend.model.exceptions.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

public interface AdminService {

    Category createCategory(String name, Boolean active) throws DuplicateInstanceException;

    List<Category> findAllCategories();

    List<Category> findActiveCategories(Boolean active);

    Category updateCategoryStatus(Long id, String name, Boolean status) throws InstanceNotFoundException;

    Category findCategoryById(Long id) throws InstanceNotFoundException;

    Long getCategoryNumTimesUsed(Long userId, Long categoryId) throws InstanceNotFoundException, PermissionException,
            HiddenImageException;

    Block<UserReport> findUserReports(Long userLoggedId, int page, int size)
            throws InstanceNotFoundException, PermissionException;

    UserReport findUserReportById(Long userLoggedId, Long userReportId)
            throws InstanceNotFoundException, PermissionException;

    Block<ImageReport> findImageReports(Long userLoggedId, int page, int size)
            throws InstanceNotFoundException, PermissionException;

    ImageReport findImageReportById(Long userLoggedId, Long imageReportId)
            throws InstanceNotFoundException, PermissionException;

    void warnUserReportWithEmail(Long userLoggedId, Long userReportId, String warning)
            throws InstanceNotFoundException, PermissionException, IOException;

    void warnImageReportWithEmail(Long userLoggedId, Long imageReportId, String warning)
            throws InstanceNotFoundException, PermissionException, IOException;

    Boolean silenceUserReport(Long userLoggedId, Long userReportId, LocalDate silencedUntil)
            throws InstanceNotFoundException, PermissionException;

    Boolean silenceImageReport(Long userLoggedId, Long imageReportId, LocalDate silencedUntil)
            throws InstanceNotFoundException, PermissionException;

    Boolean blockUserReport(Long userLoggedId, Long userReportId, LocalDate blockedUntil)
            throws InstanceNotFoundException, PermissionException;

    Boolean blockImageReport(Long userLoggedId, Long imageReportId, LocalDate blockedUntil)
            throws InstanceNotFoundException, PermissionException;

    Boolean markUserReportAsResolved(Long userLoggedId, Long userReportId)
            throws InstanceNotFoundException, PermissionException, ReportAlreadyResolvedException;

    Boolean markImageReportAsResolved(Long userLoggedId, Long imageReportId)
            throws InstanceNotFoundException, PermissionException, ReportAlreadyResolvedException;

    UserPenalty findUserPenaltyByUserId(Long userLoggedId, Long userId)
            throws InstanceNotFoundException, PermissionException;

    Boolean removeSilenceFromUser(Long userLoggedId, Long userId) throws InstanceNotFoundException, PermissionException;

    Boolean removeBlockFromUser(Long userLoggedId, Long userId) throws InstanceNotFoundException, PermissionException;

    Boolean silenceUser(Long userLoggedId, Long userId, LocalDate silencedUntil)
            throws InstanceNotFoundException, PermissionException;

    Boolean blockUser(Long userLoggedId, Long userId, LocalDate blockedUntil)
            throws InstanceNotFoundException, PermissionException;

    Block<User> findVerificationRequests(Long userLoggedId, int page, int size)
            throws InstanceNotFoundException, PermissionException;

    Boolean acceptVerificationRequest(Long userLoggedId, Long brandId)
            throws InstanceNotFoundException, PermissionException;

    Boolean rejectVerificationRequest(Long userLoggedId, Long brandId)
            throws InstanceNotFoundException, PermissionException;

    Boolean hasBrandRequestedVerification(Long userLoggedId, Long brandId)
            throws InstanceNotFoundException, PermissionException;

    void establishPublicationTimes();

}
