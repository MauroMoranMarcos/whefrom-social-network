import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {useNavigate} from 'react-router-dom';

import users from '../../users/index';

import {Errors} from '../../common';
import * as actions from '../actions';
import {Box, Button, Paper, TextField, Typography, Grid, Link, Container} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

const LoginBrandAccount = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [backendErrors, setBackendErrors] = useState(null);
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    let form;

    const handleSubmit = event => {

        event.preventDefault();

        if (form.checkValidity()) {

            dispatch(users.actions.login(
                userName.trim(),
                password,
                () => navigate('/'),
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
                            mt: 1,
                            mb: 2,
                        }}>
                        <Typography variant="h2" sx={{ mt: 1, mb: 0.2 }}>
                            <FormattedMessage id="project.brands.LoginBrandAccount.title"></FormattedMessage>
                        </Typography>
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
                                    type="password"
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
                                    sx={{ mt: 3, mb: 2 }}>
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.Login"></FormattedMessage>
                                    </Typography>
                                </Button>
                            </Box>
                            <Grid container justifyContent="center" mb={1}>
                                <Grid item>
                                    <Link href="/users/forgottenpassword" variant="h3">
                                        <Typography>
                                            <FormattedMessage id="project.users.Login.text.forgotPassword"></FormattedMessage>
                                        </Typography>
                                    </Link>
                                </Grid>
                            </Grid>
                            <Grid container justifyContent="center" mb={1}>
                                <Grid item>
                                    <Link href="/brands/signUp" variant="h3">
                                        <Typography>
                                            <FormattedMessage id="project.brands.LoginBrandAccount.text.dontHaveAccount"></FormattedMessage>
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

export default LoginBrandAccount;