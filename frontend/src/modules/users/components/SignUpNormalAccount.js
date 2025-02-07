import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {useNavigate} from 'react-router-dom';

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
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const SignUpNormalAccount = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail]  = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [about, setAbout] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [type, setType] = useState('NORMAL_USER');
    const [backendErrors, setBackendErrors] = useState(null);
    const [passwordsDoNotMatch, setPasswordsDoNotMatch] = useState(false);
    const [incorrectEmail, setIncorrectEmail] = useState(false);
    const [requiredAlertMessages, setRequiredAlertMessages] = useState({
        userName: false,
        password: false,
        confirmPassword: false,
        email: false,
        birthDate: false,
    });
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    let form;
    let confirmPasswordInput;

    const handleSubmit = event => {

        event.preventDefault();

        handleValidation();

        setIncorrectEmail(!validateEmail(email));

        const dateObject = new Date(birthDate);

        const isoDateObject = dateObject.toISOString();

        if (form.checkValidity() && checkConfirmPassword()) {

            dispatch(actions.signUp(
                {userName: userName.trim(),
                    password: password,
                    name: name.trim(),
                    surname: surname.trim(),
                    email: email.trim(),
                    phoneNumber: phoneNumber.trim(),
                    birthDate: isoDateObject,
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
                    navigate('/users/login');
                    dispatch(actions.logout());
                }
            ));

        } else {

            setBackendErrors(null);
            form.classList.add('was-validated');

        }

    }

    const handleImABrand = event => {
        event.preventDefault();

        navigate('/users/signUp/brandaccount');
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
            birthDate: birthDate === '',
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

    // Function to validate an email adress
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
                            <FormattedMessage id="project.users.SignUp.title"></FormattedMessage>
                        </Typography>
                    </Box>
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
                            variant="outlined"
                            onClick={e => handleImABrand(e)}
                            sx={{ mt: 1, mb: 1 }}>
                            <Typography>
                                <FormattedMessage id="project.global.buttons.areYouABrand"></FormattedMessage>
                            </Typography>
                        </Button>
                    </Box>
                    <Box component="form" ref={node => form = node} noValidate onSubmit={handleSubmit}
                         sx={{
                             display: "flex",
                             alignItems: "center",
                             justifyContent: "center",
                             mt: 1,
                             ml: 2,
                             mr: 2,
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
                                    label={<FormattedMessage id="project.global.fields.email" />}
                                    error={requiredAlertMessages.email || incorrectEmail}
                                    helperText={requiredAlertMessages.email ?
                                        <FormattedMessage id="project.global.validator.required" />
                                        :
                                        incorrectEmail &&
                                        <FormattedMessage id="project.global.validator.incorrectEmail" />}></TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    name="name"
                                    fullWidth
                                    id="name"
                                    label={<FormattedMessage id="project.global.fields.name" />}></TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                    name="surname"
                                    fullWidth
                                    id="surname"
                                    label={<FormattedMessage id="project.global.fields.surname" />}></TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    name="phoneNumber"
                                    fullWidth
                                    id="phoneNumber"
                                    label={<FormattedMessage id="project.global.fields.phoneNumber" />}></TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{
                                    display: "flex",
                                    alignContent: "center",
                                }}>
                                    <Typography variant="h3" sx={{ mt: 1, mb: 1 }}>
                                        <FormattedMessage id="project.global.fields.birthDate"></FormattedMessage>
                                    </Typography>
                                </Box>
                                <TextField
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    name="birthDate"
                                    type="date"
                                    required
                                    fullWidth
                                    id="birthDate"
                                    error={requiredAlertMessages.birthDate}
                                    helperText={requiredAlertMessages.birthDate &&
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
                            <Grid container direction="column" alignItems="center" mb={1}>
                                <Grid item>
                                    <Link onClick={handleLogin} variant="h3">
                                        <Typography>
                                            <FormattedMessage id="project.users.SignUp.text.alreadyHaveAccount"></FormattedMessage>
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

export default SignUpNormalAccount;