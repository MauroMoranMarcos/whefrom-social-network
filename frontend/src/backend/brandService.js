import {config, appFetch, setServiceToken, getServiceToken, removeServiceToken, setReauthenticationCallback} from './appFetch';

export const login = (userName, password, onSuccess, onErrors, reauthenticationCallback) =>
    appFetch('/brands/login', config('POST', {userName, password}),
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

    appFetch('/brands/loginFromServiceToken', config('POST'),
        authenticatedUser => onSuccess(authenticatedUser),
        () => removeServiceToken()
    );

}

export const signUp = (user, onSuccess, onErrors, reauthenticationCallback) => {

    appFetch('/brands/signUp', config('POST', user),
        authenticatedUser => {
            setServiceToken(authenticatedUser.serviceToken);
            setReauthenticationCallback(reauthenticationCallback);
            onSuccess(authenticatedUser);
        },
        onErrors);

}

export const logout = () => removeServiceToken();

export const uploadReward = (formData, onSuccess, onErrors) =>
    appFetch(`/brands/upload`,
        config('POST', formData), onSuccess, onErrors);

export const hideReward = (rewardId, onSuccess, onErrors) =>
    appFetch(`/brands/hideReward/${rewardId}`,
        config('POST'), onSuccess, onErrors);

export const showReward = (rewardId, onSuccess, onErrors) =>
    appFetch(`/brands/showReward/${rewardId}`,
        config('POST'), onSuccess, onErrors);

export const deleteReward = (rewardId, onSuccess, onErrors) =>
    appFetch(`/brands/deleteReward/${rewardId}`,
        config('POST'), onSuccess, onErrors);

export const findByRewardId = (id, userLoggedId, onSuccess) => {

    let path = `/brands/${id}`;

    path += userLoggedId ? `?userLoggedId=${userLoggedId}` : "";

    appFetch(path, config('GET'), onSuccess);

}

export const findRewards = ({brandId, userLoggedId, filterType, showOnlyClaimable, page}, onSuccess) => {

    let path = `/brands/search?page=${page}`;

    path += brandId ? `&brandId=${brandId}` : "";
    path += userLoggedId ? `&userLoggedId=${userLoggedId}` : "";
    path += filterType ? `&filterType=${filterType}` : "";
    path += showOnlyClaimable ? `&showOnlyClaimable=${showOnlyClaimable}` : "";

    appFetch(path, config('GET'), onSuccess);

}

export const claimReward = (rewardId, onSuccess, onErrors) =>
    appFetch(`/brands/${rewardId}/claimReward`,
        config('POST'), onSuccess, onErrors);

export const isRewardClaimedByUser = (rewardId, onSuccess, onErrors) =>
    appFetch(`/brands/${rewardId}/isRewardClaimedByUser`,
        config('GET'), onSuccess, onErrors);

export const findUsersThatClaimedReward = ({rewardId, page}, onSuccess, onErrors) =>
    appFetch(`/brands/${rewardId}/findUsersThatClaimedReward?page=${page}`,
        config('GET'), onSuccess, onErrors);

export const getNumPublicationsWithBrand = (brandId, onSuccess, onErrors) =>
    appFetch(`/brands/${brandId}/getNumPublicationsWithBrand`,
        config('GET'), onSuccess, onErrors);

export const requestVerification = (onSuccess, onErrors) =>
    appFetch(`/brands/requestVerification`,
        config('POST'), onSuccess, onErrors);

export const hasBrandRequestedVerification = (onSuccess, onErrors) =>
    appFetch(`/brands/hasRequestedVerification`,
        config('GET'), onSuccess, onErrors);
