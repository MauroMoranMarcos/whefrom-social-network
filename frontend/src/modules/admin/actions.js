import backend from '../../backend';
import * as actionTypes from './actionTypes';
import {findUserFollowRequests} from "../users/actions";

const categoryCreated = () => ({
    type: actionTypes.CATEGORY_CREATED
});

export const createCategory = (name, active, onSuccess, onErrors) => dispatch =>
    backend.adminService.createCategory(name, active,
        () => {
            dispatch(categoryCreated());
            onSuccess();
        },
        onErrors);

const findCategoriesCompleted = categories => ({
    type: actionTypes.FIND_CATEGORIES_COMPLETED,
    categories
});

export const findAllCategories = () => dispatch => {
    backend.adminService.findAllCategories(
        categories => {
            dispatch(findCategoriesCompleted(categories))
        })
}

export const findCategories = (active) => dispatch => {
    backend.adminService.findCategories(active,
        categories => {
            dispatch(findCategoriesCompleted(categories))
        })
}

const editCategoryCompleted = () => ({
    type: actionTypes.EDIT_CATEGORY_COMPLETED
});

export const editCategory = (id, name, active, onSuccess, onErrors) => dispatch => {
    backend.adminService.editCategory(id, name, active,
        () => {
            dispatch(editCategoryCompleted());
            onSuccess();
        },
        onErrors);
}

const findCategoryByIdCompleted = category => ({
    type: actionTypes.FIND_CATEGORY_BY_ID_COMPLETED,
    category
});

export const findCategoryById = id => dispatch => {
    backend.adminService.findByCategoryId(id,
        category => dispatch(findCategoryByIdCompleted(category)));
}

export const clearCategory = () => ({
    type: actionTypes.CLEAR_CATEGORY
});

const getCategoryNumTimesUsedCompleted = () => ({
    type: actionTypes.GET_CATEGORY_NUM_TIMES_USED_COMPLETED,
});

export const getCategoryNumTimesUsed = (id, onSuccess, onErrors) => dispatch => {
    backend.adminService.getCategoryNumTimesUsed(id,
        numTimesUsed => {
            dispatch(getCategoryNumTimesUsedCompleted());
            onSuccess(numTimesUsed)
        },
        onErrors);
}

const findUserReportsCompleted = userReports => ({
    type: actionTypes.FIND_USER_REPORTS_COMPLETED,
    userReports
});

export const findUserReports = criteria => dispatch => {

    dispatch(clearUserReports());
    backend.adminService.findUserReports(criteria,
        result => dispatch(findUserReportsCompleted({criteria, result})));

}

export const previousFindUserReportsResultPage = criteria =>
    findUserReports({...criteria, page: criteria.page - 1});

export const nextFindUserReportsResultPage = criteria =>
    findUserReports({...criteria, page: criteria.page + 1});

const clearUserReports = () => ({
    type: actionTypes.CLEAR_USER_REPORTS
});

const findUserReportByIdCompleted = userReport => ({
    type: actionTypes.FIND_USER_REPORT_BY_ID_COMPLETED,
    userReport
});

export const findUserReportById = (id, onSuccess, onErrors) => dispatch => {
    backend.adminService.findUserReportById(id,
        userReport => {
            dispatch(findUserReportByIdCompleted(userReport));
            onSuccess();
        } ,
        onErrors);
}

export const clearUserReport = () => ({
    type: actionTypes.CLEAR_USER_REPORT
});

const findImageReportsCompleted = imageReports => ({
    type: actionTypes.FIND_IMAGE_REPORTS_COMPLETED,
    imageReports
});

export const findImageReports = criteria => dispatch => {

    dispatch(clearImageReports());
    backend.adminService.findImageReports(criteria,
        result => dispatch(findImageReportsCompleted({criteria, result})));

}

export const previousFindImageReportsResultPage = criteria =>
    findImageReports({...criteria, page: criteria.page - 1});

export const nextFindImageReportsResultPage = criteria =>
    findImageReports({...criteria, page: criteria.page + 1});

const clearImageReports = () => ({
    type: actionTypes.CLEAR_IMAGE_REPORTS
});

