import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {useNavigate} from 'react-router-dom';

import {BackButton, Errors} from '../../common';
import * as actions from '../actions';
import {Box, Button, Paper, TextField, Typography, Grid, Container, CircularProgress} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

const ForgotPassword = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [backendErrors, setBackendErrors] = useState(null);
    const [showProgress, setShowProgress] = useState(false);
    const [requiredAlertMessages, setRequiredAlertMessages] = useState({
        email: false,
    });
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    useEffect(() => {

        setShowProgress(false);

    }, [backendErrors]);

    const handleSendMail = () => {

        if (!showProgress) {
            setShowProgress(true);
        }

        handleValidation();

        dispatch(actions.sendVerificationCode(
            email.trim(),
            () => {
                setShowProgress(false);
                navigate('/users/forgottenPassword/verificationCode', { state: {email} });
            },
            errors => setBackendErrors(errors)
        ));

    }

    const handleValidation = () => {
        const newRequiredAlerts = {
            email: email === '',
        };
        setRequiredAlertMessages(newRequiredAlerts);
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
                        <Typography variant="h2" sx={{ mt: 0.5, mb: 0.5, fontWeight: 'bold' }}>
                            <FormattedMessage id="project.users.ForgotPassword.title"></FormattedMessage>
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
                            <FormattedMessage id="project.users.ForgotPassword.text"></FormattedMessage>
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    name="email"
                                    type="email"
                                    required
                                    fullWidth
                                    id="email"
                                    label={<FormattedMessage id="project.global.fields.email" />}
                                    error={requiredAlertMessages.email}
                                    helperText={requiredAlertMessages.email &&
                                        <FormattedMessage id="project.global.validator.required" />}
                                    autoFocus></TextField>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 10
                        }}>
                        {showProgress &&
                            <CircularProgress
                                size={32}
                                sx={{
                                    color: '#9575cd',
                                }}
                            />
                        }
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: "auto",
                            ml: "auto",
                            mr: "auto",
                            mb: 4,
                        }}>
                        <Button
                            onClick={handleSendMail}
                            variant="contained"
                            disabled={showProgress}
                            sx={{ mt: 1 }}>
                            <Typography>
                                <FormattedMessage id="project.global.buttons.SendConfirmationEmail"></FormattedMessage>
                            </Typography>
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )

}

export default ForgotPassword;