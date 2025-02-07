import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import * as actions from "../actions";
import * as selectors from "../selectors";

import search from '../../search';
import users from '../../users';

import {BackButton, Errors} from "../../common";
import {
    Avatar,
    Box,
    Button,
    Chip, CircularProgress,
    Container,
    Dialog, DialogActions, DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Paper, TextField,
    Typography, useTheme
} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {formatReason} from "./UserReport";
import useMediaQuery from "@mui/material/useMediaQuery";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import HideImageOutlinedIcon from "@mui/icons-material/HideImageOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const ImageReportDetails = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const imageReport = useSelector(selectors.getImageReport);
    const user = useSelector(users.selectors.getUser);
    const [userThatReported, setUserThatReported] = useState(null);
    const [imageReported, setImageReported] = useState(null);
    const [reason, setReason] = useState(null);
    const [warning, setWarning] = useState('');
    const [until, setUntil] = useState('');
    const [openMarkReportAsResolvedDialog, setOpenMarkReportAsResolvedDialog] = useState(false);
    const [openWarnUserDialog, setOpenWarnUserDialog] = useState(false);
    const [openSilenceUserDialog, setOpenSilenceUserDialog] = useState(false);
    const [openBlockUserDialog, setOpenBlockUserDialog] = useState(false);
    const [showProgress, setShowProgress] = useState(false);
    const [backendErrors, setBackendErrors] = useState(null);
    const [requiredAlertMessages, setRequiredAlertMessages] = useState({
        warning: false,
    });
    const [requiredAlertMessagesUntil, setRequiredAlertMessagesUntil] = useState({
        until: false,
    });
    const [locale, setLocale] = useState(navigator.language || navigator.languages[0]);
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const {id} = useParams();

    let warningForm;
    let silenceForm;
    let blockForm;

    useEffect(() => {

        const imageReportId = Number(id);

        if (!Number.isNaN(imageReportId)) {

            dispatch(actions.findImageReportById(imageReportId));

        }

        return () => {
            dispatch(actions.clearImageReport());
        }

    }, [id, dispatch]);

    useEffect(() => {

        if (imageReport && imageReport.userId && imageReport.imageReportedId && imageReport.reason) {
            dispatch(search.actions.findUserById(imageReport.userId,
                user => setUserThatReported(user)));
            dispatch(search.actions.findImageById(imageReport.imageReportedId, user.id,
                image => setImageReported(image)));

            setReason(formatReason(imageReport.reason));
        }

    }, [imageReport, dispatch]);

    useEffect(() => {

        if (imageReported && imageReported.imgFile) {
            console.log(`data:image/jpeg;base64,${imageReported.imgFile}`);
        }

    }, [imageReported]);

    const handleUserThatReportedClick = () => {

        navigate(`/search/userdetails/${userThatReported.id}`);

    }

    const handleImageClick = () => {

        navigate(`/search/imagedetails/${imageReported.id}`);

    }

    const resetFormFields = () => {

        setWarning("");
        setUntil("");

    }

    const handleSubmitWarning = event => {

        event.preventDefault();

        handleValidationWarning();

        if (warningForm.checkValidity()) {

            if (!showProgress) {
                setShowProgress(true);
            }

            dispatch(actions.warnImageReportWithEmail(
                imageReport.id,
                warning.trim(),
                () => {
                    handleCloseWarnUserDialog();
                    resetFormFields();
                },
                errors => setBackendErrors(errors)));

        } else {

            setBackendErrors(null);
            warningForm.classList.add('was-validated');

        }

    }

    const handleValidationWarning = () => {

        const newRequiredAlerts = {
            warning: warning === '',
        };
        setRequiredAlertMessages(newRequiredAlerts);

    };

    const handleSubmitSilence = event => {

        event.preventDefault();

        handleValidationUntil();

        const dateObject = new Date(until);

        const isoDateObject = dateObject.toISOString();

        if (silenceForm.checkValidity()) {

            const formData = new FormData();

            formData.append('until', isoDateObject);

            dispatch(actions.silenceImageReport(
                imageReport.id,
                formData,
                () => {
                    handleCloseSilenceUserDialog();
                    resetFormFields();
                },
                errors => setBackendErrors(errors)));

        } else {

            setBackendErrors(null);
            silenceForm.classList.add('was-validated');

        }

    }

    const handleSubmitBlock = event => {

        event.preventDefault();

        handleValidationUntil();

        const dateObject = new Date(until);

        const isoDateObject = dateObject.toISOString();

        if (blockForm.checkValidity()) {

            const formData = new FormData();

            formData.append('until', isoDateObject);

            dispatch(actions.blockImageReport(
                imageReport.id,
                formData,
                () => {
                    handleCloseBlockUserDialog();
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

    const handleOpenWarnUserDialog = () => {

        setOpenWarnUserDialog(true);

    }

    const handleCloseWarnUserDialog = () => {

        setOpenWarnUserDialog(false);

    }

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


    const handleOpenMarkReportAsResolvedDialog = () => {

        setOpenMarkReportAsResolvedDialog(true);

    }

    const handleCloseMarkReportAsResolvedDialog = () => {

        setOpenMarkReportAsResolvedDialog(false);

    }

    const handleMarkReportAsResolved = () => {

        dispatch(actions.markImageReportAsResolved(imageReport.id,
            () => {
                handleCloseMarkReportAsResolvedDialog();
                navigate('/admin/reports');
            },
            errors => setBackendErrors(errors)));

    }

    if (!imageReport || !userThatReported || !imageReported || !reason) {
        return null;
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
                            justifyContent: "flex-start",
                            mb: 1,
                            borderBottom: '1px solid #9575cd',
                        }}>
                        <BackButton />
                        <Typography variant="h2" sx={{ mt: 0.5, mb: 0.5, fontWeight: 'bold' }}>
                            <FormattedMessage id="project.admin.ImageReportDetails.title"></FormattedMessage>
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ml: 1,
                            mr: 1,
                            mb: 1,
                        }}>
                        <Grid container spacing={1}>
                            <Grid item xs={isMobile ? 12 : 6}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: '1px solid #9575cd',
                                        borderRadius: '4px',
                                        gap: 0.5,
                                    }}>
                                    <Typography variant="h3" sx={{ textAlign: "center" }}>
                                        <FormattedMessage id="project.admin.ImageReportDetails.userThatReported" />
                                    </Typography>
                                    <Chip avatar={<Avatar src={`data:image/jpeg;base64,${userThatReported.profilePicture}`}></Avatar>}
                                          color="primary" label={userThatReported.userName} variant="outlined" component="a"
                                          onClick={handleUserThatReportedClick} clickable sx={{ ml: 1, mr: 1, mb: 0.5, mt: 0.5 }}/>
                                </Box>
                            </Grid>
                            <Grid item xs={isMobile ? 12 : 6}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: '1px solid #FF3700',
                                        borderRadius: '4px',
                                        gap: 0.5,
                                    }}>
                                    <Typography variant="h3" sx={{ textAlign: "center" }}>
                                        <FormattedMessage id="project.admin.ImageReportDetails.imageReported" />
                                    </Typography>
                                    <Chip avatar={<Avatar src={`data:image/jpeg;base64,${imageReported.imgFile}`}></Avatar>}
                                          color="primary" label={imageReported.title} variant="outlined" component="a"
                                          onClick={handleImageClick} clickable sx={{ ml: 1, mr: 1, mb: 0.5, mt: 0.5 }}/>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: '1px solid #9575cd',
                                        borderRadius: '4px',
                                        gap: 1,
                                    }}>
                                    <Typography variant="h2" sx={{ textAlign: "center" }}>
                                        <FormattedMessage id="project.search.fields.reason" />
                                    </Typography>
                                    <Typography variant="h3" sx={{ textAlign: "center" }}>
                                        {reason}
                                    </Typography>
                                    <Typography variant="h2" sx={{ textAlign: "center" }}>
                                        <FormattedMessage id="project.search.fields.explanation" />
                                    </Typography>
                                    <Typography variant="h3" sx={{ textAlign: "center" }}>
                                        {imageReport.explanation}
                                    </Typography>
                                    <Typography variant="h2" sx={{ textAlign: "center" }}>
                                        <FormattedMessage id="project.admin.fields.reportDate" />
                                    </Typography>
                                    <Typography variant="h3" sx={{ textAlign: "center" }}>
                                        {new Date(imageReport.date).toLocaleString(locale,
                                            { timeZone: 'UTC', year: 'numeric', month: 'numeric', day: 'numeric',
                                                hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        ml: "auto",
                                        mr: "auto",
                                    }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleOpenMarkReportAsResolvedDialog}
                                        sx={{ mt: 1, mb: 1 }}
                                        startIcon={<CheckCircleOutlineOutlinedIcon />}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.MarkAsResolved"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item xs={isMobile ? 12 : 4}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        ml: "auto",
                                        mr: "auto",
                                    }}>
                                    <Button
                                        variant="contained"
                                        sx={{ mt: 1, mb: 1 }}
                                        onClick={handleOpenWarnUserDialog}
                                        startIcon={<WarningAmberOutlinedIcon />}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.WarnUser"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item xs={isMobile ? 12 : 4}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        ml: "auto",
                                        mr: "auto",
                                    }}>
                                    <Button
                                        variant="contained"
                                        color="alertOrange"
                                        sx={{ mt: 1, mb: 1 }}
                                        onClick={handleOpenSilenceUserDialog}
                                        startIcon={<HideImageOutlinedIcon />}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.SilenceUser"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item xs={isMobile ? 12 : 4}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        ml: "auto",
                                        mr: "auto",
                                    }}>
                                    <Button
                                        variant="contained"
                                        color="alertRed"
                                        sx={{ mt: 1, mb: 1 }}
                                        onClick={handleOpenBlockUserDialog}
                                        startIcon={<BlockOutlinedIcon />}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.BlockUser"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                        <Dialog
                            fullScreen={fullScreen}
                            open={openMarkReportAsResolvedDialog}
                            onClose={handleCloseMarkReportAsResolvedDialog}
                            aria-labelledby="responsive-dialog-title"
                        >
                            <DialogTitle id="responsive-dialog-title">
                                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                    {<FormattedMessage id="project.admin.UserReportDetails.markReportAsResolved.title" />}
                                </Typography>
                            </DialogTitle>
                            <IconButton
                                aria-label="close"
                                onClick={handleCloseMarkReportAsResolvedDialog}
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
                                                <FormattedMessage id="project.admin.UserReportDetails.markReportAsResolvedText"></FormattedMessage>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    variant="contained"
                                    onClick={handleMarkReportAsResolved}
                                    sx={{ mt: 1, mb: 1 }}>
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.MarkAsResolved"></FormattedMessage>
                                    </Typography>
                                </Button>
                                <Button
                                    variant="contained"
                                    color="alertRed"
                                    onClick={handleCloseMarkReportAsResolvedDialog}
                                    sx={{ mt: 1, mb: 1 }}>
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                    </Typography>
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog
                            component="form" ref={node => warningForm = node} noValidate onSubmit={handleSubmitWarning}
                            fullScreen={fullScreen}
                            open={openWarnUserDialog}
                            onClose={handleCloseWarnUserDialog}
                            aria-labelledby="responsive-dialog-title"
                        >
                            <DialogTitle id="responsive-dialog-title">
                                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                    {<FormattedMessage id="project.admin.UserReportDetails.warnUser.title" />}
                                </Typography>
                            </DialogTitle>
                            <IconButton
                                aria-label="close"
                                onClick={handleCloseWarnUserDialog}
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
                                                <FormattedMessage id="project.admin.UserReportDetails.warningUserText"></FormattedMessage>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                value={warning}
                                                onChange={(e) => setWarning(e.target.value)}
                                                name="warning"
                                                autoFocus
                                                required
                                                fullWidth
                                                id="warning"
                                                label={<FormattedMessage id="project.admin.UserReportDetails.fields.warning" />}
                                                error={requiredAlertMessages.warning}
                                                helperText={requiredAlertMessages.warning &&
                                                    <FormattedMessage id="project.global.validator.required" />}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Box sx={{ position: 'relative' }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={showProgress}
                                        sx={{ mt: 1, mb: 1 }}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.WarnUser"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                    {showProgress &&
                                        <CircularProgress
                                            size={24}
                                            sx={{
                                                color: '#9575cd',
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                marginTop: '-12px',
                                                marginLeft: '-12px',
                                            }}
                                        />
                                    }
                                </Box>
                                <Button
                                    variant="contained"
                                    color="alertRed"
                                    onClick={handleCloseWarnUserDialog}
                                    sx={{ mt: 1, mb: 1 }}>
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                    </Typography>
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog
                            component="form" ref={node => silenceForm = node} noValidate onSubmit={handleSubmitSilence}
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
                                                error={requiredAlertMessages.until}
                                                helperText={requiredAlertMessages.until &&
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
                            component="form" ref={node => blockForm = node} noValidate onSubmit={handleSubmitBlock}
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
                                    color="alertRed"
                                    onClick={handleCloseBlockUserDialog}
                                    sx={{ mt: 1, mb: 1 }}>
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                    </Typography>
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )

}

export default ImageReportDetails;