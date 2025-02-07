import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {useNavigate} from 'react-router-dom';

import {BackButton, Errors} from '../../common';
import * as actions from '../actions';
import * as selectors from '../selectors';
import {
    Box,
    Button,
    Container,
    Grid,
    MenuItem,
    Paper,
    Select,
    Typography
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

const UpdateUserSettings = () => {

    const user = useSelector(selectors.getUser);
    const userSettings = useSelector(selectors.getUserSettings);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [privacyPublic, setPrivacyPublic] = useState(userSettings.privacyPublic);
    const [notifyMe, setNotifyMe] = useState(userSettings.notifyMe);
    const [areChanges, setAreChanges] = useState(false);
    const [backendErrors, setBackendErrors] = useState(null);
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    const handleUpdateUserSettings = () => {

        dispatch(actions.updateUserSettings(
            user.id,
            {privacyPublic: privacyPublic,
                notifyMe: notifyMe},
            () => navigate('/'),
            errors => setBackendErrors(errors)));

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
                            <FormattedMessage id="project.users.UpdateUserSettings.title"></FormattedMessage>
                        </Typography>
                    </Box>
                    <Box
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
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mt: 1,
                                        mb: 1,
                                    }}>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                                        <FormattedMessage id="project.users.UpdateUserSettings.fields.privacy" />
                                    </Typography>
                                </Box>
                                <Select
                                    value={privacyPublic}
                                    fullWidth
                                    onChange={(e) => {
                                        setPrivacyPublic(e.target.value);
                                        setAreChanges(true);
                                    }}>
                                    <MenuItem value="true">
                                        <Typography>
                                            <FormattedMessage id="project.users.UpdateUserSettings.fields.privacy.public" />
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem value="false">
                                        <Typography>
                                            <FormattedMessage id="project.users.UpdateUserSettings.fields.privacy.private" />
                                        </Typography>
                                    </MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mt: 1,
                                        mb: 1,
                                    }}>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                                        <FormattedMessage id="project.users.UpdateUserSettings.fields.notifications" />
                                    </Typography>
                                </Box>
                                <Select
                                    value={notifyMe}
                                    fullWidth
                                    onChange={(e) => {
                                        setNotifyMe(e.target.value);
                                        setAreChanges(true);
                                    }}>
                                    <MenuItem value="true">
                                        <Typography>
                                            <FormattedMessage id="project.users.UpdateUserSettings.fields.notifications.active" />
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem value="false">
                                        <Typography>
                                            <FormattedMessage id="project.users.UpdateUserSettings.fields.notifications.deactive" />
                                        </Typography>
                                    </MenuItem>
                                </Select>
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
                            variant="contained"
                            disabled={!areChanges}
                            onClick={handleUpdateUserSettings}
                            sx={{ mt: 2 }}>
                            <Typography>
                                <FormattedMessage id="project.global.buttons.ConfirmChanges"></FormattedMessage>
                            </Typography>
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )

}

export default UpdateUserSettings;