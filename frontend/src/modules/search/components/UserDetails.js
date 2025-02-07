import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";

import * as selectors from "../selectors";
import * as actions from "../actions";

import users from '../../users';
import admin from "../../admin";

import Images from "./Images";

import {
    Alert,
    Avatar,
    Box, Button, ButtonGroup,
    Container,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Divider, Fab, FormControl, FormHelperText,
    Grid,
    IconButton, InputLabel, MenuItem,
    Paper, Select, Skeleton,
    TextField, Tooltip, Typography, useTheme
} from "@mui/material";
import {FormattedMessage} from "react-intl";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined';
import EmojiPeopleOutlinedIcon from '@mui/icons-material/EmojiPeopleOutlined';
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';
import HideImageOutlinedIcon from "@mui/icons-material/HideImageOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CropOriginalOutlinedIcon from '@mui/icons-material/CropOriginalOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';

import useMediaQuery from "@mui/material/useMediaQuery";
import {BackButton, Errors} from "../../common";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

const UserDetails = () =>  {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector(users.selectors.isLoggedIn);
    const userLogged = useSelector(users.selectors.getUser);
    const isAdmin = useSelector(users.selectors.isAdmin);
    const user = useSelector(selectors.getUser);
    const isUserFollowing = useSelector(selectors.isUserFollowing);
    const hasUserRequestedToFollow = useSelector(selectors.hasUserRequestedToFollow);
    const numFollowers = useSelector(selectors.getNumUserFollowers);
    const numFollowed = useSelector(selectors.getNumUserFollowed);
    const imagesFromUser = useSelector(selectors.getImagesFromUser);
    const userPenalty = useSelector(admin.selectors.getUserPenalty);
    const [userSettings, setUserSettings] = useState(null);
    const [brand, setBrand] = useState(null);
    const [showFollowers, setShowFollowers] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openActionsDialog, setOpenActionsDialog] = useState(false);
    const [openReportDialog, setOpenReportDialog] = useState(false);
    const [reason, setReason] = useState('NO_REASON');
    const [explanation, setExplanation] = useState('');
    const [userLoaded, setUserLoaded] = useState(false);
    const [hasRequestedVerification, setHasRequestedVerification] = useState(false);
    const [openAcceptVerificationRequestDialog, setOpenAcceptVerificationRequestDialog] = useState(false);
    const [openRemoveSilenceDialog, setOpenRemoveSilenceDialog] = useState(false);
    const [openRemoveBlockDialog, setOpenRemoveBlockDialog] = useState(false);
    const [silencedUntil, setSilencedUntil] = useState('');
    const [blockedUntil, setBlockedUntil] = useState('');
    const [openEditSilenceDialog, setOpenEditSilenceDialog] = useState(false);
    const [openEditBlockDialog, setOpenEditBlockDialog] = useState(false);
    const [openSilenceUserDialog, setOpenSilenceUserDialog] = useState(false);
    const [openBlockUserDialog, setOpenBlockUserDialog] = useState(false);
    const [until, setUntil] = useState('');
    const [locale, setLocale] = useState(navigator.language || navigator.languages[0]);
    const [backendErrors, setBackendErrors] = useState(null);
    const {id} = useParams();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [isFormValid, setIsFormValid] = useState(false);
    const [requiredAlertMessages, setRequiredAlertMessages] = useState({
        reason: false,
        explanation: false,
    });
    const [requiredAlertMessagesSilencedUntil, setRequiredAlertMessagesSilencedUntil] = useState({
        silencedUntil: false,
    });
    const [requiredAlertMessagesBlockedUntil, setRequiredAlertMessagesBlockedUntil] = useState({
        blockedUntil: false,
    });
    const [requiredAlertMessagesUntil, setRequiredAlertMessagesUntil] = useState({
        until: false,
    });
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    let editSilenceForm;
    let editBlockForm;
    let silenceForm;
    let blockForm;

    useEffect(() => {

        const userId = Number(id);

        if (!Number.isNaN(userId)) {
            dispatch(actions.findUserById(userId));
            dispatch(actions.findUserSettingsByUserId(userId,
                    userSettings => setUserSettings(userSettings)));
            dispatch(actions.getNumUserFollowers(userId));
            dispatch(actions.getNumUserFollowed(userId));

            if (isLoggedIn && isAdmin) {
                dispatch(admin.actions.findUserPenaltyByUserId(userId,
                    userPenalty => {
                        setSilencedUntil(userPenalty.silencedUntil);
                        setBlockedUntil(userPenalty.blockedUntil);
                    }));
            }
        }

        return () => {
            dispatch(actions.clearUser());

            if (isLoggedIn && isAdmin) {
                dispatch(admin.actions.clearUserPenalty());
            }
        }

    }, [id, dispatch]);

    useEffect(() => {

        if (user && user.id && userSettings && !userLoaded) {

            if (isLoggedIn && (isAdmin ||userSettings.privacyPublic || isUserFollowing || user.id === userLogged.id)) {
                dispatch(actions.findImagesFromUser({userId: user.id, userLoggedId: userLogged.id, page: 0}));
            } else if (!isLoggedIn && userSettings.privacyPublic) {
                dispatch(actions.findImagesFromUser({userId: user.id, userLoggedId: 0, page: 0}));
            }

            setUserLoaded(true);
        }

        return () => {
            dispatch(actions.clearImagesFromUser());
        }

    }, [user, userSettings, userLoaded, dispatch]);

    useEffect(() => {

        const userId = Number(id);

        if (isLoggedIn && !Number.isNaN(userId)) {
            dispatch(actions.isUserFollowingUser(userLogged.id, userId));
            dispatch(actions.hasUserRequestedToFollow(userLogged.id, userId));
        }

    }, [isLoggedIn, userLogged]);

    useEffect(() => {

        if (user && user.id) {
            if (isLoggedIn && isAdmin && user.role === 'BRAND_USER') {
                dispatch(admin.actions.hasBrandRequestedVerification(user.id,
                    hasRequestedVerification => setHasRequestedVerification(hasRequestedVerification)));
            }
        }

    }, [user, userLoaded, dispatch]);

    useEffect(() => {

        if (showFollowers === true) {

            if (isLoggedIn) {
                dispatch(actions.findUserFollowers(user.id, {userLoggedId: userLogged.id, dateDesc: false, page: 0}));

                navigate(`/search/userdetails/${user.id}/follows`, { state: {showFollowers, userId: user.id} });
            } else {
                dispatch(actions.findUserFollowers(user.id, {userLoggedId: 0, dateDesc: false, page: 0}));

                navigate(`/search/userdetails/${user.id}/follows`, { state: {showFollowers, userId: user.id} });
            }

        } else if (showFollowers === false) {

            if (isLoggedIn) {
                dispatch(actions.findUserFollowed(user.id, {userLoggedId: userLogged.id, dateDesc: false, page: 0}));

                navigate(`/search/userdetails/${user.id}/follows`, { state: {showFollowers, userId: user.id} });
            } else {
                dispatch(actions.findUserFollowed(user.id, {userLoggedId: 0, dateDesc: false, page: 0}));

                navigate(`/search/userdetails/${user.id}/follows`, { state: {showFollowers, userId: user.id} });
            }

        }

    }, [showFollowers]);

    const handleClickOpenDialog = () => {

        setOpenDialog(true);

    };

    const handleCloseDialog = () => {

        setOpenDialog(false);

    };

    const handleClickOpenActionsDialog = () => {

        setOpenActionsDialog(true);

    };

    const handleCloseActionsDialog = () => {

        setOpenActionsDialog(false);

    };

    const handleOpenReportDialog = () => {

        setOpenReportDialog(true);

    }

    const handleCloseReportDialog = () => {

        setOpenReportDialog(false);

    }

    const handleConfirmUserReport = () => {

        handleValidation();

    }

    const restoreReportFields = () => {

        setReason('');
        setExplanation('');

    }

    const handleValidation = () => {

        const newRequiredAlerts = {
            reason: reason === 'NO_REASON',
            explanation: explanation === '',
        };
        setRequiredAlertMessages(newRequiredAlerts);
        const newIsFormValid = !newRequiredAlerts.reason && !newRequiredAlerts.explanation;
        setIsFormValid(newIsFormValid);

        if (newIsFormValid) {

            dispatch(actions.reportUser(user.id, reason, explanation,
                () => {
                    handleCloseReportDialog();
                    handleCloseActionsDialog();
                    restoreReportFields();
                }));

        }
    };

    const handleSeeFollowers = () => {

        setShowFollowers(true);

    };

    const handleSeeFollowed = () => {

        setShowFollowers(false);

    };

    const handleSeeLikesFromUser = () => {

        if (isLoggedIn) {
            dispatch(actions.findImagesLikedByUser({userId: user.id, userLoggedId: userLogged.id, dateDesc: true, page: 0}));
            dispatch(actions.findTagsLikedByUser({userLoggedId: userLogged.id, userId: user.id, dateDesc: true, page: 0}));
        } else {
            dispatch(actions.findImagesLikedByUser({userId: user.id, userLoggedId: 0, dateDesc: true, page: 0}));
            dispatch(actions.findTagsLikedByUser({userLoggedId: 0, userId: user.id, dateDesc: true, page: 0}));
        }

        navigate(`/search/userdetails/${user.id}/imagesliked`, { state: {userId: user.id} });

    }

    const handleFollowUser = () => {

        dispatch(actions.followUser(userLogged.id, user.id,
            () => {
                dispatch(actions.getNumUserFollowers(user.id));
                dispatch(actions.isUserFollowingUser(userLogged.id, user.id));
            },
            errors => setBackendErrors(errors)));

    }

    const handleUnfollowUser = () => {

        dispatch(actions.unfollowUser(userLogged.id, user.id,
            () => {
                dispatch(actions.getNumUserFollowers(user.id));
                dispatch(actions.isUserFollowingUser(userLogged.id, user.id));
            },
            errors => setBackendErrors(errors)));

    }

    const handleRequestFollow = () => {

        dispatch(actions.requestFollow(userLogged.id, user.id,
            () => {
                dispatch(actions.hasUserRequestedToFollow(userLogged.id, user.id));

            },
            errors => setBackendErrors(errors)));

    }

    const handleNotLoggedIn = () => {

        localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);

        navigate('/users/login');

    }

    const handleDeleteRequestFollow = () => {

        dispatch(actions.deleteRequestFollow(userLogged.id, user.id,
            () => {
                dispatch(actions.hasUserRequestedToFollow(userLogged.id, user.id));
            },
            errors => setBackendErrors(errors)));

    }

    const handleUpdateProfile = event => {
        event.preventDefault();

        navigate('/users/updateProfile/');
    }

    const handleSeeRewardsFromBrand = event => {
        event.preventDefault();

        navigate('/search/brandrewards', { state: {brandId: user.id}} );
    }

    const handleAcceptVerificationRequest = (brandRequestingId) => {

        dispatch(admin.actions.acceptVerificationRequest(brandRequestingId,
            () => {
                dispatch(admin.actions.hasBrandRequestedVerification(brandRequestingId,
                    hasRequestedVerification => setHasRequestedVerification(hasRequestedVerification)));
            },
            errors => setBackendErrors(errors)));

    }

    const handleRejectVerificationRequest = (brandRequestingId) => {

        dispatch(admin.actions.rejectVerificationRequest(brandRequestingId,
            () => {
                dispatch(admin.actions.hasBrandRequestedVerification(brandRequestingId,
                    hasRequestedVerification => setHasRequestedVerification(hasRequestedVerification)));
            },
            errors => setBackendErrors(errors)));

    }

    const handleOpenAcceptVerificationRequestDialog = () => {

        setOpenAcceptVerificationRequestDialog(true);

    }

    const handleCloseAcceptVerificationRequestDialog = () => {

        setOpenAcceptVerificationRequestDialog(false);

    }

    const isAfter = (date) => {
        const today = new Date();
        const dateFormatted = new Date(date);
        today.setHours(0, 0, 0, 0);
        dateFormatted.setHours(0, 0, 0, 0);

        return dateFormatted > today;
    };

    const handleOpenRemoveSilenceDialog = () => {

        setOpenRemoveSilenceDialog(true);

    }

    const handleCloseRemoveSilenceDialog = () => {

        setOpenRemoveSilenceDialog(false);

    }

    const handleOpenRemoveBlockDialog = () => {

        setOpenRemoveBlockDialog(true);

    }

    const handleCloseRemoveBlockDialog = () => {

        setOpenRemoveBlockDialog(false);

    }

    const handleRemoveSilenceFromUser = () => {

        dispatch(admin.actions.removeSilenceFromUser(user.id,
            () => {
                dispatch(admin.actions.findUserPenaltyByUserId(user.id));
            },
            errors => setBackendErrors(errors)));

    }

    const handleRemoveBlockFromUser = () => {

        dispatch(admin.actions.removeBlockFromUser(user.id,
            () => {
                dispatch(admin.actions.findUserPenaltyByUserId(user.id));
            },
            errors => setBackendErrors(errors)));

    }

    const handleOpenEditSilenceDialog = () => {

        setOpenEditSilenceDialog(true);

    }

    const handleCloseEditSilenceDialog = () => {

        setOpenEditSilenceDialog(false);

    }

    const handleOpenEditBlockDialog = () => {

        setOpenEditBlockDialog(true);

    }

    const handleCloseEditBlockDialog = () => {

        setOpenEditBlockDialog(false);

    }

    const handleSubmitEditSilence = event => {

        event.preventDefault();

        handleValidationSilencedUntil();

        const dateObject = new Date(silencedUntil);

        const isoDateObject = dateObject.toISOString();

        if (editSilenceForm.checkValidity()) {

            const formData = new FormData();

            formData.append('until', isoDateObject);

            dispatch(admin.actions.silenceUser(
                user.id,
                formData,
                () => {
                    dispatch(admin.actions.findUserPenaltyByUserId(user.id));
                    handleCloseEditSilenceDialog();
                },
                errors => setBackendErrors(errors)));

        } else {

            setBackendErrors(null);
            editSilenceForm.classList.add('was-validated');

        }

    }

    const handleValidationSilencedUntil = () => {

        const newRequiredAlerts = {
            silencedUntil: silencedUntil === '',
        };
        setRequiredAlertMessagesSilencedUntil(newRequiredAlerts);

    };

    const handleSubmitEditBlock = event => {

        event.preventDefault();

        handleValidationBlockedUntil();

        const dateObject = new Date(blockedUntil);

        const isoDateObject = dateObject.toISOString();

        if (editBlockForm.checkValidity()) {

            const formData = new FormData();

            formData.append('until', isoDateObject);

            dispatch(admin.actions.blockUser(
                user.id,
                formData,
                () => {
                    dispatch(admin.actions.findUserPenaltyByUserId(user.id));
                    handleCloseEditBlockDialog();
                },
                errors => setBackendErrors(errors)));

        } else {

            setBackendErrors(null);
            editBlockForm.classList.add('was-validated');

        }

    }

    const handleValidationBlockedUntil = () => {

        const newRequiredAlerts = {
            blockedUntil: blockedUntil === '',
        };
        setRequiredAlertMessagesBlockedUntil(newRequiredAlerts);

    };

    const handleOpenSilenceUserDialog = () => {

        setOpenSilenceUserDialog(true);

    }

    const handleCloseSilenceUserDialog = () => {

        setOpenSilenceUserDialog(false);

    }

    const handleOpenBlockUserDialog = () => {

        setOpenBlockUserDialog(true);

    }

    const handleCloseBlockUserDialog = () => {

        setOpenBlockUserDialog(false);

    }

    const handleSubmitSilenceUser = event => {

        event.preventDefault();

        handleValidationUntil();

        const dateObject = new Date(until);

        const isoDateObject = dateObject.toISOString();

        if (silenceForm.checkValidity()) {

            const formData = new FormData();

            formData.append('until', isoDateObject);

            dispatch(admin.actions.silenceUser(
                user.id,
                formData,
                () => {
                    dispatch(admin.actions.findUserPenaltyByUserId(user.id,
                        userPenalty => {
                            setSilencedUntil(userPenalty.silencedUntil);
                            setBlockedUntil(userPenalty.blockedUntil);
                        }));
                    handleCloseSilenceUserDialog();
                    handleCloseActionsDialog();
                    resetFormFields();
                },
                errors => setBackendErrors(errors)));

        } else {

            setBackendErrors(null);
            silenceForm.classList.add('was-validated');

        }

    }

    const handleSubmitBlockUser = event => {

        event.preventDefault();

        handleValidationUntil();

        const dateObject = new Date(until);

        const isoDateObject = dateObject.toISOString();

        if (blockForm.checkValidity()) {

            const formData = new FormData();

            formData.append('until', isoDateObject);

            dispatch(admin.actions.blockUser(
                user.id,
                formData,
                () => {
                    dispatch(admin.actions.findUserPenaltyByUserId(user.id,
                        userPenalty => {
                            setSilencedUntil(userPenalty.silencedUntil);
                            setBlockedUntil(userPenalty.blockedUntil);
                        }));
                    handleCloseBlockUserDialog();
                    handleCloseActionsDialog();
                    resetFormFields();
                },
                errors => setBackendErrors(errors)));

        } else {

            setBackendErrors(null);
            blockForm.classList.add('was-validated');

        }

    }

    const handleValidationUntil = () => {

        const newRequiredAlerts = {
            until: until === '',
        };
        setRequiredAlertMessagesUntil(newRequiredAlerts);

    };

    const resetFormFields = () => {

        setUntil('');

    }

    const feedback = () => (
        <Container component="main" maxWidth={isMobile ? false : "lg"} disableGutters={true}
                   sx={{
                       display: "flex",
                       flexDirection: "column",
                       justifyContent: "center",
                       padding: 0,
                   }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "column" },
                    justifyContent: "center",
                    gap: 0,
                    border: '1px solid #9575cd',
                    borderRadius: '4px'
                }}>
                <Paper elevation={8}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "start",
                        }}>
                        <Skeleton
                            sx={{ ml: 1, mr: 1 }}
                            animation="wave"
                            height={60}
                            width="100%"
                        />
                    </Box>
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ml: 8,
                            mr: 8,
                        }}>
                        <Skeleton
                            variant="circular"
                            width={100}
                            height={100}
                            animation="wave" />
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                ml: 1,
                                mr: 1,
                                flexGrow: 1,
                            }}>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <Skeleton
                                        animation="wave"
                                        height={55}
                                        width="100%"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Skeleton
                                        animation="wave"
                                        height={55}
                                        width="100%"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                        <Skeleton
                            sx={{ ml: 1, mr: 1 }}
                            animation="wave"
                            height={60}
                            width="100%"
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ml: 10,
                            mr: 10
                        }}>
                        <Skeleton
                            sx={{ mr: 0.5 }}
                            animation="wave"
                            height={55}
                            width="50%"
                        />
                        <Skeleton
                            sx={{ ml: 0.5 }}
                            animation="wave"
                            height={55}
                            width="50%"
                        />
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: isMobile ? '95%' : '97%',
                            ml: 1,
                            mr: 1,
                            mb: 1,
                        }}>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                                <Skeleton sx={{ m: 0.5 }} width="100%" height={isMobile ? 90 : 200} animation="wave" variant="rectangular" />
                                <Skeleton sx={{ m: 0.5 }} width="100%" height={isMobile ? 90 : 200} animation="wave" variant="rectangular" />
                                <Skeleton sx={{ m: 0.5 }} width="100%" height={isMobile ? 90 : 200} animation="wave" variant="rectangular" />
                            </Box>
                        ))
                        }
                    </Box>
                </Paper>
            </Box>
        </Container>
    );

    if (!user) {
        return feedback();
    }

    if (!userSettings) {
        return feedback();
    }

    if (isLoggedIn) {
        if ((isAdmin || userSettings.privacyPublic || isUserFollowing || user.id === userLogged.id) && !imagesFromUser) {
            return feedback();
        }
        if (isAdmin && !userPenalty) {
            return feedback();
        }
    }

    if (user && userSettings && !isLoggedIn) {
        if (userSettings.privacyPublic && !imagesFromUser) {
            return feedback();
        }
    }

    return (
        <Container component="main" maxWidth={isMobile ? false : "lg"} disableGutters={true}
                   sx={{
                       display: "flex",
                       flexDirection: "column",
                       justifyContent: "center",
                       padding: 0,
                       minHeight: isMobile ? '80vh' : '75vh',
                   }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "column" },
                    justifyContent: "center",
                    gap: 0,
                    border: '1px solid #9575cd',
                    borderRadius: '4px',
                    flexGrow: 1,
                }}>
                <Errors errors={backendErrors} onClose={() => setBackendErrors(null)}/>
                <Paper elevation={8}
                       sx={{
                           minHeight: isMobile ? '80vh' : '75vh',
                           display: 'flex',
                           flexDirection: 'column',
                       }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "start",
                            mt: 1,
                            mb: 1,
                        }}>
                        <BackButton />
                        {user.verified &&
                            <Tooltip title={<FormattedMessage id="project.search.UserDetails.verifiedBrand.explanatoryText" />}>
                                <VerifiedOutlinedIcon color="secondary" fontSize="small" sx={{ ml: 1 }}/>
                            </Tooltip>
                        }
                        {user.role === 'BRAND_USER' &&
                            <Tooltip title={<FormattedMessage id="project.search.UserDetails.brandUser.explanatoryText" />}>
                                <CorporateFareOutlinedIcon color="secondary" fontSize="small" sx={{ ml: user.verified ? 0.5 : 1 }}/>
                            </Tooltip>
                        }
                        <TextField
                            sx={{ ml: 0.5, mr: (!isLoggedIn || user.id === userLogged.id) ? 1 : undefined }}
                            color="primary"
                            fullWidth
                            size="small"
                            id="filled-read-only-input"
                            label={<FormattedMessage id="project.search.UserDetails.fields.userName" />}
                            defaultValue={user.userName}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="filled"
                        />
                        {isLoggedIn && !(user.id === userLogged.id) &&
                            <Tooltip title={<FormattedMessage id="project.search.UserDetails.options.explanatoryText" />}>
                                <IconButton onClick={handleClickOpenActionsDialog}>
                                    <MoreVertOutlinedIcon color="primary" fontSize="large" />
                                </IconButton>
                            </Tooltip>
                        }
                    </Box>
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 1,
                            mb: 1,
                            ml: 1,
                        }}>
                        {user.profilePicture ?
                            <Avatar
                                sx={{ width: 100, height: 100 }}
                                src={`data:image/jpeg;base64,${user.profilePicture}`}></Avatar>
                            :
                            <Avatar
                                sx={{ width: 100, height: 100 }}></Avatar>
                        }
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                ml: 1,
                                mr: 1,
                            }}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Paper elevation={4}>
                                        <Button
                                            variant="contained"
                                            align="right"
                                            fullWidth
                                            onClick={(isAdmin || userSettings.privacyPublic || isUserFollowing ||
                                                    (isLoggedIn && user.id === userLogged.id))
                                                ? handleSeeFollowers : undefined}
                                            sx={{ mr: "auto", ml: "auto" }}
                                            color="primary">
                                            <Typography>
                                                {new Intl.NumberFormat('en', { notation: 'compact' }).format(numFollowers)}
                                                <FormattedMessage id="project.search.UserDetails.numFollowers" />
                                            </Typography>
                                        </Button>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper elevation={4}>
                                        <Button
                                            variant="contained"
                                            align="right"
                                            fullWidth
                                            onClick={(isAdmin || userSettings.privacyPublic || isUserFollowing ||
                                                    (isLoggedIn && user.id === userLogged.id))
                                                ? handleSeeFollowed : undefined}
                                            sx={{ mr: "auto", ml: "auto" }}
                                            color="primary">
                                            <Typography>
                                                {new Intl.NumberFormat('en', { notation: 'compact' }).format(numFollowed)}
                                                <FormattedMessage id="project.search.UserDetails.numFollowed" />
                                            </Typography>
                                        </Button>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    {(isAdmin || userSettings.privacyPublic || isUserFollowing
                            || (isLoggedIn ? user.id === userLogged.id : false)) && user.name && user.role === 'NORMAL_USER' &&
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mt: 1,
                                mb: 1,
                            }}>
                            <FaceOutlinedIcon color="primary" fontSize="large" sx={{ ml: 1 }}/>
                            <TextField
                                sx={{ ml: 0.5 }}
                                fullWidth
                                multiline
                                color="primary"
                                size="small"
                                id="filled-read-only-input"
                                label={<FormattedMessage id="project.search.UserDetails.fields.name" />}
                                defaultValue={user.surname ? (user.name + ' ' + user.surname) : user.name}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="filled"
                            />
                            {(isAdmin || userSettings.privacyPublic || isUserFollowing ||
                                    (isLoggedIn ? user.id === userLogged.id : false)) &&
                                <Tooltip title={<FormattedMessage id="project.search.UserDetails.moreInfo.explanatoryText" />}>
                                    <IconButton onClick={handleClickOpenDialog}>
                                        <InfoOutlinedIcon color="primary" fontSize="large" />
                                    </IconButton>
                                </Tooltip>
                            }
                        </Box>
                    }
                    {(isAdmin || userSettings.privacyPublic || isUserFollowing
                            || (isLoggedIn ? user.id === userLogged.id : false)) && user.name && user.role === 'BRAND_USER' &&
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mt: 1,
                                mb: 1,
                            }}>
                            <AccountBalanceOutlinedIcon color="primary" fontSize="large" sx={{ ml: 1 }}/>
                            <TextField
                                sx={{ ml: 0.5, mr: 1 }}
                                fullWidth
                                multiline
                                color="primary"
                                size="small"
                                id="filled-read-only-input"
                                label={<FormattedMessage id="project.brands.fields.brandName" />}
                                defaultValue={user.name}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="filled"
                            />
                        </Box>
                    }
                    {isLoggedIn && isAdmin && isAfter(userPenalty.silencedUntil) &&
                        <Box>
                            <Alert
                                icon={<HideImageOutlinedIcon />}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'start',
                                    ml: 1,
                                    mr: 1,
                                    mb: 1,
                                    mt: 1
                                }}
                                variant="outlined" severity="warning">
                                <Typography variant="h3" sx={{ textAlign: "center" }}>
                                    <FormattedMessage id="project.search.UserDetails.UserSilencedUntil" />
                                    {new Date(userPenalty.silencedUntil).toLocaleString(locale,
                                        { timeZone: 'UTC', year: 'numeric', month: 'numeric', day: 'numeric' })}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <Button
                                        variant="contained"
                                        sx={{ mt: 1, mb: 1, mr: 0.5 }}
                                        onClick={handleOpenEditSilenceDialog}
                                        startIcon={<EditCalendarOutlinedIcon />}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.EditSilencedUntil"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ mt: 1, mb: 1 }}
                                        onClick={handleOpenRemoveSilenceDialog}
                                        startIcon={<CropOriginalOutlinedIcon />}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.RemoveSilence"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                </Box>
                            </Alert>
                            <Dialog
                                fullScreen={fullScreen}
                                open={openRemoveSilenceDialog}
                                onClose={handleCloseRemoveSilenceDialog}
                                aria-labelledby="responsive-dialog-title"
                            >
                                <DialogTitle id="responsive-dialog-title">
                                    <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                        {<FormattedMessage id="project.search.UserDetails.removeSilence.title" />}
                                    </Typography>
                                </DialogTitle>
                                <IconButton
                                    aria-label="close"
                                    onClick={handleCloseRemoveSilenceDialog}
                                    sx={{
                                        position: 'absolute',
                                        right: 8,
                                        top: 8,
                                    }}
                                >
                                    <CloseOutlinedIcon color="primary" />
                                </IconButton>
                                <DialogContent>
                                    <Box
                                        sx={{
                                            position: "relative",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography>
                                                    <FormattedMessage id="project.search.UserDetails.removeSilenceText"></FormattedMessage>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleRemoveSilenceFromUser()}
                                        sx={{ mt: 1, mb: 1 }}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.RemoveSilence"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="alertRed"
                                        onClick={handleCloseRemoveSilenceDialog}
                                        sx={{ mt: 1, mb: 1 }}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <Dialog
                                component="form" ref={node => editSilenceForm = node} noValidate onSubmit={handleSubmitEditSilence}
                                fullScreen={fullScreen}
                                open={openEditSilenceDialog}
                                onClose={handleCloseEditSilenceDialog}
                                aria-labelledby="responsive-dialog-title"
                            >
                                <DialogTitle id="responsive-dialog-title">
                                    <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                        {<FormattedMessage id="project.search.UserDetails.editSilence.title" />}
                                    </Typography>
                                </DialogTitle>
                                <IconButton
                                    aria-label="close"
                                    onClick={handleCloseEditSilenceDialog}
                                    sx={{
                                        position: 'absolute',
                                        right: 8,
                                        top: 8,
                                    }}
                                >
                                    <CloseOutlinedIcon color="primary" />
                                </IconButton>
                                <DialogContent>
                                    <Box
                                        sx={{
                                            position: "relative",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography>
                                                    <FormattedMessage id="project.search.UserDetails.editSilenceText"></FormattedMessage>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    value={silencedUntil}
                                                    onChange={(e) => setSilencedUntil(e.target.value)}
                                                    name="until"
                                                    type="date"
                                                    required
                                                    fullWidth
                                                    id="until"
                                                    error={requiredAlertMessages.silencedUntil}
                                                    helperText={requiredAlertMessages.silencedUntil &&
                                                        <FormattedMessage id="project.global.validator.required" />}></TextField>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{ mt: 1, mb: 1 }}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.EditSilencedUntil"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="alertRed"
                                        onClick={handleCloseEditSilenceDialog}
                                        sx={{ mt: 1, mb: 1 }}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Box>
                    }
                    {isLoggedIn && isAdmin && isAfter(userPenalty.blockedUntil) &&
                        <Box>
                            <Alert
                                icon={<BlockOutlinedIcon />}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'start',
                                    ml: 1,
                                    mr: 1,
                                    mb: 1,
                                    mt: 1
                                }}
                                variant="outlined" severity="error">
                                <Typography variant="h3" sx={{ textAlign: "center" }}>
                                    <FormattedMessage id="project.search.UserDetails.UserBlockedUntil" />
                                    {new Date(userPenalty.blockedUntil).toLocaleString(locale,
                                        { timeZone: 'UTC', year: 'numeric', month: 'numeric', day: 'numeric' })}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <Button
                                        variant="contained"
                                        sx={{ mt: 1, mb: 1, mr: 0.5 }}
                                        onClick={handleOpenEditBlockDialog}
                                        startIcon={<EditCalendarOutlinedIcon />}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.EditBlockedUntil"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ mt: 1, mb: 1 }}
                                        onClick={handleOpenRemoveBlockDialog}
                                        startIcon={<LoginOutlinedIcon />}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.RemoveBlock"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                </Box>
                            </Alert>
                            <Dialog
                                fullScreen={fullScreen}
                                open={openRemoveBlockDialog}
                                onClose={handleCloseRemoveBlockDialog}
                                aria-labelledby="responsive-dialog-title"
                            >
                                <DialogTitle id="responsive-dialog-title">
                                    <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                        {<FormattedMessage id="project.search.UserDetails.removeBlock.title" />}
                                    </Typography>
                                </DialogTitle>
                                <IconButton
                                    aria-label="close"
                                    onClick={handleCloseRemoveBlockDialog}
                                    sx={{
                                        position: 'absolute',
                                        right: 8,
                                        top: 8,
                                    }}
                                >
                                    <CloseOutlinedIcon color="primary" />
                                </IconButton>
                                <DialogContent>
                                    <Box
                                        sx={{
                                            position: "relative",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography>
                                                    <FormattedMessage id="project.search.UserDetails.removeBlockText"></FormattedMessage>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleRemoveBlockFromUser()}
                                        sx={{ mt: 1, mb: 1 }}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.RemoveBlock"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="alertRed"
                                        onClick={handleCloseRemoveBlockDialog}
                                        sx={{ mt: 1, mb: 1 }}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <Dialog
                                component="form" ref={node => editBlockForm = node} noValidate onSubmit={handleSubmitEditBlock}
                                fullScreen={fullScreen}
                                open={openEditBlockDialog}
                                onClose={handleCloseEditBlockDialog}
                                aria-labelledby="responsive-dialog-title"
                            >
                                <DialogTitle id="responsive-dialog-title">
                                    <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                        {<FormattedMessage id="project.search.UserDetails.editBlock.title" />}
                                    </Typography>
                                </DialogTitle>
                                <IconButton
                                    aria-label="close"
                                    onClick={handleCloseEditBlockDialog}
                                    sx={{
                                        position: 'absolute',
                                        right: 8,
                                        top: 8,
                                    }}
                                >
                                    <CloseOutlinedIcon color="primary" />
                                </IconButton>
                                <DialogContent>
                                    <Box
                                        sx={{
                                            position: "relative",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography>
                                                    <FormattedMessage id="project.search.UserDetails.editBlockText"></FormattedMessage>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    value={blockedUntil}
                                                    onChange={(e) => setBlockedUntil(e.target.value)}
                                                    name="until"
                                                    type="date"
                                                    required
                                                    fullWidth
                                                    id="until"
                                                    error={requiredAlertMessages.blockedUntil}
                                                    helperText={requiredAlertMessages.blockedUntil &&
                                                        <FormattedMessage id="project.global.validator.required" />}></TextField>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{ mt: 1, mb: 1 }}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.EditBlockedUntil"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="alertRed"
                                        onClick={handleCloseEditBlockDialog}
                                        sx={{ mt: 1, mb: 1 }}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Box>
                    }
                    {isLoggedIn && isAdmin && hasRequestedVerification &&
                        <Box>
                            <Alert
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'start',
                                    ml: 1,
                                    mr: 1,
                                    mb: 1,
                                    mt: 1
                                }}
                                variant="outlined" severity="info">
                                {isMobile &&
                                    <FormattedMessage id="project.search.UserDetails.BrandRequestedVerification" />
                                }
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mt: isMobile ? 1 : undefined,
                                    }}>
                                    {!isMobile &&
                                        <FormattedMessage id="project.search.UserDetails.BrandRequestedVerification" />
                                    }
                                    <Box
                                        sx={{ ml: isMobile ? undefined : 2, mr: 0.3 }}>
                                        <Fab
                                            sx={{ zIndex: 0 }}
                                            size="small"
                                            color="primary"
                                            onClick={() => handleOpenAcceptVerificationRequestDialog()}>
                                            <CheckOutlinedIcon />
                                        </Fab>
                                    </Box>
                                    <Box>
                                        <Fab
                                            sx={{ zIndex: 0 }}
                                            size="small"
                                            color="alertRed"
                                            onClick={() => handleRejectVerificationRequest(user.id)}>
                                            <HighlightOffOutlinedIcon />
                                        </Fab>
                                    </Box>
                                </Box>
                            </Alert>
                            <Dialog
                                fullScreen={fullScreen}
                                open={openAcceptVerificationRequestDialog}
                                onClose={handleCloseAcceptVerificationRequestDialog}
                                aria-labelledby="responsive-dialog-title"
                            >
                                <DialogTitle id="responsive-dialog-title">
                                    <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                        {<FormattedMessage id="project.admin.VerificationRequests.acceptVerificationRequest.title" />}
                                    </Typography>
                                </DialogTitle>
                                <IconButton
                                    aria-label="close"
                                    onClick={handleCloseAcceptVerificationRequestDialog}
                                    sx={{
                                        position: 'absolute',
                                        right: 8,
                                        top: 8,
                                    }}
                                >
                                    <CloseOutlinedIcon color="primary" />
                                </IconButton>
                                <DialogContent>
                                    <Box
                                        sx={{
                                            position: "relative",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography>
                                                    <FormattedMessage id="project.admin.VerificationRequests.acceptVerificationRequestText"></FormattedMessage>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleAcceptVerificationRequest(user.id)}
                                        sx={{ mt: 1, mb: 1 }}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.AcceptVerificationRequest"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="alertRed"
                                        onClick={handleCloseAcceptVerificationRequestDialog}
                                        sx={{ mt: 1, mb: 1 }}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Box>
                    }
                    {(isAdmin || userSettings.privacyPublic || isUserFollowing
                            || (isLoggedIn ? user.id === userLogged.id : false)) && user.about && user.role === 'NORMAL_USER' &&
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mt: 1,
                                mb: 1,
                            }}>
                            <EmojiPeopleOutlinedIcon color="primary" fontSize="large" sx={{ ml: 1 }}/>
                            <TextField
                                sx={{ ml: 0.5, mr: 1 }}
                                fullWidth
                                color="primary"
                                size="small"
                                multiline
                                id="filled-read-only-input"
                                label={<FormattedMessage id="project.search.UserDetails.fields.about" />}
                                defaultValue={user.about}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="filled"
                            />
                        </Box>
                    }
                    {(isAdmin || userSettings.privacyPublic || isUserFollowing
                            || (isLoggedIn ? user.id === userLogged.id : false)) && user.about && user.role === 'BRAND_USER' &&
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mt: 1,
                                mb: 1,
                            }}>
                            <EmojiPeopleOutlinedIcon color="primary" fontSize="large" sx={{ ml: 1 }}/>
                            <TextField
                                sx={{ ml: 0.5, mr: 1 }}
                                fullWidth
                                color="primary"
                                size="small"
                                multiline
                                id="filled-read-only-input"
                                label={<FormattedMessage id="project.brands.fields.aboutUs" />}
                                defaultValue={user.about}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="filled"
                            />
                        </Box>
                    }
                    <Dialog
                        fullScreen={fullScreen}
                        open={openDialog}
                        onClose={handleCloseDialog}
                        aria-labelledby="responsive-dialog-title"
                    >
                        <DialogTitle id="responsive-dialog-title">
                            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                {<FormattedMessage id="project.search.UserDetails.moreInfo.title" />}
                            </Typography>
                        </DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseDialog}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                            }}
                        >
                            <CloseOutlinedIcon color="primary" />
                        </IconButton>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                        <AlternateEmailOutlinedIcon color="primary" fontSize="large" />
                                        {user.role === 'BRAND_USER' ?
                                                <TextField
                                                    sx={{ ml: 1, mr: 1 }}
                                                    fullWidth
                                                    color="primary"
                                                    size="small"
                                                    id="filled-read-only-input"
                                                    label={<FormattedMessage id="project.brands.fields.enterpriseEmail" />}
                                                    defaultValue={user.email}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    variant="filled"
                                                />
                                        :
                                                <TextField
                                                    sx={{ ml: 1, mr: 1 }}
                                                    fullWidth
                                                    color="primary"
                                                    size="small"
                                                    id="filled-read-only-input"
                                                    label={<FormattedMessage id="project.search.UserDetails.fields.email" />}
                                                    defaultValue={user.email}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    variant="filled"
                                                />}
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                        <LocalPhoneOutlinedIcon color="primary" fontSize="large" />
                                        <TextField
                                            sx={{ ml: 1, mr: 1 }}
                                            fullWidth
                                            color="primary"
                                            size="small"
                                            id="filled-read-only-input"
                                            label={<FormattedMessage id="project.search.UserDetails.fields.phoneNumber" />}
                                            defaultValue={user.phoneNumber}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="filled"
                                        />
                                    </Box>
                                </Grid>
                                {user.role === 'NORMAL_USER' &&
                                    <Grid item xs={12}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}>
                                            <CakeOutlinedIcon color="primary" fontSize="large" />
                                            <TextField
                                                sx={{ ml: 1, mr: 1 }}
                                                fullWidth
                                                color="primary"
                                                size="small"
                                                id="filled-read-only-input"
                                                label={<FormattedMessage id="project.search.UserDetails.fields.birthDate" />}
                                                defaultValue={new Date(user.birthDate).toLocaleString(locale,
                                                    { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                variant="filled"
                                            />
                                        </Box>
                                    </Grid>
                                }
                            </Grid>
                        </DialogContent>
                    </Dialog>
                    <Dialog
                        fullScreen={fullScreen}
                        open={openActionsDialog}
                        onClose={handleCloseActionsDialog}
                        aria-labelledby="responsive-dialog-title"
                    >
                        <DialogTitle id="responsive-dialog-title">
                            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                {<FormattedMessage id="project.search.UserDetails.actions.title" />}
                            </Typography>
                        </DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseActionsDialog}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                            }}
                        >
                            <CloseOutlinedIcon color="primary" />
                        </IconButton>
                        <DialogContent>
                            {!isAdmin &&
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                    <Button
                                        onClick={handleOpenReportDialog}
                                        color="alertRed"
                                        variant="contained"
                                        startIcon={<ReportGmailerrorredOutlinedIcon />}
                                        sx={{ mt: 1, mb: 1 }}>
                                        <Typography sx={{ fontWeight: 'bold' }}>
                                            <FormattedMessage id="project.global.buttons.ReportUser"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                </Box>
                            }
                            {isLoggedIn && isAdmin && !isAfter(userPenalty.silencedUntil) &&
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                    <Button
                                        onClick={handleOpenSilenceUserDialog}
                                        color="alertOrange"
                                        variant="contained"
                                        startIcon={<HideImageOutlinedIcon />}
                                        sx={{ mt: 1, mb: 1 }}>
                                        <Typography sx={{ fontWeight: 'bold' }}>
                                            <FormattedMessage id="project.global.buttons.SilenceUser"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                </Box>
                            }
                            {isLoggedIn && isAdmin && !isAfter(userPenalty.blockedUntil) &&
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                    <Button
                                        onClick={handleOpenBlockUserDialog}
                                        color="alertRed"
                                        variant="contained"
                                        startIcon={<BlockOutlinedIcon />}
                                        sx={{ mt: 1, mb: 1 }}>
                                        <Typography sx={{ fontWeight: 'bold' }}>
                                            <FormattedMessage id="project.global.buttons.BlockUser"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                </Box>
                            }
                        </DialogContent>
                    </Dialog>
                    <Dialog
                        fullScreen={fullScreen}
                        open={openReportDialog}
                        onClose={handleCloseReportDialog}
                        aria-labelledby="responsive-dialog-title"
                    >
                        <DialogTitle id="responsive-dialog-title">
                            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                {<FormattedMessage id="project.search.UserDetails.reportUser.title" />}
                            </Typography>
                        </DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseReportDialog}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                            }}
                        >
                            <CloseOutlinedIcon color="primary" />
                        </IconButton>
                        <DialogContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth error={requiredAlertMessages.reason}>
                                            <InputLabel id="demo-simple-select-helper-label">
                                                <FormattedMessage id="project.search.fields.reason" />
                                            </InputLabel>
                                            <Select
                                                value={reason}
                                                fullWidth
                                                label={<FormattedMessage id="project.search.fields.reason" />}
                                                onChange={(e) => setReason(e.target.value)}>
                                                <MenuItem value={'NO_REASON'}>
                                                    <Typography>
                                                        <FormattedMessage id="project.search.UserDetails.reasons.selectReportReason" />
                                                    </Typography>
                                                </MenuItem>
                                                <MenuItem value={'IDENTITY_FRAUD'}>
                                                    <Typography>
                                                        <FormattedMessage id="project.search.UserDetails.reasons.IdentityFraud" />
                                                    </Typography>
                                                </MenuItem>
                                                <MenuItem value={'UNDER_16'}>
                                                    <Typography>
                                                        <FormattedMessage id="project.search.UserDetails.reasons.Under16" />
                                                    </Typography>
                                                </MenuItem>
                                                <MenuItem value={'SPAM'}>
                                                    <Typography>
                                                        <FormattedMessage id="project.search.UserDetails.reasons.Spam" />
                                                    </Typography>
                                                </MenuItem>
                                                <MenuItem value={'NAKED_OR_SEXUAL_ACTIVITY'}>
                                                    <Typography>
                                                        <FormattedMessage id="project.search.UserDetails.reasons.NakedOrSexualActivity" />
                                                    </Typography>
                                                </MenuItem>
                                                <MenuItem value={'VIOLENCE'}>
                                                    <Typography>
                                                        <FormattedMessage id="project.search.UserDetails.reasons.Violence" />
                                                    </Typography>
                                                </MenuItem>
                                                <MenuItem value={'BULLYING'}>
                                                    <Typography>
                                                        <FormattedMessage id="project.search.UserDetails.reasons.Bullying" />
                                                    </Typography>
                                                </MenuItem>
                                                <MenuItem value={'FRAUD'}>
                                                    <Typography>
                                                        <FormattedMessage id="project.search.UserDetails.reasons.Fraud" />
                                                    </Typography>
                                                </MenuItem>
                                            </Select>
                                            <FormHelperText color="alertRed">
                                                {requiredAlertMessages.reason &&
                                                    <FormattedMessage id="project.global.validator.required" />}
                                            </FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            value={explanation}
                                            onChange={(e) => setExplanation(e.target.value)}
                                            name="explanation"
                                            required
                                            multiline
                                            rows={3}
                                            fullWidth
                                            id="explanation"
                                            label={<FormattedMessage id="project.search.fields.explanation" />}
                                            error={requiredAlertMessages.explanation}
                                            helperText={requiredAlertMessages.explanation && <FormattedMessage id="project.global.validator.required" />}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="contained"
                                onClick={handleConfirmUserReport}
                                sx={{ mt: 1, mb: 1 }}>
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.ConfirmReport"></FormattedMessage>
                                </Typography>
                            </Button>
                            <Button
                                variant="contained"
                                color="alertRed"
                                onClick={handleCloseReportDialog}
                                sx={{ mt: 1, mb: 1 }}>
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                </Typography>
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        component="form" ref={node => silenceForm = node} noValidate onSubmit={handleSubmitSilenceUser}
                        fullScreen={fullScreen}
                        open={openSilenceUserDialog}
                        onClose={handleCloseSilenceUserDialog}
                        aria-labelledby="responsive-dialog-title"
                    >
                        <DialogTitle id="responsive-dialog-title">
                            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                {<FormattedMessage id="project.admin.UserReportDetails.silenceUser.title" />}
                            </Typography>
                        </DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseSilenceUserDialog}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                            }}
                        >
                            <CloseOutlinedIcon color="primary" />
                        </IconButton>
                        <DialogContent>
                            <Box
                                sx={{
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography>
                                            <FormattedMessage id="project.admin.UserReportDetails.silenceUserText"></FormattedMessage>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            value={until}
                                            onChange={(e) => setUntil(e.target.value)}
                                            name="until"
                                            type="date"
                                            required
                                            fullWidth
                                            id="until"
                                            error={requiredAlertMessagesUntil.until}
                                            helperText={requiredAlertMessagesUntil.until &&
                                                <FormattedMessage id="project.global.validator.required" />}></TextField>
                                    </Grid>
                                </Grid>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                type="submit"
                                variant="contained"
                                color="alertOrange"
                                sx={{ mt: 1, mb: 1 }}>
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.SilenceUser"></FormattedMessage>
                                </Typography>
                            </Button>
                            <Button
                                variant="contained"
                                color="alertRed"
                                onClick={handleCloseSilenceUserDialog}
                                sx={{ mt: 1, mb: 1 }}>
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                </Typography>
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        component="form" ref={node => blockForm = node} noValidate onSubmit={handleSubmitBlockUser}
                        fullScreen={fullScreen}
                        open={openBlockUserDialog}
                        onClose={handleCloseBlockUserDialog}
                        aria-labelledby="responsive-dialog-title"
                    >
                        <DialogTitle id="responsive-dialog-title">
                            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                {<FormattedMessage id="project.admin.UserReportDetails.blockUser.title" />}
                            </Typography>
                        </DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseBlockUserDialog}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                            }}
                        >
                            <CloseOutlinedIcon color="primary" />
                        </IconButton>
                        <DialogContent>
                            <Box
                                sx={{
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography>
                                            <FormattedMessage id="project.admin.UserReportDetails.blockUserText"></FormattedMessage>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            value={until}
                                            onChange={(e) => setUntil(e.target.value)}
                                            name="until"
                                            type="date"
                                            required
                                            fullWidth
                                            id="until"
                                            error={requiredAlertMessagesUntil.until}
                                            helperText={requiredAlertMessagesUntil.until &&
                                                <FormattedMessage id="project.global.validator.required" />}></TextField>
                                    </Grid>
                                </Grid>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                type="submit"
                                variant="contained"
                                color="alertRed"
                                sx={{ mt: 1, mb: 1 }}>
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.BlockUser"></FormattedMessage>
                                </Typography>
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCloseBlockUserDialog}
                                sx={{ mt: 1, mb: 1 }}>
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                </Typography>
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 1,
                        }}>
                        {isLoggedIn && !isAdmin && !isUserFollowing && userSettings.privacyPublic && (user.id !== userLogged.id) &&
                            <Paper elevation={4}>
                                <Button
                                    variant="contained"
                                    align="right"
                                    size="small"
                                    onClick={e => handleFollowUser(e)}
                                    sx={{ mr: "auto", ml: "auto" }}
                                    color="primary">
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.followUser" />
                                    </Typography>
                                </Button>
                            </Paper>
                        }
                        {!isLoggedIn && userSettings.privacyPublic &&
                            <Paper elevation={4}>
                                <Button
                                    variant="contained"
                                    align="right"
                                    size="small"
                                    onClick={e => handleNotLoggedIn(e)}
                                    sx={{ mr: "auto", ml: "auto" }}
                                    color="primary">
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.followUser" />
                                    </Typography>
                                </Button>
                            </Paper>
                        }
                        {isLoggedIn && !isAdmin && isUserFollowing && (user.id !== userLogged.id) &&
                            <Paper elevation={4}>
                                <Button
                                    variant="contained"
                                    align="right"
                                    size="small"
                                    onClick={e => handleUnfollowUser(e)}
                                    sx={{ mr: "auto", ml: "auto" }}
                                    color="primary">
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.unfollowUser" />
                                    </Typography>
                                </Button>
                            </Paper>
                        }
                        {isLoggedIn && !isAdmin && !isUserFollowing && !hasUserRequestedToFollow && !userSettings.privacyPublic
                            && (user.id !== userLogged.id) &&
                            <Paper elevation={4}>
                                <Button
                                    variant="contained"
                                    align="right"
                                    size="small"
                                    onClick={e => handleRequestFollow(e)}
                                    sx={{ mr: "auto", ml: "auto" }}
                                    color="primary">
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.requestFollow" />
                                    </Typography>
                                </Button>
                            </Paper>
                        }
                        {!isLoggedIn && !userSettings.privacyPublic &&
                            <Paper elevation={4}>
                                <Button
                                    variant="contained"
                                    align="right"
                                    size="small"
                                    onClick={e => handleNotLoggedIn(e)}
                                    sx={{ mr: "auto", ml: "auto" }}
                                    color="primary">
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.requestFollow" />
                                    </Typography>
                                </Button>
                            </Paper>
                        }
                        {isLoggedIn && !isAdmin && !isUserFollowing && hasUserRequestedToFollow && !userSettings.privacyPublic
                            && (user.id !== userLogged.id) &&
                            <Paper elevation={4}>
                                <Button
                                    variant="contained"
                                    align="right"
                                    size="small"
                                    onClick={e => handleDeleteRequestFollow(e)}
                                    sx={{ mr: "auto", ml: "auto" }}
                                    color="primary">
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.deleteRequestFollow" />
                                    </Typography>
                                </Button>
                            </Paper>
                        }
                        {!isMobile && isLoggedIn && user.id === userLogged.id &&
                            <Paper elevation={4}>
                                <Button
                                    variant="contained"
                                    align="right"
                                    size="small"
                                    onClick={e => handleUpdateProfile(e)}
                                    sx={{ mr: "auto", ml: "auto" }}
                                    color="primary">
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.UpdateProfile" />
                                    </Typography>
                                </Button>
                            </Paper>
                        }
                        {(isAdmin || userSettings.privacyPublic || isUserFollowing ||
                                (isLoggedIn ? user.id === userLogged.id : false)) &&
                            <Paper elevation={4} sx={{ ml: 1 }}>
                                <Button
                                    variant="contained"
                                    align="right"
                                    size="small"
                                    onClick={e => handleSeeLikesFromUser(e)}
                                    sx={{ mr: "auto", ml: "auto" }}
                                    color="primary">
                                    <Typography>
                                        <FormattedMessage id="project.search.UserDetails.imagesLikedByUser" />
                                    </Typography>
                                </Button>
                            </Paper>
                        }
                        {(isAdmin || userSettings.privacyPublic || isUserFollowing ||
                                (isLoggedIn ? user.id === userLogged.id : false)) && user.role === 'BRAND_USER' &&
                            <Tooltip title={<FormattedMessage id="project.search.UserDetails.rewards.explanatoryText" />}>
                                <Fab sx={{ ml: 0.5 }} aria-label="like" size="small" color="primary" onClick={(e) => handleSeeRewardsFromBrand(e)}>
                                    <EmojiEventsOutlinedIcon fontSize="large" />
                                </Fab>
                            </Tooltip>
                        }
                    </Box>
                    {(isAdmin || userSettings.privacyPublic || isUserFollowing
                        || (isLoggedIn ? user.id === userLogged.id : false)) ?
                        <Box>
                            <Divider color="primary" variant="middle" component="li" >
                                <Typography color="primary">
                                    <FormattedMessage id="project.search.UserDetails.userImages.text" />
                                </Typography>
                            </Divider>
                            <Box
                                sx={{
                                    width: '100%',
                                }}>
                                {(imagesFromUser.result.items.length === 0 && !imagesFromUser.result.existMoreItems) ?
                                    <Alert
                                        sx={{ display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'start',
                                            ml: 1,
                                            mr: 1,
                                            mb: 2,
                                            mt: 1
                                        }}
                                        variant="outlined" severity="warning">
                                        <FormattedMessage id="project.search.UserDetails.noImages" />
                                    </Alert>
                                    :
                                    <div>
                                        <Images images={imagesFromUser.result.items}/>
                                        {(imagesFromUser.result.existMoreItems || imagesFromUser.criteria.page > 0) &&
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    mt: 1,
                                                    mb: 1,
                                                }}>
                                                <ButtonGroup color="primary" size="small" variant="contained" aria-label="Basic button group">
                                                    <Button
                                                        disabled={imagesFromUser.criteria.page < 1}
                                                        onClick={() => dispatch(actions.previousFindImagesFromUserResultPage(imagesFromUser.criteria))}>
                                                        <ArrowCircleLeftIcon />
                                                    </Button>
                                                    <Button
                                                        disabled={!imagesFromUser.result.existMoreItems}
                                                        onClick={() => dispatch(actions.nextFindImagesFromUserResultPage(imagesFromUser.criteria))}>
                                                        <ArrowCircleRightIcon />
                                                    </Button>
                                                </ButtonGroup>
                                            </Box>
                                        }
                                    </div>
                                }
                            </Box>
                        </Box>
                        :
                        <Box
                            sx={{
                                width: '100%',
                            }}>
                            <Alert
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'start',
                                    ml: 1,
                                    mr: 1,
                                    mb: 2,
                                    mt: 1
                                }}
                                variant="outlined" severity="info">
                                <FormattedMessage id="project.search.UserDetails.privateProfile" />
                            </Alert>
                        </Box>
                    }
                </Paper>
            </Box>
        </Container>
    )

}

export default UserDetails;