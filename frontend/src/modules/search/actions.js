import * as actionTypes from './actionTypes';
import backend from '../../backend';

const searchUsersCompleted = userSearch => ({
    type: actionTypes.SEARCH_USERS_COMPLETED,
    userSearch
});

export const searchUsers = criteria => dispatch => {

    dispatch(clearUserSearch());
    backend.userService.searchUsers(criteria,
        result => dispatch(searchUsersCompleted({criteria, result})));

}

export const previousSearchUsersResultPage = criteria =>
    searchUsers({...criteria, page: criteria.page - 1});

export const nextSearchUsersResultPage = criteria =>
    searchUsers({...criteria, page: criteria.page + 1});

const clearUserSearch = () => ({
    type: actionTypes.CLEAR_USER_SEARCH
});

const searchImagesCompleted = imageSearch => ({
    type: actionTypes.SEARCH_IMAGES_COMPLETED,
    imageSearch
});

export const searchImages = criteria => dispatch => {

    dispatch(clearImageSearch());
    backend.imageService.searchImages(criteria,
        result => dispatch(searchImagesCompleted({criteria, result})));

}

export const previousSearchImagesResultPage = criteria =>
    searchImages({...criteria, page: criteria.page - 1});

export const nextSearchImagesResultPage = criteria =>
    searchImages({...criteria, page: criteria.page + 1});

const findImagesFromUserCompleted = imagesFromUser => ({
    type: actionTypes.FIND_IMAGES_FROM_USER_COMPLETED,
    imagesFromUser
});

export const clearImagesFromUser = () => ({
    type: actionTypes.CLEAR_IMAGES_FROM_USER
});

export const findImagesFromUser = criteria => dispatch => {

    dispatch(clearImageSearch());
    backend.imageService.findImagesFromUser(criteria,
        result => dispatch(findImagesFromUserCompleted({criteria, result})));

}

export const previousFindImagesFromUserResultPage = criteria =>
    findImagesFromUser({...criteria, page: criteria.page - 1});

export const nextFindImagesFromUserResultPage = criteria =>
    findImagesFromUser({...criteria, page: criteria.page + 1});

const clearImageSearch = () => ({
    type: actionTypes.CLEAR_IMAGE_SEARCH
});

const findImageByIdCompleted = image => ({
    type: actionTypes.FIND_IMAGE_BY_ID_COMPLETED,
    image
});

export const findImageById = (id, userLoggedId, onSuccess) => dispatch => {
    backend.imageService.findByImageId(id, userLoggedId,
        image => {
            dispatch(findImageByIdCompleted(image));
            onSuccess(image);
        });
}

export const clearImage = () => ({
    type: actionTypes.CLEAR_IMAGE
});

const findUserByIdCompleted = user => ({
    type: actionTypes.FIND_USER_BY_ID_COMPLETED,
    user
});

export const findUserById = (id, onSuccess, onErrors) => dispatch => {
    backend.userService.findByUserId(id,
        user => {
            dispatch(findUserByIdCompleted(user));
            if (typeof onSuccess === 'function') {
                onSuccess(user);
            }
        },
        onErrors);
}

const findUserByIdCompletedAux = () => ({
    type: actionTypes.FIND_USER_BY_ID_AUX_COMPLETED,
});

export const findUserByIdAux = (id, onSuccess, onErrors) => dispatch => {
    backend.userService.findByUserId(id,
        user => {
            dispatch(findUserByIdCompletedAux());
            if (typeof onSuccess === 'function') {
                onSuccess(user);
            }
        },
        onErrors);
}


const findUserSettingsByUserIdCompleted = userSettings => ({
    type: actionTypes.FIND_USER_SETTINGS_BY_USERID_COMPLETED,
    userSettings
});

export const findUserSettingsByUserId = (userId, onSuccess, onErrors) => dispatch => {
    backend.userService.findUserSettingsByUserId(userId,
        userSettings => {
            dispatch(findUserSettingsByUserIdCompleted(userSettings));
            if (typeof onSuccess === 'function') {
                onSuccess(userSettings);
            }
        }, onErrors);
}