const findImageReportByIdCompleted = imageReport => ({
    type: actionTypes.FIND_IMAGE_REPORT_BY_ID_COMPLETED,
    imageReport
});

export const findImageReportById = (id, onSuccess, onErrors) => dispatch => {
    backend.adminService.findImageReportById(id,
        imageReport => {
            dispatch(findImageReportByIdCompleted(imageReport));
            onSuccess();
        } ,
        onErrors);
}

export const clearImageReport = () => ({
    type: actionTypes.CLEAR_IMAGE_REPORT
});

const warnUserReportWithEmailCompleted = () => ({
    type: actionTypes.WARN_USER_REPORT_WITH_EMAIL_COMPLETED,
});

export const warnUserReportWithEmail = (userReportId, warning, onSuccess, onErrors) => dispatch => {
    backend.adminService.warnUserReportWithEmail(userReportId, warning,
        () => {
            dispatch(warnUserReportWithEmailCompleted());
            onSuccess();
        } ,
        onErrors);
}

const warnImageReportWithEmailCompleted = () => ({
    type: actionTypes.WARN_IMAGE_REPORT_WITH_EMAIL_COMPLETED,
});

export const warnImageReportWithEmail = (imageReportId, warning, onSuccess, onErrors) => dispatch => {
    backend.adminService.warnImageReportWithEmail(imageReportId, warning,
        () => {
            dispatch(warnImageReportWithEmailCompleted());
            onSuccess();
        } ,
        onErrors);
}

const silenceUserReportCompleted = () => ({
    type: actionTypes.SILENCE_USER_REPORT_COMPLETED,
});

export const silenceUserReport = (userReport, until, onSuccess, onErrors) => dispatch => {
    backend.adminService.silenceUserReport(userReport, until,
        () => {
            dispatch(silenceUserReportCompleted());
            onSuccess();
        } ,
        onErrors);
}

const silenceImageReportCompleted = () => ({
    type: actionTypes.SILENCE_IMAGE_REPORT_COMPLETED,
});

export const silenceImageReport = (imageReport, until, onSuccess, onErrors) => dispatch => {
    backend.adminService.silenceImageReport(imageReport, until,
        () => {
            dispatch(silenceImageReportCompleted());
            onSuccess();
        } ,
        onErrors);
}

const blockUserReportCompleted = () => ({
    type: actionTypes.BLOCK_USER_REPORT_COMPLETED,
});

export const blockUserReport = (userReport, until, onSuccess, onErrors) => dispatch => {
    backend.adminService.blockUserReport(userReport, until,
        () => {
            dispatch(blockUserReportCompleted());
            onSuccess();
        } ,
        onErrors);
}

const blockImageReportCompleted = () => ({
    type: actionTypes.BLOCK_IMAGE_REPORT_COMPLETED,
});

export const blockImageReport = (imageReport, until, onSuccess, onErrors) => dispatch => {
    backend.adminService.blockImageReport(imageReport, until,
        () => {
            dispatch(blockImageReportCompleted());
            onSuccess();
        } ,
        onErrors);
}

const markUserReportAsResolvedCompleted = () => ({
    type: actionTypes.MARK_USER_REPORT_AS_RESOLVED_COMPLETED,
});

export const markUserReportAsResolved = (userReportId, onSuccess, onErrors) => dispatch => {
    backend.adminService.markUserReportAsResolved(userReportId,
        () => {
            dispatch(markUserReportAsResolvedCompleted());
            onSuccess();
        } ,
        onErrors);
}

const markImageReportAsResolvedCompleted = () => ({
    type: actionTypes.MARK_IMAGE_REPORT_AS_RESOLVED_COMPLETED,
});

export const markImageReportAsResolved = (imageReportId, onSuccess, onErrors) => dispatch => {
    backend.adminService.markImageReportAsResolved(imageReportId,
        () => {
            dispatch(markImageReportAsResolvedCompleted());
            onSuccess();
        } ,
        onErrors);
}

const clearVerificationRequests = () => ({
    type: actionTypes.CLEAR_VERIFICATION_REQUESTS
});

