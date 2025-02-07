import PropTypes from 'prop-types';
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

import * as actions from '../actions';

import {Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Tooltip} from "@mui/material";
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import {FormattedMessage} from "react-intl";

const Users = ({ users, onlyBrands }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleUserClick = (userId) => {

        if (!onlyBrands) {
            navigate(`/search/userdetails/${userId}`);
        } else {
            dispatch(actions.findUserById(userId));
        }

    }

    return(

        <nav>
            <List
                sx={{bgcolor: 'background.paper', width: '100%' }}>
                {users.map(user =>
                    <ListItem disablePadding key={user.id}>
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
                            {user.verified &&
                                <Tooltip title={<FormattedMessage id="project.search.UserDetails.verifiedBrand.explanatoryText" />}>
                                    <VerifiedOutlinedIcon color="secondary"/>
                                </Tooltip>
                            }
                            {user.role === 'BRAND_USER' &&
                                <Tooltip title={<FormattedMessage id="project.search.UserDetails.brandUser.explanatoryText" />}>
                                    <CorporateFareOutlinedIcon color="secondary"/>
                                </Tooltip>
                            }
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </nav>

    );
}

Users.propTypes = {
    users: PropTypes.array.isRequired,
};

export default Users;