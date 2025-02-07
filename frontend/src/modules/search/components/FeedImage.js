import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";

import * as actions from '../actions';

import users from '../../users';
import {
    Avatar, Badge,
    Box, Button,
    Chip, Dialog, DialogActions, DialogContent, DialogTitle,
    Fab, FormControl, FormHelperText,
    Grid, IconButton, InputLabel, MenuItem, Paper, Select, Skeleton, TextField, Tooltip, Typography,
    useTheme
} from "@mui/material";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {FormattedMessage} from "react-intl";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import {Errors} from "../../common";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";

const FeedImage = ({ image }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userLogged = useSelector(users.selectors.getUser);
    const isLoggedIn = useSelector(users.selectors.isLoggedIn);
    const [isImageLikedByUser, setIsImageLikedByUser] = useState(null);
    const [numImageLikes, setNumImageLikes] = useState(null);
    const [numImageComments, setNumImageComments] = useState(null);
    const [tags, setTags] = useState(null);
    const [userFromImage, setUserFromImage] = useState(null);
    const [showTag, setShowTag] = useState(false);
    const [comment, setComment] = useState('');
    const [reason, setReason] = useState('NO_REASON');
    const [explanation, setExplanation] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [openCommentDialog, setOpenCommentDialog] = useState(false);
    const [openActionsDialog, setOpenActionsDialog] = useState(false);
    const [openReportDialog, setOpenReportDialog] = useState(false);
    const [requiredAlertMessages, setRequiredAlertMessages] = useState({
        comment: false,
    });
    const [requiredReportAlertMessages, setRequiredReportAlertMessages] = useState({
        reason: false,
        explanation: false,
    });
    const [backendErrors, setBackendErrors] = useState(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    const imageRef = useRef(null);

    let form;

    useEffect(() => {

        if (isLoggedIn && userLogged && userLogged.id) {
            dispatch(actions.findImageTags(image.id, userLogged.id,
                tags => setTags(tags)));
            dispatch(actions.findUserById(image.userId,
                user => setUserFromImage(user)));
            dispatch(actions.isImageLikedByUser(image.id,
                isImageLikedByUser => setIsImageLikedByUser(isImageLikedByUser)));
            dispatch(actions.getNumImageLikes(image.id,
                numImageLikes => setNumImageLikes(numImageLikes)));
            dispatch(actions.getNumImageComments(image.id, userLogged.id,
                numImageComments => setNumImageComments(numImageComments)));
        }

        if (!isLoggedIn) {
            dispatch(actions.findImageTags(image.id, 0,
                tags => setTags(tags)));
            dispatch(actions.findUserById(image.userId,
                user => setUserFromImage(user)));
            dispatch(actions.getNumImageLikes(image.id,
                numImageLikes => setNumImageLikes(numImageLikes)));
            dispatch(actions.getNumImageComments(image.id, 0,
                numImageComments => setNumImageComments(numImageComments)));
        }

    }, [dispatch, userLogged, image.id, image.userId]);

    // Callback function for Intersection Observer
    const observerCallback = (entries) => {

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log(`Image ${image.id} is visible`);

                if (isLoggedIn) {
                    dispatch(actions.markImageAsSeen(userLogged.id, image.id));
                }
            } else {
                console.log(`Image ${image.id} is not visible`);
            }
        });

    };

    // Intersection Observer config
    const observerOptions = {
        root: null, // Use viewport as reference
        rootMargin: '0px', // Viewport margin
        threshold: 1.0 // Image is completely visible
    };

    useEffect(() => {
        const observer = new IntersectionObserver(observerCallback, observerOptions);

        if (imageRef.current) {
            observer.observe(imageRef.current);
        }

        return () => {
            if (imageRef.current) {
                observer.unobserve(imageRef.current);
            }
        };
    }, [imageRef.current]);

    const handleImageClick = (imageId, seeComments) => {

        if (!seeComments) {

            navigate(`/search/imagedetails/${imageId}`, { state: {seeComments: false} });

        } else if (seeComments) {

            navigate(`/search/imagedetails/${imageId}`, { state: {seeComments: true} });

        }

    }

    const handleOnTagClick = () => {

        if (showTag) {
            setShowTag(false);
        } else {
            setShowTag(true);
        }

    }

    const handleLikeImage = (event) => {

        event.preventDefault();
        dispatch(actions.likeImage(userLogged.id, image.id,
            () => {
                dispatch(actions.isImageLikedByUser(image.id,
                    isImageLikedByUser => setIsImageLikedByUser(isImageLikedByUser)));
                dispatch(actions.getNumImageLikes(image.id,
                    numImageLikes => setNumImageLikes(numImageLikes)));
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
                dispatch(actions.isImageLikedByUser(image.id,
                    isImageLikedByUser => setIsImageLikedByUser(isImageLikedByUser)));
                dispatch(actions.getNumImageLikes(image.id,
                    numImageLikes => setNumImageLikes(numImageLikes)));
            },
            errors => setBackendErrors(errors)));

    }

    const handleSeeUsersThatLiked = () => {

        if (isLoggedIn) {

            dispatch(actions.findUsersThatLikedImage(
                {imageId: image.id, userLoggedId: userLogged.id, dateDesc: true, page: 0}));

        } else {

            dispatch(actions.findUsersThatLikedImage(
                {imageId: image.id, userLoggedId: 0, dateDesc: true, page: 0}));

        }

        navigate(`/search/imagedetails/${image.id}/usersthatliked`, { state: {imageId: image.id, showImageLikes: true} });

    }

    const handleOnCommentClick = () => {

        setOpenCommentDialog(true);

    }

    const handleCloseCommentDialog = () => {

        setOpenCommentDialog(false);
        setComment('');

    }

    const handleValidationComment = () => {

        const newRequiredAlerts = {
            comment: comment === '',
        };
        setRequiredAlertMessages(newRequiredAlerts);

    };

    const handleSubmit = event => {

        event.preventDefault();

        handleValidationComment();


        if (form.checkValidity()) {

            dispatch(actions.commentImage(
                userLogged.id,
                image.id,
                comment.trim(),
                () => {
                    dispatch(actions.getNumImageComments(image.id, userLogged.id,
                        numImageComments => setNumImageComments(numImageComments)));
                    dispatch(actions.findCommentsFromImage({userId: userLogged.id, imageId: image.id, page: 0}));
                    handleCloseCommentDialog();
                },
                errors => setBackendErrors(errors)));

        } else {

            setBackendErrors(null);
            form.classList.add('was-validated');

        }

    }

    const handleSeeCommentsFromImage = (imageId) => {

        handleImageClick(imageId, true);

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

    const handleSeeUser = () => {

        navigate(`/search/userdetails/${userFromImage.id}`);

    }

    if (!tags || !userFromImage) {
        return (
            <Grid item xs={ 12 } sx={{ border: '1px solid #673ab7', borderRadius: '4px' }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                        mt: 0.5,
                        borderBottom: '1px solid #673ab7'
                    }}>
                    <Skeleton
                        sx={{ ml: 0.5, mb: 0.5 }}
                        variant="circular"
                        width={40}
                        height={40}
                        animation="wave" />
                    <Skeleton
                        sx={{ ml: 0.5, mr: 0.5, mb: 0.5 }}
                        animation="wave"
                        height={20}
                        width="60%"
                    />
                </Box>
                <Box
                    sx={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderBottom: '1px solid #673ab7'
                    }}>
                    <Skeleton sx={{ m: 1 }} width="100%" height={350} animation="wave" variant="rectangular" />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 1,
                        ml: 1,
                        mr: 1,
                    }}>
                    <Skeleton variant="rounded" width={210} height={35} animation="wave" />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        mt: 0.5,
                        mb: 1,
                    }}>
                    <Skeleton sx={{ mr: "auto", ml: "auto" }} variant="rounded" width={230} height={35} animation="wave" />
                </Box>
            </Grid>
        );
    }

    return (
        <Grid item xs={ 12 } sx={{ border: '1px solid #673ab7', borderRadius: '4px' }}>
            <Errors errors={backendErrors} onClose={() => setBackendErrors(null)}/>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 0.5,
                    borderBottom: '1px solid #673ab7'
                }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                    }}>
                    <Chip avatar={<Avatar src={`data:image/jpeg;base64,${userFromImage.profilePicture}`}></Avatar>}
                          color="primary" label={userFromImage.userName} variant="outlined" component="a"
                          onClick={handleSeeUser} clickable sx={{ ml: 0.5, mb: 0.5 }}/>
                    <Typography sx={{ ml: 0.5, mr: 0.5, mb: 0.5 }}>
                        {image.title}
                    </Typography>
                </Box>
                {isLoggedIn &&
                    <Tooltip title={<FormattedMessage id="project.search.UserDetails.options.explanatoryText" />}>
                        <IconButton onClick={handleClickOpenActionsDialog}>
                            <MoreVertOutlinedIcon color="primary" fontSize="large" />
                        </IconButton>
                    </Tooltip>
                }
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
                            onClick={isLoggedIn ? handleConfirmImageReport : handleInteractingNotLogged}
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
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: '1px solid #673ab7'
                }}>
                <img
                    ref={imageRef}
                    src={`data:image/jpeg;base64,${image.imgFile}`}
                    style={{maxWidth: '100%', maxHeight: 400}}
                    onClick={(e) => handleImageClick(image.id)}>
                </img>
                {tags.map(tag => {

                        const adjustedX = tag.coordinateX;
                        const adjustedY = tag.coordinateY;

                        return (
                            <div>
                                {
                                    showTag ?
                                        <Chip
                                            key={tag.id}
                                            label={tag.name}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: `${adjustedY}px`,
                                                left: `${adjustedX}px`,
                                                zIndex: 0,
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
                                                zIndex: 0,
                                                bgcolor: 'transparent',
                                                width: '24px',
                                                height: '24px',
                                                minWidth: '24px',
                                                minHeight: '24px',
                                                padding: '0',
                                            }}></Fab>
                                }
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
                            zIndex: 0,
                            width: '28px',
                            height: '28px',
                            minWidth: '28px',
                            minHeight: '28px',
                            padding: '0',
                        }}>
                        <SellOutlinedIcon/>
                    </Fab>
                }
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ml: 1,
                    mr: 1,
                    position: 'relative',
                }}>
                {isImageLikedByUser &&
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
                {!isImageLikedByUser &&
                    <button className="btn">
                        <svg
                            className="icon"
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
                <Badge
                    onClick={handleSeeUsersThatLiked}
                    color="secondary"
                    badgeContent={new Intl.NumberFormat('en', { notation: 'compact' }).format(numImageLikes)}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: isMobile ? '46.7%' : '48%',
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer',
                    }}
                />
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        mt: 1,
                        mb: 1,
                        ml: 6,
                    }}>
                    <button className="btn">
                        <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             stroke-width="1.5"
                             onClick={isLoggedIn ? handleOnCommentClick : handleInteractingNotLogged}>
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/>
                        </svg>
                    </button>
                    <Dialog
                        component="form" ref={node => form = node} noValidate onSubmit={handleSubmit}
                        fullScreen={fullScreen}
                        open={openCommentDialog}
                        onClose={handleCloseCommentDialog}
                        aria-labelledby="responsive-dialog-title"
                    >
                        <DialogTitle id="responsive-dialog-title">
                            {<FormattedMessage id="project.search.ImageDetails.comment.title" />}
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
                </Box>
                <Badge
                    onClick={() => handleSeeCommentsFromImage(image.id)}
                    color="secondary"
                    badgeContent={new Intl.NumberFormat('en', { notation: 'compact' }).format(numImageComments)}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: isMobile ? '76.7%' : '65.6%',
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer',
                    }}
                />
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    mb: 1,
                }}>
                <Paper elevation={4} sx={{ ml: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        align="right"
                        onClick={() => handleSeeCommentsFromImage(image.id)}
                        sx={{ mr: "auto", ml: "auto" }}
                        color="primary">
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
                    </Button>
                </Paper>
            </Box>
        </Grid>
    )

}

export default FeedImage;