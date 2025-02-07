import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {useNavigate} from 'react-router-dom';

import {BackButton, Errors} from '../../common';
import * as actions from '../actions';
import {Box, Button, Paper, TextField, Typography, Grid, Container, InputAdornment, IconButton} from "@mui/material";
import * as selectors from "../selectors";
import users from "../index";
import useMediaQuery from "@mui/material/useMediaQuery";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const ChangePassword = () => {

    const user = useSelector(users.selectors.getUser);
    const userName = useSelector(users.selectors.getUserName);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [backendErrors, setBackendErrors] = useState(null);
    const [passwordsDoNotMatch, setPasswordsDoNotMatch] = useState(false);
    const [requiredAlertMessages, setRequiredAlertMessages] = useState({
        oldPassword: false,
        password: false,
        confirmPassword: false,
    });
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    let form;
    let confirmPasswordInput;

    const handleSubmit = event => {

        event.preventDefault();

        handleValidation();

        if (form.checkValidity() && checkConfirmPassword()) {

            dispatch(actions.changePassword(
                user.id,
                oldPassword,
                password,
                () => navigate('/'),
                errors => setBackendErrors(errors)
            ));

        } else {
            setBackendErrors(null);
            form.classList.add('was-validated');
        }

    }

    const handleValidation = () => {
        const newRequiredAlerts = {
            oldPassword: oldPassword === '',
            password: password === '',
            confirmPassword: confirmPassword === '',
        };
        setRequiredAlertMessages(newRequiredAlerts);
    };

    const checkConfirmPassword = () => {

        if (password !== confirmPassword) {

            confirmPasswordInput.setCustomValidity('error');
            setPasswordsDoNotMatch(true);

            return false;

        } else {
            return true;
        }

    }

    const handleConfirmPasswordChange = event => {

        confirmPasswordInput.setCustomValidity('');
        setConfirmPassword(event.target.value);
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
                            justifyContent: "flex-start",
                            mb: 1,
                            borderBottom: '1px solid #9575cd',
                        }}>
                        <BackButton />
                        <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                            <FormattedMessage id="project.users.ChangePassword.title"></FormattedMessage>
                        </Typography>
                    </Box>
                    <Box component="form" ref={node => form = node} noValidate onSubmit={handleSubmit}
                         sx={{
                             display: "flex",
                             flexDirection: "column",
                             alignItems: "center",
                             justifyContent: "center",
                             ml: 1,
                             mr: 1,
                             mb: 1,
                         }}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                ml: 1,
                                mr: 1,
                                mb: 1,
                            }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        fullWidth
                                        id="password"
                                        label={<FormattedMessage id="project.global.fields.oldPassword" />}
                                        autoFocus
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
                                        error={requiredAlertMessages.oldPassword}
                                        helperText={requiredAlertMessages.oldPassword &&
                                            <FormattedMessage id="project.global.validator.required" />}></TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        fullWidth
                                        id="password"
                                        label={<FormattedMessage id="project.global.fields.newPassword" />}
                                        error={requiredAlertMessages.password}
                                        helperText={requiredAlertMessages.password &&
                                            <FormattedMessage id="project.global.validator.required" />}></TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        inputRef={node => confirmPasswordInput = node}
                                        value={confirmPassword}
                                        onChange={(e) => handleConfirmPasswordChange(e)}
                                        name="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        fullWidth
                                        id="confirmPassword"
                                        label={<FormattedMessage id="project.users.SignUp.fields.confirmPassword" />}
                                        error={requiredAlertMessages.confirmPassword || passwordsDoNotMatch}
                                        helperText={passwordsDoNotMatch ?
                                            <FormattedMessage id="project.global.validator.passwordsDoNotMatch" />
                                            :
                                            requiredAlertMessages.confirmPassword &&
                                            <FormattedMessage id="project.global.validator.required" />}></TextField>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: "auto",
                                ml: "auto",
                                mr: "auto",
                                mb: 4,
                            }}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 1 }}>
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.ChangePassword"></FormattedMessage>
                                </Typography>
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )

}

export default ChangePassword;