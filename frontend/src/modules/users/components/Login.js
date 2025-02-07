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
    InputAdornment, IconButton
} from "@mui/material";
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import useMediaQuery from "@mui/material/useMediaQuery";

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [backendErrors, setBackendErrors] = useState(null);
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    let form;

    const handleSubmit = event => {

        event.preventDefault();

        if (form.checkValidity()) {

            dispatch(actions.login(
                userName.trim(),
                password,
                () => {
                    const redirectUrl = localStorage.getItem('redirectAfterLogin');
                    if (redirectUrl) {
                        localStorage.removeItem('redirectAfterLogin');
                        navigate(redirectUrl);
                    } else {
                        navigate('/');
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

    const handleClickShowPassword = () => {

        setShowPassword((show) => !show);

    }

    const handleForgotPassword = () => {

        navigate("/users/forgottenpassword");

    }

    const handleSignUp = () => {

        navigate("/users/signup");

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
                           gap: 4,
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
                            <FormattedMessage id="project.users.Login.title"></FormattedMessage>
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
                            size="large"
                            variant="outlined"
                            onClick={e => handleImABrand(e)}
                            sx={{ mt: 1, mb: 2, ml: 0.5, mr: 0.5, minWidth: !isMobile ? '200px' : undefined, minHeight: !isMobile ? '60px' : undefined }}>
                            <Typography sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                                <FormattedMessage id="project.global.buttons.areYouABrand"></FormattedMessage>
                            </Typography>
                        </Button>
                    </Box>
                    <Box component="form" ref={node => form = node} noValidate onSubmit={handleSubmit}
                         sx={{
                             display: "flex",
                             alignItems: "center",
                             justifyContent: "center",
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
                                    autoFocus></TextField>
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
                                            >
                                                {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                                            </IconButton>
                                        </InputAdornment>,
                                    }}
                                    required
                                    fullWidth
                                    id="password"
                                    label={<FormattedMessage id="project.global.fields.password" />}></TextField>
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
                                    sx={{ mt: 5, mb: 4 }}>
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.Login"></FormattedMessage>
                                    </Typography>
                                </Button>
                            </Box>
                            <Grid container direction="column" alignItems="center" mb={1}>
                                <Grid item sx={{ mb: 1 }}>
                                    <Link onClick={handleForgotPassword} variant="h3">
                                        <Typography textAlign="center">
                                            <FormattedMessage id="project.users.Login.text.forgotPassword"></FormattedMessage>
                                        </Typography>
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link onClick={handleSignUp} variant="h3">
                                        <Typography textAlign="center">
                                            <FormattedMessage id="project.users.Login.text.dontHaveAccount"></FormattedMessage>
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

export default Login;