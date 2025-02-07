import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import PropTypes from "prop-types";

import * as selectors from "../selectors";
import * as actions from "../actions";

import {Avatar, Box, Fab, List, ListItem, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import {Errors} from "../../common";

const FollowRequests = ({ users }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(selectors.getUser);
    const [backendErrors, setBackendErrors] = useState(null);

    const handleUserClick = (userId) => {

        navigate(`/search/userdetails/${userId}`);

    }

    const handleAcceptFollowRequest = (userRequestingId) => {

        dispatch(actions.acceptFollowRequest(user.id, userRequestingId,
            () => {
                dispatch(actions.getUserNumFollowRequests(user.id));
                dispatch(actions.findUserFollowRequests(user.id, {page: 0}));
            },
            errors => setBackendErrors(errors)));

    }

    const handleRejectFollowRequest = (userRequestingId) => {

        dispatch(actions.rejectFollowRequest(user.id, userRequestingId,
            () => {
                dispatch(actions.getUserNumFollowRequests(user.id));
                dispatch(actions.findUserFollowRequests(user.id, {page: 0}));
            },
            errors => setBackendErrors(errors)));

    }

    return(

        <nav>
            <Errors errors={backendErrors} onClose={() => setBackendErrors(null)}/>
            <List
                sx={{bgcolor: 'background.paper', width: '100%' }}>
                {users.map(user =>
                    <ListItem disablePadding key={user.id} sx={{ maxWidth: 500, width: '100%' }}>
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
                                onClick={() => handleAcceptFollowRequest(user.id)}>
                                <CheckOutlinedIcon />
                            </Fab>
                        </Box>
                        <Box>
                            <Fab
                                sx={{ zIndex: 0 }}
                                size="small"
                                color="alertRed"
                                onClick={() => handleRejectFollowRequest(user.id)}>
                                <HighlightOffOutlinedIcon />
                            </Fab>
                        </Box>
                    </ListItem>
                )}
            </List>
        </nav>

    );

}

FollowRequests.propTypes = {
    followRequests: PropTypes.array.isRequired,
};

export default FollowRequests;