export const clearUser = () => ({
    type: actionTypes.CLEAR_USER
});

const findImageTagsCompleted = tags => ({
    type: actionTypes.FIND_IMAGE_TAGS_COMPLETED,
    tags
});

const clearImageTags = () => ({
    type: actionTypes.CLEAR_TAGS
});

export const findImageTags = (imageId, userLoggedId, onSuccess, onErrors) => dispatch => {

    dispatch(clearImageTags());
    backend.imageService.findImageTags(imageId, userLoggedId,
        tags => {
            dispatch(findImageTagsCompleted(tags));
            if (typeof onSuccess === 'function') {
                onSuccess(tags);
            }
        },
        onErrors);

}

const followUserCompleted = () => ({
    type: actionTypes.FOLLOW_USER_COMPLETED,
});

export const followUser = (userId, userFollowedId, onSuccess, onErrors) => dispatch =>
    backend.userService.followUser(userId, userFollowedId,
        () => {
            dispatch(followUserCompleted());
            onSuccess();
        },
        onErrors);

const unfollowUserCompleted = () => ({
    type: actionTypes.UNFOLLOW_USER_COMPLETED,
});

export const unfollowUser = (userId, userFollowedId, onSuccess, onErrors) => dispatch =>
    backend.userService.unfollowUser(userId, userFollowedId,
        () => {
            dispatch(unfollowUserCompleted());
            onSuccess();
        },
        onErrors);

const getNumUserFollowersCompleted = numFollowers => ({
    type: actionTypes.GET_NUM_USER_FOLLOWERS_COMPLETED,
    numFollowers
});

const clearNumUserFollowers = () => ({
    type: actionTypes.CLEAR_NUM_USER_FOLLOWERS
});

export const getNumUserFollowers = userId => dispatch => {

    dispatch(clearNumUserFollowers());
    backend.userService.getUserNumFollowers(userId,
        numFollowers => dispatch(getNumUserFollowersCompleted(numFollowers)));

}

const getNumUserFollowedCompleted = numFollowed => ({
    type: actionTypes.GET_NUM_USER_FOLLOWED_COMPLETED,
    numFollowed
});

const clearNumUserFollowed = () => ({
    type: actionTypes.CLEAR_NUM_USER_FOLLOWED
});

export const getNumUserFollowed = userId => dispatch => {

    dispatch(clearNumUserFollowed());
    backend.userService.getUserNumFollowed(userId,
        numFollowed => dispatch(getNumUserFollowedCompleted(numFollowed)));

}


const findUserFollowersCompleted = userFollowers => ({
    type: actionTypes.FIND_USER_FOLLOWERS_COMPLETED,
    userFollowers
});

const clearUserFollowers = () => ({
    type: actionTypes.CLEAR_USER_FOLLOWERS
});

export const findUserFollowers = (userId, criteria) => dispatch => {

    dispatch(clearUserFollowers());
    backend.userService.findUserFollowers(userId, criteria,
            result => dispatch(findUserFollowersCompleted({criteria, result})));

}

const findUserFollowedCompleted = userFollowed => ({
    type: actionTypes.FIND_USER_FOLLOWED_COMPLETED,
    userFollowed
});

const clearUserFollowed = () => ({
    type: actionTypes.CLEAR_USER_FOLLOWED
});

export const findUserFollowed = (userId, criteria) => dispatch => {

    dispatch(clearUserFollowed());
    backend.userService.findUserFollowed(userId, criteria,
        result => dispatch(findUserFollowedCompleted({criteria, result})));

}

export const previousFindUserFollowersResultPage = (userId, criteria) =>
    findUserFollowers(userId, {...criteria, page: criteria.page - 1});

export const nextFindUserFollowersResultPage = (userId, criteria) =>
    findUserFollowers(userId, {...criteria, page: criteria.page + 1});

export const previousFindUserFollowedResultPage = (userId, criteria) =>
    findUserFollowed(userId, {...criteria, page: criteria.page - 1});

