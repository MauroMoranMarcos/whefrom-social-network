import {useNavigate} from "react-router-dom";

import {FormattedMessage} from "react-intl";
import PropTypes from "prop-types";

import {Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Tooltip} from "@mui/material";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import CurrencyBitcoinOutlinedIcon from "@mui/icons-material/CurrencyBitcoinOutlined";

const UsersThatClaimed = ({ usersThatClaimed }) => {

    const navigate = useNavigate();

    const handleUserClick = (userId) => {

        navigate(`/search/userdetails/${userId}`);

    }

    return(

        <nav>
            <List
                sx={{bgcolor: 'background.paper', width: '100%' }}>
                {usersThatClaimed.map(user =>
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
                            <ListItemText primary={user.userName} secondary={user.email}/>
                            {user.verified && <VerifiedOutlinedIcon color="secondary"/>}
                            {user.role === 'BRAND_USER' &&
                                <Tooltip title={<FormattedMessage id="project.search.UserDetails.brandUser.explanatoryText" />}>
                                    <CurrencyBitcoinOutlinedIcon color="secondary"/>
                                </Tooltip>
                            }
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </nav>

    );

}

UsersThatClaimed.propTypes = {
    usersThatClaimed: PropTypes.array.isRequired,
};

export default UsersThatClaimed;