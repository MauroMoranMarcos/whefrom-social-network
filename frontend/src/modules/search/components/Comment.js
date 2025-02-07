import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {FormattedMessage} from "react-intl";

import * as actions from "../actions";
import * as selectors from "../selectors";

import users from "../../users";

import {
    Avatar,
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Fab, Grid, IconButton,
    Link,
    ListItem,
    ListItemButton,
    ListItemText, TextField,
    Typography, useTheme
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";

import ShowAnswersFromComment from "./ShowAnswersFromComment";

const Comment = ({ comment, setOpenCommentsDialog, showAnswers }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(users.selectors.isLoggedIn);
    const isAdmin = useSelector(users.selectors.isAdmin);
    const userLogged = useSelector(users.selectors.getUser);
    const image = useSelector(selectors.getImage);
    const [userComment, setUserComment] = useState(null);
    const [answer, setAnswer] = useState('');
    const [openAnswerCommentDialog, setOpenAnswerCommentDialog] = useState(false);
    const [openAnswersDialog, setOpenAnswersDialog] = useState(false);
    const [openDeleteCommentDialog, setOpenDeleteCommentDialog] = useState(false);
    const [commentSelectedId, setCommentSelectedId] = useState(null);
    const [backendErrors, setBackendErrors] = useState(null);
    const [locale, setLocale] = useState(navigator.language || navigator.languages[0]);
    const [requiredAlertMessages, setRequiredAlertMessages] = useState({
        answer: false,
    });
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    let form;

    useEffect(() => {

        dispatch(actions.findUserById(comment.userId,
            user => setUserComment(user)));

    }, []);

    const handleUserClick = (userId) => {

        navigate(`/search/userdetails/${userId}`);

    }

    const handleSeeAnswers = (commentId) => {

        if (isLoggedIn) {

            dispatch(actions.findAnswersFromComment({userId: userLogged.id, commentId: commentId, page: 0}));

        } else {

            dispatch(actions.findAnswersFromComment({userId: 0, commentId: commentId, page: 0}));

        }

        setOpenAnswersDialog(true);

    }

    const handleCloseAnswersDialog = () => {

        setOpenAnswersDialog(false);

    };

    const handleDeleteComment = () => {

        dispatch(actions.deleteImageComment(
            commentSelectedId,
            userLogged.id,
            () => {
                if (showAnswers) {
                    window.location.reload();
                } else {
                    dispatch(actions.getNumImageComments(image.id, userLogged.id));
                    dispatch(actions.findCommentsFromImage({userId: userLogged.id, imageId: image.id, page: 0}));
                    handleCloseDeleteCommentDialog();
                    handleCloseAnswersDialog();
                    setOpenCommentsDialog(false);
                }
            },
            errors => setBackendErrors(errors)));

    }

    const handleOpenDeleteCommentDialog = (commentId) => {

        setCommentSelectedId(commentId)
        setOpenDeleteCommentDialog(true);

    }

    const handleCloseDeleteCommentDialog = () => {

        setOpenDeleteCommentDialog(false);

    }

    const handleSubmit = event => {

        event.preventDefault();

        handleValidationAnswer();

        if (form.checkValidity()) {

            dispatch(actions.answerComment(
                userLogged.id,
                image.id,
                answer.trim(),
                commentSelectedId,
                () => {
                    if (showAnswers) {
                        window.location.reload();
                    } else {
                        dispatch(actions.getNumImageComments(image.id, userLogged.id));
                        dispatch(actions.findCommentsFromImage({userId: userLogged.id, imageId: image.id, page: 0}));
                        handleCloseAnswerCommentDialog();
                        handleCloseAnswersDialog();
                        setOpenCommentsDialog(false);
                    }
                },
                errors => setBackendErrors(errors)));

        } else {

            setBackendErrors(null);
            form.classList.add('was-validated');

        }

    }

    const handleOnAnswerCommentClick = (commentId) => {

        setCommentSelectedId(commentId);
        setOpenAnswerCommentDialog(true);

    }

    const handleCloseAnswerCommentDialog = () => {

        setOpenAnswerCommentDialog(false);
        setAnswer('');

    }

    const handleValidationAnswer = () => {

        const newRequiredAlerts = {
            answer: answer === '',
        };
        setRequiredAlertMessages(newRequiredAlerts);

    };

    if (!userComment) {
        return null;
    }

    return(
        <ListItem disablePadding key={comment.id}
                  sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      maxWidth: '100%',
                      flexWrap: 'wrap',
                      wordWrap: 'break-word'
                  }}>
            <Box sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <ListItemButton sx={{ alignItems: 'flex-start', padding: 0 }}>
                    <Avatar
                        sx={{
                            width: 38,
                            height: 38,
                            mr: 0.5,
                            mt: 0.62,
                            mb: 0,
                            '&:hover': {
                                color: 'primary.main',
                                cursor: 'pointer',
                            },
                        }}
                        onClick={() => handleUserClick(comment.userId)}
                        src={`data:image/jpeg;base64,${userComment.profilePicture}`}></Avatar>
                    <ListItemText primary={
                        <Box sx={{ display: 'flex' }}>
                            <Typography
                                variant="h21"
                                onClick={() => handleUserClick(comment.userId)}
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
                                {userComment.userName}
                            </Typography>
                            <Typography
                                variant="h21"
                                sx={{
                                    textAlign: 'start',
                                    mr: 0.5,
                                }}>
                                {comment.text}
                            </Typography>
                        </Box>
                    } secondary={
                        <Box>
                            {
                                <Typography
                                    variant="h4"
                                    sx={{
                                        textAlign: 'start',
                                        mr: 0.5,
                                    }}>
                                    {new Date(comment.date).toLocaleString(locale,
                                        { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })}
                                </Typography>
                            }
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {isLoggedIn && !isAdmin &&
                                    <Link
                                        underline="none"
                                        onClick={() => handleOnAnswerCommentClick(comment.id)}>
                                        {<Typography variant="h3">
                                            <FormattedMessage id="project.global.buttons.AnswerComment" />
                                        </Typography>}
                                    </Link>
                                }
                                {(comment.numAnswers > 0) &&
                                    <Link
                                        underline="none"
                                        onClick={() => handleSeeAnswers(comment.id)}>
                                        {<Typography variant="h3">
                                            <FormattedMessage id="project.global.buttons.seeAnswers" />
                                        </Typography>}
                                    </Link>
                                }
                            </Box>
                        </Box>
                    }/>
                    <Dialog
                        component="form" ref={node => form = node} noValidate onSubmit={handleSubmit}
                        fullScreen={fullScreen}
                        open={openAnswerCommentDialog}
                        onClose={handleCloseAnswerCommentDialog}
                        aria-labelledby="responsive-dialog-title"
                    >
                        <DialogTitle id="responsive-dialog-title">
                            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                {<FormattedMessage id="project.search.ImageDetails.answer.title" />}
                            </Typography>
                        </DialogTitle>
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
                                            value={answer}
                                            onChange={(e) => setAnswer(e.target.value)}
                                            name="answer"
                                            required
                                            fullWidth
                                            id="answer"
                                            label={<FormattedMessage id="project.search.ImageDetails.fields.answer" />}
                                            error={requiredAlertMessages.answer}
                                            helperText={requiredAlertMessages.answer &&
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
                                    <FormattedMessage id="project.global.buttons.AnswerComment"></FormattedMessage>
                                </Typography>
                            </Button>
                            <Button
                                variant="contained"
                                color="alertRed"
                                onClick={handleCloseAnswerCommentDialog}
                                sx={{ mt: 1, mb: 1 }}>
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                </Typography>
                            </Button>
                        </DialogActions>
                    </Dialog>
                </ListItemButton>
            </Box>
            {isLoggedIn && (userLogged.id === comment.userId) &&
                <Fab
                    size="small"
                    color="alertRed"
                    onClick={() => handleOpenDeleteCommentDialog(comment.id)}
                    sx={{ marginLeft: 1, zIndex: 0 }}>
                    <DeleteOutlineOutlinedIcon />
                </Fab>
            }
            <Dialog
                fullScreen={fullScreen}
                open={openDeleteCommentDialog}
                onClose={handleCloseDeleteCommentDialog}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    <Typography sx={{ fontWeight: 'bold' }}>
                        <FormattedMessage id="project.search.ImageDetails.deleteComment.title" />
                    </Typography>
                </DialogTitle>
                <DialogContent></DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        sx={{ mt: 1, mb: 1 }}
                        onClick={handleDeleteComment}>
                        <Typography>
                            <FormattedMessage id="project.global.buttons.DeleteComment"></FormattedMessage>
                        </Typography>
                    </Button>
                    <Button
                        variant="contained"
                        color="alertRed"
                        onClick={handleCloseDeleteCommentDialog}
                        sx={{ mt: 1, mb: 1 }}>
                        <Typography>
                            <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                        </Typography>
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                fullScreen={fullScreen}
                open={openAnswersDialog}
                onClose={handleCloseAnswersDialog}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    <Typography sx={{ fontWeight: 'bold', mr: 5 }}>
                        {<FormattedMessage id="project.search.ImageDetails.commentAnswers.title" />}
                    </Typography>
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseAnswersDialog}
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
                            mt: 0.5,
                            mb: 0.5,
                            ml: 0.5,
                            mr: 0.5,
                        }}>
                        <ShowAnswersFromComment />
                    </Box>
                </DialogContent>
            </Dialog>
        </ListItem>
    )

}

export default Comment;