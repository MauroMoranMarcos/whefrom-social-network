import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";

import PropTypes from "prop-types";

import * as selectors from "../selectors";
import * as actions from "../actions";

import {Errors} from "../../common";
import {
    Avatar,
    Box, Button, Dialog, DialogActions, DialogContent,
    DialogTitle,
    Fab, Grid, IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText, Typography, useTheme
} from "@mui/material";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import {FormattedMessage} from "react-intl";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";

export const VerificationRequests = ({ users }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [openAcceptVerificationRequestDialog, setOpenAcceptVerificationRequestDialog] = useState(false);
    const [backendErrors, setBackendErrors] = useState(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleUserClick = (userId) => {

        navigate(`/search/userdetails/${userId}`);

    }

    const handleAcceptVerificationRequest = (brandRequestingId) => {

        dispatch(actions.acceptVerificationRequest(brandRequestingId,
            () => {
                dispatch(actions.findVerificationRequests({page: 0}));
            },
            errors => setBackendErrors(errors)));

    }

    const handleRejectVerificationRequest = (brandRequestingId) => {

        dispatch(actions.rejectVerificationRequest(brandRequestingId,
            () => {
                dispatch(actions.findVerificationRequests({page: 0}));
            },
            errors => setBackendErrors(errors)));

    }

    const handleOpenAcceptVerificationRequestDialog = () => {

        setOpenAcceptVerificationRequestDialog(true);

    }

    const handleCloseAcceptVerificationRequestDialog = () => {

        setOpenAcceptVerificationRequestDialog(false);

    }

    return(

        <nav>
            <Errors errors={backendErrors} onClose={() => setBackendErrors(null)}/>
            <List
                sx={{bgcolor: 'background.paper', width: '100%' }}>
                {users.map(user =>
                    <ListItem disablePadding key={user.id} sx={{ width: '100%' }}>
                        <ListItemButton
                            onClick={() => handleUserClick(user.id)}>
                            <ListItemAvatar>
                                {user.profilePicture ?
                                    <Avatar
                                        src={`data:image/jpeg;base64,${user.profilePicture}`}></Avatar>
                                    :
                                    <Avatar></Avatar>
                                }
                            </ListItemAvatar>
                            <ListItemText primary={user.userName} secondary={user.name}/>
                        </ListItemButton>
                        <Box
                            sx={{ mr: 0.3, ml: 0.5 }}>
                            <Fab
                                sx={{ zIndex: 0 }}
                                size="small"
                                color="primary"
                                onClick={() => handleOpenAcceptVerificationRequestDialog()}>
                                <CheckOutlinedIcon />
                            </Fab>
                        </Box>
                        <Box>
                            <Fab
                                sx={{ zIndex: 0 }}
                                size="small"
                                color="alertRed"
                                onClick={() => handleRejectVerificationRequest(user.id)}>
                                <HighlightOffOutlinedIcon />
                            </Fab>
                        </Box>
                        <Dialog
                            fullScreen={fullScreen}
                            open={openAcceptVerificationRequestDialog}
                            onClose={handleCloseAcceptVerificationRequestDialog}
                            aria-labelledby="responsive-dialog-title"
                        >
                            <DialogTitle id="responsive-dialog-title">
                                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                    {<FormattedMessage id="project.admin.VerificationRequests.acceptVerificationRequest.title" />}
                                </Typography>
                            </DialogTitle>
                            <IconButton
                                aria-label="close"
                                onClick={handleCloseAcceptVerificationRequestDialog}
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
                                                <FormattedMessage id="project.admin.VerificationRequests.acceptVerificationRequestText"></FormattedMessage>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    variant="contained"
                                    onClick={() => handleAcceptVerificationRequest(user.id)}
                                    sx={{ mt: 1, mb: 1 }}>
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.AcceptVerificationRequest"></FormattedMessage>
                                    </Typography>
                                </Button>
                                <Button
                                    variant="contained"
                                    color="alertRed"
                                    onClick={handleCloseAcceptVerificationRequestDialog}
                                    sx={{ mt: 1, mb: 1 }}>
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                    </Typography>
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </ListItem>
                )}
            </List>
        </nav>

    );

}

VerificationRequests.propTypes = {
    verificationRequests: PropTypes.array.isRequired,
};

export default VerificationRequests;