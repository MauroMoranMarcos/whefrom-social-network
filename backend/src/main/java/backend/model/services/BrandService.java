package backend.model.services;

import backend.model.entities.Reward;
import backend.model.entities.User;
import backend.model.exceptions.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;

public interface BrandService {

    void signUp(User user) throws DuplicateInstanceException;

    User login(String userName, String password) throws IncorrectLoginException;

    User loginFromId(Long id) throws InstanceNotFoundException;

    Reward uploadReward(String name, String description, LocalDate endDate, Long pointsCost,
                        Long publicationsNeeded, Long stock, byte[] imgFile, Long brandId)
            throws InstanceNotFoundException, PermissionException, InvalidEndDateException, BrandNotVerifiedException;

    Boolean hideReward(Long rewardId, Long brandId)
            throws InstanceNotFoundException, PermissionException, RewardAlreadyHiddenException;

    Boolean showReward(Long rewardId, Long brandId)
            throws InstanceNotFoundException, PermissionException, RewardNotHiddenException;

    Boolean deleteReward(Long rewardId, Long brandId) throws InstanceNotFoundException, PermissionException;

    Reward findRewardById(Long rewardId, Long userLoggedId) throws InstanceNotFoundException, HiddenRewardException;

    Block<Reward> findRewards(Long brandId, Long userLoggedId, String filterType, Boolean showOnlyClaimable,
                              int page, int size) throws InstanceNotFoundException, PermissionException, HiddenImageException;

    Long claimReward(Long userId, Long rewardId)
            throws InstanceNotFoundException, RewardAlreadyClaimedException, RewardNotClaimableException, IOException, PermissionException, HiddenImageException;

    Boolean isRewardClaimedByUser(Long userId, Long rewardId) throws InstanceNotFoundException;

    Block<User>  findUsersThatClaimedReward(Long brandId, Long rewardId, int page, int size)
            throws InstanceNotFoundException, PermissionException;

    Long getNumPublicationsWithBrand(Long userLoggedId, Long brandId) throws InstanceNotFoundException, PermissionException, HiddenImageException;

    Long requestVerification(Long brandId) throws InstanceNotFoundException, PermissionException,
            VerificationRequestAlreadyExists;

    Boolean hasBrandRequestedVerification(Long brandId) throws InstanceNotFoundException, PermissionException;

}