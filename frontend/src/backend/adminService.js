import {config, appFetch} from './appFetch';

export const createCategory = (name, active, onSuccess, onErrors) =>
    appFetch(`/admin/categories/create`,
        config('POST', {name, active}), onSuccess, onErrors);

export const findAllCategories = (onSuccess, onErrors) =>
    appFetch(`/admin/categories`,
        config('GET'), onSuccess, onErrors);

export const findCategories = (active, onSuccess, onErrors) =>
    appFetch(`/admin/categories?active=${active}`,
        config('GET'), onSuccess, onErrors);

export const editCategory = (id, name, active, onSuccess, onErrors) =>
    appFetch(`/admin/categories/update/${id}`,
        config('PUT', {name, active}),
        data => {
            console.log('Success response data:', data);
            try {
                onSuccess();  // Envolviendo en try-catch
            } catch (e) {
                console.error('Error in onSuccess:', e);
            }
        },
        error => {
            console.error('Error response:', error);
            onErrors(error);
        });

export const findByCategoryId = (id, onSuccess) =>
    appFetch(`/admin/categories/${id}`, config('GET'), onSuccess);

export const getCategoryNumTimesUsed = (id, onSuccess) =>
    appFetch(`/admin/categories/${id}/numTimesUsed`, config('GET'), onSuccess);

export const findUserReports = ({page}, onSuccess, onErrors) =>
    appFetch(`/admin/reports/userReports?page=${page}`,
        config('GET'), onSuccess, onErrors);

export const findUserReportById = (userReportId, onSuccess, onErrors) =>
    appFetch(`/admin/reports/userReports/${userReportId}`,
        config('GET'), onSuccess, onErrors);

export const findImageReports = ({page}, onSuccess, onErrors) =>
    appFetch(`/admin/reports/imageReports?page=${page}`,
        config('GET'), onSuccess, onErrors);

export const findImageReportById = (imageReportId, onSuccess, onErrors) =>
    appFetch(`/admin/reports/imageReports/${imageReportId}`,
        config('GET'), onSuccess, onErrors);

export const warnUserReportWithEmail = (userReportId, warning, onSuccess, onErrors) =>
    appFetch(`/admin/reports/userReports/${userReportId}/warning`,
        config('POST', {warning}), onSuccess, onErrors);

export const warnImageReportWithEmail = (imageReportId, warning, onSuccess, onErrors) =>
    appFetch(`/admin/reports/imageReports/${imageReportId}/warning`,
        config('POST', {warning}), onSuccess, onErrors);

export const silenceUserReport = (userReportId, until, onSuccess, onErrors) =>
    appFetch(`/admin/reports/userReports/${userReportId}/silence`,
        config('POST', until), onSuccess, onErrors);

export const silenceImageReport = (imageReportId, until, onSuccess, onErrors) =>
    appFetch(`/admin/reports/imageReports/${imageReportId}/silence`,
        config('POST', until), onSuccess, onErrors);

export const blockUserReport = (userReportId, until, onSuccess, onErrors) =>
    appFetch(`/admin/reports/userReports/${userReportId}/block`,
        config('POST', until), onSuccess, onErrors);

export const blockImageReport = (imageReportId, until, onSuccess, onErrors) =>
    appFetch(`/admin/reports/imageReports/${imageReportId}/block`,
        config('POST', until), onSuccess, onErrors);

export const markUserReportAsResolved = (userReportId, onSuccess, onErrors) =>
    appFetch(`/admin/reports/userReports/${userReportId}/markAsResolved`,
        config('PUT'), onSuccess, onErrors);

export const markImageReportAsResolved = (imageReportId, onSuccess, onErrors) =>
    appFetch(`/admin/reports/imageReports/${imageReportId}/markAsResolved`,
        config('PUT'), onSuccess, onErrors);

export const findUserPenaltyByUserId = (userId, onSuccess, onErrors) =>
    appFetch(`/admin/reports/userPenalty/${userId}`,
        config('GET'), onSuccess, onErrors);

export const removeSilenceFromUser = (userId, onSuccess, onErrors) =>
    appFetch(`/admin/reports/userPenalty/${userId}/removeSilence`,
        config('PUT'), onSuccess, onErrors);

export const removeBlockFromUser = (userId, onSuccess, onErrors) =>
    appFetch(`/admin/reports/userPenalty/${userId}/removeBlock`,
        config('PUT'), onSuccess, onErrors);

export const silenceUser = (userId, until, onSuccess, onErrors) =>
    appFetch(`/admin/reports/${userId}/silenceUser`,
        config('POST', until), onSuccess, onErrors);

export const blockUser = (userId, until, onSuccess, onErrors) =>
    appFetch(`/admin/reports/${userId}/blockUser`,
        config('POST', until), onSuccess, onErrors);

export const findVerificationRequests = ({page}, onSuccess, onErrors) =>
    appFetch(`/admin/verificationRequests?page=${page}`,
        config('GET'), onSuccess, onErrors);

export const acceptVerificationRequest = (userRequestingId, onSuccess, onErrors) =>
    appFetch(`/admin/verificationRequests/accept`,
        config('PUT', {userRequestingId}), onSuccess, onErrors);

export const rejectVerificationRequest = (userRequestingId, onSuccess, onErrors) =>
    appFetch(`/admin/verificationRequests/reject`,
        config('PUT', {userRequestingId}), onSuccess, onErrors);

export const hasBrandRequestedVerification = (brandId, onSuccess, onErrors) =>
    appFetch(`/admin/verificationRequests/exists/${brandId}`,
        config('GET'), onSuccess, onErrors);
