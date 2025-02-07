import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";

import users from '../../users';

import {
    Badge,
    Box,
    Button,
    ButtonGroup, Checkbox,
    Container, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControlLabel, IconButton,
    Paper,
    Typography, useTheme
} from "@mui/material";
import {FormattedMessage} from "react-intl";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined';
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const LeftBar = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userName = useSelector(users.selectors.getUserName);
    const isLoggedIn = useSelector(users.selectors.isLoggedIn);
    const user = useSelector(users.selectors.getUser);
    const userSettings = useSelector(users.selectors.getUserSettings);
    const userPoints = useSelector(users.selectors.getUserPoints);
    const isAdmin = useSelector(users.selectors.isAdmin);
    const isBrand = useSelector(users.selectors.isBrand);
    const numFollowRequests = useSelector(users.selectors.getNumFollowRequests);
    const [openUploadImageDisabledHelper, setOpenUploadImageDisabledHelper] = useState(false);
    const [openUploadRewardDisabledHelper, setOpenUploadRewardDisabledHelper] = useState(false);
    const [checkedReward, setCheckedReward] = useState(false);
    const [checkedImage, setCheckedImage] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {

        if (isLoggedIn) {
            dispatch(users.actions.getUserNumFollowRequests(user.id));
        }

    }, [isLoggedIn]);

    const handleChangeDontShowRewardHelp = (event) => {

        setCheckedReward(event.target.checked);

    }

    const handleChangeDontShowImageHelp = (event) => {

        setCheckedImage(event.target.checked);

    }

    const handleOpenUploadImageDisabledHelper = () => {

        setOpenUploadImageDisabledHelper(true);

    }

    const handleCloseUploadImageDisabledHelper = () => {

        setOpenUploadImageDisabledHelper(false);

    }

    const handleOpenUploadRewardDisabledHelper = () => {

        setOpenUploadRewardDisabledHelper(true);

    }

    const handleCloseUploadRewardDisabledHelper = () => {

        setOpenUploadRewardDisabledHelper(false);

    }

    const handleAcceptImageHelp = () => {

        handleCloseUploadImageDisabledHelper();

        if (checkedImage) {
            dispatch(users.actions.dontShowUplImageHelp(user.id));
        }

    }

    const handleAcceptRewardHelp = () => {

        handleCloseUploadRewardDisabledHelper();

        if (checkedReward) {
            dispatch(users.actions.dontShowUplRewardHelp(user.id));
        }

    }

    const handleGoHome = event => {
        event.preventDefault();

        navigate('/search/feed');
    }

    const handleSearch = event => {
        event.preventDefault();

        navigate('/search');
    }

    const handleFindRewards = event => {
        event.preventDefault();

        navigate('/search/rewards');
    }

    const handleUploadImage = event => {
        event.preventDefault();

        navigate('/images/upload');
    }

    const handleSeeFollowRequests = event => {
        event.preventDefault();

        dispatch(users.actions.getUserNumFollowRequests(user.id));
        dispatch(users.actions.findUserFollowRequests(user.id, {page: 0}));
        navigate('/users/followrequests');

    }

    const handleSeeMyProfile = event => {
        event.preventDefault();

        navigate(`/search/userdetails/${user.id}`);
    }

    const handleUpdateProfile = event => {
        event.preventDefault();

        navigate('/users/updateProfile/');
    }

    const handleLogout = event => {
        event.preventDefault();

        navigate('/users/logout');
    }

    const handleUploadReward = event => {
        event.preventDefault();

        navigate('/brands/upload');
    }

    const handleSeeUploadedRewards = event => {
        event.preventDefault();

        navigate('/search/uploadedrewards', { state: {brandId: user.id}} );
    }

    const handleManageCategories = event => {
        event.preventDefault();

        navigate('/admin/categories');
    }

    const handleSeeReports = event => {
        event.preventDefault();

        navigate('/admin/reports');
    }

    const handleViewVerificationRequests = event => {
        event.preventDefault();

        navigate('/admin/verificationrequests');
    }

    const checkPublicationTime = () => {

        const publicationDate = new Date(userPoints.publicationTime);

        const now = new Date();

        return now.getTime() < publicationDate.getTime();

    }

    if (isLoggedIn && !isAdmin && !userSettings && !userPoints) {
        return null;
    }

    return(
        <Container component="main" maxWidth="xs" disableGutters={true} sx={{ pr: 1 }}>
            <Paper elevation={4}>
                <Box
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: { xs: "column", md: "column" },
                        justifyContent: "center",
                        gap: 1,
                        border: '1px solid #9575cd',
                        borderRadius: '4px'
                    }}>
                    <ButtonGroup orientation="vertical" variant="text">
                        <Button
                            onClick={e => handleGoHome(e)}
                            color="secondary"
                            startIcon={<HomeOutlinedIcon style={{ fontSize: 30 }} />}
                            style={{
                                textAlign: 'left',
                                justifyContent: 'flex-start',
                                fontSize: '1.4rem',
                                padding: '12px 12px',
                                width: '100%'
                            }}>
                            <Typography>
                                <FormattedMessage id="project.global.buttons.Home"></FormattedMessage>
                            </Typography>
                        </Button>
                        <Button
                            onClick={e => handleSearch(e)}
                            color="secondary"
                            startIcon={<SearchOutlinedIcon style={{ fontSize: 30 }} />}
                            style={{
                                textAlign: 'left',
                                justifyContent: 'flex-start',
                                fontSize: '1.4rem',
                                padding: '12px 12px',
                                width: '100%'
                            }}>
                            <Typography>
                                <FormattedMessage id="project.global.buttons.Search"></FormattedMessage>
                            </Typography>
                        </Button>
                        <Button
                            onClick={e => handleFindRewards(e)}
                            color="secondary"
                            startIcon={<EmojiEventsOutlinedIcon style={{ fontSize: 30 }}/>}
                            style={{
                                textAlign: 'left',
                                justifyContent: 'flex-start',
                                fontSize: '1.4rem',
                                padding: '12px 12px',
                                width: '100%'
                            }}>
                            <Typography>
                                <FormattedMessage id="project.global.buttons.FindRewards"></FormattedMessage>
                            </Typography>
                        </Button>
                        {isAdmin &&
                            <Button
                                onClick={e => handleManageCategories(e)}
                                color="secondary"
                                startIcon={<CategoryOutlinedIcon style={{ fontSize: 30 }}/>}
                                style={{
                                    textAlign: 'left',
                                    justifyContent: 'flex-start',
                                    fontSize: '1.4rem',
                                    padding: '12px 12px',
                                    width: '100%'
                                }}>
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.ManageCategories"></FormattedMessage>
                                </Typography>
                            </Button>
                        }
                        {isAdmin &&
                            <Button
                                onClick={e => handleSeeReports(e)}
                                color="secondary"
                                startIcon={<ReportGmailerrorredOutlinedIcon style={{ fontSize: 30 }}/>}
                                style={{
                                    textAlign: 'left',
                                    justifyContent: 'flex-start',
                                    fontSize: '1.4rem',
                                    padding: '12px 12px',
                                    width: '100%'
                                }}>
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.SeeReports"></FormattedMessage>
                                </Typography>
                            </Button>
                        }
                        {isAdmin &&
                            <Button
                                onClick={e => handleViewVerificationRequests(e)}
                                color="secondary"
                                startIcon={<VerifiedOutlinedIcon style={{ fontSize: 30 }}/>}
                                style={{
                                    textAlign: 'left',
                                    justifyContent: 'flex-start',
                                    fontSize: '1.4rem',
                                    padding: '12px 12px',
                                    width: '100%'
                                }}>
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.SeeVerificationRequests"></FormattedMessage>
                                </Typography>
                            </Button>
                        }
                        {isBrand &&
                            <div style={{position: 'relative', width: '100%'}}>
                                <Button
                                    onClick={e => handleUploadReward(e)}
                                    disabled={!user.verified}
                                    color="secondary"
                                    startIcon={<PublishOutlinedIcon style={{fontSize: 30}}/>}
                                    style={{
                                        textAlign: 'left',
                                        justifyContent: 'flex-start',
                                        fontSize: '1.4rem',
                                        padding: '12px 12px',
                                        width: '100%',
                                        pointerEvents: user.verified ? 'auto' : 'none',
                                        position: 'relative',
                                    }}
                                >
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.UploadReward"/>
                                    </Typography>
                                </Button>
                                {!user.verified && userSettings.showUplRewardHelp &&
                                    <button
                                        className="faq-button"
                                        onClick={e => {
                                            e.stopPropagation();
                                            handleOpenUploadRewardDisabledHelper();
                                        }}
                                        style={{
                                            position: 'absolute',
                                            right: '5px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            pointerEvents: 'auto',
                                            zIndex: 2,
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                            <path
                                                d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/>
                                        </svg>
                                        <span className="tooltip">
                                            <FormattedMessage id="project.app.LeftBar.uploadRewardDisabledHelper"/>
                                        </span>
                                    </button>
                                }
                                <Dialog
                                    fullScreen={fullScreen}
                                    open={openUploadRewardDisabledHelper}
                                    onClose={handleCloseUploadRewardDisabledHelper}
                                    aria-labelledby="responsive-dialog-title"
                                >
                                    <DialogTitle id="responsive-dialog-title">
                                        <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                            <FormattedMessage id="project.app.LeftBar.uploadRewardDisabledTitle" />
                                        </Typography>
                                    </DialogTitle>
                                    <IconButton
                                        aria-label="close"
                                        onClick={handleCloseUploadRewardDisabledHelper}
                                        sx={{
                                            position: 'absolute',
                                            right: 8,
                                            top: 8,
                                        }}
                                    >
                                        <CloseOutlinedIcon color="primary" />
                                    </IconButton>
                                    <DialogContent>
                                        <Typography>
                                            <FormattedMessage
                                                id="project.app.LeftBar.uploadRewardDisabledBody"
                                                values={{
                                                    lineBreak: <br />,
                                                    strong: (chunks) => <strong>{chunks}</strong>,
                                                }}></FormattedMessage>
                                        </Typography>
                                        <FormControlLabel control={<Checkbox checked={checkedReward}
                                                                             onChange={handleChangeDontShowRewardHelp}
                                                                             inputProps={{ 'aria-label': 'controlled' }} />}
                                                          label={<FormattedMessage id="project.app.LeftBar.dontShowAgain" />} />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button
                                            variant="contained"
                                            sx={{ mt: 1, mb: 1 }}
                                            onClick={handleAcceptRewardHelp}>
                                            <Typography>
                                                <FormattedMessage id="project.global.buttons.Accept"></FormattedMessage>
                                            </Typography>
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        }
                        {isBrand && user.verified &&
                            <Button
                                onClick={e => handleSeeUploadedRewards(e)}
                                color="secondary"
                                startIcon={<StarsOutlinedIcon style={{fontSize: 30}}/>}
                                style={{
                                    textAlign: 'left',
                                    justifyContent: 'flex-start',
                                    fontSize: '1.4rem',
                                    padding: '12px 12px',
                                    width: '100%'
                                }}>
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.SeeUploadedRewards"></FormattedMessage>
                                </Typography>
                            </Button>
                        }
                        {userName && !isAdmin &&
                            <div style={{position: 'relative', width: '100%'}}>
                                <Button
                                    onClick={e => handleUploadImage(e)}
                                    color="secondary"
                                    disabled={(isBrand && !user.verified && (userPoints.publishedToday || checkPublicationTime()))
                                        || !isBrand && (userPoints.publishedToday || checkPublicationTime())}
                                    startIcon={<ImageOutlinedIcon style={{fontSize: 30}}/>}
                                    endIcon={((isBrand && !user.verified) && userPoints.publishedToday) || (!isBrand && userPoints.publishedToday) ?
                                        <TaskAltOutlinedIcon sx={{ ml: 5 }} style={{ color: 'green', fontSize: 30 }}/>
                                        :
                                        (checkPublicationTime() &&
                                            <HourglassEmptyOutlinedIcon sx={{ ml: 5 }} style={{ fontSize: 30 }}/>)
                                    }
                                    style={{
                                        textAlign: 'left',
                                        justifyContent: 'flex-start',
                                        fontSize: '1.4rem',
                                        padding: '12px 12px',
                                        width: '100%'
                                    }}>
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.UploadImage"></FormattedMessage>
                                    </Typography>
                                </Button>
                                {userSettings.showUplImageHelp && ((!userPoints.publishedToday && ((isBrand && !user.verified &&
                                            (userPoints.publishedToday || checkPublicationTime()))
                                    || !isBrand && (userPoints.publishedToday || checkPublicationTime()))) || userPoints.publishedToday) &&
                                    <button
                                        className="faq-button"
                                        onClick={e => {
                                            e.stopPropagation();
                                            handleOpenUploadImageDisabledHelper();
                                        }}
                                        style={{
                                            position: 'absolute',
                                            right: '5px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            pointerEvents: 'auto',
                                            zIndex: 2,
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                            <path
                                                d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/>
                                        </svg>
                                        <span className="tooltip">
                                            <FormattedMessage id="project.app.LeftBar.uploadImageDisabledHelper"/>
                                        </span>
                                    </button>
                                }
                                <Dialog
                                    fullScreen={fullScreen}
                                    open={openUploadImageDisabledHelper}
                                    onClose={handleCloseUploadImageDisabledHelper}
                                    aria-labelledby="responsive-dialog-title"
                                >
                                    <DialogTitle id="responsive-dialog-title">
                                        <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                            <FormattedMessage id="project.app.LeftBar.uploadImageDisabledTitle" />
                                        </Typography>
                                    </DialogTitle>
                                    <IconButton
                                        aria-label="close"
                                        onClick={handleCloseUploadImageDisabledHelper}
                                        sx={{
                                            position: 'absolute',
                                            right: 8,
                                            top: 8,
                                        }}
                                    >
                                        <CloseOutlinedIcon color="primary" />
                                    </IconButton>
                                    <DialogContent>
                                        <Typography>
                                            <FormattedMessage
                                                id="project.app.LeftBar.uploadImageDisabledBody"
                                                values={{
                                                    lineBreak: <br />,
                                                    strong: (chunks) => <strong>{chunks}</strong>,
                                                }}></FormattedMessage>
                                        </Typography>
                                        <FormControlLabel control={<Checkbox checked={checkedImage}
                                                                             onChange={handleChangeDontShowImageHelp}
                                                                             inputProps={{ 'aria-label': 'controlled' }} />}
                                                          label={<FormattedMessage id="project.app.LeftBar.dontShowAgain" />} />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button
                                            variant="contained"
                                            sx={{ mt: 1, mb: 1 }}
                                            onClick={handleAcceptImageHelp}>
                                            <Typography>
                                                <FormattedMessage id="project.global.buttons.Accept"></FormattedMessage>
                                            </Typography>
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        }
                        {userName && !isAdmin && !userSettings.privacyPublic &&
                            <Badge color="secondary"
                                   badgeContent={isLoggedIn ? numFollowRequests != null ? numFollowRequests : 0 : 0}>
                                <Button
                                    onClick={e => handleSeeFollowRequests(e)}
                                    color="secondary"
                                    startIcon={<ChecklistOutlinedIcon style={{ fontSize: 30 }}/>}
                                    style={{
                                        textAlign: 'left',
                                        justifyContent: 'flex-start',
                                        fontSize: '1.4rem',
                                        padding: '12px 12px',
                                        width: '100%'
                                    }}>
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.SeeFollowRequests"></FormattedMessage>
                                    </Typography>
                                </Button>
                            </Badge>
                        }
                        {userName && !isAdmin &&
                            <Button
                                onClick={e => handleSeeMyProfile(e)}
                                color="secondary"
                                startIcon={<AccountBoxOutlinedIcon style={{ fontSize: 30 }}/>}
                                style={{
                                    textAlign: 'left',
                                    justifyContent: 'flex-start',
                                    fontSize: '1.4rem',
                                    padding: '12px 12px',
                                    width: '100%'
                                }}>
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.MyProfile"></FormattedMessage>
                                </Typography>
                            </Button>
                        }
                        {userName && !isAdmin &&
                            <Button
                                onClick={e => handleUpdateProfile(e)}
                                color="secondary"
                                startIcon={<SettingsOutlinedIcon style={{ fontSize: 30 }}/>}
                                style={{
                                    textAlign: 'left',
                                    justifyContent: 'flex-start',
                                    fontSize: '1.4rem',
                                    padding: '12px 12px',
                                    width: '100%'
                                }}>
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.Settings"></FormattedMessage>
                                </Typography>
                            </Button>
                        }
                        {userName &&
                            <Button
                                onClick={e => handleLogout(e)}
                                color="secondary"
                                startIcon={<LogoutOutlinedIcon style={{ fontSize: 30 }}/>}
                                style={{
                                    textAlign: 'left',
                                    justifyContent: 'flex-start',
                                    fontSize: '1.4rem',
                                    padding: '12px 12px',
                                    width: '100%'
                                }}>
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.Logout"></FormattedMessage>
                                </Typography>
                            </Button>
                        }
                    </ButtonGroup>
                </Box>
            </Paper>
        </Container>
    )

}

export default LeftBar;