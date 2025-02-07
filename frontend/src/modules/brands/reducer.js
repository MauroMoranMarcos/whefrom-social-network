import {combineReducers} from 'redux';

import * as actionTypes from './actionTypes';

const initialState = {
    brand: null,
    brandUserSettings: null,
    lastRewardUploaded: null,
    reward: null,
    rewardSearch: null,
    isRewardClaimedByUser: null,
    rewardsLastUnits: null,
    usersThatClaimedReward: null,
};

const brand = (state = initialState.brand, action) => {

    switch (action.type) {

        default:
            return state;

    }

}

const brandUserSettings = (state = initialState.brandUserSettings, action) => {

    switch (action.type) {

        default:
            return state;

    }

}

const lastRewardUploaded = (state = initialState.lastRewardUploaded, action) => {

    switch (action.type) {

        case actionTypes.UPLOAD_REWARD_COMPLETED:
            return action.lastRewardUploaded;

        default:
            return state;

    }

}

const reward = (state = initialState.reward, action) => {

    switch (action.type) {

        case actionTypes.FIND_REWARD_BY_ID_COMPLETED:
            return action.reward;

        case actionTypes.CLEAR_REWARD:
            return initialState.reward;

        default:
            return state;

    }

}

const rewardSearch = (state = initialState.rewardSearch, action) => {

    switch (action.type) {

        case actionTypes.FIND_REWARDS_COMPLETED:
            return action.rewardSearch;

        case actionTypes.CLEAR_REWARD_SEARCH:
            return initialState.rewardSearch;

        default:
            return state;

    }

}

const isRewardClaimedByUser = (state = initialState.isRewardClaimedByUser, action) => {

    switch (action.type) {

        case actionTypes.IS_REWARD_CLAIMED_BY_USER_COMPLETED:
            return action.isRewardClaimedByUser;

        case actionTypes.CLEAR_IS_REWARD_CLAIMED_BY_USER:
            return initialState.isRewardClaimedByUser;

        default:
            return state;

    }

}

const rewardsLastUnits = (state = initialState.rewardsLastUnits, action) => {

    switch (action.type) {

        case actionTypes.FIND_REWARDS_LAST_UNITS_COMPLETED:
            return action.rewardsLastUnits;

        case actionTypes.CLEAR_REWARDS_LAST_UNITS:
            return initialState.rewardsLastUnits;

        default:
            return state;

    }

}

const usersThatClaimedReward = (state = initialState.usersThatClaimedReward, action) => {

    switch (action.type) {

        case actionTypes.FIND_USERS_THAT_CLAIMED_REWARD_COMPLETED:
            return action.usersThatClaimedReward;

        case actionTypes.CLEAR_USERS_THAT_CLAIMED_REWARD:
            return initialState.usersThatClaimedReward;

        default:
            return state;

    }

}

const reducer = combineReducers({
    brand,
    brandUserSettings,
    lastRewardUploaded,
    reward,
    rewardSearch,
    isRewardClaimedByUser,
    rewardsLastUnits,
    usersThatClaimedReward
});

export default reducer;