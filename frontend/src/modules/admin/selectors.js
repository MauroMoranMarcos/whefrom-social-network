const getModuleState = state => state.admin;

export const getCategories = state =>
    getModuleState(state).categories;

export const getCategory = state =>
    getModuleState(state).category;

export const getUserReports = state =>
    getModuleState(state).userReports;

export const getUserReport = state =>
    getModuleState(state).userReport;

export const getImageReports = state =>
    getModuleState(state).imageReports;

export const getImageReport = state =>
    getModuleState(state).imageReport;

export const getVerificationRequests = state =>
    getModuleState(state).verificationRequests;

export const getUserPenalty = state =>
    getModuleState(state).userPenalty;
