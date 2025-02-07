import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {useLocation, useNavigate} from 'react-router-dom';

import {Errors} from '../../common';
import * as actions from '../actions';
import {Box, Button, Paper, TextField, Typography, Grid, Container} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

const EnterVerificationCode = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [backendErrors, setBackendErrors] = useState(null);
    const [requiredAlertMessages, setRequiredAlertMessages] = useState({
        verificationCode: false,
    });
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    useEffect(() => {

        if (location.state) {
            setEmail(location.state.email);
        }

    }, []);

    const handleEnterVerificationCode = () => {

        handleValidation();

        dispatch(actions.enterVerificationCode(
            email.trim(),
            verificationCode.trim(),
            () => navigate('/users/forgottenPassword/restorePassword', { state: {email, verificationCode} }),
            errors => setBackendErrors(errors)
        ));

    }

    const handleValidation = () => {
        const newRequiredAlerts = {
            verificationCode: verificationCode === '',
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
                            justifyContent: "center",
                            mb: 1,
                            borderBottom: '1px solid #9575cd',
                        }}>
                        <Typography variant="h2" sx={{ mt: 0.5, mb: 0.5, fontWeight: 'bold' }}>
                            <FormattedMessage id="project.users.EnterVerificationCode.title"></FormattedMessage>
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
                            <FormattedMessage id="project.users.EnterVerificationCode.text"></FormattedMessage>
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
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    name="verificationCode"
                                    required
                                    fullWidth
                                    id="verificationCode"
                                    label={<FormattedMessage id="project.global.fields.verificationCode" />}
                                    error={requiredAlertMessages.verificationCode}
                                    helperText={requiredAlertMessages.verificationCode &&
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
                            mt: "auto",
                            ml: "auto",
                            mr: "auto",
                            mb: 4,
                        }}>
                        <Button
                            onClick={handleEnterVerificationCode}
                            variant="contained"
                            sx={{ mt: 1 }}>
                            <Typography>
                                <FormattedMessage id="project.global.buttons.EnterVerificationCode"></FormattedMessage>
                            </Typography>
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )

}

export default EnterVerificationCode;