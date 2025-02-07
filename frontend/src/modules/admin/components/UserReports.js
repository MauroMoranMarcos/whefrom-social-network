import PropTypes from "prop-types";

import {List, ListItem} from "@mui/material";

import UserReport from "./UserReport";

const UserReports = ({ userReports }) => {

    return(

        <nav>
            <List
                sx={{bgcolor: 'background.paper', width: '100%' }}>
                {userReports.map(userReport =>
                    <ListItem disablePadding key={userReport.id} sx={{ width: '100%' }}>
                        <UserReport userReport={userReport} />
                    </ListItem>
                )}
            </List>
        </nav>

    );

}

UserReports.propTypes = {
    userReports: PropTypes.array.isRequired,
};

export default UserReports;