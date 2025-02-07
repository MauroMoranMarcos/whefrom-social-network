import {combineReducers} from 'redux';

import * as actionTypes from './actionTypes';

const initialState = {
    lastImageUploaded: null,
};

const lastImageUploaded = (state = initialState.lastImageUploaded, action) => {

    switch (action.type) {

        case actionTypes.UPLOAD_IMAGE_COMPLETED:
            return action.lastImageUploaded;

        case actionTypes.TAG_IMAGE_COMPLETED:
            return state;

        case actionTypes.UPDATE_IMAGE_COMPLETED:
            return action.image;

        case actionTypes.UPDATE_TAG_COMPLETED:
            return state;

        default:
            return state;

    }

}

const reducer = combineReducers({
    lastImageUploaded,
});

export default reducer;