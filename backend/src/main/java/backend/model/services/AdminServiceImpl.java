package backend.model.services;

import backend.model.entities.*;
import backend.model.exceptions.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private final String SENDER_EMAIL = "tfgwhefrom@gmail.com";
    private Properties properties = new Properties();
    private InputStream inputStream = null;

    @Autowired
    private ImageService imageService;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private CategoryDao categoryDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private ImageDao imageDao;

    @Autowired
    private UserReportDao userReportDao;

    @Autowired
    private ImageReportDao imageReportDao;

    @Autowired
    private VerificationRequestDao verificationRequestDao;

    @Autowired
    private PermissionChecker permissionChecker;

    @Override
    public Category createCategory(String name, Boolean active) throws DuplicateInstanceException {

        if (categoryDao.existsByName(name)) {
            throw new DuplicateInstanceException("project.entities.category", name);
        }

        Category category = Category.createNew(name, active);

        categoryDao.save(category);

        return category;

    }

    @Override
    public List<Category> findAllCategories() {

        Iterable<Category> categories = categoryDao.findAll(Sort.by(Sort.Direction.ASC, "name"));
        List<Category> categoriesAsList = new ArrayList<>();

        categories.forEach(c -> categoriesAsList.add(c));

        return categoriesAsList;

    }

    @Override
    public List<Category> findActiveCategories(Boolean active) {

        Iterable<Category> categories = categoryDao.findByActiveOrderByNameAsc(active);
        List<Category> categoriesAsList = new ArrayList<>();

        categories.forEach(c -> categoriesAsList.add(c));

        return categoriesAsList;

    }

    @Override
    public Category updateCategoryStatus(Long id, String name, Boolean status) throws InstanceNotFoundException {

        Optional<Category> categoryopt = categoryDao.findById(id);

        if (!categoryopt.isPresent()) {
            throw new InstanceNotFoundException("id", id);
        }

        Category category = categoryopt.get();

        category.updateCategory(name, status);

        return category;

    }

    @Override
    public Category findCategoryById(Long id) throws InstanceNotFoundException {

        Optional<Category> category = categoryDao.findById(id);

        if (!category.isPresent()) {
            throw new InstanceNotFoundException("project.entities.category", id);
        }

        return category.get();

    }

    @Override
    public Long getCategoryNumTimesUsed(Long userId, Long categoryId)
            throws InstanceNotFoundException, PermissionException, HiddenImageException {

        Long counter = 0L;

        User admin = permissionChecker.checkUser(userId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        Optional<Category> category = categoryDao.findById(categoryId);

        if (!category.isPresent()) {
            throw new InstanceNotFoundException("project.entities.category", categoryId);
        }

        List<Image> allImages = (List<Image>) imageDao.findAll();

        for (Image image : allImages) {
            List<Tag> tagsFromImage = imageService.findImageTags(image.getId(), userId);

            for (Tag tag : tagsFromImage) {
                if (tag.getCategory().equals(category.get())) {
                    counter += 1L;
                    break;
                }
            }
        }

        return counter;

    }

    @Override
    public Block<UserReport> findUserReports(Long userLoggedId, int page, int size) throws InstanceNotFoundException,
            PermissionException {

        User admin = permissionChecker.checkUser(userLoggedId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        Slice<UserReport> slice = userReportDao.find(page, size);

        return new Block<>(slice.getContent(), slice.hasNext());

    }

    @Override
    public UserReport findUserReportById(Long userLoggedId, Long userReportId) throws InstanceNotFoundException,
            PermissionException {

        User admin = permissionChecker.checkUser(userLoggedId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        Optional<UserReport> userReportOpt = userReportDao.findById(userReportId);

        if (!userReportOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.userReport", userReportId);
        }

        return userReportOpt.get();

    }

    @Override
    public Block<ImageReport> findImageReports(Long userLoggedId, int page, int size) throws InstanceNotFoundException,
            PermissionException {

        User admin = permissionChecker.checkUser(userLoggedId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        Slice<ImageReport> slice = imageReportDao.find(page, size);

        return new Block<>(slice.getContent(), slice.hasNext());

    }

    @Override
    public ImageReport findImageReportById(Long userLoggedId, Long imageReportId) throws InstanceNotFoundException,
            PermissionException {

        User admin = permissionChecker.checkUser(userLoggedId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        Optional<ImageReport> imageReportOpt = imageReportDao.findById(imageReportId);

        if (!imageReportOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.imageReport", imageReportId);
        }

        return imageReportOpt.get();

    }

    @Override
    public void warnUserReportWithEmail(Long userLoggedId, Long userReportId, String warning)
            throws InstanceNotFoundException, PermissionException, IOException {

        User admin = permissionChecker.checkUser(userLoggedId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        Optional<UserReport> userReportOpt = userReportDao.findById(userReportId);

        if (!userReportOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.userReport", userReportId);
        }

        User userReported = userReportOpt.get().getUserReported();

        sendEmailToWarnUser(userReported.getEmail(), warning);

    }

    @Override
    public void warnImageReportWithEmail(Long userLoggedId, Long imageReportId, String warning) throws InstanceNotFoundException, PermissionException, IOException {

        User admin = permissionChecker.checkUser(userLoggedId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        Optional<ImageReport> imageReportOpt = imageReportDao.findById(imageReportId);

        if (!imageReportOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.imageReport", imageReportId);
        }

        User userReported = imageReportOpt.get().getImageReported().getUser();

        sendEmailToWarnUser(userReported.getEmail(), warning);

    }

    @Override
    public Boolean silenceUserReport(Long userLoggedId, Long userReportId, LocalDate silencedUntil)
            throws InstanceNotFoundException, PermissionException {

        User admin = permissionChecker.checkUser(userLoggedId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        Optional<UserReport> userReportOpt = userReportDao.findById(userReportId);

        if (!userReportOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.userReport", userReportId);
        }

        User userReported = userReportOpt.get().getUserReported();
        UserPenalty userPenalty = userReported.getUserPenalty();

        userReported.silence();
        userPenalty.silenceUntil(silencedUntil);

        return userReported.getSilenced();

    }

    @Override
    public Boolean silenceImageReport(Long userLoggedId, Long imageReportId, LocalDate silencedUntil)
            throws InstanceNotFoundException, PermissionException {

        User admin = permissionChecker.checkUser(userLoggedId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        Optional<ImageReport> imageReportOpt = imageReportDao.findById(imageReportId);

        if (!imageReportOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.imageReport", imageReportId);
        }

        User userReported = imageReportOpt.get().getImageReported().getUser();
        UserPenalty userPenalty = userReported.getUserPenalty();

        userReported.silence();
        userPenalty.silenceUntil(silencedUntil);

        return userReported.getSilenced();

    }

    @Override
    public Boolean blockUserReport(Long userLoggedId, Long userReportId, LocalDate blockedUntil)
            throws InstanceNotFoundException, PermissionException {

        User admin = permissionChecker.checkUser(userLoggedId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        Optional<UserReport> userReportOpt = userReportDao.findById(userReportId);

        if (!userReportOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.userReport", userReportId);
        }

        User userReported = userReportOpt.get().getUserReported();
        UserPenalty userPenalty = userReported.getUserPenalty();

        userReported.block();
        userPenalty.blockUntil(blockedUntil);

        return userReported.getBlocked();

    }

    @Override
    public Boolean blockImageReport(Long userLoggedId, Long imageReportId, LocalDate blockedUntil)
            throws InstanceNotFoundException, PermissionException {

        User admin = permissionChecker.checkUser(userLoggedId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        Optional<ImageReport> imageReportOpt = imageReportDao.findById(imageReportId);

        if (!imageReportOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.imageReport", imageReportId);
        }

        User userReported = imageReportOpt.get().getImageReported().getUser();
        UserPenalty userPenalty = userReported.getUserPenalty();

        userReported.block();
        userPenalty.blockUntil(blockedUntil);

        return userReported.getBlocked();

    }

    @Override
    public Boolean markUserReportAsResolved(Long userLoggedId, Long userReportId) throws InstanceNotFoundException,
            PermissionException, ReportAlreadyResolvedException {

        User admin = permissionChecker.checkUser(userLoggedId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        Optional<UserReport> userReportOpt = userReportDao.findById(userReportId);

        if (!userReportOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.userReport", userReportId);
        }

        UserReport userReport = userReportOpt.get();

        if (userReport.getResolved()) {
            throw new ReportAlreadyResolvedException();
        }

        userReport.resolve();

        return userReport.getResolved();

    }

    @Override
    public Boolean markImageReportAsResolved(Long userLoggedId, Long imageReportId) throws InstanceNotFoundException, PermissionException, ReportAlreadyResolvedException {

        User admin = permissionChecker.checkUser(userLoggedId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        Optional<ImageReport> imageReportOpt = imageReportDao.findById(imageReportId);

        if (!imageReportOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.userReport", imageReportId);
        }

        ImageReport imageReport = imageReportOpt.get();

        if (imageReport.getResolved()) {
            throw new ReportAlreadyResolvedException();
        }

        imageReport.resolve();

        return imageReport.getResolved();

    }

    @Override
    public UserPenalty findUserPenaltyByUserId(Long userLoggedId, Long userId)
            throws InstanceNotFoundException, PermissionException {

        User admin = permissionChecker.checkUser(userLoggedId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        User user = permissionChecker.checkUser(userId);

        return user.getUserPenalty();

    }

    @Override
    public Boolean removeSilenceFromUser(Long userLoggedId, Long userId) throws InstanceNotFoundException, PermissionException {

        User admin = permissionChecker.checkUser(userLoggedId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        User user = permissionChecker.checkUser(userId);

        UserPenalty userPenalty = findUserPenaltyByUserId(userLoggedId, userId);

        userPenalty.resetSilence();
        user.unsilence();

        return user.getSilenced();

    }

    @Override
    public Boolean removeBlockFromUser(Long userLoggedId, Long userId) throws InstanceNotFoundException, PermissionException {

        User admin = permissionChecker.checkUser(userLoggedId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        User user = permissionChecker.checkUser(userId);

        UserPenalty userPenalty = findUserPenaltyByUserId(userLoggedId, userId);

        userPenalty.resetBlock();
        user.unblock();

        return user.getSilenced();

    }

    @Override
    public Boolean silenceUser(Long userLoggedId, Long userId, LocalDate silencedUntil) throws InstanceNotFoundException, PermissionException {

        User admin = permissionChecker.checkUser(userLoggedId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        User user = permissionChecker.checkUser(userId);

        UserPenalty userPenalty = user.getUserPenalty();

        user.silence();
        userPenalty.silenceUntil(silencedUntil);

        return user.getSilenced();

    }

    @Override
    public Boolean blockUser(Long userLoggedId, Long userId, LocalDate blockedUntil) throws InstanceNotFoundException, PermissionException {

        User admin = permissionChecker.checkUser(userLoggedId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        User user = permissionChecker.checkUser(userId);

        UserPenalty userPenalty = user.getUserPenalty();

        user.block();
        userPenalty.blockUntil(blockedUntil);

        return user.getBlocked();

    }

    @Override
    public Block<User> findVerificationRequests(Long userLoggedId, int page, int size)
            throws InstanceNotFoundException, PermissionException {

        User admin = permissionChecker.checkUser(userLoggedId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        Slice<User> slice = verificationRequestDao.findVerificationRequests(page, size);

        return new Block<>(slice.getContent(), slice.hasNext());

    }

    @Override
    public Boolean acceptVerificationRequest(Long userLoggedId, Long brandId)
            throws InstanceNotFoundException, PermissionException {

        User admin = permissionChecker.checkUser(userLoggedId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        User brand = permissionChecker.checkUser(brandId);

        if (!isBrand(brand.getRole())) {
            throw new PermissionException();
        }

        Optional<VerificationRequest> verificationRequestOpt = verificationRequestDao.findByBrand(brand);

        if (!verificationRequestOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.verificationRequest", brandId);
        }

        brand.verify();

        VerificationRequest verificationRequest = verificationRequestOpt.get();
        verificationRequestDao.delete(verificationRequest);

        return verificationRequestDao.existsByBrand(brand);

    }

    @Override
    public Boolean rejectVerificationRequest(Long userLoggedId, Long brandId)
            throws InstanceNotFoundException, PermissionException {

        User admin = permissionChecker.checkUser(userLoggedId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        User brand = permissionChecker.checkUser(brandId);

        if (!isBrand(brand.getRole())) {
            throw new PermissionException();
        }

        Optional<VerificationRequest> verificationRequestOpt = verificationRequestDao.findByBrand(brand);

        if (!verificationRequestOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.verificationRequest", brandId);
        }

        brand.unverify();

        VerificationRequest verificationRequest = verificationRequestOpt.get();
        verificationRequestDao.delete(verificationRequest);

        return verificationRequestDao.existsByBrand(brand);

    }

    @Override
    public Boolean hasBrandRequestedVerification(Long userLoggedId, Long brandId)
            throws InstanceNotFoundException, PermissionException {

        User admin = permissionChecker.checkUser(userLoggedId);

        if (!isAdmin(admin.getRole())) {
            throw new PermissionException();
        }

        User brand = permissionChecker.checkUser(brandId);

        if (!isBrand(brand.getRole())) {
            throw new PermissionException();
        }

        return verificationRequestDao.existsByBrand(brand);

    }

    @Override
    @Scheduled(cron = "0 0 0 * * ?", zone = "Europe/Madrid")
    public void establishPublicationTimes() {

        Iterable<User> users = userDao.findAll();

        for (User user : users) {
            if (!isAdmin(user.getRole())) {
                UserPoints userPoints = user.getUserPoints();

                userPoints.resetPublicationTime();
                userPoints.resetPublishedToday();
            }
        }

    }

    @Scheduled(fixedRate = 60000)  // Este método se ejecutará cada minuto
    public void sendEmailsAtScheduledTime() throws IOException {

        Iterable<User> users = userDao.findAll();

        for (User user : users) {
            if (user.getUserSettings().getNotifyMe()) {
                LocalDateTime now = LocalDateTime.now();
                UserPoints userPoints = user.getUserPoints();
                LocalDateTime publicationTime = userPoints.getPublicationTime();

                if (!userPoints.getPublishedToday() && publicationTime.getHour() == now.getHour() &&
                        publicationTime.getMinute() == now.getMinute()) {

                    sendEmailToPublishToday(user.getEmail());
                }
            }
        }
    }

    private void sendEmailToPublishToday(String to) throws IOException {

        inputStream = new FileInputStream("src/main/resources/messages_en.properties");
        properties.load(inputStream);

        SimpleMailMessage mailMessage = new SimpleMailMessage();

        String mailBody = properties.getProperty("project.messages.mail.notifyUserToPublishBody");
        String mailSubject = properties.getProperty("project.messages.mail.notifyUserToPublishSubject");

        mailMessage.setFrom(SENDER_EMAIL);
        mailMessage.setTo(to);
        mailMessage.setText(mailBody);
        mailMessage.setSubject(mailSubject);

        mailSender.send(mailMessage);

    }

    private void sendEmailToWarnUser(String to, String warning) throws IOException {

        inputStream = new FileInputStream("src/main/resources/messages_en.properties");
        properties.load(inputStream);

        SimpleMailMessage mailMessage = new SimpleMailMessage();

        String mailBody = properties.getProperty("project.messages.mail.reportWarningBody");
        String mailSubject = properties.getProperty("project.messages.mail.reportWarningSubject");

        mailMessage.setFrom(SENDER_EMAIL);
        mailMessage.setTo(to);
        mailMessage.setText(mailBody + "\n\n" + warning);
        mailMessage.setSubject(mailSubject);

        mailSender.send(mailMessage);

    }

    private boolean isAdmin(User.RoleType role) {
        return Objects.equals(role, User.RoleType.ADMIN_USER);
    }

    private boolean isBrand(User.RoleType role) {
        return Objects.equals(role, User.RoleType.BRAND_USER);
    }

}