export const nextFindUserFollowedResultPage = (userId, criteria) =>
    findUserFollowed(userId, {...criteria, page: criteria.page + 1});

const isUserFollowingUserCompleted = isUserFollowing => ({
    type: actionTypes.IS_USER_FOLLOWING_USER_COMPLETED,
    isUserFollowing
});

const clearIsUserFollowingUser = () => ({
    type: actionTypes.CLEAR_IS_USER_FOLLOWING_USER
});

export const isUserFollowingUser = (userId, userFollowingId) => dispatch => {

    dispatch(clearIsUserFollowingUser());
    backend.userService.isUserFollowingUser(userId, userFollowingId,
        isUserFollowing => dispatch(isUserFollowingUserCompleted(isUserFollowing)));

}

const likeImageCompleted = () => ({
    type: actionTypes.LIKE_IMAGE_COMPLETED,
});

export const likeImage = (userId, imageId, onSuccess, onErrors) => dispatch =>
    backend.imageService.likeImage(userId, imageId,
        () => {
            dispatch(likeImageCompleted());
            if (typeof onSuccess === 'function') {
                onSuccess();
            }
        },
        onErrors);

const deleteImageLikeCompleted = () => ({
    type: actionTypes.DELETE_IMAGE_LIKE_COMPLETED,
});

export const deleteImageLike = (userId, imageId, onSuccess, onErrors) => dispatch =>
    backend.imageService.deleteImageLike(userId, imageId,
        () => {
            dispatch(deleteImageLikeCompleted());
            onSuccess();
        },
        onErrors);

const getNumImageLikesCompleted = numImageLikes => ({
    type: actionTypes.GET_NUM_IMAGE_LIKES_COMPLETED,
    numImageLikes
});

const clearNumImageLikes = () => ({
    type: actionTypes.CLEAR_NUM_IMAGE_LIKES
});

export const getNumImageLikes = (imageId, onSuccess, onErrors) => dispatch => {

    dispatch(clearNumImageLikes());
    backend.imageService.getNumImageLikes(imageId,
        numImageLikes => {
            dispatch(getNumImageLikesCompleted(numImageLikes));
            if (typeof onSuccess === 'function') {
                onSuccess(numImageLikes);
            }
        },
        onErrors);

}

const findImagesLikedByUserCompleted = imagesLikedByUser => ({
    type: actionTypes.FIND_IMAGES_LIKED_BY_USER_COMPLETED,
    imagesLikedByUser
});

const clearImagesLikedByUser = () => ({
    type: actionTypes.CLEAR_IMAGES_LIKED_BY_USER
});

export const findImagesLikedByUser = (criteria) => dispatch => {

    dispatch(clearImagesLikedByUser());
    backend.imageService.findImagesLikedByUser(criteria,
        result => dispatch(findImagesLikedByUserCompleted({criteria, result})));

}

export const previousFindImagesLikedByUserResultPage = (criteria) =>
    findImagesLikedByUser( {...criteria, page: criteria.page - 1});

export const nextFindImagesLikedByUserResultPage = (criteria) =>
    findImagesLikedByUser({...criteria, page: criteria.page + 1});

const findUsersThatLikedImageCompleted = usersThatLikedImage => ({
    type: actionTypes.FIND_USERS_THAT_LIKED_IMAGE_COMPLETED,
    usersThatLikedImage
});

const clearUsersThatLikedImage = () => ({
    type: actionTypes.CLEAR_USERS_THAT_LIKED_IMAGE
});

export const findUsersThatLikedImage = (criteria, onSuccess, onErrors) => dispatch => {

    dispatch(clearUsersThatLikedImage());
    backend.imageService.findUsersThatLikedImage(criteria,
        result => {
            dispatch(findUsersThatLikedImageCompleted({criteria, result}));
            onSuccess(result);
        },
        onErrors);

}

export const previousFindUsersThatLikedImageResultPage = (criteria) =>
    findUsersThatLikedImage( {...criteria, page: criteria.page - 1});

