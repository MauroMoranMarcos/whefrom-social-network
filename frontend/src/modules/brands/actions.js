import * as actionTypes from './actionTypes';
import backend from '../../backend';
import {searchUsers} from "../search/actions";

const uploadRewardCompleted = lastRewardUploaded => ({
    type: actionTypes.UPLOAD_REWARD_COMPLETED,
    lastRewardUploaded
});

export const uploadReward = (formData, onSuccess, onErrors) => dispatch =>
    backend.brandService.uploadReward(formData,
        lastRewardUploaded => {
            dispatch(uploadRewardCompleted(lastRewardUploaded));
            onSuccess();
        },
        onErrors);

const hideRewardCompleted = () => ({
    type: actionTypes.HIDE_REWARD_COMPLETED,
});

export const hideReward = (rewardId, onSuccess, onErrors) => dispatch =>
    backend.brandService.hideReward(rewardId,
        () => {
            dispatch(hideRewardCompleted());
            onSuccess();
        },
        onErrors);

const showRewardCompleted = () => ({
    type: actionTypes.SHOW_REWARD_COMPLETED,
});

export const showReward = (rewardId, onSuccess, onErrors) => dispatch =>
    backend.brandService.showReward(rewardId,
        () => {
            dispatch(showRewardCompleted());
            onSuccess();
        },
        onErrors);

const deleteRewardCompleted = () => ({
    type: actionTypes.DELETE_REWARD_COMPLETED,
});

export const deleteReward = (rewardId, onSuccess, onErrors) => dispatch =>
    backend.brandService.deleteReward(rewardId,
        () => {
            dispatch(deleteRewardCompleted());
            onSuccess();
        },
        onErrors);

const findRewardByIdCompleted = reward => ({
    type: actionTypes.FIND_REWARD_BY_ID_COMPLETED,
    reward
});

export const findRewardById = (id, userLoggedId) => dispatch => {
    backend.brandService.findByRewardId(id, userLoggedId,
        reward => dispatch(findRewardByIdCompleted(reward)));
}

export const clearReward = () => ({
    type: actionTypes.CLEAR_REWARD
});

const clearRewardsSearch = () => ({
    type: actionTypes.CLEAR_REWARD_SEARCH
});

const findRewardsCompleted = rewardSearch => ({
    type: actionTypes.FIND_REWARDS_COMPLETED,
    rewardSearch
});

export const findRewards = criteria => dispatch => {

    dispatch(clearRewardsSearch());
    backend.brandService.findRewards(criteria,
        result => dispatch(findRewardsCompleted({criteria, result})));

}

const clearRewardsLastUnits = () => ({
    type: actionTypes.CLEAR_REWARDS_LAST_UNITS
});

const findRewardsLastUnitsCompleted = rewardsLastUnits => ({
    type: actionTypes.FIND_REWARDS_LAST_UNITS_COMPLETED,
    rewardsLastUnits
});

export const findRewardsLastUnits = criteria => dispatch => {

    dispatch(clearRewardsLastUnits());
    backend.brandService.findRewards(criteria,
        result => dispatch(findRewardsLastUnitsCompleted({criteria, result})));

}

export const previousFindRewardsResultPage = criteria =>
    findRewards({...criteria, page: criteria.page - 1});

export const nextFindRewardsResultPage = criteria =>
    findRewards({...criteria, page: criteria.page + 1});

const claimRewardCompleted = () => ({
    type: actionTypes.CLAIM_REWARD_COMPLETED,
});

export const claimReward = (rewardId, onSuccess, onErrors) => dispatch =>
    backend.brandService.claimReward(rewardId,
        () => {
            dispatch(claimRewardCompleted());
            if (typeof onSuccess === 'function') {
                onSuccess();
            }
        },
        onErrors);

const isRewardClaimedByUserCompleted = isRewardClaimedByUser => ({
    type: actionTypes.IS_REWARD_CLAIMED_BY_USER_COMPLETED,
    isRewardClaimedByUser
});

export const clearIsRewardClaimedByUser = () => ({
    type: actionTypes.CLEAR_IS_REWARD_CLAIMED_BY_USER
});

export const isRewardClaimedByUser = (rewardId, onSuccess, onErrors) => dispatch => {

    dispatch(clearIsRewardClaimedByUser());
    backend.brandService.isRewardClaimedByUser(rewardId,
        isRewardClaimedByUser => {
            dispatch(isRewardClaimedByUserCompleted(isRewardClaimedByUser));
            if (typeof onSuccess === 'function') {
                onSuccess(isRewardClaimedByUser);
            }
        },
        onErrors);

}

const clearUsersThatClaimedReward = () => ({
    type: actionTypes.CLEAR_USERS_THAT_CLAIMED_REWARD
});

const findUsersThatClaimedRewardCompleted = usersThatClaimedReward => ({
    type: actionTypes.FIND_USERS_THAT_CLAIMED_REWARD_COMPLETED,
    usersThatClaimedReward
});

export const findUsersThatClaimedReward = (criteria, onSuccess, onErrors) => dispatch => {

    dispatch(clearUsersThatClaimedReward());
    backend.brandService.findUsersThatClaimedReward(criteria,
        result => {
            dispatch(findUsersThatClaimedRewardCompleted({criteria, result}));
            onSuccess();
        },
        onErrors);

}

export const previousFindUsersThatClaimedRewardResultPage = criteria =>
    findUsersThatClaimedReward({...criteria, page: criteria.page - 1});

export const nextFindUsersThatClaimedRewardResultPage = criteria =>
    findUsersThatClaimedReward({...criteria, page: criteria.page + 1});

const getNumPublicationsWithBrandCompleted = () => ({
    type: actionTypes.GET_NUM_PUBLICATIONS_WITH_BRAND_COMPLETED
});

export const getNumPublicationsWithBrand = (brandId, onSuccess, onErrors) => dispatch => {

    backend.brandService.getNumPublicationsWithBrand(brandId,
        numPublicationsWithBrand => {
            dispatch(getNumPublicationsWithBrandCompleted());
            onSuccess(numPublicationsWithBrand);
        },
        onErrors);

}

const requestVerificationCompleted = () => ({
    type: actionTypes.REQUEST_VERIFICATION_COMPLETED,
});

export const requestVerification = (onSuccess, onErrors) => dispatch =>
    backend.brandService.requestVerification(
        () => {
            dispatch(requestVerificationCompleted());
            onSuccess();
        },
        onErrors);

const hasBrandRequestedVerificationCompleted = () => ({
    type: actionTypes.HAS_BRAND_REQUESTED_VERIFICATION_COMPLETED,
});

export const hasBrandRequestedVerification = (onSuccess, onErrors) => dispatch =>
    backend.brandService.hasBrandRequestedVerification(
        hasRequestedVerification => {
            dispatch(hasBrandRequestedVerificationCompleted);
            onSuccess(hasRequestedVerification);
        },
        onErrors);
