import * as actionTypes from './actionTypes';
import backend from '../../backend';

const uploadImageCompleted = lastImageUploaded => ({
    type: actionTypes.UPLOAD_IMAGE_COMPLETED,
    lastImageUploaded
});

export const uploadImage = (formData, onSuccess, onErrors) => dispatch =>
    backend.imageService.uploadImage(formData,
        lastImageUploaded => {
            dispatch(uploadImageCompleted(lastImageUploaded));
            onSuccess();
        },
        onErrors);

export const updateImageCompleted = image => ({
    type: actionTypes.UPDATE_IMAGE_COMPLETED,
    image
})

export const updateImage = (title, description, location, imageId, onSuccess, onErrors) => dispatch =>
    backend.imageService.updateImage(title, description, location, imageId,
        image => {
            dispatch(updateImageCompleted(image));
            onSuccess();
        },
        onErrors);

const deleteImageCompleted = () => ({
    type: actionTypes.DELETE_IMAGE_COMPLETED,
});

export const deleteImage = (imageId, onSuccess, onErrors) => dispatch =>
    backend.imageService.deleteImage(imageId,
        () => {
            dispatch(deleteImageCompleted());
            onSuccess();
        },
        onErrors);

const hideImageCompleted = () => ({
    type: actionTypes.HIDE_IMAGE_COMPLETED,
});

export const hideImage = (imageId, onSuccess, onErrors) => dispatch =>
    backend.imageService.hideImage(imageId,
        () => {
            dispatch(hideImageCompleted());
            onSuccess();
        },
        onErrors);

const showImageCompleted = () => ({
    type: actionTypes.SHOW_IMAGE_COMPLETED,
});

export const showImage = (imageId, onSuccess, onErrors) => dispatch =>
    backend.imageService.showImage(imageId,
        () => {
            dispatch(showImageCompleted());
            onSuccess();
        },
        onErrors);

const tagImageCompleted = () => ({
    type: actionTypes.TAG_IMAGE_COMPLETED,
});

export const tagImage = (tagName, link, coordinateX, coordinateY, categoryId, imageId, brandId, userId, onSuccess, onErrors) =>
        dispatch =>
    backend.imageService.tagImage(tagName, link, coordinateX, coordinateY, categoryId, imageId, brandId, userId,
        () => {
            dispatch(tagImageCompleted());
            onSuccess();
        },
        onErrors);

export const updateTagCompleted = () => ({
    type: actionTypes.UPDATE_TAG_COMPLETED,
})

export const updateTag = (name, link, categoryId, brandId, tagId, onSuccess, onErrors) => dispatch =>
    backend.imageService.updateTag(name, link, categoryId, brandId, tagId,
        () => {
            dispatch(updateTagCompleted());
            onSuccess();
        },
        onErrors);

const deleteTagFromImageCompleted = () => ({
    type: actionTypes.DELETE_TAG_FROM_IMAGE_COMPLETED,
});

export const deleteTagFromImage = (tagId, imageId, onSuccess, onErrors) => dispatch =>
    backend.imageService.deleteTagFromImage(tagId, imageId,
        () => {
            dispatch(deleteTagFromImageCompleted());
            onSuccess();
        },
        onErrors);