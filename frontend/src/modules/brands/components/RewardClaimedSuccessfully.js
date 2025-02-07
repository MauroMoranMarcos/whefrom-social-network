import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

import * as selectors from '../selectors';
import * as actions from '../actions';

import search from '../../search';
import users from "../../users";

import {
    Alert,
    Avatar,
    Box, Button,
    Chip, Container, Grid,
    Paper, Skeleton,
    TextField,
    Typography, useTheme
} from "@mui/material";
import {Errors} from "../../common";
import {FormattedMessage} from "react-intl";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";

const RewardClaimedSuccessfully = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userLogged = useSelector(users.selectors.getUser);
    const reward = useSelector(selectors.getReward);
    const brand = useSelector(search.selectors.getUser);
    const [backendErrors, setBackendErrors] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    useEffect(() => {

        if (location.state && userLogged && userLogged.id) {
            dispatch(actions.findRewardById(location.state.rewardId, userLogged.id));
        }

    }, [dispatch]);

    useEffect(() => {

        if (location.state && reward && reward.brandId) {
            dispatch(search.actions.findUserById(reward.brandId));
        }

    }, [reward]);

    const handleSeeMoreRewards = () => {

        navigate('/search/rewards');

    }

    const handleSeeBrand = () => {

        navigate(`/search/userdetails/${brand.id}`);

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
                            justifyContent: "center",
                            borderBottom: '1px solid #9575cd',
                        }}>
                        <Typography variant="h2" sx={{ mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                            <FormattedMessage id="project.brands.RewardClaimedSuccessfully.title"></FormattedMessage>
                        </Typography>
                    </Box>
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
                    <Box sx={{ m: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Skeleton
                            variant="rounded"
                            animation="wave"
                            height={35}
                            width="60%"
                        />
                    </Box>
                </Paper>
            </Box>
        </Container>
    );

    if (!reward || !brand) {
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
                            justifyContent: "center",
                            borderBottom: '1px solid #9575cd',
                        }}>
                        <Typography variant="h2" sx={{ mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                            <FormattedMessage id="project.brands.RewardClaimedSuccessfully.title"></FormattedMessage>
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "start",
                            mt: 0.5,
                            mb: 1,
                            borderBottom: '1px solid #9575cd',
                        }}>
                        <Chip avatar={<Avatar src={`data:image/jpeg;base64,${brand.profilePicture}`}></Avatar>}
                              color="primary" label={brand.userName} variant="outlined"
                              onClick={handleSeeBrand} clickable sx={{ ml: 0.5, mb: 0.5 }}/>
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
                    <Alert
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'start',
                            ml: 1,
                            mr: 1,
                            mb: 1,
                            mt: 1
                        }}
                        variant="outlined" severity="success">
                        <FormattedMessage id="project.brands.RewardClaimedSuccessfully.rewardClaimedSuccessfully" />
                    </Alert>
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 1,
                            mb: 1,
                            ml: 0.5,
                            mr: 0.5,
                        }}>
                        <img
                            src={`data:image/jpeg;base64,${reward.imgFile}`}
                            style={{ maxWidth: '100%', maxHeight: 400 }}>
                        </img>
                    </Box>
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
                        <Button
                            onClick={handleSeeMoreRewards}
                            variant="contained"
                            sx={{ mb: 1 }}   >
                            <Typography>
                                <FormattedMessage id="project.global.buttons.SeeMoreRewards"></FormattedMessage>
                            </Typography>
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )

}

export default RewardClaimedSuccessfully;