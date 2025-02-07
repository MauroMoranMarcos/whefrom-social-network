import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

import search from '../../search/index';

import {Avatar, Chip, ListItem, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import {FormattedMessage} from "react-intl";

const UserReport = ({ userReport }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [reason, setReason] = useState(null);
    const [userReported, setUserReported] = useState(null);

    useEffect(() => {

        dispatch(search.actions.findUserById(userReport.userReportedId,
            user => setUserReported(user)));

        setReason(formatReason(userReport.reason));

    }, []);

    const handleUserReportClick = (userReportId) => {

        navigate(`/admin/reports/user/${userReportId}`);

    }

    const handleUserReportedClick = () => {

        navigate(`/search/userdetails/${userReported.id}`);

    }

    if (!reason || !userReported) {
        return null
    }

    return (
        <ListItem disablePadding key={userReport.id} sx={{ width: '100%' }}>
            <ListItemButton
                onClick={() => handleUserReportClick(userReport.id)}>
                <Chip avatar={<Avatar src={`data:image/jpeg;base64,${userReported.profilePicture}`}></Avatar>}
                      color="primary" label={userReported.userName} variant="outlined" component="a"
                      onClick={(e) => {
                          e.stopPropagation();
                          handleUserReportedClick();
                      }} clickable sx={{ mr: 1 }}/>
                <ListItemText primary={reason}/>
            </ListItemButton>
        </ListItem>
    )

}

export const formatReason = (reason) => {

    if (reason === 'IDENTITY_FRAUD') {
        return(<FormattedMessage id="project.search.UserDetails.reasons.IdentityFraud" />);
    }
    if (reason === 'UNDER_16') {
        return(<FormattedMessage id="project.search.UserDetails.reasons.Under16" />);
    }
    if (reason === 'SPAM') {
        return(<FormattedMessage id="project.search.UserDetails.reasons.Spam" />);
    }
    if (reason === 'NAKED_OR_SEXUAL_ACTIVITY') {
        return(<FormattedMessage id="project.search.UserDetails.reasons.NakedOrSexualActivity" />);
    }
    if (reason === 'VIOLENCE') {
        return(<FormattedMessage id="project.search.UserDetails.reasons.Violence" />);
    }
    if (reason === 'BULLYING') {
        return(<FormattedMessage id="project.search.UserDetails.reasons.Bullying" />);
    }
    if (reason === 'FRAUD') {
        return(<FormattedMessage id="project.search.UserDetails.reasons.Fraud" />);
    }

}

export default UserReport;