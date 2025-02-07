import {config, appFetch, setServiceToken, getServiceToken, removeServiceToken, setReauthenticationCallback} from './appFetch';

export const login = (userName, password, onSuccess, onErrors, reauthenticationCallback) =>
    appFetch('/users/login', config('POST', {userName, password}),
        authenticatedUser => {
            setServiceToken(authenticatedUser.serviceToken);
            setReauthenticationCallback(reauthenticationCallback);
            onSuccess(authenticatedUser);
        }, 
        onErrors);

export const tryLoginFromServiceToken = (onSuccess, reauthenticationCallback) => {

    const serviceToken = getServiceToken();

    if (!serviceToken) {
        onSuccess();
        return;
    }

    setReauthenticationCallback(reauthenticationCallback);

    appFetch('/users/loginFromServiceToken', config('POST'),
        authenticatedUser => onSuccess(authenticatedUser),
        () => removeServiceToken()
    );

}

export const signUp = (user, onSuccess, onErrors, reauthenticationCallback) => {

    appFetch('/users/signUp', config('POST', user), 
        authenticatedUser => {
            setServiceToken(authenticatedUser.serviceToken);
            setReauthenticationCallback(reauthenticationCallback);
            onSuccess(authenticatedUser);
        }, 
        onErrors);

}

export const addProfilePicture = (formData, userId, onSuccess, onErrors) => {
    appFetch(`/users/updateProfile/${userId}/addProfilePicture`, config('PUT', formData),
        onSuccess, onErrors);
}

export const logout = () => removeServiceToken();

export const updateProfile = (user, onSuccess, onErrors) =>
    appFetch(`/users/updateProfile/${user.id}`, config('PUT', user),
        onSuccess, onErrors);

export const updateUserSettings = (userId, userSettings, onSuccess, onErrors) =>
    appFetch(`/users/updateUserSettings/${userId}`, config('PUT', userSettings),
        onSuccess, onErrors);

export const sendVerificationCode = (email, onSuccess, onErrors) =>
    appFetch(`/users/forgottenPassword`, config('POST', {email}),
        onSuccess, onErrors);

export const enterVerificationCode = (email, verificationCode, onSuccess, onErrors) =>
    appFetch(`/users/forgottenPassword/verificationCode`, config('POST', {email, verificationCode}),
        onSuccess, onErrors);

export const restorePassword = (email, verificationCode, newPassword, onSuccess, onErrors) =>
    appFetch(`/users/forgottenPassword/restorePassword`, config('POST', {email, verificationCode, newPassword}),
        onSuccess, onErrors);

export const changePassword = (id, oldPassword, newPassword, onSuccess,
    onErrors) =>
    appFetch(`/users/updateProfile/${id}/changePassword`,
        config('POST', {oldPassword, newPassword}),
        onSuccess, onErrors);

export const searchUsers = ({keywords, onlyBrands, page}, onSuccess) => {

    let path = `/users/search?page=${page}`;

    path += keywords.length > 0 ? `&keywords=${encodeURIComponent(keywords)}` : "";
    path += onlyBrands ? `&onlyBrands=${onlyBrands}` : "";

    appFetch(path, config('GET'), onSuccess);

}

export const findByUserId = (id, onSuccess) =>
    appFetch(`/users/${id}`, config('GET'), onSuccess);

export const findUserSettingsByUserId = (userId, onSuccess, onErrors) =>
    appFetch(`/users/userSettings/${userId}`, config(`GET`), onSuccess, onErrors);

export const followUser = (userId, userFollowedId, onSuccess, onErrors) =>
    appFetch(`/users/follow/${userId}`, config('POST', {userId, userFollowedId}), onSuccess, onErrors);

export const unfollowUser = (userId, userFollowedId, onSuccess, onErrors) =>
    appFetch(`/users/unfollow/${userId}`, config('POST', {userId, userFollowedId}), onSuccess, onErrors);

export const findUserFollowers = (userId, {userLoggedId, dateDesc, page}, onSuccess) =>
    appFetch(`/users/${userId}/followers?userLoggedId=${userLoggedId}&dateDesc=${dateDesc}&page=${page}`, config('GET'), onSuccess);

export const findUserFollowed = (userId, {userLoggedId, dateDesc, page}, onSuccess) =>
    appFetch(`/users/${userId}/followed?userLoggedId=${userLoggedId}&dateDesc=${dateDesc}&page=${page}`, config('GET'), onSuccess);

export const getUserNumFollowers = (userId, onSuccess) =>
    appFetch(`/users/${userId}/numFollowers`, config('GET'), onSuccess);

export const getUserNumFollowed = (userId, onSuccess) =>
    appFetch(`/users/${userId}/numFollowed`, config('GET'), onSuccess);

export const isUserFollowingUser = (userId, userFollowingId, onSuccess) =>
    appFetch(`/users/${userId}/isFollowing?userFollowingId=${userFollowingId}`, config('GET'), onSuccess);

export const requestFollow = (userId, userFollowedId, onSuccess, onErrors) =>
    appFetch(`/users/requestFollow/${userId}`, config('POST',
        {userId, userFollowedId}), onSuccess, onErrors);

export const deleteRequestFollow = (userId, userFollowedId, onSuccess, onErrors) =>
    appFetch(`/users/deleteRequestFollow/${userId}`, config('POST',
        {userId, userFollowedId}), onSuccess, onErrors);

export const findUserFollowRequests = (userId, {page}, onSuccess, onErrors) =>
    appFetch(`/users/followRequests/${userId}?page=${page}`, config('GET'),
        onSuccess, onErrors);

export const getUserNumFollowRequests = (userId, onSuccess, onErrors) =>
    appFetch(`/users/getNumFollowRequests/${userId}`, config('GET'),
        onSuccess, onErrors);

export const acceptFollowRequest = (userId, userRequestingId, onSuccess, onErrors) =>
    appFetch(`/users/acceptFollowRequest/${userId}`, config('POST',
        {userRequestingId}), onSuccess, onErrors);

export const rejectFollowRequest = (userId, userRequestingId, onSuccess, onErrors) =>
    appFetch(`/users/rejectFollowRequest/${userId}`, config('POST',
        {userRequestingId}), onSuccess, onErrors);

export const hasUserRequestedToFollow = (userId, userRequestedId, onSuccess, onErrors) =>
    appFetch(`/users/hasRequested/${userId}?userRequestedId=${userRequestedId}`, config('GET'),
        onSuccess, onErrors);

export const reportUser = (userReportedId, reason, explanation, onSuccess, onErrors) =>
    appFetch(`/users/${userReportedId}/reportUser`, config('POST',
        {reason, explanation}), onSuccess, onErrors);

export const dontShowUplRewardHelp = (userId, onSuccess, onErrors) =>
    appFetch(`/users/userSettings/${userId}/dontShowUplRewardHelp`,
        config('POST'), onSuccess, onErrors);

export const dontShowUplImageHelp = (userId, onSuccess, onErrors) =>
    appFetch(`/users/userSettings/${userId}/dontShowUplImageHelp`,
        config('POST'), onSuccess, onErrors);