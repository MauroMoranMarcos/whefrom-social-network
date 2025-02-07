import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {Link as ReactLink} from 'react-router-dom';

import * as selectors from '../selectors';
import * as actions from '../actions';

import admin from '../../admin';
import users from '../../users';
import images from '../../images';

import {
    Accordion, AccordionDetails, AccordionSummary, Alert,
    Avatar, Badge,
    Box, Button,
    Chip,
    Container,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Fab, FormControl, FormHelperText,
    Grid, IconButton, InputLabel, Link, MenuItem,
    Paper, Select, Skeleton, SpeedDial, SpeedDialAction, Stack,
    TextField, Tooltip, Typography,
    useTheme,
} from "@mui/material";

import useMediaQuery from '@mui/material/useMediaQuery';

import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import AbcOutlinedIcon from '@mui/icons-material/AbcOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import ShowCommentsFromImage from "./ShowCommentsFromImage";
import {BackButton, Errors} from "../../common";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";

const ImageDetails = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const isLoggedIn = useSelector(users.selectors.isLoggedIn);
    const isAdmin = useSelector(users.selectors.isAdmin);
    const userLogged = useSelector(users.selectors.getUser);
    const isUserFollowing = useSelector(selectors.isUserFollowing);
    const userSettings = useSelector(selectors.getUserSettings);
    const image = useSelector(selectors.getImage);
    const tags = useSelector(selectors.getTags);
    const isImageLikedByUser = useSelector(selectors.isImageLikedByUser);
    const numImageLikes = useSelector(selectors.getNumImageLikes);
    const numImageComments = useSelector(selectors.getNumImageComments);
    const isTagLikedByUser = useSelector(selectors.isTagLikedByUser);
    const numTagLikes = useSelector(selectors.getNumTagLikes);
    const [user, setUser] = useState(null);
    const [showTag, setShowTag] = useState(false);
    const [detailedTag, setDetailedTag] = useState(null);
    const [brandFromTag, setBrandFromTag] = useState(null);
    const categoryName = useSelector(admin.selectors.getCategory);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [openDialog, setOpenDialog] = useState(false);
    const [openCommentsDialog, setOpenCommentsDialog] = useState(false);
    const [comment, setComment] = useState('');
    const [openCommentDialog, setOpenCommentDialog] = useState(false);
    const [openDeleteImageDialog, setOpenDeleteImageDialog] = useState(false);
    const [openHideImageDialog, setOpenHideImageDialog] = useState(false);
    const [openShowImageDialog, setOpenShowImageDialog] = useState(false);
    const [requiredAlertMessages, setRequiredAlertMessages] = useState({
        comment: false,
    });
    const [expanded, setExpanded] = useState(location.state ? location.state.seeComments : false);
    const [openActionsDialog, setOpenActionsDialog] = useState(false);
    const [openReportDialog, setOpenReportDialog] = useState(false);
    const [reason, setReason] = useState('NO_REASON');
    const [explanation, setExplanation] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [requiredReportAlertMessages, setRequiredReportAlertMessages] = useState({
        reason: false,
        explanation: false,
    });
    const [locale, setLocale] = useState(navigator.language || navigator.languages[0]);
    const [backendErrors, setBackendErrors] = useState(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const {id} = useParams();

    let form;

    useEffect(() => {

        const imageId = Number(id);

        if (!Number.isNaN(imageId)) {

            if (isLoggedIn) {
                dispatch(actions.findImageById(imageId, userLogged.id));
                dispatch(actions.findCommentsFromImage({userId: userLogged.id, imageId: imageId, page: 0}));
                dispatch(actions.isImageLikedByUser(imageId));
            } else {
                dispatch(actions.findImageById(imageId, 0));
                dispatch(actions.findCommentsFromImage({userId: 0, imageId: imageId, page: 0}));
            }

            dispatch(actions.getNumImageLikes(imageId));
        }

        return () => {
            dispatch(actions.clearImage());
        }

    }, [id, dispatch]);

    useEffect(() => {

        if (image && image.userId && !imageLoaded) {
            dispatch(actions.findUserById(image.userId,
                user => setUser(user)));

            if (isLoggedIn) {
                dispatch(actions.findImageTags(image.id, userLogged.id));
            } else {
                dispatch(actions.findImageTags(image.id, 0));
            }

            setImageLoaded(true);
        }

    }, [image, imageLoaded, dispatch]);

    useEffect(() => {

        if (user && user.id) {
            dispatch(actions.findUserSettingsByUserId(user.id));
        }

    }, [user, dispatch]);

    useEffect(() => {

        const imageId = Number(id);

        if (isLoggedIn && !Number.isNaN(imageId)) {
            dispatch(actions.getNumImageComments(imageId, userLogged.id));
        } else {
            dispatch(actions.getNumImageComments(imageId, "0"));
        }

    }, [isLoggedIn, userLogged]);

    const handleImageLoad = (event) => {

        const img = event.target;
        setImageSize({ width: img.width, height: img.height });

    };

    const handleOnTagClick = () => {

        if (showTag) {
            setShowTag(false);
        } else {
            setShowTag(true);
        }

    }

    const handleClickOpenDialog = (tag) => {

        setDetailedTag(tag);
        dispatch(admin.actions.findCategoryById(tag.categoryId));

        if (isLoggedIn) {
            dispatch(actions.isTagLikedByUser(tag.id, userLogged.id));
            dispatch(actions.getNumTagLikes(tag.id, userLogged.id));
        } else {
            dispatch(actions.getNumTagLikes(tag.id, 0));
        }

        if (tag.brandId) {
            dispatch(actions.findUserById(tag.brandId,
                user => {
                    setBrandFromTag(user);
                    setOpenDialog(true);
                }));
        } else {
            setBrandFromTag(null);
            setOpenDialog(true);
        }
        //setOpenDialog(true);

    };

    const handleCloseDialog = () => {

        setOpenDialog(false);

    };

    const handleLikeImage = (event) => {

        event.preventDefault();
        dispatch(actions.likeImage(userLogged.id, image.id,
            () => {
                dispatch(actions.isImageLikedByUser(image.id));
                dispatch(actions.getNumImageLikes(image.id));
            },
            errors => setBackendErrors(errors)));

    }

    const handleInteractingNotLogged = (event) => {

        event.preventDefault();

        localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);

        navigate('/users/login');

    }

    const handleDeleteImageLike = () => {

        dispatch(actions.deleteImageLike(userLogged.id, image.id,
            () => {
                dispatch(actions.isImageLikedByUser(image.id));
                dispatch(actions.getNumImageLikes(image.id));
            },
            errors => setBackendErrors(errors)));

    }

    const handleSeeUsersThatLiked = () => {

        if (isLoggedIn) {
            dispatch(actions.findUsersThatLikedImage({imageId: image.id, userLoggedId: userLogged.id, dateDesc: true, page: 0}));
        } else {
            dispatch(actions.findUsersThatLikedImage({imageId: image.id, userLoggedId: 0, dateDesc: true, page: 0}));
        }

        navigate(`/search/imagedetails/${image.id}/usersthatliked`, { state: {imageId: image.id, showImageLikes: true} });

    }

    const handleSeeUsersThatLikedTag = () => {

        if (isLoggedIn) {
            dispatch(actions.findUsersThatLikedTag({userLoggedId: userLogged.id, tagId: detailedTag.id, dateDesc: true, page: 0}));
        } else {
            dispatch(actions.findUsersThatLikedTag({userLoggedId: 0, tagId: detailedTag.id, dateDesc: true, page: 0}));
        }

        navigate(`/search/imagedetails/${image.id}/usersthatliked`, { state: {tagId: detailedTag.id, showImageLikes: false} });

    }

    const handleSubmit = event => {

        event.preventDefault();

        handleValidationComment();


        if (form.checkValidity()) {

            dispatch(actions.commentImage(
                userLogged.id,
                image.id,
                comment.trim(),
                () => {
                    dispatch(actions.getNumImageComments(image.id, userLogged.id));
                    dispatch(actions.findCommentsFromImage({userId: userLogged.id, imageId: image.id, page: 0}));
                    handleCloseCommentDialog();
                },
                errors => setBackendErrors(errors)));

        } else {

            setBackendErrors(null);
            form.classList.add('was-validated');

        }

    }

    const handleOnCommentClick = () => {

        setOpenCommentDialog(true);

    }

    const handleCloseCommentDialog = () => {

        setOpenCommentDialog(false);
        setComment('');

    }

    const handleSeeComments = () => {

        if (expanded) {
            setExpanded(false);
        } else {
            setExpanded(true);
        }

    }

    const handleValidationComment = () => {

        const newRequiredAlerts = {
            comment: comment === '',
        };
        setRequiredAlertMessages(newRequiredAlerts);

    };

    const handleLikeTag = () => {

        if (isLoggedIn) {
            dispatch(actions.likeTag(userLogged.id, detailedTag.id,
                () => {
                    dispatch(actions.isTagLikedByUser(detailedTag.id, userLogged.id));
                    dispatch(actions.getNumTagLikes(detailedTag.id, userLogged.id));
                },
                errors => setBackendErrors(errors)));
        } else {
            navigate('/users/login');
        }

    }

    const handleDeleteTagLike = () => {

        dispatch(actions.deleteTagLike(userLogged.id, detailedTag.id,
            () => {
                dispatch(actions.isTagLikedByUser(detailedTag.id, userLogged.id));
                dispatch(actions.getNumTagLikes(detailedTag.id, userLogged.id));
            },
            errors => setBackendErrors(errors)));

    }

    const handleEditImage = () => {

        navigate(`/images/update`, { state: {image: image, tags: tags} });

    }

    const handleOpenDeleteImageDialog = () => {

        setOpenDeleteImageDialog(true);

    }

    const handleCloseDeleteImageDialog = () => {

        setOpenDeleteImageDialog(false);

    }

    const handleDeleteImage = () => {

        dispatch(images.actions.deleteImage(image.id,
            () => {
                navigate('/');
            },
            errors => setBackendErrors(errors)));

    }

    const handleOpenHideImageDialog = () => {

        setOpenHideImageDialog(true);

    }

    const handleCloseHideImageDialog = () => {

        setOpenHideImageDialog(false);

    }

    const handleHideImage = () => {

        dispatch(images.actions.hideImage(image.id,
            () => {
                dispatch(actions.findImageById(image.id, userLogged.id));
                handleCloseHideImageDialog();
            },
            errors => setBackendErrors(errors)));

    }

    const handleOpenShowImageDialog = () => {

        setOpenShowImageDialog(true);

    }

    const handleCloseShowImageDialog = () => {

        setOpenShowImageDialog(false);

    }

    const handleShowImage = () => {

        dispatch(images.actions.showImage(image.id,
            () => {
                dispatch(actions.findImageById(image.id, userLogged.id));
                handleCloseShowImageDialog();
            },
            errors => setBackendErrors(errors)));

    }

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

    const handleConfirmImageReport = () => {

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
        setRequiredReportAlertMessages(newRequiredAlerts);
        const newIsFormValid = !newRequiredAlerts.reason && !newRequiredAlerts.explanation;
        setIsFormValid(newIsFormValid);

        if (newIsFormValid) {

            dispatch(actions.reportImage(image.id, reason, explanation,
                () => {
                    handleCloseReportDialog();
                    handleCloseActionsDialog();
                    restoreReportFields();
                },
                errors => {
                    setBackendErrors(errors);
                    handleCloseReportDialog();
                    handleCloseActionsDialog();
                    restoreReportFields();
                }));

        }
    };

    const handleSeeUserDetails = () => {

        navigate(`/search/userdetails/${user.id}`);

    }

    const handleSeeBrandDetails = () => {

        navigate(`/search/userdetails/${brandFromTag.id}`);

    }

    const transformLink = (link) => {

        if (link) {
            let url = new URL(link);

            return url.origin;
        }

    }

    const feedback = () => (
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
                            borderBottom: `1px solid ${theme.palette.primary.main}`,
                            width: "100%",
                            flexGrow: 1,
                        }}>
                        <Box sx={{ width: "100%" }}>
                            <Skeleton
                                sx={{ ml: 1, mr: 1, mt: 1 }}
                                variant="rounded"
                                animation="wave"
                                height={30}
                                width="30%"
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "start",
                                    width: "100%",
                                    flexGrow: 1,
                                }}>
                                <Skeleton
                                    sx={{ ml: 1, mr: 1, mb: 1 }}
                                    variant="text"
                                    animation="wave"
                                    height={20}
                                    width="45%"
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                        <Skeleton
                            style={{ maxWidth: '100%', maxHeight: 400 }}
                            variant="rectangular"
                            animation="wave"
                            height={400}
                            width="100%"
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "start",
                            borderTop: `1px solid ${theme.palette.primary.main}`,
                            borderBottom: `1px solid ${theme.palette.primary.main}`,
                        }}>
                        <Skeleton
                            sx={{ ml: 0.5, mr: 0.5, mt: 0.5, mb: 0.5 }}
                            variant="rounded"
                            animation="wave"
                            height={20}
                            width={70}
                        />
                        <Skeleton
                            sx={{ mr: 0.5, mt: 0.5, mb: 0.5 }}
                            variant="rounded"
                            animation="wave"
                            height={20}
                            width={70}
                        />
                        <Skeleton
                            sx={{ mr: 0.5, mt: 0.5, mb: 0.5 }}
                            variant="rounded"
                            animation="wave"
                            height={20}
                            width={70}
                        />
                        <Skeleton
                            sx={{ mr: 0.5, mt: 0.5, mb: 0.5 }}
                            variant="rounded"
                            animation="wave"
                            height={20}
                            width={70}
                        />
                        <Skeleton
                            sx={{ mr: 0.5, mt: 0.5, mb: 0.5 }}
                            variant="rounded"
                            animation="wave"
                            height={20}
                            width={70}
                        />
                        <Skeleton
                            sx={{ mr: 0.5, mt: 0.5, mb: 0.5 }}
                            variant="rounded"
                            animation="wave"
                            height={20}
                            width={70}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderBottom: `1px solid ${theme.palette.primary.main}`,
                        }}>
                        <Skeleton
                            sx={{ mr: 0.5 }}
                            variant="circular"
                            width={40}
                            height={40}
                            animation="wave" />
                        <Skeleton
                            sx={{ mr: 0.5 }}
                            variant="circular"
                            width={40}
                            height={40}
                            animation="wave" />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "start",
                            mt: 1,
                            mb: 1,
                            ml: 0.5,
                            mr: 0.5,
                        }}>
                        <Skeleton
                            sx={{ mr: 1 }}
                            variant="text"
                            animation="wave"
                            height={20}
                            width="15%"
                        />
                        <Skeleton
                            variant="text"
                            animation="wave"
                            height={20}
                            width="45%"
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "start",
                            mt: 1,
                            mb: 1,
                            ml: 1,
                            mr: 1,
                            borderTop: `1px solid ${theme.palette.primary.main}`,
                            borderBottom: `1px solid ${theme.palette.primary.main}`,
                            borderLeft: `1px solid ${theme.palette.primary.main}`,
                            borderRight: `1px solid ${theme.palette.primary.main}`,
                            borderRadius: '4px'
                        }}>
                        <Skeleton
                            sx={{ ml: 0.5, mr: 0.5 }}
                            variant="text"
                            animation="wave"
                            height={70}
                            width="100%"
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "center",
                            mt: 0.5,
                            mb: 0.5,
                            ml: 0.5,
                            mr: 0.5,
                        }}>
                        <Skeleton
                            sx={{
                                borderTop: `1px solid ${theme.palette.primary.main}`,
                                borderBottom: `1px solid ${theme.palette.primary.main}`,
                                borderLeft: `1px solid ${theme.palette.primary.main}`,
                                borderRight: `1px solid ${theme.palette.primary.main}`,
                            }}
                            style={{ maxWidth: '100%', maxHeight: 400 }}
                            variant="rectangular"
                            animation="wave"
                            height={50}
                            width="100%"
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            mt: 1,
                            mb: 1,
                            mr: 0.5,
                        }}>
                        <Skeleton
                            variant="text"
                            animation="wave"
                            height={25}
                            width="30%"
                        />
                    </Box>
                </Paper>
            </Box>
        </Container>
    );

    if (!image || !user || !userSettings || !tags) {
        return feedback();
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
                            justifyContent: "space-between",
                            borderBottom: `1px solid ${theme.palette.primary.main}`,
                        }}>
                        <Box>
                            <BackButton />
                            <Chip avatar={<Avatar src={`data:image/jpeg;base64,${user.profilePicture}`}></Avatar>}
                                  color="primary" label={user.userName} variant="outlined" component="a"
                                  onClick={handleSeeUserDetails} clickable sx={{ ml: 0.5, mb: image.location ? 0.2 : 0.5, mt: 0.5 }} />
                            {image.location &&
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "start",
                                        mb: 0.5,
                                    }}>
                                    <RoomOutlinedIcon color="primary" fontSize="medium" sx={{ ml: 0.5 }}/>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            ml: 0.3,
                                            textAlign: 'center',
                                        }}>
                                        {image.location}
                                    </Typography>
                                </Box>
                            }
                        </Box>
                        {isLoggedIn && !isAdmin &&
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
                        }}>
                        <img
                            src={`data:image/jpeg;base64,${image.imgFile}`}
                            style={{ maxWidth: '100%', maxHeight: 400 }}
                            onLoad={(e) => handleImageLoad(e)}>
                        </img>
                        {tags.map(tag => {

                                const adjustedX = tag.coordinateX;
                                const adjustedY = tag.coordinateY;

                                return(
                                    <div>
                                        {
                                            showTag ?
                                                <Chip
                                                    key={tag.id}
                                                    label={tag.name}
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => handleClickOpenDialog(tag)}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: `${adjustedY}px`,
                                                        left: `${adjustedX}px`,
                                                        zIndex: 1,
                                                        bgcolor: theme.palette.primary.main,
                                                    }}>
                                                </Chip>
                                                :
                                                <Fab
                                                    size="small"
                                                    color="primary"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: `${adjustedY}px`,
                                                        left: `${adjustedX}px`,
                                                        zIndex: 1,
                                                        bgcolor: 'transparent',
                                                        width: '24px',
                                                        height: '24px',
                                                        minWidth: '24px',
                                                        minHeight: '24px',
                                                        padding: '0',
                                                    }}></Fab>
                                        }
                                        <Dialog
                                            fullScreen={fullScreen}
                                            open={openDialog}
                                            onClose={handleCloseDialog}
                                            aria-labelledby="responsive-dialog-title"
                                        >
                                            <DialogTitle id="responsive-dialog-title">
                                                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                                    {<FormattedMessage id="project.search.TagDetails.title" />}
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
                                                {
                                                    (isAdmin || isUserFollowing || userSettings.privacyPublic || userLogged.id === image.userId)
                                                    && detailedTag && categoryName &&
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={12}>
                                                            <Box
                                                                sx={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    mb: 0.5,
                                                                    borderBottom: `1px solid ${theme.palette.primary.main}`,
                                                                    position: 'relative',
                                                                }}>
                                                                {isTagLikedByUser && !isAdmin &&
                                                                    <Fab
                                                                        sx={{ mb: 0.5 }}
                                                                        aria-label="like"
                                                                        size="small"
                                                                        color="primary"
                                                                        onClick={handleDeleteTagLike}>
                                                                        <FavoriteIcon color="like"/>
                                                                    </Fab>
                                                                }
                                                                {!isTagLikedByUser && !isAdmin &&
                                                                    <Fab
                                                                        sx={{ mb: 0.5 }}
                                                                        aria-label="like"
                                                                        size="small"
                                                                        color="primary"
                                                                        onClick={(e) => handleLikeTag(e)}>
                                                                        <FavoriteIcon />
                                                                    </Fab>
                                                                }
                                                                {!isAdmin && !isMobile &&
                                                                    <Badge
                                                                        onClick={handleSeeUsersThatLikedTag}
                                                                        color="secondary"
                                                                        badgeContent={numTagLikes}
                                                                        sx={{
                                                                            position: 'absolute',
                                                                            top: '50%',
                                                                            left: '56%',
                                                                            transform: 'translate(-50%, -50%)',
                                                                            cursor: 'pointer',
                                                                        }}
                                                                    />
                                                                }
                                                                {!isAdmin && isMobile &&
                                                                    <Badge
                                                                        onClick={handleSeeUsersThatLikedTag}
                                                                        color="secondary"
                                                                        badgeContent={numTagLikes}
                                                                        sx={{
                                                                            position: 'absolute',
                                                                            top: '50%',
                                                                            left: '61%',
                                                                            transform: 'translate(-50%, -50%)',
                                                                            cursor: 'pointer',
                                                                        }}
                                                                    />
                                                                }
                                                                {isAdmin &&
                                                                    <Badge
                                                                        onClick={handleSeeUsersThatLikedTag}
                                                                        color="secondary"
                                                                        badgeContent={numTagLikes ? numTagLikes : "0"}
                                                                        sx={{
                                                                            position: 'relative',
                                                                            transform: 'translate(-50%, -50%)',
                                                                            cursor: 'pointer',
                                                                            m: 2,
                                                                        }}
                                                                    />
                                                                }
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Box
                                                                sx={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "start",
                                                                    borderTop: `1px solid ${theme.palette.primary.main}`,
                                                                    borderBottom: `1px solid ${theme.palette.primary.main}`,
                                                                    borderLeft: `1px solid ${theme.palette.primary.main}`,
                                                                    borderRight: `1px solid ${theme.palette.primary.main}`,
                                                                    borderRadius: '4px'
                                                                }}>
                                                                <AbcOutlinedIcon color="primary" fontSize="large" />
                                                                <Typography
                                                                    variant="h2"
                                                                    sx={{
                                                                        ml: 1,
                                                                        mr: 1,
                                                                        mt: 0.5,
                                                                        mb: 0.5,
                                                                        textAlign: 'center',

                                                                    }}>
                                                                    {detailedTag.name}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Box
                                                                sx={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "start",
                                                                    borderTop: `1px solid ${theme.palette.primary.main}`,
                                                                    borderBottom: `1px solid ${theme.palette.primary.main}`,
                                                                    borderLeft: `1px solid ${theme.palette.primary.main}`,
                                                                    borderRight: `1px solid ${theme.palette.primary.main}`,
                                                                    borderRadius: '4px'
                                                                }}>
                                                                <StoreOutlinedIcon color="primary" fontSize="large" />
                                                                {!detailedTag.link ?
                                                                    <Typography
                                                                        variant="h21"
                                                                        sx={{
                                                                            ml: 1,
                                                                            mr: 1,
                                                                            mt: 0.5,
                                                                            mb: 0.5,
                                                                            textAlign: 'center',
                                                                            color: 'text.secondary'
                                                                        }}>
                                                                        <FormattedMessage id="project.search.ImageDetails.noLinkOnTag" />
                                                                    </Typography>
                                                                    :
                                                                    <Link sx={{ ml: 1, mr: 1, mt: 0.5, mb: 0.5 }} href={detailedTag.link} underline="hover" rel="noopener" target="_blank">
                                                                        {transformLink(detailedTag.link)}
                                                                    </Link>
                                                                }
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Box
                                                                sx={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "start",
                                                                    borderTop: `1px solid ${theme.palette.primary.main}`,
                                                                    borderBottom: `1px solid ${theme.palette.primary.main}`,
                                                                    borderLeft: `1px solid ${theme.palette.primary.main}`,
                                                                    borderRight: `1px solid ${theme.palette.primary.main}`,
                                                                    borderRadius: '4px'
                                                                }}>
                                                                <CategoryOutlinedIcon color="primary" fontSize="large" />
                                                                <Typography
                                                                    variant="h21"
                                                                    sx={{
                                                                        ml: 1,
                                                                        mr: 1,
                                                                        mt: 0.5,
                                                                        mb: 0.5,
                                                                        textAlign: 'center',

                                                                    }}>
                                                                    {categoryName.name}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        {brandFromTag &&
                                                            <Grid item xs={12}>
                                                                <Box
                                                                    sx={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "start",
                                                                        borderTop: `1px solid ${theme.palette.primary.main}`,
                                                                        borderBottom: `1px solid ${theme.palette.primary.main}`,
                                                                        borderLeft: `1px solid ${theme.palette.primary.main}`,
                                                                        borderRight: `1px solid ${theme.palette.primary.main}`,
                                                                        borderRadius: '4px'
                                                                    }}>
                                                                    <CurrencyBitcoinIcon color="primary" fontSize="large" />
                                                                    <Chip avatar={<Avatar src={`data:image/jpeg;base64,${brandFromTag.profilePicture}`}></Avatar>}
                                                                          color="primary" label={brandFromTag.userName} variant="outlined" component="a"
                                                                          onClick={handleSeeBrandDetails} clickable sx={{ ml: 1, mr: 1 }} />
                                                                </Box>
                                                            </Grid>
                                                        }
                                                    </Grid>
                                                }
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                )

                            }
                        )}
                        {tags.length > 0 &&
                            <Fab
                                size="small"
                                color="primary"
                                onClick={handleOnTagClick}
                                sx={{
                                    position: 'absolute',
                                    bottom: '10px',
                                    left: '10px',
                                    zIndex: 1,
                                    width: '28px',
                                    height: '28px',
                                    minWidth: '28px',
                                    minHeight: '28px',
                                    padding: '0',
                                }}>
                                <SellOutlinedIcon />
                            </Fab>
                        }
                        {isLoggedIn && userLogged.id === image.userId &&
                            <SpeedDial
                                ariaLabel="SpeedDial openIcon example"
                                sx={{
                                    mt: 0.3,
                                    mr: 0.3,
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    zIndex: 1,
                                    padding: '0',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    minWidth: '40px',
                                    minHeight: '40px',
                                    '& .MuiFab-primary': {
                                        width: '40px',
                                        height: '40px',
                                        minHeight: '40px',
                                    }
                                }}
                                icon={<SettingsOutlinedIcon />}
                                direction="down">
                                <SpeedDialAction
                                    icon={<EditOutlinedIcon color="primary" />}
                                    tooltipTitle={<FormattedMessage id="project.search.ImageDetails.editImage.toolTip" />}
                                    onClick={handleEditImage}/>
                                {image.hidden ?
                                    <SpeedDialAction
                                        icon={<VisibilityOutlinedIcon color="primary" />}
                                        tooltipTitle={<FormattedMessage id="project.search.ImageDetails.showImage.toolTip" />}
                                        onClick={handleOpenShowImageDialog}/>
                                    :
                                    <SpeedDialAction
                                        icon={<VisibilityOffOutlinedIcon color="primary" />}
                                        tooltipTitle={<FormattedMessage id="project.search.ImageDetails.hideImage.toolTip" />}
                                        onClick={handleOpenHideImageDialog}/>}
                                <SpeedDialAction
                                    icon={<DeleteOutlineOutlinedIcon color="alertRed" />}
                                    tooltipTitle={<FormattedMessage id="project.search.ImageDetails.deleteImage.toolTip" />}
                                    onClick={handleOpenDeleteImageDialog}/>
                            </SpeedDial>
                        }
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            overflowX: 'auto',
                            borderTop: `1px solid ${theme.palette.primary.main}`,
                            borderBottom: tags.length > 0 && `1px solid ${theme.palette.primary.main}`,
                        }}>
                        <Stack
                            direction={{ xs: 'row', sm: 'row' }}
                            spacing={{ xs: 1, sm: 2, md: 1 }}
                            sx={{ ml: 0.5, mr: 0.5, mt: 0.2, mb: 0.2 }}
                        >
                            {tags.map(tag =>
                                <Chip
                                    key={tag.id}
                                    label={tag.name}
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleClickOpenDialog(tag)}
                                    sx={{
                                        zIndex: 1,
                                        bgcolor: theme.palette.primary.main,
                                        mb: 1,
                                        ml: 0.5,
                                    }}>
                                </Chip>
                            )}
                        </Stack>
                    </Box>
                    {isLoggedIn && userLogged.id === image.userId && image.hidden &&
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
                            <FormattedMessage id="project.search.ImageDetails.imageHidden" />
                        </Alert>
                    }
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 0.5,
                            mb: 0.5,
                            p: 0.5,
                            borderBottom: `1px solid ${theme.palette.primary.main}`,
                            position: 'relative',
                        }}>
                        {isImageLikedByUser && !isAdmin &&
                            <button className="btn">
                                <svg
                                    className="icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20.503"
                                    height="20.625"
                                    viewBox="0 0 17.503 15.625"
                                    onClick={handleDeleteImageLike}
                                >
                                    <path
                                        id="Fill"
                                        style={{
                                            fill: isImageLikedByUser ? "red" : "white",
                                        }}
                                        d="M8.752,15.625h0L1.383,8.162a4.824,4.824,0,0,1,0-6.762,4.679,4.679,0,0,1,6.674,0l.694.7.694-.7a4.678,4.678,0,0,1,6.675,0,4.825,4.825,0,0,1,0,6.762L8.752,15.624ZM4.72,1.25A3.442,3.442,0,0,0,2.277,2.275a3.562,3.562,0,0,0,0,5l6.475,6.556,6.475-6.556a3.563,3.563,0,0,0,0-5A3.443,3.443,0,0,0,12.786,1.25h-.01a3.415,3.415,0,0,0-2.443,1.038L8.752,3.9,7.164,2.275A3.442,3.442,0,0,0,4.72,1.25Z"
                                    ></path>
                                </svg>
                            </button>
                        }
                        {!isImageLikedByUser && !isAdmin &&
                            <button class="btn">
                                <svg
                                    class="icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20.503"
                                    height="20.625"
                                    viewBox="0 0 17.503 15.625"
                                    onClick={(e) => isLoggedIn ? handleLikeImage(e) : handleInteractingNotLogged(e)}
                                >
                                    <path
                                        id="Fill"
                                        style={{
                                            fill: isImageLikedByUser ? "red" : "white",
                                        }}
                                        d="M8.752,15.625h0L1.383,8.162a4.824,4.824,0,0,1,0-6.762,4.679,4.679,0,0,1,6.674,0l.694.7.694-.7a4.678,4.678,0,0,1,6.675,0,4.825,4.825,0,0,1,0,6.762L8.752,15.624ZM4.72,1.25A3.442,3.442,0,0,0,2.277,2.275a3.562,3.562,0,0,0,0,5l6.475,6.556,6.475-6.556a3.563,3.563,0,0,0,0-5A3.443,3.443,0,0,0,12.786,1.25h-.01a3.415,3.415,0,0,0-2.443,1.038L8.752,3.9,7.164,2.275A3.442,3.442,0,0,0,4.72,1.25Z"
                                    ></path>
                                </svg>
                            </button>
                        }
                        {isAdmin ?
                            <Badge
                                onClick={handleSeeUsersThatLiked}
                                color="secondary"
                                badgeContent={numImageLikes ? new Intl.NumberFormat('en', { notation: 'compact' }).format(numImageLikes) : "0"}
                                sx={{
                                    position: 'relative',
                                    transform: 'translate(-50%, -50%)',
                                    cursor: 'pointer',
                                    m: 2,
                                }}
                            />
                            :
                            <Badge
                                onClick={handleSeeUsersThatLiked}
                                color="secondary"
                                badgeContent={new Intl.NumberFormat('en', { notation: 'compact' }).format(numImageLikes)}
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: isMobile ? '46.5%' : '48%',
                                    transform: 'translate(-50%, -50%)',
                                    cursor: 'pointer',
                                }}
                            />
                        }
                        {!isAdmin &&
                            <Box sx={{position: 'relative', display: 'inline-flex', ml: 6}}>
                                <button className="btn">
                                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke-width="1.5" onClick={isLoggedIn ? handleOnCommentClick : handleInteractingNotLogged}>
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/>
                                    </svg>
                                </button>
                                <Badge
                                    onClick={handleSeeComments}
                                    color="secondary"
                                    badgeContent={new Intl.NumberFormat('en', { notation: 'compact' }).format(numImageComments)}
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: -13,
                                        transform: 'translate(50%, -50%)',
                                        cursor: 'pointer',
                                    }}
                                />
                            </Box>
                        }
                        <Dialog
                            fullScreen={fullScreen}
                            open={openDeleteImageDialog}
                            onClose={handleCloseDeleteImageDialog}
                            aria-labelledby="responsive-dialog-title"
                        >
                            <DialogTitle id="responsive-dialog-title">
                                <Typography variant="h2" sx={{fontWeight: 'bold'}}>
                                    <FormattedMessage id="project.search.ImageDetails.deleteImage.title"/>
                                </Typography>
                            </DialogTitle>
                            <DialogContent>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    variant="contained"
                                    sx={{mt: 1, mb: 1}}
                                    onClick={handleDeleteImage}>
                                    <Typography>
                                        {!isMobile ?
                                            <FormattedMessage
                                                id="project.global.buttons.DeleteImage"></FormattedMessage>
                                            :
                                            <FormattedMessage id="project.global.buttons.Delete"></FormattedMessage>
                                        }
                                    </Typography>
                                </Button>
                                <Button
                                    variant="contained"
                                    color="alertRed"
                                    onClick={handleCloseDeleteImageDialog}
                                    sx={{ mt: 1, mb: 1 }}>
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                    </Typography>
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog
                            fullScreen={fullScreen}
                            open={openHideImageDialog}
                            onClose={handleCloseHideImageDialog}
                            aria-labelledby="responsive-dialog-title"
                        >
                            <DialogTitle id="responsive-dialog-title">
                                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                    <FormattedMessage id="project.search.ImageDetails.hideImage.title" />
                                </Typography>
                            </DialogTitle>
                            <DialogContent>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    variant="contained"
                                    sx={{ mt: 1, mb: 1 }}
                                    onClick={handleHideImage}>
                                    <Typography>
                                        {!isMobile ?
                                            <FormattedMessage id="project.global.buttons.HideImage"></FormattedMessage>
                                            :
                                            <FormattedMessage id="project.global.buttons.Hide"></FormattedMessage>
                                        }
                                    </Typography>
                                </Button>
                                <Button
                                    variant="contained"
                                    color="alertRed"
                                    onClick={handleCloseHideImageDialog}
                                    sx={{ mt: 1, mb: 1 }}>
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                    </Typography>
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog
                            fullScreen={fullScreen}
                            open={openShowImageDialog}
                            onClose={handleCloseShowImageDialog}
                            aria-labelledby="responsive-dialog-title"
                        >
                            <DialogTitle id="responsive-dialog-title">
                                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                    <FormattedMessage id="project.search.ImageDetails.showImage.title" />
                                </Typography>
                            </DialogTitle>
                            <DialogContent />
                            <DialogActions>
                                <Button
                                    variant="contained"
                                    sx={{ mt: 1, mb: 1 }}
                                    onClick={handleShowImage}>
                                    <Typography>
                                        {!isMobile ?
                                            <FormattedMessage id="project.global.buttons.ShowImage"></FormattedMessage>
                                            :
                                            <FormattedMessage id="project.global.buttons.Show"></FormattedMessage>
                                        }
                                    </Typography>
                                </Button>
                                <Button
                                    variant="contained"
                                    color="alertRed"
                                    onClick={handleCloseShowImageDialog}
                                    sx={{ mt: 1, mb: 1 }}>
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                    </Typography>
                                </Button>
                            </DialogActions>
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
                                        sx={{ mt: 1, mb: 1, ml: 0.5 }}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.ReportImage"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                </Box>
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
                                    {<FormattedMessage id="project.search.ImageDetails.reportImage.title" />}
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
                                    onClick={handleConfirmImageReport}
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
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "start",
                            mt: 1,
                            mb: 1,
                            ml: 0.5,
                            mr: 0.5,
                        }}>
                        <Typography
                            variant="h21"
                            onClick={handleSeeUserDetails}
                            sx={{
                                textAlign: 'start',
                                fontWeight: 'bold',
                                mr: 0.5,
                                transition: 'color 0.3s ease',
                                '&:hover': {
                                    color: 'primary.main',
                                    cursor: 'pointer',
                                },
                            }}>
                            {user.userName}
                        </Typography>
                        <Typography
                            variant="h21"
                            sx={{
                                textAlign: 'start',
                                mr: 0.5,
                            }}>
                            {image.title}
                        </Typography>
                    </Box>
                    {image.description &&
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "start",
                                mt: 1,
                                mb: 1,
                                ml: 1,
                                mr: 1,
                                borderTop: `1px solid ${theme.palette.primary.main}`,
                                borderBottom: `1px solid ${theme.palette.primary.main}`,
                                borderLeft: `1px solid ${theme.palette.primary.main}`,
                                borderRight: `1px solid ${theme.palette.primary.main}`,
                                borderRadius: '4px'
                            }}>
                            <Typography
                                variant="h3"
                                sx={{
                                    m: 0.2,
                                    textAlign: 'start',
                                }}>
                                {image.description}
                            </Typography>
                        </Box>
                    }
                    {(isAdmin || isUserFollowing || userSettings.privacyPublic || userLogged.id === image.userId) &&
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "center",
                                mt: 0.5,
                                mb: 0.5,
                                ml: 0.5,
                                mr: 0.5,
                            }}>
                            <Dialog
                                component="form" ref={node => form = node} noValidate onSubmit={handleSubmit}
                                fullScreen={fullScreen}
                                open={openCommentDialog}
                                onClose={handleCloseCommentDialog}
                                aria-labelledby="responsive-dialog-title"
                            >
                                <DialogTitle id="responsive-dialog-title">
                                    <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                        {<FormattedMessage id="project.search.ImageDetails.comment.title" />}
                                    </Typography>
                                </DialogTitle>
                                <IconButton
                                    aria-label="close"
                                    onClick={handleCloseCommentDialog}
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
                                                <TextField
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    name="comment"
                                                    autoFocus
                                                    required
                                                    fullWidth
                                                    id="comment"
                                                    label={<FormattedMessage id="project.search.ImageDetails.fields.comment" />}
                                                    error={requiredAlertMessages.comment}
                                                    helperText={requiredAlertMessages.comment &&
                                                        <FormattedMessage id="project.global.validator.required" />}
                                                />
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
                                            <FormattedMessage id="project.global.buttons.CommentImage"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="alertRed"
                                        onClick={handleCloseCommentDialog}
                                        sx={{ mt: 1, mb: 1 }}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <Paper elevation={4}
                                   sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Accordion sx={{ flex: 1, width: '100%' }} expanded={expanded} defaultExpanded={location.state ? location.state.seeComments : false}>
                                    <AccordionSummary
                                        sx={{
                                            borderTop: `1px solid ${theme.palette.primary.main}`,
                                            borderBottom: `1px solid ${theme.palette.primary.main}`,
                                            borderLeft: `1px solid ${theme.palette.primary.main}`,
                                            borderRight: `1px solid ${theme.palette.primary.main}`,
                                        }}
                                        onClick={handleSeeComments}
                                        expandIcon={<ExpandMoreIcon color="primary" />}
                                        aria-controls="panel1-content"
                                        id="panel1-header">
                                        {(numImageComments === 0) &&
                                            <Typography>
                                                <FormattedMessage id="project.search.ImageDetails.numCommentsStart" />
                                                <FormattedMessage id="project.search.ImageDetails.numCommentsEnd" />
                                            </Typography>
                                        }
                                        {(numImageComments === 1) &&
                                            <Typography>
                                                <FormattedMessage id="project.search.ImageDetails.numCommentsStart" />
                                                {numImageComments}
                                                <FormattedMessage id="project.search.ImageDetails.numCommentsEndSingular" />
                                            </Typography>
                                        }
                                        {(numImageComments > 1) &&
                                            <Typography>
                                                <FormattedMessage id="project.search.ImageDetails.numCommentsStart" />
                                                {new Intl.NumberFormat('en', { notation: 'compact' }).format(numImageComments)}
                                                <FormattedMessage id="project.search.ImageDetails.numCommentsEnd" />
                                            </Typography>
                                        }
                                    </AccordionSummary>
                                    <AccordionDetails
                                        sx={{
                                            borderBottom: `1px solid ${theme.palette.primary.main}`,
                                            borderLeft: `1px solid ${theme.palette.primary.main}`,
                                            borderRight: `1px solid ${theme.palette.primary.main}`,
                                        }}>
                                        <Box
                                            sx={{
                                                position: "relative",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}>
                                            <ShowCommentsFromImage showComments={true}
                                                                   openCommentsDialog={openCommentsDialog}
                                                                   setOpenCommentsDialog={setOpenCommentsDialog}
                                                                    numComments={numImageComments}/>
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            </Paper>
                        </Box>
                    }
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            mt: "auto",
                            mb: 1,
                            mr: 0.5,
                        }}>
                        <CalendarMonthOutlinedIcon color="primary" fontSize="medium" sx={{ ml: 1 }}/>
                        <Typography
                            variant="h3"
                            sx={{
                                ml: 0.3,
                                textAlign: 'center',
                            }}>
                            {new Date(image.date).toLocaleString(locale,
                                { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )
}

export default ImageDetails;