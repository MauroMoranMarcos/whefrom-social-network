import {combineReducers} from 'redux';

import * as actionTypes from './actionTypes';

const initialState = {
    user: null,
    userSettings: null,
    numFollowRequests: null,
    followRequests: null,
    userPoints: null,
};

const user = (state = initialState.user, action) => {

    switch (action.type) {

        case actionTypes.SIGN_UP_COMPLETED:
            return action.authenticatedUser.user;

        case actionTypes.ADD_PROFILE_PICTURE_COMPLETED:
            return action.user;

        case actionTypes.LOGIN_COMPLETED:
            return action.authenticatedUser.user;

        case actionTypes.LOGOUT:
            return initialState.user;

        case actionTypes.UPDATE_PROFILE_COMPLETED:
            return action.user;

        case actionTypes.SEND_VERIFICATION_CODE_COMPLETED:
            return state;

        case actionTypes.ENTER_VERIFICATION_CODE_COMPLETED:
            return state;

        default:
            return state;

    }

}

const userSettings = (state = initialState.userSettings, action) => {

    switch (action.type) {

        case actionTypes.SIGN_UP_COMPLETED:
            return action.authenticatedUser.userSettings;

        case actionTypes.LOGIN_COMPLETED:
            return action.authenticatedUser.userSettings;

        case actionTypes.UPDATE_USER_SETTINGS_COMPLETED:
            return action.userSettings;

        case actionTypes.DONT_SHOW_UPL_REWARD_COMPLETED:
            return action.userSettings;

        case actionTypes.DONT_SHOW_UPL_IMAGE_COMPLETED:
            return action.userSettings;

        default:
            return state;

    }

}

const numFollowRequests = (state = initialState.numFollowRequests, action) => {

    switch (action.type) {

        case actionTypes.GET_USER_NUM_FOLLOW_REQUESTS:
            return action.numFollowRequests;

        case actionTypes.CLEAR_USER_NUM_FOLLOW_REQUESTS:
            return initialState.numFollowRequests;

        default:
            return state;

    }

}

const followRequests = (state = initialState.followRequests, action) => {

    switch (action.type) {

        case actionTypes.FIND_USER_FOLLOW_REQUESTS_COMPLETED:
            return action.followRequests;

        case actionTypes.CLEAR_USER_FOLLOW_REQUESTS:
            return initialState.followRequests;

        default:
            return state;

    }

}

const userPoints = (state = initialState.userPoints, action) => {

    switch (action.type) {

        case actionTypes.SIGN_UP_COMPLETED:
            return action.authenticatedUser.userPoints;

        case actionTypes.LOGIN_COMPLETED:
            return action.authenticatedUser.userPoints;

        default:
            return state;

    }

}

const reducer = combineReducers({
    user,
    userSettings,
    numFollowRequests,
    followRequests,
    userPoints
});

export default reducer;