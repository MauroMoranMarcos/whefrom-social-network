const getModuleState = state => state.users;

export const getUser = state =>
    getModuleState(state).user;

export const getUserSettings = state =>
    getModuleState(state).userSettings;

export const isLoggedIn = state =>
    getUser(state) !== null

export const getUserName = state =>
    isLoggedIn(state) ? getUser(state).userName : null;

export const isAdmin = state =>
    isLoggedIn(state) && getUser(state).role === "ADMIN_USER";

export const isBrand = state =>
    isLoggedIn(state) && getUser(state).role === "BRAND_USER";

export const getNumFollowRequests = state =>
    getModuleState(state).numFollowRequests;

export const getFollowRequests = state =>
    getModuleState(state).followRequests;

export const getUserPoints = state =>
    getModuleState(state).userPoints;