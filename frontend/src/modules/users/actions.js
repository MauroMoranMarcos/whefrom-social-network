import * as actionTypes from './actionTypes';
import backend from '../../backend';
import {act} from "react-dom/test-utils";

const signUpCompleted = authenticatedUser => ({
    type: actionTypes.SIGN_UP_COMPLETED,
    authenticatedUser
});

export const signUp = (user, onSuccess, onErrors, reauthenticationCallback) => dispatch =>
    backend.userService.signUp(user,
        authenticatedUser => {
            dispatch(signUpCompleted(authenticatedUser));
            onSuccess();
        },
        onErrors,
        reauthenticationCallback);

export const addProfilePicture = (formData, userId, onSuccess, onErrors) => dispatch =>
    backend.userService.addProfilePicture(formData, userId,
        user => {
            dispatch(updateProfileCompleted(user));
            onSuccess();
        },
        onErrors);

const loginCompleted = authenticatedUser => ({
    type: actionTypes.LOGIN_COMPLETED,
    authenticatedUser
});

export const login = (userName, password, onSuccess, onErrors, reauthenticationCallback) => dispatch =>
    backend.userService.login(userName, password,
        authenticatedUser => {
            dispatch(loginCompleted(authenticatedUser));
            onSuccess();
        },
        onErrors,
        reauthenticationCallback
    );

export const tryLoginFromServiceToken = reauthenticationCallback => dispatch =>
    backend.userService.tryLoginFromServiceToken(
        authenticatedUser => {
            if (authenticatedUser) {
                dispatch(loginCompleted(authenticatedUser));
            }
        },
        reauthenticationCallback
    );

export const logout = () => {

    backend.userService.logout();

    return {type: actionTypes.LOGOUT};

};

export const updateProfileCompleted = user => ({
    type: actionTypes.UPDATE_PROFILE_COMPLETED,
    user
})

export const updateProfile = (user, onSuccess, onErrors) => dispatch =>
    backend.userService.updateProfile(user,
        user => {
            dispatch(updateProfileCompleted(user));
            onSuccess();
        },
        onErrors);

export const updateUserSettingsCompleted = userSettings => ({
    type: actionTypes.UPDATE_USER_SETTINGS_COMPLETED,
    userSettings
})

export const updateUserSettings = (userId, userSettings, onSuccess, onErrors) => dispatch =>
    backend.userService.updateUserSettings(userId, userSettings,
        userSettings => {
            dispatch(updateUserSettingsCompleted(userSettings));
            onSuccess();
        },
        onErrors);

export const changePasswordCompleted = () => ({
    type: actionTypes.CHANGE_PASSWORD_COMPLETED
});

export const changePassword = (userId, oldPassword, newPassword, onSuccess, onErrors) => dispatch => {
    backend.userService.changePassword(userId, oldPassword, newPassword,
        () => {
            dispatch(changePasswordCompleted());
            onSuccess();
        },
        onErrors);
}

export const sendVerificationCode = (email, onSuccess, onErrors) => dispatch =>
    backend.userService.sendVerificationCode(email,
        () => {
            dispatch({
                type: actionTypes.SEND_VERIFICATION_CODE_COMPLETED
            });
            onSuccess();
        },
        onErrors);

export const enterVerificationCode = (email, verificationCode, onSuccess, onErrors) => dispatch =>
    backend.userService.enterVerificationCode(email, verificationCode,
        () => {
            dispatch({
                type: actionTypes.ENTER_VERIFICATION_CODE_COMPLETED
            });
            onSuccess();
        },
        onErrors);

export const restorePassword = (email, verificationCode, newPassword, onSuccess, onErrors) => dispatch =>
    backend.userService.restorePassword(email, verificationCode, newPassword, onSuccess, onErrors);


const findUserFollowRequestsCompleted = followRequests => ({
    type: actionTypes.FIND_USER_FOLLOW_REQUESTS_COMPLETED,
    followRequests
});

const clearUserFollowRequests = () => ({
    type: actionTypes.CLEAR_USER_FOLLOW_REQUESTS
});

export const findUserFollowRequests = (userId, criteria) => dispatch => {

    dispatch(clearUserFollowRequests());
    backend.userService.findUserFollowRequests(userId, criteria,
        result => dispatch(findUserFollowRequestsCompleted({criteria, result})));

}

export const previousFindUserFollowRequestsResultPage = (userId, criteria) =>
    findUserFollowRequests(userId, {...criteria, page: criteria.page - 1});

export const nextFindUserFollowRequestsResultPage = (userId, criteria) =>
    findUserFollowRequests(userId, {...criteria, page: criteria.page + 1});

const getUserNumFollowRequestsCompleted = numFollowRequests => ({
    type: actionTypes.GET_USER_NUM_FOLLOW_REQUESTS,
    numFollowRequests
});

const clearUserNumFollowRequests = () => ({
    type: actionTypes.CLEAR_USER_NUM_FOLLOW_REQUESTS
});

export const getUserNumFollowRequests = userId => dispatch => {

    dispatch(clearUserNumFollowRequests());
    backend.userService.getUserNumFollowRequests(userId,
        numFollowRequests => dispatch(getUserNumFollowRequestsCompleted(numFollowRequests)));

}

const acceptFollowRequestCompleted = () => ({
    type: actionTypes.ACCEPT_FOLLOW_REQUEST_COMPLETED,
});

export const acceptFollowRequest = (userId, userRequestingId, onSuccess, onErrors) => dispatch =>
    backend.userService.acceptFollowRequest(userId, userRequestingId,
        () => {
            dispatch(acceptFollowRequestCompleted());
            onSuccess();
        },
        onErrors);

const rejectFollowRequestCompleted = () => ({
    type: actionTypes.REJECT_FOLLOW_REQUEST_COMPLETED,
});

export const rejectFollowRequest = (userId, userRequestingId, onSuccess, onErrors) => dispatch =>
    backend.userService.rejectFollowRequest(userId, userRequestingId,
        () => {
            dispatch(rejectFollowRequestCompleted());
            onSuccess();
        },
        onErrors);

const dontShowUplRewardHelpCompleted = userSettings => ({
    type: actionTypes.DONT_SHOW_UPL_REWARD_COMPLETED,
    userSettings
})

export const dontShowUplRewardHelp = (userId, onSuccess, onErrors) => dispatch =>
    backend.userService.dontShowUplRewardHelp(userId,
        userSettings => {
            dispatch(dontShowUplRewardHelpCompleted(userSettings));
            if (typeof onSuccess === 'function') {
                onSuccess();
            }
        },
        onErrors);

const dontShowUplImageHelpCompleted = userSettings => ({
    type: actionTypes.DONT_SHOW_UPL_IMAGE_COMPLETED,
    userSettings
})

export const dontShowUplImageHelp = (userId, onSuccess, onErrors) => dispatch =>
    backend.userService.dontShowUplImageHelp(userId,
        userSettings => {
            dispatch(dontShowUplImageHelpCompleted(userSettings));
            if (typeof onSuccess === 'function') {
                onSuccess();
            }
        },
        onErrors);