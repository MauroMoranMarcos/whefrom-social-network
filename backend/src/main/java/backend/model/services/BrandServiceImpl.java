package backend.model.services;

import backend.model.entities.*;
import backend.model.exceptions.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class BrandServiceImpl implements BrandService {

    private final String SENDER_EMAIL = "tfgwhefrom@gmail.com";
    private Properties properties = new Properties();
    private InputStream inputStream = null;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PermissionChecker permissionChecker;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private ImageService imageService;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserSettingsDao userSettingsDao;

    @Autowired
    private UserPenaltyDao userPenaltyDao;

    @Autowired
    private RewardDao rewardDao;

    @Autowired
    private RewardClaimedDao rewardClaimedDao;

    @Autowired
    private VerificationRequestDao verificationRequestDao;

    @Override
    public void signUp(User user) throws DuplicateInstanceException {

        if (userDao.existsByUserName(user.getUserName())) {
            throw new DuplicateInstanceException("project.entities.user", user.getUserName());
        }

        user.initBrandUser(user, passwordEncoder.encode(user.getPassword()));

        userDao.save(user);
        userSettingsDao.save(user.getUserSettings());
        userPenaltyDao.save(user.getUserPenalty());

    }

    @Override
    @Transactional(readOnly = true)
    public User login(String userName, String password) throws IncorrectLoginException {

        Optional<User> user = userDao.findByUserName(userName);

        if (!user.isPresent()) {
            throw new IncorrectLoginException(userName, password);
        }

        if (!passwordEncoder.matches(password, user.get().getPassword())) {
            throw new IncorrectLoginException(userName, password);
        }

        return user.get();

    }

    @Override
    @Transactional(readOnly=true)
    public User loginFromId(Long id) throws InstanceNotFoundException {
        return permissionChecker.checkUser(id);
    }

    @Override
    public Reward uploadReward(String name, String description, LocalDate endDate, Long pointsCost,
                               Long publicationsNeeded, Long stock, byte[] imgFile, Long brandId)
            throws InstanceNotFoundException, PermissionException, InvalidEndDateException, BrandNotVerifiedException {

        User brand = permissionChecker.checkUser(brandId);

        if (!brand.getRole().equals(User.RoleType.BRAND_USER)) {
            throw new PermissionException();
        }

        if (!brand.getVerified()) {
            throw new BrandNotVerifiedException();
        }

        if (endDate.isBefore(LocalDate.now())) {
            throw new InvalidEndDateException();
        }

        Reward reward = new Reward(name, description, LocalDateTime.now(), endDate, pointsCost, publicationsNeeded,
                stock, imgFile, false, brand);

        rewardDao.save(reward);

        return reward;

    }

    @Override
    public Boolean hideReward(Long rewardId, Long brandId) throws InstanceNotFoundException, PermissionException,
            RewardAlreadyHiddenException {

        User brand = permissionChecker.checkUser(brandId);

        Optional<Reward> rewardOpt = rewardDao.findById(rewardId);

        if (!rewardOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.reward", rewardId);
        }

        Reward reward = rewardOpt.get();

        if (!brand.equals(reward.getBrand()) || !brand.getRole().equals(User.RoleType.BRAND_USER)) {
            throw new PermissionException();
        }

        if (reward.getHidden()) {
            throw new RewardAlreadyHiddenException();
        }

        reward.setHidden(true);

        return reward.getHidden();

    }

    @Override
    public Boolean showReward(Long rewardId, Long brandId) throws InstanceNotFoundException, PermissionException,
            RewardNotHiddenException {

        User brand = permissionChecker.checkUser(brandId);

        Optional<Reward> rewardOpt = rewardDao.findById(rewardId);

        if (!rewardOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.reward", rewardId);
        }

        Reward reward = rewardOpt.get();

        if (!brand.equals(reward.getBrand()) || !brand.getRole().equals(User.RoleType.BRAND_USER)) {
            throw new PermissionException();
        }

        if (!reward.getHidden()) {
            throw new RewardNotHiddenException();
        }

        reward.setHidden(false);

        return reward.getHidden();

    }

    @Override
    public Boolean deleteReward(Long rewardId, Long brandId) throws InstanceNotFoundException, PermissionException {

        User brand = permissionChecker.checkUser(brandId);

        Optional<Reward> rewardOpt = rewardDao.findById(rewardId);

        if (!rewardOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.reward", rewardId);
        }

        Reward reward = rewardOpt.get();

        if (!brand.equals(reward.getBrand()) || !brand.getRole().equals(User.RoleType.BRAND_USER)) {
            throw new PermissionException();
        }

        rewardDao.delete(reward);

        return !rewardDao.existsById(rewardId);

    }

    @Override
    public Reward findRewardById(Long rewardId, Long userLoggedId) throws InstanceNotFoundException, HiddenRewardException {

        Optional<Reward> reward = rewardDao.findById(rewardId);

        if (!reward.isPresent()) {
            throw new InstanceNotFoundException("project.entities.reward", rewardId);
        }

        if (reward.get().getHidden() && !userLoggedId.equals(reward.get().getBrand().getId())) {
            throw new HiddenRewardException();
        }

        return reward.get();

    }

    private Block<Reward> filterRewards(Slice<Reward> slice, User userLogged, Boolean showOnlyClaimable,
                                        int page, int size)
            throws PermissionException, InstanceNotFoundException, HiddenImageException {

        List<Reward> rewards = slice.getContent();

        List<Reward> rewardsFiltered = new ArrayList<>();

        if (userLogged == null || !showOnlyClaimable) {
            return new Block<>(slice.getContent(), slice.hasNext());
        }

        for (Reward reward : rewards) {
            if ((userLogged.getUserPoints().getPoints() >= reward.getPointsCost())
                    && reward.getStock() > 0
                    && reward.getEndDate().isAfter(LocalDate.now().minusDays(1))
                    && !rewardClaimedDao.existsByUserAndReward(userLogged, reward)
                    && userHasEnoughPublicationsFromBrand(userLogged, reward)) {
                rewardsFiltered.add(reward);
            }
        }

        int start = Math.min(page * size, rewardsFiltered.size());

        int end = Math.min((page + 1) * size, rewardsFiltered.size());

        List<Reward> pagedRewards = rewardsFiltered.subList(start, end);

        boolean hasNext = end < rewardsFiltered.size();

        return new Block<>(pagedRewards, hasNext);

    }

    @Override
    public Block<Reward> findRewards(Long brandId, Long userLoggedId, String filterType, Boolean showOnlyClaimable,
                                     int page, int size)
            throws InstanceNotFoundException, PermissionException, HiddenImageException {

        User brand = new User();
        User userLogged = new User();
        boolean sameBrand = false;

        if (brandId != 0) {
            brand = permissionChecker.checkUser(brandId);
        }

        if (userLoggedId != 0) {
            userLogged = permissionChecker.checkUser(userLoggedId);
        }

        if (brandId != 0 && userLoggedId != 0) {
            sameBrand = brand.equals(userLogged);
        }

        if (Objects.equals(filterType, "CREATION_DATE_DESC")) {
            Slice<Reward> slice = rewardDao.find(brandId, sameBrand, Reward.FilterType.CREATION_DATE_DESC, page, size);

            return filterRewards(slice, userLogged, showOnlyClaimable, page, size);
        }
        if (Objects.equals(filterType, "CREATION_DATE_ASC")) {
            Slice<Reward> slice = rewardDao.find(brandId, sameBrand, Reward.FilterType.CREATION_DATE_ASC, page, size);

            return filterRewards(slice, userLogged, showOnlyClaimable, page, size);
        }
        if (Objects.equals(filterType, "POINTS_COST_DESC")) {
            Slice<Reward> slice = rewardDao.find(brandId, sameBrand, Reward.FilterType.POINTS_COST_DESC, page, size);

            return filterRewards(slice, userLogged, showOnlyClaimable, page, size);
        }
        if (Objects.equals(filterType, "POINTS_COST_ASC")) {
            Slice<Reward> slice = rewardDao.find(brandId, sameBrand, Reward.FilterType.POINTS_COST_ASC, page, size);

            return filterRewards(slice, userLogged, showOnlyClaimable, page, size);
        }
        if (Objects.equals(filterType, "STOCK_DESC")) {
            Slice<Reward> slice = rewardDao.find(brandId, sameBrand, Reward.FilterType.STOCK_DESC, page, size);

            return filterRewards(slice, userLogged, showOnlyClaimable, page, size);
        }
        if (Objects.equals(filterType, "STOCK_ASC")) {
            Slice<Reward> slice = rewardDao.find(brandId, sameBrand, Reward.FilterType.STOCK_ASC, page, size);

            return filterRewards(slice, userLogged, showOnlyClaimable, page, size);
        }
        if (Objects.equals(filterType, "STOCK_ASC_ONLY_IN_STOCK")) {

            Slice<Reward> slice = rewardDao.find(brandId, sameBrand, Reward.FilterType.STOCK_ASC_ONLY_IN_STOCK, page, size);

            if (userLoggedId == 0) {
                return new Block<>(slice.getContent(), slice.hasNext());
            }

            List<Reward> rewards = slice.getContent();

            List<Reward> rewardsFiltered = new ArrayList<>();

            for (Reward reward : rewards) {
                if (reward.getEndDate().isAfter(LocalDate.now().minusDays(1))
                        && !rewardClaimedDao.existsByUserAndReward(userLogged, reward)) {
                    rewardsFiltered.add(reward);
                }

                if (rewardsFiltered.size() > 10) {
                    break;
                }
            }

            Slice<Reward> sliceModified = new SliceImpl<>(rewardsFiltered, PageRequest.of(page, size), slice.hasNext());

            return new Block<>(sliceModified.getContent(), slice.hasNext());
        }

        return null;

    }

    private Boolean userHasEnoughPublicationsFromBrand(User user, Reward reward)
            throws PermissionException, InstanceNotFoundException, HiddenImageException {

        Long numPublications = 0L;

        List<Image> images = imageService.findImagesByUserId(user.getId(), user.getId(), 0, 100000).getItems();

        for (Image image : images) {
            if (!image.getHidden()) {
                List<Tag> tags = imageService.findImageTags(image.getId(), user.getId());

                for (Tag tag : tags) {
                    if (tag.getBrand() == reward.getBrand()) {
                        numPublications += 1L;
                        break;
                    }
                }
            }
        }

        return numPublications >= reward.getPublicationsNeeded();

    }

    @Override
    public Long claimReward(Long userId, Long rewardId) throws InstanceNotFoundException, RewardAlreadyClaimedException,
            RewardNotClaimableException, IOException, PermissionException, HiddenImageException {

        User user = permissionChecker.checkUser(userId);

        Optional<Reward> rewardOpt = rewardDao.findById(rewardId);

        if (!rewardOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.reward", rewardId);
        }

        Reward reward = rewardOpt.get();
        UserPoints userPoints = user.getUserPoints();

        if (reward.getStock() <= 0 || userPoints.getPoints() < reward.getPointsCost() || reward.getHidden()
            || LocalDate.now().isAfter(reward.getEndDate()) || !userHasEnoughPublicationsFromBrand(user, reward)) {
            throw new RewardNotClaimableException();
        }

        if (rewardClaimedDao.existsByUserAndReward(user, reward)) {
            throw new RewardAlreadyClaimedException();
        }

        userPoints.setPoints(userPoints.getPoints() - reward.getPointsCost());
        reward.setStock(reward.getStock() - 1L);

        RewardClaimed rewardClaimed = new RewardClaimed(user, reward);
        rewardClaimedDao.save(rewardClaimed);

        inputStream = new FileInputStream("src/main/resources/messages_en.properties");
        properties.load(inputStream);

        SimpleMailMessage mailMessage = new SimpleMailMessage();

        String mailBody = properties.getProperty("project.messages.mail.claimRewardBody");
        String mailSubject = properties.getProperty("project.messages.mail.claimRewardSubject");

        mailMessage.setFrom(SENDER_EMAIL);
        mailMessage.setTo(user.getEmail());
        mailMessage.setText(mailBody + "\n\n" + reward.getName() + "\n" + reward.getDescription());
        mailMessage.setSubject(mailSubject);

        mailSender.send(mailMessage);

        return rewardClaimed.getId();

    }

    @Override
    public Boolean isRewardClaimedByUser(Long userId, Long rewardId) throws InstanceNotFoundException {

        User user = permissionChecker.checkUser(userId);

        Optional<Reward> rewardOpt = rewardDao.findById(rewardId);

        if (!rewardOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.reward", rewardId);
        }

        return rewardClaimedDao.existsByUserAndReward(user, rewardOpt.get());

    }

    @Override
    public Block<User> findUsersThatClaimedReward(Long brandId, Long rewardId, int page, int size)
            throws InstanceNotFoundException, PermissionException {

        User brand = permissionChecker.checkUser(brandId);

        if (brand.getRole() != User.RoleType.BRAND_USER) {
            throw new PermissionException();
        }

        Optional<Reward> rewardOpt = rewardDao.findById(rewardId);

        if (!rewardOpt.isPresent()) {
            throw new InstanceNotFoundException("project.entities.reward", rewardId);
        }

        Slice<User> slice = rewardClaimedDao.findUsersThatClaimedReward(rewardId, page, size);

        return new Block<>(slice.getContent(), slice.hasNext());

    }

    @Override
    public Long getNumPublicationsWithBrand(Long userLoggedId, Long brandId) throws InstanceNotFoundException,
            PermissionException, HiddenImageException {

        User user = permissionChecker.checkUser(userLoggedId);

        User brand = permissionChecker.checkUser(brandId);

        Long numPublications = 0L;

        List<Image> images = imageService.findImagesByUserId(user.getId(), user.getId(), 0, 100000).getItems();

        for (Image image : images) {
            if (!image.getHidden()) {
                List<Tag> tags = imageService.findImageTags(image.getId(), user.getId());

                for (Tag tag : tags) {
                    if (tag.getBrand() == brand) {
                        numPublications += 1L;
                        break;
                    }
                }
            }
        }

        return numPublications;

    }

    @Override
    public Long requestVerification(Long brandId) throws InstanceNotFoundException, PermissionException,
            VerificationRequestAlreadyExists {

        User brand = permissionChecker.checkUser(brandId);

        if (!Objects.equals(brand.getRole(), User.RoleType.BRAND_USER)) {
            throw new PermissionException();
        }

        if (verificationRequestDao.existsByBrand(brand)) {
            throw new VerificationRequestAlreadyExists();
        }

        VerificationRequest verificationRequest = new VerificationRequest(LocalDateTime.now(), brand);

        verificationRequestDao.save(verificationRequest);

        return verificationRequest.getId();

    }

    @Override
    public Boolean hasBrandRequestedVerification(Long brandId) throws InstanceNotFoundException, PermissionException {

        User brand = permissionChecker.checkUser(brandId);

        if (!Objects.equals(brand.getRole(), User.RoleType.BRAND_USER)) {
            throw new PermissionException();
        }

        return verificationRequestDao.existsByBrand(brand);

    }

}
