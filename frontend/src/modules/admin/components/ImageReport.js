import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import search from "../../search";
import users from "../../users";

import {FormattedMessage} from "react-intl";
import {Avatar, Chip, Grid, ListItem, ListItemButton, ListItemText, Typography} from "@mui/material";
import {ImageButton, ImageSrc} from "../../search/components/Images";

const ImageReport = ({ imageReport }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userLogged = useSelector(users.selectors.getUser);
    const [reason, setReason] = useState(null);
    const [imageReported, setImageReported] = useState(null);

    useEffect(() => {

        dispatch(search.actions.findImageById(imageReport.imageReportedId, userLogged.id,
            image => setImageReported(image)));

        if (imageReport.reason === 'IDENTITY_FRAUD') {
            setReason(<FormattedMessage id="project.search.UserDetails.reasons.IdentityFraud" />);
        }
        if (imageReport.reason === 'UNDER_16') {
            setReason(<FormattedMessage id="project.search.UserDetails.reasons.Under16" />);
        }
        if (imageReport.reason === 'SPAM') {
            setReason(<FormattedMessage id="project.search.UserDetails.reasons.Spam" />);
        }
        if (imageReport.reason === 'NAKED_OR_SEXUAL_ACTIVITY') {
            setReason(<FormattedMessage id="project.search.UserDetails.reasons.NakedOrSexualActivity" />);
        }
        if (imageReport.reason === 'VIOLENCE') {
            setReason(<FormattedMessage id="project.search.UserDetails.reasons.Violence" />);
        }
        if (imageReport.reason === 'BULLYING') {
            setReason(<FormattedMessage id="project.search.UserDetails.reasons.Bullying" />);
        }
        if (imageReport.reason === 'FRAUD') {
            setReason(<FormattedMessage id="project.search.UserDetails.reasons.Fraud" />);
        }

    }, []);

    const handleImageReportClick = (imageReportId) => {

        navigate(`/admin/reports/image/${imageReportId}`);

    }

    const handleImageReportedClick = () => {

        navigate(`/search/imagedetails/${imageReported.id}`);

    }

    if (!reason || !imageReported) {
        return null
    }

    return (
        <ListItem disablePadding key={imageReport.id} sx={{ width: '100%' }}>
            <ListItemButton
                onClick={() => handleImageReportClick(imageReport.id)}>
                <Chip avatar={<Avatar src={`data:image/jpeg;base64,${imageReported.imgFile}`}></Avatar>}
                      color="primary" label={imageReported.title} variant="outlined" component="a"
                      onClick={(e) => {
                          e.stopPropagation();
                          handleImageReportedClick();
                      }} clickable sx={{ mr: 1 }}/>
                <ListItemText primary={reason}/>
            </ListItemButton>
        </ListItem>
    )

}

export default ImageReport;