import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {useNavigate} from 'react-router-dom';

import users from '../../users/index';

import {Errors} from '../../common';
import * as actions from '../actions';
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Grid,
    Link,
    Container,
    InputAdornment,
    IconButton
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const SignUpBrandAccount = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [brandName, setBrandName] = useState('');
    const [email, setEmail]  = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [about, setAbout] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [type, setType] = useState('BRAND_USER');
    const [backendErrors, setBackendErrors] = useState(null);
    const [passwordsDoNotMatch, setPasswordsDoNotMatch] = useState(false);
    const [incorrectEmail, setIncorrectEmail] = useState(false);
    const [requiredAlertMessages, setRequiredAlertMessages] = useState({
        userName: false,
        password: false,
        confirmPassword: false,
        email: false,
        brandName: false,
        phoneNumber: false,
    });
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    let form;
    let confirmPasswordInput;

    const handleSubmit = event => {

        event.preventDefault();

        handleValidation();

        setIncorrectEmail(!validateEmail(email));

        if (form.checkValidity() && checkConfirmPassword()) {

            dispatch(users.actions.signUp(
                {userName: userName.trim(),
                    password: password,
                    name: brandName.trim(),
                    email: email.trim(),
                    phoneNumber: phoneNumber.trim(),
                    profilePicture: profilePicture,
                    role: type.trim(),
                    about: about.trim(),
                    verificationCode: verificationCode.trim()},
                () => {
                    const redirectUrl = localStorage.getItem('redirectAfterLogin');
                    if (redirectUrl) {
                        localStorage.removeItem('redirectAfterLogin');
                        navigate(redirectUrl);
                    } else {
                        navigate('/users/updateprofile/addprofilepicture');
                    }
                },
                errors => setBackendErrors(errors),
                () => {
                    navigate('/brands/login');
                    dispatch(users.actions.logout());
                }
            ));

        } else {

            setBackendErrors(null);
            form.classList.add('was-validated');

        }

    }

    const handleImANormalUser = event => {
        event.preventDefault();

        navigate('/users/signup');
    }

    const handleLogin = event => {
        event.preventDefault();

        navigate('/users/login');
    }

    const handleValidation = () => {
        const newRequiredAlerts = {
            userName: userName === '',
            password: password === '',
            confirmPassword: confirmPassword === '',
            email: email === '',
            brandName: brandName === '',
            phoneNumber: phoneNumber === '',
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

    const handleConfirmPasswordChange = value => {

        confirmPasswordInput.setCustomValidity('');
        setConfirmPassword(value);
        setPasswordsDoNotMatch(false);

    }

    const handleClickShowPassword = () => {

        setShowPassword((show) => !show);

    }

    const handleMouseDownPassword = (event) => {

        event.preventDefault();

    };

    // Function to validate an email address
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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
                            <FormattedMessage id="project.brands.SignUpBrandAccount.title"></FormattedMessage>
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
                        <Button
                            variant="outlined"
                            onClick={e => handleImANormalUser(e)}
                            sx={{ mt: 1, mb: 2 }}>
                            <Typography>
                                <FormattedMessage id="project.global.buttons.areYouANormalUser"></FormattedMessage>
                            </Typography>
                        </Button>
                    </Box>
                    <Box component="form" ref={node => form = node} noValidate onSubmit={handleSubmit}
                         sx={{
                             display: "flex",
                             alignItems: "center",
                             justifyContent: "center",
                             mt: 1,
                             ml: 1,
                             mr: 1,
                             mb: 1,
                         }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    name="userName"
                                    required
                                    fullWidth
                                    id="userName"
                                    label={<FormattedMessage id="project.global.fields.userName" />}
                                    autoFocus
                                    error={requiredAlertMessages.userName}
                                    helperText={requiredAlertMessages.userName &&
                                        <FormattedMessage id="project.global.validator.required" />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    name="password"
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
                                    id="password"
                                    label={<FormattedMessage id="project.global.fields.password" />}
                                    error={requiredAlertMessages.password}
                                    helperText={requiredAlertMessages.password &&
                                        <FormattedMessage id="project.global.validator.required" />}></TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    inputRef={node => confirmPasswordInput = node}
                                    value={confirmPassword}
                                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
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
                            <Grid item xs={12}>
                                <TextField
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    name="email"
                                    type="email"
                                    required
                                    fullWidth
                                    id="email"
                                    label={<FormattedMessage id="project.brands.fields.enterpriseEmail" />}
                                    error={requiredAlertMessages.email || incorrectEmail}
                                    helperText={requiredAlertMessages.email ?
                                        <FormattedMessage id="project.global.validator.required" />
                                        :
                                        incorrectEmail &&
                                        <FormattedMessage id="project.global.validator.incorrectEmail" />}></TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={brandName}
                                    onChange={(e) => setBrandName(e.target.value)}
                                    name="name"
                                    required
                                    fullWidth
                                    id="name"
                                    label={<FormattedMessage id="project.brands.fields.brandName" />}
                                    error={requiredAlertMessages.brandName}
                                    helperText={requiredAlertMessages.brandName &&
                                        <FormattedMessage id="project.global.validator.required" />}></TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    name="phoneNumber"
                                    required
                                    fullWidth
                                    id="phoneNumber"
                                    label={<FormattedMessage id="project.global.fields.phoneNumber" />}
                                    error={requiredAlertMessages.phoneNumber}
                                    helperText={requiredAlertMessages.phoneNumber &&
                                        <FormattedMessage id="project.global.validator.required" />}></TextField>
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
                                    sx={{ mt: 3, mb: 2 }}>
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.SignUp"></FormattedMessage>
                                    </Typography>
                                </Button>
                            </Box>
                            <Grid container justifyContent="center">
                                <Grid item>
                                    <Link onClick={handleLogin} variant="h3">
                                        <Typography sx={{ textAlign: 'center', ml: 5, mr: 5 }}>
                                            <FormattedMessage id="project.brands.SignUpBrandAccount.text.alreadyHaveAccount"></FormattedMessage>
                                        </Typography>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )

}

export default SignUpBrandAccount;