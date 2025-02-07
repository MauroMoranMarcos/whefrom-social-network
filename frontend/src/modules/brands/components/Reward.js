import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import * as actions from '../actions';

import users from "../../users";
import search from "../../search";

import {hasExpired, isToday} from "./RewardDetails";

import {
    Avatar,
    Box,
    Button, Chip, CircularProgress,
    Dialog,
    DialogActions, DialogContent,
    DialogTitle,
    ImageListItem,
    Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {styled} from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import useMediaQuery from "@mui/material/useMediaQuery";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";

const Reward = ({ reward, rewardsInfo }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(users.selectors.isLoggedIn);
    const userLogged = useSelector(users.selectors.getUser);
    const userPoints = useSelector(users.selectors.getUserPoints);
    const [brand, setBrand] = useState(null);
    const [isRewardClaimedByUser, setIsRewardClaimedByUser] = useState(null);
    const [numPublicationsWithBrand, setNumPublicationsWithBrand] = useState(null);
    const [openClaimRewardDialog, setOpenClaimRewardDialog] = useState(false);
    const [filter, setFilter] = useState('STOCK_ASC_ONLY_IN_STOCK');
    const [showProgress, setShowProgress] = useState(false);
    const [backendErrors, setBackendErrors] = useState(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {

        if (isLoggedIn) {
            if (reward && reward.id && !rewardsInfo) {
                dispatch(actions.isRewardClaimedByUser(reward.id,
                    isRewardClaimedByUser => setIsRewardClaimedByUser(isRewardClaimedByUser)));
                dispatch(actions.getNumPublicationsWithBrand(reward.brandId,
                    numPublicationsWithBrand => setNumPublicationsWithBrand(numPublicationsWithBrand)));
            }
        } else {
            dispatch(actions.isRewardClaimedByUser(reward.id,
                isRewardClaimedByUser => setIsRewardClaimedByUser(isRewardClaimedByUser)));
        }

    }, [dispatch, reward.id]);

    useEffect(() => {

        if (reward && reward.brandId) {
            dispatch(search.actions.findUserByIdAux(reward.brandId,
                user => setBrand(user)));
        }

    }, [reward, dispatch]);

    useEffect(() => {

        setShowProgress(false);

    }, [backendErrors]);

    const handleRewardClick = (rewardId) => {

        navigate(`/search/rewarddetails/${rewardId}`);

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

    const handleSeeBrand = () => {

        navigate(`/search/userdetails/${brand.id}`);

    }

    if ((isLoggedIn && !userPoints && !numPublicationsWithBrand) || !brand) {
        return null;
    }

    return(
        <ImageListItem key={reward.id} sx={{ height: '100%', maxWidth: '100%', border: (!rewardsInfo && isRewardClaimedByUser) ? '1px solid #039705' :
                hasExpired(reward.endDate) ? '1px solid #FF3700' : isToday(reward.endDate) ? '1px solid #FF7700' : '1px solid #9575cd',
                borderRadius: '4px', p: 0.2, overflow: 'hidden', }}>
            <ImageButton
                onClick={() => handleRewardClick(reward.id)}
                focusRipple
                style={{
                    width: reward.width,
                    flexGrow: 1,
                }}
            >
                <ImageSrc style={{ backgroundImage: `url(data:image/jpeg;base64,${reward.imgFile})` }} />
            </ImageButton>
            {(!rewardsInfo && isRewardClaimedByUser) ?
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <Typography
                        variant="h2"
                        sx={{
                            mt: 0.2,
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '96%',
                        }}>
                        {reward.name}
                    </Typography>
                    <Tooltip title={<FormattedMessage id="project.brands.Reward.rewardClaimed" />}>
                        <CheckCircleOutlineOutlinedIcon color="greenCheck" />
                    </Tooltip>
                </Box>
                :
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <Typography variant="h2"
                                sx={{
                                    mt: 0.2,
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '96%',
                    }}>
                        {reward.name}
                    </Typography>
                    {(!rewardsInfo && reward.hidden) &&
                        <Tooltip title={<FormattedMessage id="project.brands.Reward.rewardHidden" />}>
                            <VisibilityOffOutlinedIcon color="primary" />
                        </Tooltip>
                    }
                </Box>
            }
            <Typography variant="h3" sx={{ mt: 0.5 }}>
                <FormattedMessage id="project.brands.Rewards.pointsCost" />
                {reward.pointsCost}
            </Typography>
            <Typography variant="h3" sx={{ mt: 0.5 }}>
                <FormattedMessage id="project.brands.Rewards.publicationsNeeded" />
                {reward.publicationsNeeded}
            </Typography>
            <Typography variant="h3" sx={{ mt: 0.5 }}>
                <FormattedMessage id="project.brands.Rewards.stock" />
                {reward.stock}
            </Typography>
            {!rewardsInfo &&
                <Chip avatar={<Avatar src={`data:image/jpeg;base64,${brand.profilePicture}`}></Avatar>}
                      color="primary" label={brand.userName} variant="outlined"
                      deleteIcon={brand.verified &&
                          <Tooltip title={<FormattedMessage id="project.search.UserDetails.verifiedBrand.explanatoryText" />}>
                            <VerifiedOutlinedIcon />
                          </Tooltip>}
                      onClick={handleSeeBrand} onDelete={brand.verified ? handleSeeBrand : undefined} clickable/>
            }
            {rewardsInfo &&
                <Box sx={{ position: "relative" }}>
                    <Button
                        onClick={isLoggedIn ? handleOpenClaimRewardDialog : handleClaimRewardNotLogged}
                        variant="contained"
                        disabled={reward.stock === 0 || (isLoggedIn &&
                                (userPoints.points < reward.pointsCost || numPublicationsWithBrand < reward.publicationsNeeded
                                || hasExpired(reward.endDate) || isRewardClaimedByUser))
                            || showProgress}
                        sx={{ width: '100%' }}   >
                        <Typography>
                            <FormattedMessage id="project.global.buttons.ClaimRewardShort"></FormattedMessage>
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
            <Dialog
                fullScreen={fullScreen}
                open={openClaimRewardDialog}
                onClose={handleCloseClaimRewardDialog}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    <FormattedMessage id="project.brands.RewardDetails.claimReward.title" />
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
                            <FormattedMessage id="project.global.buttons.ClaimReward"></FormattedMessage>
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
        </ImageListItem>
    )

}

const ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: 'relative',
    height: 200,
    [theme.breakpoints.down('sm')]: {
        width: '100% !important', // Overrides inline-style
        height: 100,
    },
    '&:hover, &.Mui-focusVisible': {
        zIndex: 1,
        '& .MuiImageBackdrop-root': {
            opacity: 0.15,
        },
        '& .MuiImageMarked-root': {
            opacity: 0,
        },
        '& .MuiTypography-root': {
            border: '4px solid currentColor',
        },
    },
}));

const ImageSrc = styled('span')({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
});

export default Reward;