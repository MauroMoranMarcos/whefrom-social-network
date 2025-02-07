import {combineReducers} from 'redux';

import * as actionTypes from './actionTypes';
import {FIND_USER_SETTINGS_BY_USERID_COMPLETED} from "./actionTypes";

const initialState = {
    feed: null,
    userSearch: null,
    imageSearch: null,
    user: null,
    imagesFromUser: null,
    isUserFollowing: null,
    hasUserRequestedToFollow: null,
    numUserFollowers: null,
    userFollowers: null,
    numUserFollowed: null,
    userFollowed: null,
    userSettings: null,
    image: null,
    isImageLikedByUser: null,
    numImageLikes: null,
    imagesLikedByUser: null,
    usersThatLikedImage: null,
    numImageComments: null,
    commentsFromImage: null,
    numCommentAnswers: null,
    answersFromComment: null,
    tags: null,
    isTagLikedByUser: null,
    numTagLikes: null,
    tagsLikedByUser: null,
    usersThatLikedTag: null,
};

const feed = (state = initialState.feed, action) => {

    switch (action.type) {

        case actionTypes.GET_FEED_COMPLETED:
            return action.feed;

        case actionTypes.CLEAR_FEED:
            return initialState.feed;

        default:
            return state;

    }

}

const userSearch = (state = initialState.userSearch, action) => {

    switch (action.type) {

        case actionTypes.SEARCH_USERS_COMPLETED:
            return action.userSearch;

        case actionTypes.CLEAR_USER_SEARCH:
            return initialState.userSearch;

        default:
            return state;

    }

}

const imageSearch = (state = initialState.imageSearch, action) => {

    switch (action.type) {

        case actionTypes.SEARCH_IMAGES_COMPLETED:
            return action.imageSearch;

        case actionTypes.CLEAR_IMAGE_SEARCH:
            return initialState.imageSearch;

        default:
            return state;

    }

}

const user = (state = initialState.user, action) => {

    switch (action.type) {

        case actionTypes.FIND_USER_BY_ID_COMPLETED:
            return action.user;

        case actionTypes.CLEAR_USER:
            return initialState.user;

        default:
            return state;

    }

}

const imagesFromUser = (state = initialState.imagesFromUser, action) => {

    switch (action.type) {

        case actionTypes.FIND_IMAGES_FROM_USER_COMPLETED:
            return action.imagesFromUser;

        case actionTypes.CLEAR_IMAGES_FROM_USER:
            return initialState.imagesFromUser;

        default:
            return state;

    }

}

const isUserFollowing = (state = initialState.isUserFollowing, action) => {

    switch (action.type) {

        case actionTypes.IS_USER_FOLLOWING_USER_COMPLETED:
            return action.isUserFollowing;

        case actionTypes.CLEAR_IS_USER_FOLLOWING_USER:
            return initialState.isUserFollowing;

        default:
            return state;

    }

}

const hasUserRequestedToFollow = (state = initialState.hasUserRequestedToFollow, action) => {

    switch (action.type) {

        case actionTypes.HAS_USER_REQUESTED_TO_FOLLOW_COMPLETED:
            return action.hasUserRequestedToFollow;

        case actionTypes.CLEAR_HAS_USER_REQUESTED_TO_FOLLOW:
            return initialState.hasUserRequestedToFollow;

        default:
            return state;

    }

}

const numUserFollowers = (state = initialState.numUserFollowers, action) => {

    switch (action.type) {

        case actionTypes.GET_NUM_USER_FOLLOWERS_COMPLETED:
            return action.numFollowers;

        case actionTypes.CLEAR_NUM_USER_FOLLOWERS:
            return initialState.numUserFollowers;

        default:
            return state;

    }

}

const userFollowers = (state = initialState.userFollowers, action) => {

    switch (action.type) {

        case actionTypes.FIND_USER_FOLLOWERS_COMPLETED:
            return action.userFollowers;

        case actionTypes.CLEAR_USER_FOLLOWERS:
            return initialState.userFollowers;

        default:
            return state;

    }

}

const numUserFollowed = (state = initialState.numUserFollowed, action) => {

    switch (action.type) {

        case actionTypes.GET_NUM_USER_FOLLOWED_COMPLETED:
            return action.numFollowed;

        case actionTypes.CLEAR_NUM_USER_FOLLOWED:
            return initialState.numUserFollowed;

        default:
            return state;

    }

}

const userFollowed = (state = initialState.userFollowed, action) => {

    switch (action.type) {

        case actionTypes.FIND_USER_FOLLOWED_COMPLETED:
            return action.userFollowed;

        case actionTypes.CLEAR_USER_FOLLOWED:
            return initialState.userFollowed;

        default:
            return state;

    }

}

const userSettings = (state = initialState.userSettings, action) => {

    switch (action.type) {

        case actionTypes.FIND_USER_SETTINGS_BY_USERID_COMPLETED:
            return action.userSettings;

        case actionTypes.CLEAR_USER:
            return initialState.userSettings;

        default:
            return state;

    }

}

const image = (state = initialState.image, action) => {

    switch (action.type) {

        case actionTypes.FIND_IMAGE_BY_ID_COMPLETED:
            return action.image;

        case actionTypes.CLEAR_IMAGE:
            return initialState.image;

        default:
            return state;

    }

}

