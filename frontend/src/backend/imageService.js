import {config, appFetch} from './appFetch';

export const uploadImage = (formData, onSuccess, onErrors) =>
    appFetch(`/images/upload`,
        config('POST', formData), onSuccess, onErrors);

export const updateImage = (title, description, location, imageId, onSuccess, onErrors) =>
    appFetch(`/images/updateImage/${imageId}`,
        config('PUT', {title, description, location}), onSuccess, onErrors);

export const deleteImage = (imageId, onSuccess, onErrors) =>
    appFetch(`/images/deleteImage/${imageId}`,
        config('POST'), onSuccess, onErrors);

export const hideImage = (imageId, onSuccess, onErrors) =>
    appFetch(`/images/hideImage/${imageId}`,
        config('POST'), onSuccess, onErrors);

export const showImage = (imageId, onSuccess, onErrors) =>
    appFetch(`/images/showImage/${imageId}`,
        config('POST'), onSuccess, onErrors);

export const tagImage = (name, link, coordinateX, coordinateY, categoryId, imageId, brandId, userId,
                         onSuccess, onErrors) =>
    appFetch(`/images/tagging`,
        config('POST', {name, link, coordinateX, coordinateY, categoryId, imageId, brandId, userId}),
        onSuccess, onErrors);

export const updateTag = (name, link, categoryId, brandId, tagId, onSuccess, onErrors) =>
    appFetch(`/images/updateTag/${tagId}`,
        config('PUT', {name, link, categoryId, brandId}), onSuccess, onErrors);

export const deleteTagFromImage = (tagId, imageId, onSuccess, onErrors) =>
    appFetch(`/images/deleteTag/${tagId}`,
        config('POST', imageId), onSuccess, onErrors);

export const searchImages = ({categoryId, keywords, page}, onSuccess) => {

    let path = `/images/search?page=${page}`;

    path += categoryId ? `&categoryId=${categoryId}` : "";
    path += keywords.length > 0 ? `&keywords=${encodeURIComponent(keywords)}` : "";

    appFetch(path, config('GET'), onSuccess);

}

export const findByImageId = (id, userLoggedId, onSuccess) =>
    appFetch(`/images/${id}?userLoggedId=${userLoggedId}`, config('GET'), onSuccess);

export const findImageTags = (imageId, userLoggedId, onSuccess) =>
    appFetch(`/images/${imageId}/findTags?userLoggedId=${userLoggedId}`,
        config('GET'), onSuccess);

export const findImagesFromUser = ({userId, userLoggedId, page}, onSuccess) =>
    appFetch(`/images/search/user?page=${page}&userId=${userId}&userLoggedId=${userLoggedId}`,
        config('GET'), onSuccess);

export const likeImage = (userId, imageId, onSuccess, onErrors) =>
    appFetch(`/images/${imageId}/like`,
        config('POST'), onSuccess, onErrors);

export const deleteImageLike = (userId, imageId, onSuccess, onErrors) =>
    appFetch(`/images/${imageId}/deleteLike`,
        config('POST'), onSuccess, onErrors);

export const getNumImageLikes = (imageId, onSuccess, onErrors) =>
    appFetch(`/images/${imageId}/getNumImageLikes`,
        config('GET'), onSuccess, onErrors);

export const findImagesLikedByUser = ({userId, userLoggedId, dateDesc, page}, onSuccess, onErrors) =>
    appFetch(`/images/search/likedByUser?page=${page}&userId=${userId}&userLoggedId=${userLoggedId}&dateDesc=${dateDesc}`,
        config('GET'), onSuccess, onErrors);

export const findUsersThatLikedImage = ({imageId, userLoggedId, dateDesc, page}, onSuccess, onErrors) =>
    appFetch(`/images/search/usersThatLiked?page=${page}&imageId=${imageId}&userLoggedId=${userLoggedId}&dateDesc=${dateDesc}`,
        config('GET'), onSuccess, onErrors);

