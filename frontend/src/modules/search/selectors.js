const getModuleState = state => state.search;

export const getFeed = state =>
    getModuleState(state).feed;

export const getUserSearch = state =>
    getModuleState(state).userSearch;

export const getImageSearch = state =>
    getModuleState(state).imageSearch;

export const getImage = state =>
    getModuleState(state).image;

export const getUser = state =>
    getModuleState(state).user;

export const getImagesFromUser = state =>
    getModuleState(state).imagesFromUser;

export const isUserFollowing = state =>
    getModuleState(state).isUserFollowing;

export const hasUserRequestedToFollow = state =>
    getModuleState(state).hasUserRequestedToFollow;

export const getNumUserFollowers = state =>
    getModuleState(state).numUserFollowers;

export const getUserFollowers = state =>
    getModuleState(state).userFollowers;

export const getNumUserFollowed = state =>
    getModuleState(state).numUserFollowed;

export const getUserFollowed = state =>
    getModuleState(state).userFollowed;

export const isImageLikedByUser = state =>
    getModuleState(state).isImageLikedByUser;

export const getNumImageLikes = state =>
    getModuleState(state).numImageLikes;

export const getImagesLikedByUser = state =>
    getModuleState(state).imagesLikedByUser;

export const getUsersThatLikedImage = state =>
    getModuleState(state).usersThatLikedImage;

export const getUserSettings = state =>
    getModuleState(state).userSettings;

export const getTags = state =>
    getModuleState(state).tags;

export const getNumImageComments = state =>
    getModuleState(state).numImageComments;

export const getCommentsFromImage = state =>
    getModuleState(state).commentsFromImage;

export const getNumCommentAnswers = state =>
    getModuleState(state).numCommentAnswers;

export const getAnswersFromComment = state =>
    getModuleState(state).answersFromComment;

export const isTagLikedByUser = state =>
    getModuleState(state).isTagLikedByUser;

export const getNumTagLikes = state =>
    getModuleState(state).numTagLikes;

export const getTagsLikedByUser = state =>
    getModuleState(state).tagsLikedByUser;

export const getUsersThatLikedTag = state =>
    getModuleState(state).usersThatLikedTag;