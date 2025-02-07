import {combineReducers} from 'redux';

import * as actionTypes from './actionTypes';

const initialState = {
    categories: null,
    category: null,
    userReports: null,
    userReport: null,
    imageReports: null,
    imageReport: null,
    verificationRequests: null,
    userPenalty: null,
};

const categories = (state = initialState.categories, action) => {

    switch (action.type) {

        case actionTypes.CATEGORY_CREATED:
            return action.categories ? action.categories : state;

        case actionTypes.FIND_CATEGORIES_COMPLETED:
            return action.categories;

        case actionTypes.EDIT_CATEGORY_COMPLETED:
            return action.categories ? action.categories : state;

        default:
            return state;

    }

}

const category = (state = initialState.category, action) => {

    switch (action.type) {

        case actionTypes.FIND_CATEGORY_BY_ID_COMPLETED:
            return action.category;

        case actionTypes.CLEAR_CATEGORY:
            return initialState.category;

        default:
            return state;

    }

}

const userReports = (state = initialState.userReports, action) => {

    switch (action.type) {

        case actionTypes.FIND_USER_REPORTS_COMPLETED:
            return action.userReports;

        case actionTypes.CLEAR_USER_REPORTS:
            return initialState.userReports;

        default:
            return state;

    }

}

const userReport = (state = initialState.userReport, action) => {

    switch (action.type) {

        case actionTypes.FIND_USER_REPORT_BY_ID_COMPLETED:
            return action.userReport;

        case actionTypes.CLEAR_USER_REPORT:
            return initialState.userReport;

        default:
            return state;

    }

}

const imageReports = (state = initialState.imageReports, action) => {

    switch (action.type) {

        case actionTypes.FIND_IMAGE_REPORTS_COMPLETED:
            return action.imageReports;

        case actionTypes.CLEAR_IMAGE_REPORTS:
            return initialState.imageReports;

        default:
            return state;

    }

}

const imageReport = (state = initialState.imageReport, action) => {

    switch (action.type) {

        case actionTypes.FIND_IMAGE_REPORT_BY_ID_COMPLETED:
            return action.imageReport;

        case actionTypes.CLEAR_IMAGE_REPORT:
            return initialState.imageReport;

        default:
            return state;

    }

}

const verificationRequests = (state = initialState.verificationRequests, action) => {

    switch (action.type) {

        case actionTypes.FIND_VERIFICATION_REQUESTS_COMPLETED:
            return action.verificationRequests;

        case actionTypes.CLEAR_VERIFICATION_REQUESTS:
            return initialState.verificationRequests;

        default:
            return state;

    }

}

const userPenalty = (state = initialState.userPenalty, action) => {

    switch (action.type) {

        case actionTypes.FIND_USER_PENALTY_BY_USER_ID_COMPLETED:
            return action.userPenalty;

        case actionTypes.CLEAR_USER_PENALTY:
            return initialState.userPenalty;

        default:
            return state;

    }

}

const reducer = combineReducers({
    categories,
    category,
    userReports,
    userReport,
    imageReports,
    imageReport,
    verificationRequests,
    userPenalty
});

export default reducer;