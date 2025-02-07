import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {useLocation, useNavigate, useParams} from 'react-router-dom';

import * as selectors from '../selectors';
import * as actions from '../actions';

import search from '../../search';
import users from '../../users';

import {
    Alert,
    Avatar,
    Box, Button,
    Chip, CircularProgress,
    Container,
    Dialog, DialogActions, DialogContent,
    DialogTitle, Grid,
    Paper, Skeleton, SpeedDial, SpeedDialAction, Tooltip,
    Typography,
    useTheme,
} from "@mui/material";

import useMediaQuery from '@mui/material/useMediaQuery';

import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import {BackButton, Errors} from "../../common";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";

const RewardDetails = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const isLoggedIn = useSelector(users.selectors.isLoggedIn);
    const userLogged = useSelector(users.selectors.getUser);
    const isBrand = useSelector(users.selectors.isBrand);
    const isAdmin = useSelector(users.selectors.isAdmin);
    const userPoints = useSelector(users.selectors.getUserPoints);
    const reward = useSelector(selectors.getReward);
    const brand = useSelector(search.selectors.getUser);
    const isRewardClaimedByUser = useSelector(selectors.isRewardClaimedByUser);
    const [numPublicationsWithBrand, setNumPublicationsWithBrand] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [openClaimRewardDialog, setOpenClaimRewardDialog] = useState(false);
    const [openDeleteRewardDialog, setOpenDeleteRewardDialog] = useState(false);
    const [openHideRewardDialog, setOpenHideRewardDialog] = useState(false);
    const [openShowRewardDialog, setOpenShowRewardDialog] = useState(false);
    const [filter, setFilter] = useState('STOCK_ASC_ONLY_IN_STOCK');
    const [showProgress, setShowProgress] = useState(false);
    const [locale, setLocale] = useState(navigator.language || navigator.languages[0]);
    const [backendErrors, setBackendErrors] = useState(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const {id} = useParams();

    useEffect(() => {

        const rewardId = Number(id);

        if (!Number.isNaN(rewardId)) {

            if (isLoggedIn) {
                dispatch(actions.findRewardById(rewardId, userLogged.id));
                dispatch(actions.isRewardClaimedByUser(rewardId));
            } else {
                dispatch(actions.findRewardById(rewardId, 0));
            }

        }

        return () => {
            dispatch(actions.clearReward());
            dispatch(actions.clearIsRewardClaimedByUser());
        }

    }, [id, dispatch]);

    useEffect(() => {

        if (reward && reward.brandId && !imageLoaded) {
            dispatch(search.actions.findUserById(reward.brandId));

            dispatch(actions.getNumPublicationsWithBrand(reward.brandId,
                numPublicationsWithBrand => setNumPublicationsWithBrand(numPublicationsWithBrand)));

            setImageLoaded(true);
        }

    }, [reward, imageLoaded, dispatch]);

    useEffect(() => {

        setShowProgress(false);

    }, [backendErrors]);

    const handleImageLoad = (event) => {

        const img = event.target;
        setImageSize({ width: img.width, height: img.height });

    };

    const handleOpenDeleteRewardDialog = () => {

        setOpenDeleteRewardDialog(true);

    }

    const handleCloseDeleteRewardDialog = () => {

        setOpenDeleteRewardDialog(false);

    }

    const handleDeleteReward = () => {

        dispatch(actions.deleteReward(reward.id,
            () => {
                navigate('/');
            },
            errors => setBackendErrors(errors)));

    }

    const handleOpenHideRewardDialog = () => {

        setOpenHideRewardDialog(true);

    }

    const handleCloseHideRewardDialog = () => {

        setOpenHideRewardDialog(false);

    }

    const handleHideReward = () => {

        dispatch(actions.hideReward(reward.id,
            () => {
                dispatch(actions.findRewardById(reward.id, userLogged.id));
                handleCloseHideRewardDialog();
            },
            errors => setBackendErrors(errors)));

    }

    const handleOpenShowRewardDialog = () => {

        setOpenShowRewardDialog(true);

    }

    const handleCloseShowRewardDialog = () => {

        setOpenShowRewardDialog(false);

    }

    const handleShowReward = () => {

        dispatch(actions.showReward(reward.id,
            () => {
                dispatch(actions.findRewardById(reward.id, userLogged.id));
                handleCloseShowRewardDialog();
            },
            errors => setBackendErrors(errors)));

    }

    const handleOpenClaimRewardDialog = () => {

        setOpenClaimRewardDialog(true);

    }

    const handleCloseClaimRewardDialog = () => {

        setOpenClaimRewardDialog(false);

    }

    const handleClaimReward = () => {

        if (!showProgress) {
            setShowProgress(true);
        }

        dispatch(actions.claimReward(reward.id,
            () => {
                dispatch(actions.findRewardById(reward.id, userLogged.id));
                dispatch(actions.isRewardClaimedByUser(reward.id));
                dispatch(actions.findRewardsLastUnits({userLoggedId: userLogged.id, filterType: filter, page: 0}));
                dispatch(users.actions.tryLoginFromServiceToken());
                setShowProgress(false);
                navigate(`/search/rewarddetails/${reward.id}/rewardclaimed`);
            },
            errors => {
                setBackendErrors(errors);
            }));

        setOpenClaimRewardDialog(false);

    }

    const handleClaimRewardNotLogged = () => {

        localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);

        navigate('/users/login');

    }

    const handleSeeUsersThatClaimedReward = () => {

        dispatch(actions.findUsersThatClaimedReward({rewardId: reward.id, page: 0},
            () => navigate(`/brands/seeusersthatclaimedreward`),
            errors => setBackendErrors(errors)));

    }

    const handleSeeBrand = () => {

        navigate(`/search/userdetails/${brand.id}`);

    }

    const isToday = (date) => {

        const dateFormatted = new Date(date);
        const today = new Date();

        return dateFormatted.getDate() === today.getDate() &&
            dateFormatted.getMonth() === today.getMonth() &&
            dateFormatted.getFullYear() === today.getFullYear();

    }

    function daysUntil(date) {

        const today = new Date();

        const endDate= new Date(date);

        const millisDifference = endDate - today;

        const daysLeft = Math.ceil(millisDifference / (1000 * 60 * 60 * 24));

        return daysLeft;

    }

    const feedback = () => (
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
                <Paper elevation={10}
                       sx={{
                           minHeight: isMobile ? '80vh' : '75vh',
                           display: 'flex',
                           flexDirection: 'column',
                       }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "start",
                            mt: 0.5,
                            mb: 1,
                            borderBottom: '1px solid #9575cd',
                        }}>
                        <Skeleton
                            sx={{ ml: 0.5, mb: 0.5 }}
                            variant="rounded"
                            animation="wave"
                            height={30}
                            width="25%"
                        />
                        <Skeleton
                            sx={{ mr: 0.5, ml: 0.5, mb: 0.5 }}
                            variant="text"
                            animation="wave"
                            height={20}
                            width="40%"
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "start",
                            mt: 0.5,
                            mb: 1,
                            ml: 0.5,
                            mr: 0.5,
                            borderTop: `1px solid ${theme.palette.primary.main}`,
                            borderBottom: `1px solid ${theme.palette.primary.main}`,
                            borderLeft: `1px solid ${theme.palette.primary.main}`,
                            borderRight: `1px solid ${theme.palette.primary.main}`,
                            borderRadius: '4px'
                        }}>
                        <Skeleton
                            sx={{ ml: 0.5, mr: 0.5 }}
                            variant="text"
                            animation="wave"
                            height={50}
                            width="100%"
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: isMobile ? { xs: "column", md: "column" } : undefined,
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 0.5,
                            ml: 0.5,
                            mr: 0.5,
                        }}>
                        <Skeleton
                            sx={{ ml: 0.5, mb: 0.5, mr: isMobile ? 0.5 : undefined }}
                            variant="rounded"
                            animation="wave"
                            height={45}
                            width={isMobile ? "100%" : "30%"}
                        />
                        <Skeleton
                            sx={{ ml: 0.5, mb: 0.5, mr: isMobile ? 0.5 : undefined }}
                            variant="rounded"
                            animation="wave"
                            height={45}
                            width={isMobile ? "100%" : "40%"}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: isMobile ? { xs: "column", md: "column" } : undefined,
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 1,
                            ml: 0.5,
                            mr: 0.5,
                        }}>
                        <Skeleton
                            sx={{ ml: 0.5, mb: 0.5, mr: isMobile ? 0.5 : undefined }}
                            variant="rounded"
                            animation="wave"
                            height={45}
                            width={isMobile ? "100%" : "40%"}
                        />
                        <Skeleton
                            sx={{ ml: 0.5, mb: 0.5, mr: isMobile ? 0.5 : undefined }}
                            variant="rounded"
                            animation="wave"
                            height={45}
                            width={isMobile ? "100%" : "30%"}
                        />
                    </Box>
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 0.5,
                            mb: 0.5,
                            ml: 0.5,
                            mr: 0.5,
                        }}>
                        <Skeleton
                            style={{ maxWidth: '100%', maxHeight: 400 }}
                            variant="rectangular"
                            animation="wave"
                            height={400}
                            width="100%"
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ml: 0.5,
                            mr: 0.5,
                            mt: 0.5,
                            mb: 0.5,
                            borderTop: `1px solid ${theme.palette.primary.main}`,
                            borderBottom: `1px solid ${theme.palette.primary.main}`,
                            borderLeft: `1px solid ${theme.palette.primary.main}`,
                            borderRight: `1px solid ${theme.palette.primary.main}`,
                            borderRadius: '4px'
                        }}>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <Box>
                                    <Skeleton
                                        sx={{ ml: 0.5, mr: 0.5 }}
                                        variant="text"
                                        animation="wave"
                                        height={45}
                                        width="35%"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box>
                                    <Skeleton
                                        sx={{ ml: 0.5, mr: 0.5 }}
                                        variant="text"
                                        animation="wave"
                                        height={45}
                                        width="45%"
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ m: 0.5, position: 'relative' }}>
                        <Skeleton
                            variant="rounded"
                            animation="wave"
                            height={40}
                            width="100%"
                        />
                    </Box>
                </Paper>
            </Box>
        </Container>
    );

    if (!reward) {
        return feedback();
    }

    if (!brand) {
        return feedback();
    }

    if (isLoggedIn && !isBrand && !isAdmin && numPublicationsWithBrand === undefined) {
        return feedback();
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
                            justifyContent: "start",
                            mt: 0.5,
                            mb: 1,
                            borderBottom: '1px solid #9575cd',
                        }}>
                        <BackButton />
                        <Chip avatar={<Avatar src={`data:image/jpeg;base64,${brand.profilePicture}`}></Avatar>}
                              color="primary" label={brand.userName} variant="outlined" component="a"
                              onClick={handleSeeBrand} clickable sx={{ ml: 0.5, mb: 0.5 }}
                              deleteIcon={brand.verified &&
                                  <Tooltip title={<FormattedMessage id="project.search.UserDetails.verifiedBrand.explanatoryText" />}>
                                      <VerifiedOutlinedIcon />
                                  </Tooltip>} onDelete={brand.verified ? handleSeeBrand : undefined}/>
                        <Typography
                            variant="h21"
                            sx={{
                                textAlign: 'start',
                                mr: 0.5,
                                ml: 0.5,
                                mb: 0.5,
                                fontWeight: 'bold'
                            }}>
                            {reward.name}
                        </Typography>
                    </Box>
                    {reward.description &&
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "start",
                                mt: 0.5,
                                mb: 1,
                                ml: 0.5,
                                mr: 0.5,
                                borderTop: `1px solid ${theme.palette.primary.main}`,
                                borderBottom: `1px solid ${theme.palette.primary.main}`,
                                borderLeft: `1px solid ${theme.palette.primary.main}`,
                                borderRight: `1px solid ${theme.palette.primary.main}`,
                                borderRadius: '4px'
                            }}>
                            <Typography
                                variant="h3"
                                sx={{
                                    m: 0.2,
                                    textAlign: 'start',
                                }}>
                                {reward.description}
                            </Typography>
                        </Box>
                    }
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: isMobile ? { xs: "column", md: "column" } : undefined,
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 0.5,
                            ml: 0.5,
                            mr: 0.5,
                            gap: isMobile ? 0.5 : undefined,
                        }}>
                        {reward.pointsCost &&
                            <Paper
                                elevation={2}
                                sx={{
                                    flex: 1,
                                    padding: '8px',
                                    backgroundColor: theme.palette.primary.main,
                                    ml: 0.5,
                                    mr: 0.5,
                                    mb: reward.stock === 0 ? undefined : 0.5,
                                    width: isMobile ? '100%' : undefined,
                                    maxWidth: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                }}>
                                <Typography sx={{ color: '#FFF' }}>
                                    <FormattedMessage id="project.search.RewardDetails.fields.pointsCost" />
                                    {reward.pointsCost}
                                </Typography>
                            </Paper>
                        }
                        {reward.stock === 0 ?
                            <Paper
                                elevation={0}
                                sx={{
                                    flex: 1,
                                    padding: '8px',
                                    ml: 0.5,
                                    mr: 0.5,
                                    mb: reward.stock === 0 ? undefined : 0.5,
                                    width: isMobile ? '100%' : undefined,
                                    maxWidth: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                }}>
                                <Alert sx={{ flex: 1, width: isMobile ? '100%' : 'auto', fontSize: '0.875rem' }}
                                       variant="outlined" severity="warning">
                                    <FormattedMessage id="project.brands.RewardDetails.outOfStock" />
                                </Alert>
                            </Paper>
                            :
                            <Paper
                                elevation={2}
                                sx={{
                                    flex: 1,
                                    padding: '8px',
                                    backgroundColor: theme.palette.primary.main,
                                    ml: 0.5,
                                    mr: 0.5,
                                    mb: reward.stock === 0 ? undefined : 0.5,
                                    width: isMobile ? '100%' : undefined,
                                    maxWidth: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                }}>
                                <Typography sx={{ color: '#FFF' }}>
                                    <FormattedMessage id="project.search.RewardDetails.fields.stock" />
                                    {reward.stock}
                                </Typography>
                            </Paper>
                        }
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: isMobile ? { xs: "column", md: "column" } : undefined,
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 1,
                            ml: 0.5,
                            mr: 0.5,
                            gap: isMobile ? 0.5 : undefined,
                        }}>
                        <Paper
                            elevation={2}
                            sx={{
                                flex: 1,
                                padding: '8px',
                                backgroundColor: theme.palette.primary.main,
                                ml: 0.5,
                                mr: 0.5,
                                mb: reward.stock === 0 ? undefined : 0.5,
                                width: isMobile ? '100%' : undefined,
                                maxWidth: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                            }}>
                            <Typography sx={{ color: '#FFF' }}>
                                <FormattedMessage id="project.search.RewardDetails.fields.publicationsNeeded" />
                                {reward.publicationsNeeded}
                            </Typography>
                        </Paper>
                        <Paper
                            elevation={2}
                            sx={{
                                flex: 1,
                                padding: '8px',
                                backgroundColor: isToday(reward.endDate) ? "#FF7700" : hasExpired(reward.endDate) ? "#FF3700" : theme.palette.primary.main,
                                ml: 0.5,
                                mr: 0.5,
                                mb: reward.stock === 0 ? undefined : 0.5,
                                width: isMobile ? '100%' : undefined,
                                color: "#fff",
                                maxWidth: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                            }}>
                            <Typography sx={{ color: '#FFF' }}>
                                {hasExpired(reward.endDate) ?
                                    <span>
                                        <FormattedMessage id="project.search.RewardDetails.fields.endDateExpired"/>
                                        {new Date(reward.endDate).toLocaleString(locale, {
                                            timeZone: 'UTC',
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric'
                                        })}
                                    </span>
                                    :
                                    <span>
                                        {daysUntil(reward.endDate)}
                                        <FormattedMessage id="project.search.RewardDetails.fields.daysLeft"/>
                                    </span>
                                }
                            </Typography>
                        </Paper>
                    </Box>
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 'auto',
                            mb: 0.5,
                            ml: 0.5,
                            mr: 0.5,
                        }}>
                        <img
                            src={`data:image/jpeg;base64,${reward.imgFile}`}
                            style={{ maxWidth: '100%', maxHeight: 400 }}
                            onLoad={(e) => handleImageLoad(e)}>
                        </img>
                        {isLoggedIn && userLogged.id === reward.brandId &&
                            <SpeedDial
                                ariaLabel="SpeedDial openIcon example"
                                sx={{
                                    position: 'absolute',
                                    mr: 0.3,
                                    mt: 0.3,
                                    top: 0,
                                    right: 0,
                                    zIndex: 1,
                                    padding: '0',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    minWidth: '40px',
                                    minHeight: '40px',
                                    '& .MuiFab-primary': {
                                        width: '40px',
                                        height: '40px',
                                        minHeight: '40px',
                                    }
                                }}
                                icon={<MoreVertOutlinedIcon />}
                                direction="down">
                                {reward.hidden ?
                                    <SpeedDialAction
                                        icon={<VisibilityOutlinedIcon color="primary" />}
                                        tooltipTitle={<FormattedMessage id="project.search.RewardDetails.showReward.toolTip" />}
                                        onClick={handleOpenShowRewardDialog}/>
                                    :
                                    <SpeedDialAction
                                        icon={<VisibilityOffOutlinedIcon color="primary" />}
                                        tooltipTitle={<FormattedMessage id="project.search.RewardDetails.hideReward.toolTip" />}
                                        onClick={handleOpenHideRewardDialog}/>}
                                <SpeedDialAction
                                    icon={<DeleteOutlineOutlinedIcon color="alertRed" />}
                                    tooltipTitle={<FormattedMessage id="project.search.RewardDetails.deleteReward.toolTip" />}
                                    onClick={handleOpenDeleteRewardDialog}/>
                            </SpeedDial>
                        }
                    </Box>
                    {isLoggedIn && userLogged.id === reward.brandId && reward.hidden &&
                        <Alert
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'start',
                                ml: 1,
                                mr: 1,
                                mb: 1,
                                marginTop: 'auto',
                            }}
                            variant="outlined" severity="info">
                            <FormattedMessage id="project.search.RewardDetails.rewardHidden" />
                        </Alert>
                    }
                    {isLoggedIn && !isBrand && !isAdmin &&
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 'auto',
                                ml: 0.5,
                                mr: 0.5,
                                mb: 0.5,
                                borderTop: `1px solid ${theme.palette.primary.main}`,
                                borderBottom: `1px solid ${theme.palette.primary.main}`,
                                borderLeft: `1px solid ${theme.palette.primary.main}`,
                                borderRight: `1px solid ${theme.palette.primary.main}`,
                                borderRadius: '4px'
                            }}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Box>
                                        <Typography
                                            variant="h21"
                                            sx={{
                                                textAlign: 'start',
                                                mr: 0.5,
                                                ml: 0.5,
                                            }}>
                                            <FormattedMessage id="project.brands.RewardDetails.fields.userPoints"></FormattedMessage>
                                        </Typography>
                                        <Typography
                                            variant="h21"
                                            sx={{
                                                textAlign: 'start',
                                                mr: 0.5,
                                                ml: 0.5,
                                            }}>
                                            {userPoints.points}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box>
                                        <Typography
                                            variant="h21"
                                            sx={{
                                                textAlign: 'start',
                                                mr: 0.5,
                                                ml: 0.5,
                                            }}>
                                            <FormattedMessage id="project.brands.RewardDetails.fields.numPublicationsWithBrand"></FormattedMessage>
                                        </Typography>
                                        <Typography
                                            variant="h21"
                                            sx={{
                                                textAlign: 'start',
                                                mr: 0.5,
                                                ml: 0.5,
                                            }}>
                                            {numPublicationsWithBrand}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Dialog
                                fullScreen={fullScreen}
                                open={openClaimRewardDialog}
                                onClose={handleCloseClaimRewardDialog}
                                aria-labelledby="responsive-dialog-title"
                            >
                                <DialogTitle id="responsive-dialog-title">
                                    <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                        <FormattedMessage id="project.brands.RewardDetails.claimReward.title" />
                                    </Typography>
                                </DialogTitle>
                                <DialogContent>
                                    <Typography>
                                        <FormattedMessage id="project.brands.Reward.SharingEmailText"></FormattedMessage>
                                    </Typography>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        variant="contained"
                                        sx={{ mt: 1, mb: 1 }}
                                        onClick={handleClaimReward}>
                                        <Typography>
                                            {!isMobile ?
                                                <FormattedMessage id="project.global.buttons.ClaimReward"></FormattedMessage>
                                                :
                                                <FormattedMessage id="project.global.buttons.Claim"></FormattedMessage>
                                            }
                                        </Typography>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="alertRed"
                                        onClick={handleCloseClaimRewardDialog}
                                        sx={{ mt: 1, mb: 1 }}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Box>
                    }
                    {!isAdmin && !isBrand && ((!isRewardClaimedByUser && isLoggedIn && userLogged.id !== reward.brandId) || !isLoggedIn) &&
                        <Box sx={{ m: 0.5, marginTop: 'auto', position: 'relative' }}>
                            <Button
                                onClick={isLoggedIn ? handleOpenClaimRewardDialog : handleClaimRewardNotLogged}
                                variant="contained"
                                disabled={isLoggedIn && (userPoints.points < reward.pointsCost
                                    || numPublicationsWithBrand < reward.publicationsNeeded
                                    || reward.stock === 0
                                    || hasExpired(reward.endDate)
                                    || showProgress)}
                                sx={{ mr: 1, width: '100%' }}   >
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.ClaimReward"></FormattedMessage>
                                </Typography>
                            </Button>
                            {showProgress &&
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        color: '#9575cd',
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        marginTop: '-12px',
                                        marginLeft: '-12px',
                                    }}
                                />
                            }
                        </Box>
                    }
                    {isRewardClaimedByUser &&
                        <Box sx={{ m: 0.5, marginTop: 'auto', position: 'relative' }}>
                            <Button
                                disabled
                                variant="contained"
                                sx={{ width: '100%' }}   >
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.RewardClaimed"></FormattedMessage>
                                </Typography>
                            </Button>
                        </Box>
                    }
                    {isLoggedIn && userLogged.id === reward.brandId &&
                        <Box sx={{ m: 0.5, marginTop: 'auto', position: 'relative' }}>
                            <Button
                                onClick={handleSeeUsersThatClaimedReward}
                                variant="contained"
                                sx={{ width: '100%' }}   >
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.SeeUsersThatClaimedReward"></FormattedMessage>
                                </Typography>
                            </Button>
                        </Box>
                    }
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 1,
                            mb: 1,
                            ml: 1,
                            mr: 1,
                        }}>
                        <Dialog
                            fullScreen={fullScreen}
                            open={openDeleteRewardDialog}
                            onClose={handleCloseDeleteRewardDialog}
                            aria-labelledby="responsive-dialog-title"
                        >
                            <DialogTitle id="responsive-dialog-title">
                                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                    <FormattedMessage id="project.search.RewardDetails.deleteReward.title" />
                                </Typography>
                            </DialogTitle>
                            <DialogContent>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    variant="contained"
                                    sx={{ mt: 1, mb: 1 }}
                                    onClick={handleDeleteReward}>
                                    <Typography>
                                        {!isMobile ?
                                            <FormattedMessage id="project.global.buttons.DeleteReward"></FormattedMessage>
                                            :
                                            <FormattedMessage id="project.global.buttons.Delete"></FormattedMessage>
                                        }
                                    </Typography>
                                </Button>
                                <Button
                                    variant="contained"
                                    color="alertRed"
                                    onClick={handleCloseDeleteRewardDialog}
                                    sx={{ mt: 1, mb: 1 }}>
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                    </Typography>
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog
                            fullScreen={fullScreen}
                            open={openHideRewardDialog}
                            onClose={handleCloseHideRewardDialog}
                            aria-labelledby="responsive-dialog-title"
                        >
                            <DialogTitle id="responsive-dialog-title">
                                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                    <FormattedMessage id="project.search.RewardDetails.hideReward.title" />
                                </Typography>
                            </DialogTitle>
                            <DialogContent>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    variant="contained"
                                    sx={{ mt: 1, mb: 1 }}
                                    onClick={handleHideReward}>
                                    <Typography>
                                        {!isMobile ?
                                            <FormattedMessage id="project.global.buttons.HideReward"></FormattedMessage>
                                            :
                                            <FormattedMessage id="project.global.buttons.Hide"></FormattedMessage>
                                        }
                                    </Typography>
                                </Button>
                                <Button
                                    variant="contained"
                                    color="alertRed"
                                    onClick={handleCloseHideRewardDialog}
                                    sx={{ mt: 1, mb: 1 }}>
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                    </Typography>
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog
                            fullScreen={fullScreen}
                            open={openShowRewardDialog}
                            onClose={handleCloseShowRewardDialog}
                            aria-labelledby="responsive-dialog-title"
                        >
                            <DialogTitle id="responsive-dialog-title">
                                <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                    <FormattedMessage id="project.search.RewardDetails.showReward.title" />
                                </Typography>
                            </DialogTitle>
                            <DialogActions>
                                <Button
                                    variant="contained"
                                    sx={{ mt: 1, mb: 1 }}
                                    onClick={handleShowReward}>
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.ShowReward"></FormattedMessage>
                                    </Typography>
                                </Button>
                                <Button
                                    variant="contained"
                                    color="alertRed"
                                    onClick={handleCloseShowRewardDialog}
                                    sx={{ mt: 1, mb: 1 }}>
                                    <Typography>
                                        <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                    </Typography>
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )
}

export const hasExpired = (date) => {

    const dateFormatted = new Date(date);
    dateFormatted.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return dateFormatted < today;

}

export const isToday = (date) => {

    const dateFormatted = new Date(date);
    const today = new Date();

    return dateFormatted.getDate() === today.getDate() &&
        dateFormatted.getMonth() === today.getMonth() &&
        dateFormatted.getFullYear() === today.getFullYear();

}

export default RewardDetails;