export const nextFindUsersThatLikedImageResultPage = (criteria) =>
    findUsersThatLikedImage({...criteria, page: criteria.page + 1});

const isImageLikedByUserCompleted = isImageLikedByUser => ({
    type: actionTypes.IS_IMAGE_LIKED_BY_USER_COMPLETED,
    isImageLikedByUser
});

const clearIsImageLikedByUser = () => ({
    type: actionTypes.CLEAR_IS_IMAGE_LIKED_BY_USER
});

export const isImageLikedByUser = (imageId, onSuccess, onErrors) => dispatch => {

    dispatch(clearIsImageLikedByUser());
    backend.imageService.isImageLikedByUser(imageId,
        isImageLikedByUser => {
            dispatch(isImageLikedByUserCompleted(isImageLikedByUser));
            if (typeof onSuccess === 'function') {
                onSuccess(isImageLikedByUser);
            }
        },
        onErrors);

}

const commentImageCompleted = () => ({
    type: actionTypes.COMMENT_IMAGE_COMPLETED,
});

export const commentImage = (userId, imageId, text, onSuccess, onErrors) => dispatch =>
    backend.imageService.commentImage(imageId, userId, text,
        () => {
            dispatch(commentImageCompleted());
            onSuccess();
        },
        onErrors);

const answerCommentCompleted = () => ({
    type: actionTypes.ANSWER_COMMENT_COMPLETED,
});

export const answerComment = (userId, imageId, text, commentAnsweredId, onSuccess, onErrors) => dispatch =>
    backend.imageService.answerComment(imageId, userId, text, commentAnsweredId,
        () => {
            dispatch(answerCommentCompleted());
            onSuccess();
        },
        onErrors);

const deleteImageCommentCompleted = () => ({
    type: actionTypes.DELETE_IMAGE_COMMENT_COMPLETED,
});

export const deleteImageComment = (commentId, userId, onSuccess, onErrors) => dispatch =>
    backend.imageService.deleteComment(commentId, userId,
        () => {
            dispatch(deleteImageCommentCompleted());
            onSuccess();
        },
        onErrors);

const getNumImageCommentsCompleted = numImageComments => ({
    type: actionTypes.GET_NUM_IMAGE_COMMENTS_COMPLETED,
    numImageComments
});

const clearNumImageComments = () => ({
    type: actionTypes.CLEAR_NUM_IMAGE_COMMENTS
});

export const getNumImageComments = (imageId, userLoggedId, onSuccess) => dispatch => {

    dispatch(clearNumImageComments());
    backend.imageService.getNumImageComments(imageId, userLoggedId,
        numImageComments => {
            dispatch(getNumImageCommentsCompleted(numImageComments));
            if (typeof onSuccess === 'function') {
                onSuccess(numImageComments);
            }
        });

}

const getNumCommentAnswersCompleted = numCommentAnswers => ({
    type: actionTypes.GET_NUM_COMMENT_ANSWERS_COMPLETED,
    numCommentAnswers
});

const clearNumCommentAnswers = () => ({
    type: actionTypes.CLEAR_NUM_COMMENT_ANSWERS
});

export const getNumCommentAnswers = (commentId, userLoggedId) => dispatch => {

    dispatch(clearNumCommentAnswers());
    backend.imageService.getNumCommentAnswers(commentId, userLoggedId,
        numCommentAnswers => dispatch(getNumCommentAnswersCompleted(numCommentAnswers)));

}

const findCommentsFromImageCompleted = commentsFromImage => ({
    type: actionTypes.FIND_COMMENTS_FROM_IMAGE_COMPLETED,
    commentsFromImage
});

const clearCommentsFromImage = () => ({
    type: actionTypes.CLEAR_COMMENTS_FROM_IMAGE
});

export const findCommentsFromImage = (criteria) => dispatch => {

    dispatch(clearCommentsFromImage());
    backend.imageService.findCommentsFromImage(criteria,
        result => dispatch(findCommentsFromImageCompleted({criteria, result})));

}

export const previousFindCommentsFromImageResultPage = (criteria) =>
    findCommentsFromImage( {...criteria, page: criteria.page - 1});