const isImageLikedByUser = (state = initialState.isImageLikedByUser, action) => {

    switch (action.type) {

        case actionTypes.IS_IMAGE_LIKED_BY_USER_COMPLETED:
            return action.isImageLikedByUser;

        case actionTypes.CLEAR_IS_IMAGE_LIKED_BY_USER:
            return initialState.isImageLikedByUser;

        default:
            return state;

    }

}

const numImageLikes = (state = initialState.numImageLikes, action) => {

    switch (action.type) {

        case actionTypes.GET_NUM_IMAGE_LIKES_COMPLETED:
            return action.numImageLikes;

        case actionTypes.CLEAR_NUM_IMAGE_LIKES:
            return initialState.numImageLikes;

        default:
            return state;

    }

}

const imagesLikedByUser = (state = initialState.imagesLikedByUser, action) => {

    switch (action.type) {

        case actionTypes.FIND_IMAGES_LIKED_BY_USER_COMPLETED:
            return action.imagesLikedByUser;

        case actionTypes.CLEAR_IMAGES_LIKED_BY_USER:
            return initialState.imagesLikedByUser;

        default:
            return state;

    }

}

const usersThatLikedImage = (state = initialState.usersThatLikedImage, action) => {

    switch (action.type) {

        case actionTypes.FIND_USERS_THAT_LIKED_IMAGE_COMPLETED:
            return action.usersThatLikedImage;

        case actionTypes.CLEAR_USERS_THAT_LIKED_IMAGE:
            return initialState.usersThatLikedImage;

        default:
            return state;

    }

}

const numImageComments = (state = initialState.numImageComments, action) => {

    switch (action.type) {

        case actionTypes.GET_NUM_IMAGE_COMMENTS_COMPLETED:
            return action.numImageComments;

        case actionTypes.CLEAR_NUM_IMAGE_COMMENTS:
            return initialState.numImageComments;

        default:
            return state;

    }

}

const commentsFromImage = (state = initialState.commentsFromImage, action) => {

    switch (action.type) {

        case actionTypes.FIND_COMMENTS_FROM_IMAGE_COMPLETED:
            return action.commentsFromImage;

        case actionTypes.CLEAR_COMMENTS_FROM_IMAGE:
            return initialState.commentsFromImage;

        default:
            return state;

    }

}

const numCommentAnswers = (state = initialState.numCommentAnswers, action) => {

    switch (action.type) {

        case actionTypes.GET_NUM_COMMENT_ANSWERS_COMPLETED:
            return action.numCommentAnswers;

        case actionTypes.CLEAR_NUM_IMAGE_COMMENTS:
            return initialState.numCommentAnswers;

        default:
            return state;

    }

}

const answersFromComment = (state = initialState.answersFromComment, action) => {

    switch (action.type) {

        case actionTypes.FIND_ANSWERS_FROM_COMMENT_COMPLETED:
            return action.answersFromComment;

        case actionTypes.CLEAR_ANSWERS_FROM_COMMENT:
            return initialState.answersFromComment;

        default:
            return state;

    }

}

const tags = (state = initialState.tags, action) => {

    switch (action.type) {

        case actionTypes.FIND_IMAGE_TAGS_COMPLETED:
            return action.tags;

        case actionTypes.CLEAR_TAGS:
            return initialState.tags;

        default:
            return state;

    }

}

const isTagLikedByUser = (state = initialState.isTagLikedByUser, action) => {

    switch (action.type) {

        case actionTypes.IS_TAG_LIKED_BY_USER_COMPLETED:
            return action.isTagLikedByUser;

        case actionTypes.CLEAR_IS_TAG_LIKED_BY_USER:
            return initialState.isTagLikedByUser;

        default:
            return state;

    }

}

const numTagLikes = (state = initialState.numTagLikes, action) => {

    switch (action.type) {

        case actionTypes.GET_NUM_TAG_LIKES_COMPLETED:
            return action.numTagLikes;

        case actionTypes.CLEAR_NUM_TAG_LIKES:
            return initialState.numTagLikes;

        default:
            return state;

    }

}

const tagsLikedByUser = (state = initialState.tagsLikedByUser, action) => {

    switch (action.type) {

        case actionTypes.FIND_TAGS_LIKED_BY_USER_COMPLETED:
            return action.tagsLikedByUser;

        case actionTypes.CLEAR_TAGS_LIKED_BY_USER:
            return initialState.tagsLikedByUser;

        default:
            return state;

    }

}

const usersThatLikedTag = (state = initialState.usersThatLikedTag, action) => {

    switch (action.type) {

        case actionTypes.FIND_USERS_THAT_LIKED_TAG_COMPLETED:
            return action.usersThatLikedTag;

        case actionTypes.CLEAR_USERS_THAT_LIKED_TAG:
            return initialState.usersThatLikedTag;

        default:
            return state;

    }

}

const reducer = combineReducers({
    feed,
    userSearch,
    imageSearch,
    user,
    imagesFromUser,
    isUserFollowing,
    hasUserRequestedToFollow,
    numUserFollowers,
    userFollowers,
    numUserFollowed,
    userFollowed,
    userSettings,
    image,
    isImageLikedByUser,
    numImageLikes,
    imagesLikedByUser,
    usersThatLikedImage,
    numImageComments,
    commentsFromImage,
    numCommentAnswers,
    answersFromComment,
    tags,
    isTagLikedByUser,
    numTagLikes,
    tagsLikedByUser,
    usersThatLikedTag
});

export default reducer;