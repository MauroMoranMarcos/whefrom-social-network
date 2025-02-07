import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {useLocation, useNavigate} from 'react-router-dom';

import {Errors} from '../../common';
import * as actions from '../actions';

import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Grid,
    Container,
    InputAdornment,
    IconButton,
    CircularProgress
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const RestorePassword = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState(null);
    const [verificationCode, setVerificationCode] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [backendErrors, setBackendErrors] = useState(null);
    const [passwordsDoNotMatch, setPasswordsDoNotMatch] = useState(false);
    const [requiredAlertMessages, setRequiredAlertMessages] = useState({
        newPassword: false,
        confirmNewPassword: false,
    });
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    let form;
    let confirmNewPasswordInput;

    useEffect(() => {

        if (location.state) {
            setEmail(location.state.email);
            setVerificationCode(location.state.verificationCode);
        }

    }, []);

    const handleRestorePassword = () => {

        handleValidation();

        if (checkConfirmPassword()) {

            dispatch(actions.restorePassword(
                email.trim(),
                verificationCode.trim(),
                newPassword.trim(),
                () => navigate('/users/login'),
                errors => setBackendErrors(errors)
            ));

        }

    }

    const handleValidation = () => {
        const newRequiredAlerts = {
            newPassword: newPassword === '',
            confirmNewPassword: confirmNewPassword === '',
        };
        setRequiredAlertMessages(newRequiredAlerts);
    };

    const checkConfirmPassword = () => {

        if (newPassword !== confirmNewPassword) {

            confirmNewPasswordInput.setCustomValidity('error');
            setPasswordsDoNotMatch(true);

            return false;

        } else {
            return true;
        }

    }

    const handleConfirmPasswordChange = value => {

        confirmNewPasswordInput.setCustomValidity('');
        setConfirmNewPassword(value);
        setPasswordsDoNotMatch(false);

    }

    const handleClickShowPassword = () => {

        setShowPassword((show) => !show);

    }

    const handleMouseDownPassword = (event) => {

        event.preventDefault();

    };

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
                            borderBottom: '1px solid #9575cd',
                        }}>
                        <Typography variant="h2" sx={{ mt: 0.5, mb: 0.5, fontWeight: 'bold' }}>
                            <FormattedMessage id="project.users.RestorePassword.title"></FormattedMessage>
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ml: 2,
                            mr: 2,
                            mt: 1,
                            mb: 2,
                        }}>
                        <Typography variant="h3" sx={{ mt: 1, mb: 0.2, textAlign: 'center' }}>
                            <FormattedMessage id="project.users.RestorePassword.text"></FormattedMessage>
                        </Typography>
                    </Box>
                    <Box
                         sx={{
                             display: "flex",
                             alignItems: "center",
                             justifyContent: "center",
                             mt: 2,
                             ml: 1,
                             mr: 1,
                             mb: 1,
                         }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    name="newPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                                            </IconButton>
                                        </InputAdornment>,
                                    }}
                                    required
                                    fullWidth
                                    id="newPassword"
                                    label={<FormattedMessage id="project.users.RestorePassword.fields.newPassword" />}
                                    error={requiredAlertMessages.newPassword}
                                    helperText={requiredAlertMessages.newPassword &&
                                        <FormattedMessage id="project.global.validator.required" />}
                                    autoFocus></TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    inputRef={node => confirmNewPasswordInput = node}
                                    value={confirmNewPassword}
                                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                                    name="confirmNewPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    fullWidth
                                    id="confirmNewPassword"
                                    label={<FormattedMessage id="project.users.RestorePassword.fields.confirmNewPassword" />}
                                    error={requiredAlertMessages.confirmNewPassword || passwordsDoNotMatch}
                                    helperText={passwordsDoNotMatch ?
                                        <FormattedMessage id="project.global.validator.passwordsDoNotMatch" />
                                        :
                                        requiredAlertMessages.confirmNewPassword &&
                                        <FormattedMessage id="project.global.validator.required" />}></TextField>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: "auto",
                            ml: "auto",
                            mr: "auto",
                            mb: 4,
                        }}>
                        <Button
                            onClick={handleRestorePassword}
                            variant="contained"
                            sx={{ mt: 1 }}>
                            <Typography>
                                <FormattedMessage id="project.global.buttons.RestorePassword"></FormattedMessage>
                            </Typography>
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )

}

export default RestorePassword;