export const nextFindCommentsFromImageResultPage = (criteria) =>
    findCommentsFromImage({...criteria, page: criteria.page + 1});

const findAnswersFromCommentCompleted = answersFromComment => ({
    type: actionTypes.FIND_ANSWERS_FROM_COMMENT_COMPLETED,
    answersFromComment
});

const clearAnswersFromComment = () => ({
    type: actionTypes.CLEAR_ANSWERS_FROM_COMMENT
});

export const findAnswersFromComment = (criteria) => dispatch => {

    dispatch(clearAnswersFromComment());
    backend.imageService.findAnswersFromComment(criteria,
        result => dispatch(findAnswersFromCommentCompleted({criteria, result})));

}

export const previousFindAnswersFromCommentResultPage = (criteria) =>
    findAnswersFromComment( {...criteria, page: criteria.page - 1});

export const nextFindAnswersFromCommentResultPage = (criteria) =>
    findAnswersFromComment({...criteria, page: criteria.page + 1});

const likeTagCompleted = () => ({
    type: actionTypes.LIKE_TAG_COMPLETED,
});

export const likeTag = (userId, tagId, onSuccess, onErrors) => dispatch =>
    backend.imageService.likeTag(userId, tagId,
        () => {
            dispatch(likeTagCompleted());
            onSuccess();
        },
        onErrors);

const deleteTagLikeCompleted = () => ({
    type: actionTypes.DELETE_TAG_LIKE_COMPLETED,
});

export const deleteTagLike = (userId, tagId, onSuccess, onErrors) => dispatch =>
    backend.imageService.deleteTagLike(userId, tagId,
        () => {
            dispatch(deleteTagLikeCompleted());
            onSuccess();
        },
        onErrors);

const getNumTagLikesCompleted = numTagLikes => ({
    type: actionTypes.GET_NUM_TAG_LIKES_COMPLETED,
    numTagLikes
});

const clearNumTagLikes = () => ({
    type: actionTypes.CLEAR_NUM_TAG_LIKES
});

export const getNumTagLikes = (tagId, userLoggedId, onSuccess, onErrors) => dispatch => {

    dispatch(clearNumTagLikes());
    backend.imageService.getNumTagLikes(tagId, userLoggedId,
        numTagLikes => {
            dispatch(getNumTagLikesCompleted(numTagLikes));
        },
        onErrors);

}

const isTagLikedByUserCompleted = isTagLikedByUser => ({
    type: actionTypes.IS_TAG_LIKED_BY_USER_COMPLETED,
    isTagLikedByUser
});

const clearIsTagLikedByUser = () => ({
    type: actionTypes.CLEAR_IS_TAG_LIKED_BY_USER
});

export const isTagLikedByUser = (tagId, userLoggedId) => dispatch => {

    dispatch(clearIsTagLikedByUser());
    backend.imageService.isTagLikedByUser(tagId, userLoggedId,
        isTagLikedByUser => dispatch(isTagLikedByUserCompleted(isTagLikedByUser)));

}

const findTagsLikedByUserCompleted = tagsLikedByUser => ({
    type: actionTypes.FIND_TAGS_LIKED_BY_USER_COMPLETED,
    tagsLikedByUser
});

const clearTagsLikedByUser = () => ({
    type: actionTypes.CLEAR_TAGS_LIKED_BY_USER
});

export const findTagsLikedByUser = (criteria) => dispatch => {

    dispatch(clearTagsLikedByUser());
    backend.imageService.findTagsLikedByUser(criteria,
        result => dispatch(findTagsLikedByUserCompleted({criteria, result})));

}

export const previousFindTagsLikedByUserResultPage = (criteria) =>
    findTagsLikedByUser( {...criteria, page: criteria.page - 1});

export const nextFindTagsLikedByUserResultPage = (criteria) =>
    findTagsLikedByUser({...criteria, page: criteria.page + 1});

const findUsersThatLikedTagCompleted = usersThatLikedTag => ({
    type: actionTypes.FIND_USERS_THAT_LIKED_TAG_COMPLETED,
    usersThatLikedTag
});