export const isImageLikedByUser = (imageId, onSuccess, onErrors) =>
    appFetch(`/images/${imageId}/isImageLikedByUser`,
        config('GET'), onSuccess, onErrors);

export const commentImage = (imageId, userId, text, onSuccess, onErrors) =>
    appFetch(`/images/${imageId}/comment`,
        config('POST', {text}), onSuccess, onErrors);

export const answerComment = (imageId, userId, text, commentAnsweredId, onSuccess, onErrors) =>
    appFetch(`/images/${imageId}/comment`,
        config('POST', {text, commentAnsweredId}), onSuccess, onErrors);

export const deleteComment = (commentId, userId, onSuccess, onErrors) =>
    appFetch(`/images/${commentId}/deleteComment`,
        config('POST'), onSuccess, onErrors);

export const getNumImageComments = (imageId, userLoggedId, onSuccess, onErrors) =>
    appFetch(`/images/${imageId}/getNumImageComments?userId=${userLoggedId}`,
        config('GET'), onSuccess, onErrors);

export const getNumCommentAnswers = (commentId, userLoggedId, onSuccess, onErrors) =>
    appFetch(`/images/${commentId}/getNumCommentAnswers?userId=${userLoggedId}`,
        config('GET'), onSuccess, onErrors);

export const findCommentsFromImage = ({userId, imageId, page}, onSuccess, onErrors) =>
    appFetch(`/images/search/commentsFromImage?page=${page}&userId=${userId}&imageId=${imageId}`,
        config('GET'), onSuccess, onErrors);

export const findAnswersFromComment = ({userId, commentId, page}, onSuccess, onErrors) =>
    appFetch(`/images/search/answersFromComment?page=${page}&userId=${userId}&commentId=${commentId}`,
        config('GET'), onSuccess, onErrors);

export const likeTag = (userId, tagId, onSuccess, onErrors) =>
    appFetch(`/images/tagging/${tagId}/likeTag`,
        config('POST'), onSuccess, onErrors);

export const deleteTagLike = (userId, tagId, onSuccess, onErrors) =>
    appFetch(`/images/tagging/${tagId}/deleteTagLike`,
        config('POST'), onSuccess, onErrors);

export const findTagsLikedByUser = ({userId, userLoggedId, dateDesc, page}, onSuccess, onErrors) =>
    appFetch(`/images/search/tagsLikedByUser?page=${page}&userId=${userId}&userLoggedId=${userLoggedId}&dateDesc=${dateDesc}`,
        config('GET'), onSuccess, onErrors);

export const findUsersThatLikedTag = ({userLoggedId, tagId, dateDesc, page}, onSuccess, onErrors) =>
    appFetch(`/images/search/usersThatLikedTag?page=${page}&userLoggedId=${userLoggedId}&tagId=${tagId}&dateDesc=${dateDesc}`,
        config('GET'), onSuccess, onErrors);

export const getNumTagLikes = (tagId, userLoggedId, onSuccess, onErrors) =>
    appFetch(`/images/search/tagging/${tagId}/getNumTagLikes?userId=${userLoggedId}`,
        config('GET'), onSuccess, onErrors);

export const isTagLikedByUser = (tagId, userLoggedId, onSuccess, onErrors) =>
    appFetch(`/images/search/tagging/${tagId}/isTagLikedByUser?userId=${userLoggedId}`,
        config('GET'), onSuccess, onErrors);

export const getFeed = ({userLoggedId, page}, onSuccess, onErrors) =>
    appFetch(`/images/search/getFeed?userLoggedId=${userLoggedId}&page=${page}`,
        config('GET'), onSuccess, onErrors);

export const markImageAsSeen = (userId, imageId, onSuccess, onErrors) =>
    appFetch(`/images/search/getFeed/markImageAsSeen`,
        config('POST', {userId, imageId}), onSuccess, onErrors);

export const reportImage = (imageReportedId, reason, explanation, onSuccess, onErrors) =>
    appFetch(`/images/${imageReportedId}/reportImage`, config('POST',
        {reason, explanation}), onSuccess, onErrors);