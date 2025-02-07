import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from "react";
import {FormattedMessage} from 'react-intl';

import users from '../../users';
import admin from "../../admin";

import {
    AppBar, Avatar, Badge,
    Box,
    Button, Checkbox, Chip,
    CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle,
    Drawer, Fab, FormControlLabel, IconButton,
    List,
    ListItem,
    ListItemButton, ListItemText, Menu, MenuItem, Paper,
    Toolbar, Tooltip,
    Typography, useTheme
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import FiberNewOutlinedIcon from '@mui/icons-material/FiberNewOutlined';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined';
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import useMediaQuery from "@mui/material/useMediaQuery";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const Header = (props) => {

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
    const navigate = useNavigate();
    const { window } = props;
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isNotMobile = useMediaQuery(theme.breakpoints.up('sm'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {

        if (isLoggedIn) {
            dispatch(users.actions.getUserNumFollowRequests(user.id));
        }

    }, [isLoggedIn]);

    const handleOpenUploadImageDisabledHelper = () => {

        setOpenUploadImageDisabledHelper(true);

    }

    const handleCloseUploadImageDisabledHelper = () => {

        setOpenUploadImageDisabledHelper(false);

    }

    const handleChangeDontShowRewardHelp = (event) => {

        setCheckedReward(event.target.checked);

    }

    const handleChangeDontShowImageHelp = (event) => {

        setCheckedImage(event.target.checked);

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

    const handleDrawerToggle = () => {

        setMobileOpen((prevState) => !prevState);

    }


    const handleOpenSettingsMenu = event => {

        setAnchorElUser(event.currentTarget);

    }

    const handleCloseSettingsMenu = () => {

        setAnchorElUser(null);

    };

    const checkPublicationTime = () => {

        const publicationDate = new Date(userPoints.publicationTime);

        const now = new Date();

        return now.getTime() < publicationDate.getTime();

    }

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', backgroundColor: '#f0f0f0' }}>
            <Typography variant="h1" sx={{ my: 2, color: '#9575cd', fontWeight: 'bold' }}>
                <FormattedMessage id="project.app.Header.WheFrom" />
            </Typography>
            <List>
                {userName && isAdmin &&
                    <Paper variant="outlined" elevation={8} sx={{ ml: 0.5, mr: 0.5, border: '1px solid #9575cd' }}>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ textAlign: 'center' }} onClick={(e) => handleManageCategories(e)}>
                                <CategoryOutlinedIcon color="primary" />
                                <ListItemText primary={<FormattedMessage id="project.global.buttons.ManageCategories" />}
                                              sx={{ color: '#673ab7', fontWeight: '500' }}></ListItemText>
                            </ListItemButton>
                        </ListItem>
                    </Paper>
                }
                {userName && isAdmin &&
                    <Paper variant="outlined" elevation={8} sx={{ mt: 0.5, ml: 0.5, mr: 0.5, border: '1px solid #9575cd' }}>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ textAlign: 'center' }} onClick={(e) => handleSeeReports(e)}>
                                <ReportGmailerrorredOutlinedIcon color="primary" />
                                <ListItemText primary={<FormattedMessage id="project.global.buttons.SeeReports" />}
                                              sx={{ color: '#673ab7', fontWeight: '500' }}></ListItemText>
                            </ListItemButton>
                        </ListItem>
                    </Paper>
                }
                {userName && isAdmin &&
                    <Paper variant="outlined" elevation={8} sx={{ mt: 0.5, ml: 0.5, mr: 0.5, border: '1px solid #9575cd' }}>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ textAlign: 'center' }} onClick={(e) => handleViewVerificationRequests(e)}>
                                <VerifiedOutlinedIcon color="primary" />
                                <ListItemText primary={<FormattedMessage id="project.global.buttons.SeeVerificationRequests" />}
                                              sx={{ color: '#673ab7', fontWeight: '500' }}></ListItemText>
                            </ListItemButton>
                        </ListItem>
                    </Paper>
                }
                {userName && !isAdmin &&
                    <Paper variant="outlined" elevation={8} sx={{ ml: 0.5, mr: 0.5, border: '1px solid #9575cd' }}>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ textAlign: 'center' }}
                                            disabled={userPoints.publishedToday || checkPublicationTime()}
                                            onClick={(e) => (!userPoints.publishedToday && !checkPublicationTime()) && handleUploadImage(e)}>
                                <ImageOutlinedIcon color="primary" />
                                <ListItemText primary={<FormattedMessage id="project.global.buttons.UploadImage" />}
                                              sx={{ color: '#673ab7', fontWeight: '500' }}></ListItemText>
                                {userPoints.publishedToday ?
                                    <TaskAltOutlinedIcon style={{ color: 'green' }}/>
                                :
                                    (checkPublicationTime() && <HourglassEmptyOutlinedIcon/>)
                                }
                            </ListItemButton>
                            {((userPoints.publishedToday || checkPublicationTime()) || userPoints.publishedToday) && userSettings.showUplImageHelp &&
                                <button
                                    className="faq-button"
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleOpenUploadImageDisabledHelper();
                                    }}
                                    style={{
                                        marginLeft: '8px',
                                        position: 'absolute',
                                        right: '10px',
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
                        </ListItem>
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
                    </Paper>
                }
                {userName && isBrand &&
                    <Paper variant="outlined" elevation={8} sx={{ mt: 0.5, ml: 0.5, mr: 0.5, border: '1px solid #9575cd' }}>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ textAlign: 'center', marginRight: !user.verified ? '10px' : undefined }}
                                            disabled={!user.verified} onClick={(e) => handleUploadReward(e)}
                                            style={{
                                                pointerEvents: user.verified ? 'auto' : 'none',
                                            }}>
                                <PublishOutlinedIcon color="primary" />
                                <ListItemText primary={<FormattedMessage id="project.global.buttons.UploadReward" />}
                                              sx={{ color: '#673ab7', fontWeight: '500' }}></ListItemText>
                            </ListItemButton>
                            {!user.verified && userSettings.showUplRewardHelp &&
                                <button
                                    className="faq-button"
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleOpenUploadRewardDisabledHelper();
                                    }}
                                    style={{
                                        marginLeft: '8px',
                                        position: 'absolute',
                                        right: '10px',
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
                        </ListItem>
                    </Paper>
                }
                {userName && isBrand && user.verified &&
                    <Paper variant="outlined" elevation={8} sx={{ mt: 0.5, ml: 0.5, mr: 0.5, border: '1px solid #9575cd' }}>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ textAlign: 'center' }} onClick={(e) => handleSeeUploadedRewards(e)}>
                                <StarsOutlinedIcon color="primary" />
                                <ListItemText primary={<FormattedMessage id="project.global.buttons.SeeUploadedRewards" />}
                                              sx={{ color: '#673ab7', fontWeight: '500' }}></ListItemText>
                            </ListItemButton>
                        </ListItem>
                    </Paper>
                }
                {!userName &&
                    <Paper variant="outlined" elevation={8} sx={{ ml: 0.5, mr: 0.5, border: '1px solid #9575cd' }}>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ textAlign: 'center' }} onClick={(e) => handleLogin(e)}>
                                <LoginOutlinedIcon color="primary" />
                                <ListItemText primary={<FormattedMessage id="project.global.buttons.Login" />}
                                              sx={{ color: '#673ab7', fontWeight: '500' }}></ListItemText>
                            </ListItemButton>
                        </ListItem>
                    </Paper>
                }
                {!userName &&
                    <Paper variant="outlined" elevation={8} sx={{ mt: 0.5, ml: 0.5, mr: 0.5, border: '1px solid #9575cd' }}>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ textAlign: 'center' }} onClick={(e) => handleSignUp(e)}>
                                <FiberNewOutlinedIcon color="primary" />
                                <ListItemText primary={<FormattedMessage id="project.global.buttons.SignUp" />}
                                              sx={{ color: '#673ab7', fontWeight: '500' }}></ListItemText>
                            </ListItemButton>
                        </ListItem>
                    </Paper>
                }
                {!isAdmin &&
                    <Paper variant="outlined" elevation={8} sx={{ mt: 0.5, ml: 0.5, mr: 0.5, border: '1px solid #9575cd' }}>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ textAlign: 'center' }} onClick={(e) => handleSeeRewardsInfo(e)}>
                                <AutoGraphOutlinedIcon color="primary" />
                                <ListItemText primary={<FormattedMessage id="project.global.buttons.RewardsInfo" />}
                                              sx={{ color: '#673ab7', fontWeight: '500' }}></ListItemText>
                            </ListItemButton>
                        </ListItem>
                    </Paper>
                }
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    const handleSignUp = event => {
        event.preventDefault();

        navigate('/users/signUp');
    }

    const handleLogin = event => {
        event.preventDefault();

        navigate('/users/login');
    }

    const handleLogout = event => {
        event.preventDefault();

        navigate('/users/logout');
    }

    const handleUpdateProfile = event => {
        event.preventDefault();

        navigate('/users/updateProfile/');
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

    const handleUploadImage = event => {
        event.preventDefault();

        navigate('/images/upload');
    }

    const handleSeeRewardsInfo = event => {
        event.preventDefault();

        navigate('/rewards/rewardsinfo');
    }

    const handleUploadReward = event => {
        event.preventDefault();

        navigate('/brands/upload');
    }

    const handleSeeUploadedRewards = event => {
        event.preventDefault();

        navigate('/search/uploadedrewards', { state: {brandId: user.id}} );
    }

    const handleSearch = event => {
        event.preventDefault();

        navigate('/search');
    }

    const handleSeeMyProfile = event => {
        event.preventDefault();

        navigate(`/search/userdetails/${user.id}`);
    }

    const handleSeeFollowRequests = event => {
        event.preventDefault();

        dispatch(users.actions.getUserNumFollowRequests(user.id));
        dispatch(users.actions.findUserFollowRequests(user.id, {page: 0}));
        navigate('/users/followrequests');

    }

    const handleGoHome = event => {
        event.preventDefault();

        navigate('/search/feed');
    }

    const handlePointsClick = () => {

        navigate('/rewards/help');

    }

    const handleFindRewards = event => {
        event.preventDefault();

        navigate('/search/rewards');
    }

    if (isLoggedIn && !user) {
        return null;
    }

    if (isLoggedIn && !isBrand && !isAdmin && (!userSettings || !userPoints)) {
        return null;
    }

    return (

        <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <CssBaseline />
            <AppBar component="nav" color="secondary">
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5 }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, ml: 0.5, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    {isNotMobile &&
                        <button
                            className="button"
                            data-text="Awesome"
                            onClick={e => handleGoHome(e)}>
                            <span className="actual-text">&nbsp;<FormattedMessage
                                id="project.app.Header.WheFrom"/>&nbsp;</span>
                            <span aria-hidden="true" className="hover-text">&nbsp;<FormattedMessage
                                id="project.app.Header.WheFrom"/>&nbsp;</span>
                        </button>
                    }
                    {!userName &&
                        <Box sx={{ display: { sm: 'none' }, flexDirection: 'row', alignItems: 'center' }}>
                            <Fab sx={{ mr: 0.5 }} variant="extended" color="primary" size="small" onClick={e => handleLogin(e)}>
                                <LoginOutlinedIcon />
                            </Fab>
                        </Box>
                    }

                    {!userName &&
                        <Box sx={{ display: {xs: 'none', md: 'block'}, flexDirection: 'row', alignItems: 'center' }}>
                            <Typography variant="h21">
                                <FormattedMessage id="project.app.Header.dontHaveAccount" />
                            </Typography>
                            <Button
                                sx={{ ml: 1 }}
                                variant="contained"
                                onClick={e => handleSignUp(e)}
                                color="primary"
                                startIcon={<FiberNewOutlinedIcon />}
                                style={{ textAlign: 'left', justifyContent: 'flex-start' }}>
                                <Typography textAlign="center">
                                    <FormattedMessage id="project.global.buttons.SignUp"></FormattedMessage>
                                </Typography>
                            </Button>
                            <Typography variant="h21" sx={{ ml: 2 }}>
                                <FormattedMessage id="project.app.Header.ifYouHaveAccount" />
                            </Typography>
                            <Button
                                sx={{ ml: 1 }}
                                variant="contained"
                                onClick={e => handleLogin(e)}
                                color="primary"
                                startIcon={<LoginOutlinedIcon />}
                                style={{ textAlign: 'left', justifyContent: 'flex-start' }}>
                                <Typography textAlign="center">
                                    <FormattedMessage id="project.global.buttons.Login"></FormattedMessage>
                                </Typography>
                            </Button>
                        </Box>
                    }

                    {userName &&
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Box sx={{ display: 'flex', flexGrow: 0, mr: 0.5, ml: 2 }}>
                                <Tooltip title={isDesktop && !isAdmin ? <FormattedMessage id="project.app.Header.profileTooltip" />
                                    : <FormattedMessage id="project.app.Header.settingsTooltip" />}>
                                    <IconButton onClick={isDesktop && !isAdmin ? handleSeeMyProfile : handleOpenSettingsMenu} sx={{ p: 0 }}>
                                        {isDesktop ?
                                            <Avatar src={`data:image/jpeg;base64,${user.profilePicture}`} sx={{ width: 46, height: 46 }}></Avatar>
                                            :
                                            <Badge color="secondary" badgeContent={isLoggedIn ? numFollowRequests != null ? numFollowRequests : 0 : 0}>
                                                <Avatar src={`data:image/jpeg;base64,${user.profilePicture}`}></Avatar>
                                            </Badge>
                                        }
                                    </IconButton>
                                </Tooltip>
                                <ListItemText sx={{ mr: 2, ml: 1.5, display: { xs: 'none', md: 'block' } }}
                                              primary={user.userName}
                                              secondary={isBrand ? user.name : ((user.name && user.surname) ?
                                                  user.name + ' ' + user.surname : user.name ? user.name : user.surname ?
                                                      user.surname : '')}
                                              secondaryTypographyProps={{ sx: { color: '#C5C5C9'} }}></ListItemText>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseSettingsMenu}
                                >
                                    <MenuItem sx={{ display: { sm: 'none' } }}>
                                        <IconButton sx={{ p: 0 }}>
                                            <Avatar src={`data:image/jpeg;base64,${user.profilePicture}`}></Avatar>
                                        </IconButton>
                                        <ListItemText sx={{ ml: 1, display: { sm: 'none' } }}
                                                      primary={user.userName}
                                                      secondary={isBrand ? user.name : (user.name + ' ' + user.surname)}></ListItemText>
                                    </MenuItem>
                                    {isLoggedIn && !isAdmin &&
                                        <MenuItem onClick={handleCloseSettingsMenu}>
                                            <Chip sx={{ width: '100%' }}
                                                  label={
                                                      <span>
                                                          <FormattedMessage id="project.brands.RewardDetails.fields.userPoints" /> {isLoggedIn ? userPoints.points : 0}
                                                      </span>}
                                                  color="secondary" variant="filled" onClick={handlePointsClick} />
                                        </MenuItem>
                                    }
                                    {isLoggedIn && !isAdmin &&
                                        <MenuItem onClick={handleCloseSettingsMenu}>
                                            <Button
                                                variant="contained"
                                                onClick={e => handleSeeMyProfile(e)}
                                                color="primary"
                                                fullWidth
                                                startIcon={<AccountBoxOutlinedIcon />}
                                                style={{ textAlign: 'left', justifyContent: 'flex-start' }}>
                                                <Typography textAlign="center">
                                                    <FormattedMessage id="project.global.buttons.MyProfile"></FormattedMessage>
                                                </Typography>
                                            </Button>
                                        </MenuItem>
                                    }
                                    {!isAdmin && !userSettings.privacyPublic &&
                                        <MenuItem onClick={handleCloseSettingsMenu}>
                                            <Button
                                                variant="contained"
                                                onClick={e => handleSeeFollowRequests(e)}
                                                color="primary"
                                                fullWidth
                                                startIcon={
                                                    <Badge
                                                        color="secondary"
                                                        badgeContent={isLoggedIn ? numFollowRequests != null ? numFollowRequests : 0 : 0}
                                                        anchorOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'left',
                                                        }}
                                                    >
                                                        <ChecklistOutlinedIcon />
                                                    </Badge>
                                                }
                                                style={{ textAlign: 'left', justifyContent: 'flex-start', width: '100%' }}>
                                                <Typography textAlign="center">
                                                    <FormattedMessage id="project.global.buttons.SeeFollowRequests"></FormattedMessage>
                                                </Typography>
                                            </Button>
                                        </MenuItem>
                                    }
                                    {isLoggedIn && !isAdmin &&
                                        <MenuItem startIcon={<LogoutOutlinedIcon />} onClick={handleCloseSettingsMenu}>
                                            <Button
                                                variant="contained"
                                                onClick={e => handleUpdateProfile(e)}
                                                color="primary"
                                                fullWidth
                                                startIcon={<SettingsOutlinedIcon />}
                                                style={{ textAlign: 'left', justifyContent: 'flex-start' }}>
                                                <Typography textAlign="center">
                                                    <FormattedMessage id="project.global.buttons.Settings"></FormattedMessage>
                                                </Typography>
                                            </Button>
                                        </MenuItem>
                                    }
                                    <MenuItem onClick={handleCloseSettingsMenu}>
                                        <Button
                                            variant="contained"
                                            onClick={e => handleLogout(e)}
                                            color="primary"
                                            fullWidth
                                            startIcon={<LogoutOutlinedIcon />}
                                            style={{ textAlign: 'left', justifyContent: 'flex-start' }}>
                                            <Typography textAlign="center">
                                                <FormattedMessage id="project.global.buttons.Logout"></FormattedMessage>
                                            </Typography>
                                        </Button>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Box>
                    }
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, overflow: 'visible' },
                    }}
                    >
                    {drawer}
                </Drawer>
            </nav>
        </Box>

    )

};

export default Header;