const clearUsersThatLikedTag = () => ({
    type: actionTypes.CLEAR_USERS_THAT_LIKED_TAG
});

export const findUsersThatLikedTag = (criteria) => dispatch => {

    dispatch(clearUsersThatLikedTag());
    backend.imageService.findUsersThatLikedTag(criteria,
        result => dispatch(findUsersThatLikedTagCompleted({criteria, result})));

}

export const previousFindUsersThatLikedTagResultPage = (criteria) =>
    findUsersThatLikedTag( {...criteria, page: criteria.page - 1});

export const nextFindUsersThatLikedTagResultPage = (criteria) =>
    findUsersThatLikedTag({...criteria, page: criteria.page + 1});

const requestFollowCompleted = () => ({
    type: actionTypes.REQUEST_FOLLOW_COMPLETED,
});

export const requestFollow = (userId, userFollowedId, onSuccess, onErrors) => dispatch =>
    backend.userService.requestFollow(userId, userFollowedId,
        () => {
            dispatch(requestFollowCompleted());
            onSuccess();
        },
        onErrors);

const deleteRequestFollowCompleted = () => ({
    type: actionTypes.DELETE_REQUEST_FOLLOW_COMPLETED,
});

export const deleteRequestFollow = (userId, userFollowedId, onSuccess, onErrors) => dispatch =>
    backend.userService.deleteRequestFollow(userId, userFollowedId,
        () => {
            dispatch(deleteRequestFollowCompleted());
            onSuccess();
        },
        onErrors);

const hasUserRequestedToFollowCompleted = hasUserRequestedToFollow => ({
    type: actionTypes.HAS_USER_REQUESTED_TO_FOLLOW_COMPLETED,
    hasUserRequestedToFollow
});

const clearHasUserRequestedToFollow = () => ({
    type: actionTypes.CLEAR_HAS_USER_REQUESTED_TO_FOLLOW
});

export const hasUserRequestedToFollow = (userId, userRequestedId) => dispatch => {

    dispatch(clearHasUserRequestedToFollow());
    backend.userService.hasUserRequestedToFollow(userId, userRequestedId,
        hasUserRequestedToFollow => dispatch(hasUserRequestedToFollowCompleted(hasUserRequestedToFollow)));

}

const getFeedCompleted = feed => ({
    type: actionTypes.GET_FEED_COMPLETED,
    feed
});

export const getFeed = criteria => dispatch => {

    dispatch(clearFeed());
    backend.imageService.getFeed(criteria,
        result => dispatch(getFeedCompleted({criteria, result})));

}

export const previousGetFeedResultPage = criteria =>
    getFeed({...criteria, page: criteria.page - 1});

export const nextGetFeedResultPage = criteria =>
    getFeed({...criteria, page: criteria.page + 1});

const clearFeed = () => ({
    type: actionTypes.CLEAR_FEED
});

const markImageAsSeenCompleted = () => ({
    type: actionTypes.MARK_IMAGE_AS_SEEN_COMPLETED,
});

export const markImageAsSeen = (userId, imageId) => dispatch =>
    backend.imageService.markImageAsSeen(userId, imageId,
        () => dispatch(markImageAsSeenCompleted()));

const reportUserCompleted = () => ({
    type: actionTypes.REPORT_USER_COMPLETED,
});

export const reportUser = (userReportedId, reason, explanation, onSuccess, onErrors) => dispatch =>
    backend.userService.reportUser(userReportedId, reason, explanation,
        () => {
            dispatch(reportUserCompleted());
            onSuccess();
        },
        onErrors);

const reportImageCompleted = () => ({
    type: actionTypes.REPORT_IMAGE_COMPLETED,
});

export const reportImage = (imageReportedId, reason, explanation, onSuccess, onErrors) => dispatch =>
    backend.imageService.reportImage(imageReportedId, reason, explanation,
        () => {
            dispatch(reportImageCompleted());
            onSuccess();
        },
        onErrors);
