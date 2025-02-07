import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {useNavigate} from 'react-router-dom';

import brands from "../../brands";

import {Errors} from '../../common';
import * as actions from '../actions';
import * as selectors from '../selectors';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Container, Dialog, DialogActions, DialogContent, DialogTitle, Fab,
    Grid,
    IconButton,
    Paper,
    TextField,
    Tooltip,
    Typography, useTheme
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FlakyOutlinedIcon from '@mui/icons-material/FlakyOutlined';
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";

const UpdateProfile = () => {

    const user = useSelector(selectors.getUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isBrand = useSelector(selectors.isBrand);
    const verificationRequestId = useSelector(brands.selectors.getRequestVerificationId);
    const [userName, setUserName] = useState(user.userName);
    const [name, setName] = useState(user.name);
    const [surname, setSurname] = useState(user.surname);
    const [email, setEmail]  = useState(user.email);
    const [phoneNumber, setPhoneNumber]  = useState(user.phoneNumber);
    const [about, setAbout]  = useState(user.about);
    const [areChanges, setAreChanges] = useState(false);
    const [backendErrors, setBackendErrors] = useState(null);
    const [requiredAlertMessages, setRequiredAlertMessages] = useState({
        email: false,
    });
    const [incorrectEmail, setIncorrectEmail] = useState(false);
    const [hasBrandRequestedVerification, setHasBrandRequestedVerification] = useState(null);
    const [openRequestVerificationDialog, setOpenRequestVerificationDialog] = useState(false);
    const [openRequestRegistered, setOpenRequestRegistered] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    let form;

    useEffect(() => {

        dispatch(brands.actions.hasBrandRequestedVerification(
            hasRequestedVerification => setHasBrandRequestedVerification(hasRequestedVerification)
        ));

    }, []);

    const handleChangePassword = event => {
        event.preventDefault();

        navigate('/users/updateprofile/changepassword');
    }

    const handleUpdateUserSettings = event => {
        event.preventDefault();

        navigate('/users/updateUserSettings/');
    }

    const handleModifyProfilePicture = event => {
        event.preventDefault();

        navigate('/users/updateprofile/addprofilepicture', { state: {editing: true} });
    }

    const handleSubmit = event => {

        event.preventDefault();

        handleValidation();

        setIncorrectEmail(!validateEmail(email));

        if (form.checkValidity()) {

            if (!isBrand) {

                dispatch(actions.updateProfile(
                    {id: user.id,
                        name: name.trim(),
                        surname: surname.trim(),
                        email: email.trim(),
                        phoneNumber: phoneNumber.trim(),
                        about: about.trim()},
                    () => navigate('/'),
                    errors => setBackendErrors(errors)));

            } else if (isBrand) {

                dispatch(actions.updateProfile(
                    {id: user.id,
                        name: name.trim(),
                        email: email.trim(),
                        phoneNumber: phoneNumber.trim(),
                        about: about.trim()},
                    () => navigate('/'),
                    errors => setBackendErrors(errors)));

            }

        } else {

            setBackendErrors(null);
            form.classList.add('was-validated');

        }

    }

    const handleValidation = () => {
        const newRequiredAlerts = {
            email: email === '',
        };
        setRequiredAlertMessages(newRequiredAlerts);
    };

    // Function to validate an email address
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleRequestVerification = () => {

        dispatch(brands.actions.requestVerification(
            () => {
                dispatch(brands.actions.hasBrandRequestedVerification(
                    hasRequestedVerification => setHasBrandRequestedVerification(hasRequestedVerification)
                ));
                handleCloseRequestVerificationDialog();
                handleOpenRequestRegistered();
            },
        errors => {
            handleCloseRequestVerificationDialog();
            setBackendErrors(errors);
        }));

    }

    const handleOpenRequestVerificationDialog = () => {

        setOpenRequestVerificationDialog(true);

    }

    const handleCloseRequestVerificationDialog = () =>  {

        setOpenRequestVerificationDialog(false);

    }

    const handleOpenRequestRegistered = () => {

        setOpenRequestRegistered(true);

    }

    const handleCloseRequestRegistered = () =>  {

        setOpenRequestRegistered(false);

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
                            justifyContent: "center",
                            mb: 1,
                            borderBottom: `1px solid ${theme.palette.primary.main}`,
                        }}>
                        <Typography variant="h2" sx={{ textAlign: 'center', mt: 0.5, mb: 0.5, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                            <FormattedMessage id="project.users.UpdateProfile.title"></FormattedMessage>
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 1,
                            ml: 1,
                            mr: 1,
                        }}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                            }}
                        >
                            {!isMobile && isBrand && !hasBrandRequestedVerification && !user.verified &&
                                <Tooltip title={<FormattedMessage id="project.users.UpdateProfile.requestVerification" />}>
                                    <Fab color="primary" size="small"
                                         onClick={handleOpenRequestVerificationDialog}
                                         sx={{ position: "absolute", left: -210, zIndex: 0 }}>
                                        <FlakyOutlinedIcon />
                                    </Fab>
                                </Tooltip>
                            }
                            {!isMobile && isBrand && hasBrandRequestedVerification &&
                                <Fab color="primary" size="small" disabled
                                     sx={{ position: "absolute", left: -210, zIndex: 0 }}>
                                    <FlakyOutlinedIcon />
                                </Fab>
                            }
                            <Tooltip title={<FormattedMessage id="project.users.UpdateProfile.changePassword" />}>
                                <Fab color="primary" size="small" onClick={handleChangePassword} sx={{ position: "absolute", left: -125, zIndex: 0 }}>
                                    <PasswordOutlinedIcon />
                                </Fab>
                            </Tooltip>
                            <Tooltip title={<FormattedMessage id="project.users.UpdateProfile.userSettings" />}>
                                <Fab color="primary" size="small" onClick={handleUpdateUserSettings} sx={{ position: "absolute", left: -45, zIndex: 0 }}>
                                    <SettingsOutlinedIcon />
                                </Fab>
                            </Tooltip>
                            <Avatar
                                sx={{ width: 70, height: 70 }}
                                src={`data:image/jpeg;base64,${user.profilePicture}`}></Avatar>
                            <Tooltip title={<FormattedMessage id="project.users.UpdateProfile.modifyProfilePicture" />}>
                                <IconButton color="primary" onClick={handleModifyProfilePicture} sx={{ position: "absolute", right: -45 }}>
                                    <EditOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                            {isMobile && isBrand && !hasBrandRequestedVerification && !user.verified &&
                                <Tooltip title={<FormattedMessage id="project.users.UpdateProfile.requestVerification" />}>
                                    <Fab color="primary" size="small"
                                         onClick={handleOpenRequestVerificationDialog}
                                         sx={{ position: "absolute", right: -120, zIndex: 0 }}>
                                        <FlakyOutlinedIcon />
                                    </Fab>
                                </Tooltip>
                            }
                            {isMobile && isBrand && hasBrandRequestedVerification &&
                                <Fab color="primary" size="small" disabled
                                     sx={{ position: "absolute", right: -120, zIndex: 0 }}>
                                    <FlakyOutlinedIcon />
                                </Fab>
                            }
                        </Box>
                    </Box>
                    <Dialog
                        fullScreen={fullScreen}
                        open={openRequestVerificationDialog}
                        onClose={handleCloseRequestVerificationDialog}
                        aria-labelledby="responsive-dialog-title"
                    >
                        <DialogTitle id="responsive-dialog-title">
                            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                {<FormattedMessage id="project.users.UpdateProfile.requestVerification.title" />}
                            </Typography>
                        </DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseRequestVerificationDialog}
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
                                            <FormattedMessage id="project.users.UpdateProfile.requestVerificationText"></FormattedMessage>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="contained"
                                onClick={handleRequestVerification}
                                sx={{ mt: 1, mb: 1 }}>
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.RequestVerification"></FormattedMessage>
                                </Typography>
                            </Button>
                            <Button
                                variant="contained"
                                color="alertRed"
                                onClick={handleCloseRequestVerificationDialog}
                                sx={{ mt: 1, mb: 1 }}>
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                </Typography>
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        fullScreen={fullScreen}
                        open={openRequestRegistered}
                        onClose={handleCloseRequestRegistered}
                        aria-labelledby="responsive-dialog-title"
                    >
                        <DialogTitle id="responsive-dialog-title">
                            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                {<FormattedMessage id="project.users.UpdateProfile.requestRegistered.title" />}
                            </Typography>
                        </DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseRequestRegistered}
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
                                            <FormattedMessage id="project.users.UpdateProfile.requestRegisteredText"></FormattedMessage>
                                            {verificationRequestId}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="contained"
                                onClick={handleCloseRequestRegistered}
                                sx={{ mt: 1, mb: 1 }}>
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.AddProfilePictureContinue"></FormattedMessage>
                                </Typography>
                            </Button>
                        </DialogActions>
                    </Dialog>
                    {isBrand && hasBrandRequestedVerification &&
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                ml: 1,
                                mr: 1,
                                mb: 2,
                            }}>
                            <Alert variant="outlined" severity="info">
                                <Typography variant="h3" sx={{ textAlign: 'center' }}>
                                    <FormattedMessage id="project.users.UpdateProfile.verificationAlreadyRequested" />
                                </Typography>
                            </Alert>
                        </Box>
                    }
                    {isBrand && user.verified &&
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                ml: 1,
                                mr: 1,
                                mb: 2,
                            }}>
                            <Alert icon={<VerifiedOutlinedIcon fontSize="small" />} variant="outlined" severity="info">
                                <Typography variant="h3" sx={{ textAlign: 'center' }}>
                                    <FormattedMessage id="project.users.UpdateProfile.verifiedAccount" />
                                </Typography>
                            </Alert>
                        </Box>
                    }
                    <Box component="form" ref={node => form = node} noValidate onSubmit={handleSubmit}
                         sx={{
                             display: "flex",
                             alignItems: "center",
                             justifyContent: "center",
                             ml: 1,
                             mr: 1,
                         }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    disabled
                                    value={userName}
                                    size={isMobile && 'small'}
                                    name="userName"
                                    fullWidth
                                    id="userName"
                                    label={<FormattedMessage id="project.global.fields.userName" />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={name}
                                    size={isMobile && 'small'}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setAreChanges(true);
                                    }}
                                    name="name"
                                    fullWidth
                                    id="name"
                                    label={!isBrand ? <FormattedMessage id="project.global.fields.name" />
                                            : <FormattedMessage id="project.brands.fields.brandName" />}
                                />
                            </Grid>
                            {!isBrand &&
                                <Grid item xs={12}>
                                <TextField
                                value={surname}
                                size={isMobile && 'small'}
                                onChange={(e) => {
                                    setSurname(e.target.value);
                                    setAreChanges(true);
                                }}
                                name="surname"
                                fullWidth
                                id="surname"
                                label={<FormattedMessage id="project.global.fields.surname" />}>
                                </TextField>
                                </Grid>
                            }
                            <Grid item xs={12}>
                                <TextField
                                    value={email}
                                    size={isMobile && 'small'}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setAreChanges(true);
                                    }}
                                    name="email"
                                    type="email"
                                    required
                                    fullWidth
                                    id="email"
                                    label={!isBrand ? <FormattedMessage id="project.global.fields.email" />
                                        : <FormattedMessage id="project.brands.fields.enterpriseEmail" />}
                                    error={requiredAlertMessages.email || incorrectEmail}
                                    helperText={requiredAlertMessages.email ?
                                        <FormattedMessage id="project.global.validator.required" />
                                        :
                                        incorrectEmail &&
                                        <FormattedMessage id="project.global.validator.incorrectEmail" />}></TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={about}
                                    size={isMobile && 'small'}
                                    onChange={(e) => {
                                        setAbout(e.target.value);
                                        setAreChanges(true);
                                    }}
                                    name="about"
                                    fullWidth
                                    id="about"
                                    multiline
                                    rows={isMobile ? 4 : 5}
                                    label={!isBrand ? <FormattedMessage id="project.global.fields.about" />
                                        : <FormattedMessage id="project.brands.fields.aboutUs" />}></TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    size={isMobile && 'small'}
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        setPhoneNumber(e.target.value);
                                        setAreChanges(true);
                                    }}
                                    name="phoneNumber"
                                    fullWidth
                                    id="phoneNumber"
                                    label={<FormattedMessage id="project.global.fields.phoneNumber" />}></TextField>
                            </Grid>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    ml: "auto",
                                    mr: "auto",
                                    mb: 1,
                                }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={!areChanges}
                                    sx={{ mt: 1, mb: 1 }}>
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.UpdateProfile"></FormattedMessage>
                                    </Typography>
                                </Button>
                            </Box>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )


}

export default UpdateProfile;