const findVerificationRequestsCompleted = verificationRequests => ({
    type: actionTypes.FIND_VERIFICATION_REQUESTS_COMPLETED,
    verificationRequests
});

export const findVerificationRequests = criteria => dispatch => {

    dispatch(clearVerificationRequests());
    backend.adminService.findVerificationRequests(criteria,
        result => dispatch(findVerificationRequestsCompleted({criteria, result})));

}

export const previousFindVerificationRequestsResultPage = (criteria) =>
    findVerificationRequests({...criteria, page: criteria.page - 1});

export const nextFindVerificationRequestsResultPage = (criteria) =>
    findVerificationRequests({...criteria, page: criteria.page + 1});

const acceptVerificationRequestCompleted = () => ({
    type: actionTypes.ACCEPT_VERIFICATION_REQUEST_COMPLETED,
});

export const acceptVerificationRequest = (brandRequestingId, onSuccess, onErrors) => dispatch =>
    backend.adminService.acceptVerificationRequest(brandRequestingId,
        () => {
            dispatch(acceptVerificationRequestCompleted());
            onSuccess();
        },
        onErrors);

const rejectVerificationRequestCompleted = () => ({
    type: actionTypes.REJECT_VERIFICATION_REQUEST_COMPLETED,
});

export const rejectVerificationRequest = (brandRequestingId, onSuccess, onErrors) => dispatch =>
    backend.adminService.rejectVerificationRequest(brandRequestingId,
        () => {
            dispatch(rejectVerificationRequestCompleted());
            onSuccess();
        },
        onErrors);

const hasBrandRequestedVerificationCompleted = () => ({
    type: actionTypes.HAS_BRAND_REQUESTED_VERIFICATION_ADMIN_COMPLETED,
});

export const hasBrandRequestedVerification = (brandId, onSuccess, onErrors) => dispatch =>
    backend.adminService.hasBrandRequestedVerification(brandId,
        hasRequestedVerification => {
            dispatch(hasBrandRequestedVerificationCompleted);
            onSuccess(hasRequestedVerification);
        },
        onErrors);

const findUserPenaltyByUserIdCompleted = userPenalty => ({
    type: actionTypes.FIND_USER_PENALTY_BY_USER_ID_COMPLETED,
    userPenalty
});

export const findUserPenaltyByUserId = (userId, onSuccess, onErrors) => dispatch => {
    backend.adminService.findUserPenaltyByUserId(userId,
        userPenalty => {
            dispatch(findUserPenaltyByUserIdCompleted(userPenalty));
            onSuccess(userPenalty);
        } ,
        onErrors);
}

export const clearUserPenalty = () => ({
    type: actionTypes.CLEAR_USER_PENALTY
});

const removeSilenceFromUserCompleted = () => ({
    type: actionTypes.REMOVE_SILENCE_FROM_USER_COMPLETED,
});

export const removeSilenceFromUser = (userId, onSuccess, onErrors) => dispatch =>
    backend.adminService.removeSilenceFromUser(userId,
        () => {
            dispatch(removeSilenceFromUserCompleted());
            onSuccess();
        },
        onErrors);

const removeBlockFromUserCompleted = () => ({
    type: actionTypes.REMOVE_BLOCK_FROM_USER_COMPLETED,
});

export const removeBlockFromUser = (userId, onSuccess, onErrors) => dispatch =>
    backend.adminService.removeBlockFromUser(userId,
        () => {
            dispatch(removeBlockFromUserCompleted());
            onSuccess();
        },
        onErrors);

const silenceUserCompleted = () => ({
    type: actionTypes.SILENCE_USER_COMPLETED,
});

export const silenceUser = (userId, until, onSuccess, onErrors) => dispatch => {
    backend.adminService.silenceUser(userId, until,
        () => {
            dispatch(silenceUserCompleted());
            onSuccess();
        } ,
        onErrors);
}

const blockUserCompleted = () => ({
    type: actionTypes.BLOCK_USER_COMPLETED,
});

export const blockUser = (userId, until, onSuccess, onErrors) => dispatch => {
    backend.adminService.blockUser(userId, until,
        () => {
            dispatch(blockUserCompleted());
            onSuccess();
        } ,
        onErrors);
}