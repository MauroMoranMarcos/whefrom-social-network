const getModuleState = state => state.brands;

export const getLastRewardUploaded = state =>
    getModuleState(state).lastRewardUploaded;

export const getReward = state =>
    getModuleState(state).reward;

export const getRewardSearch = state =>
    getModuleState(state).rewardSearch;

export const isRewardClaimedByUser = state =>
    getModuleState(state).isRewardClaimedByUser;

export const getRewardsLastUnits = state =>
    getModuleState(state).rewardsLastUnits;

export const getUsersThatClaimedReward = state =>
    getModuleState(state).usersThatClaimedReward;

export const getRequestVerificationId = state =>
    getModuleState(state).requestVerificationId;