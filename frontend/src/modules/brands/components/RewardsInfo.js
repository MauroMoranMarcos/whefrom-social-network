import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import * as selectors from '../selectors';
import * as actions from '../actions';

import users from '../../users';
import {
    Alert,
    Box,
    Chip,
    Container,
    Divider,
    Paper, Skeleton,
    Typography
} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {useEffect, useState} from "react";
import Rewards from "./Rewards";
import useMediaQuery from "@mui/material/useMediaQuery";
const RewardsInfo = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector(users.selectors.isLoggedIn);
    const isBrand = useSelector(users.selectors.isBrand);
    const userLogged = useSelector(users.selectors.getUser);
    const userPoints = useSelector(users.selectors.getUserPoints);
    const rewardsLastUnits = useSelector(selectors.getRewardsLastUnits);
    const [filter, setFilter] = useState('STOCK_ASC_ONLY_IN_STOCK');
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    useEffect(() => {

        if (isLoggedIn) {
            if (userLogged && userLogged.id) {
                dispatch(actions.findRewardsLastUnits({userLoggedId: userLogged.id, filterType: filter, page: 0}));
            }
        } else {
            dispatch(actions.findRewardsLastUnits({userLoggedId: 0, filterType: filter, page: 0}));
        }

    }, [isLoggedIn, userLogged, userPoints, dispatch]);

    const handlePointsClick = () => {

        navigate('/rewards/help');

    }

    return(
        <Container component="main" maxWidth={isMobile ? false : "xs"} disableGutters={true}
                   sx={{
                       display: "flex",
                       flexDirection: "column",
                       justifyContent: "center",
                       pl: isMobile ? undefined : 1,
                       minWidth: "300px",
                   }}>
            <Paper elevation={isMobile ? 10 : 4}>
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
                    <div className="rewards-icon-container" style={{ marginTop: "15px", marginBottom: (!isLoggedIn || isBrand) ? "10px" : undefined }}>
                        <svg className="svg-icon" height={70} preserveAspectRatio="xMidYMid meet" viewBox="0 0 100 100"
                             width={70} x={0} xmlns="http://www.w3.org/2000/svg" y={0} onClick={handlePointsClick}>
                            <path
                                d="M62.11,53.93c22.582-3.125,22.304-23.471,18.152-29.929-4.166-6.444-10.36-2.153-10.36-2.153v-4.166H30.099v4.166s-6.194-4.291-10.36,2.153c-4.152,6.458-4.43,26.804,18.152,29.929l5.236,7.777v8.249s-.944,4.597-4.833,4.986c-3.903,.389-7.791,4.028-7.791,7.374h38.997c0-3.347-3.889-6.986-7.791-7.374-3.889-.389-4.833-4.986-4.833-4.986v-8.249l5.236-7.777Zm7.388-24.818s2.833-3.097,5.111-1.347c2.292,1.75,2.292,15.86-8.999,18.138l3.889-16.791Zm-44.108-1.347c2.278-1.75,5.111,1.347,5.111,1.347l3.889,16.791c-11.291-2.278-11.291-16.388-8.999-18.138Z">
                            </path>
                        </svg>
                        <div className="container__star">
                            <div className="star-eight"/>
                        </div>
                        <div/>
                    </div>
                    {isLoggedIn && !isBrand &&
                        <Typography variant="h2" sx={{mt: 1, textAlign: "center", fontWeight: 'bold'}}>
                            <FormattedMessage id="project.brands.RewardsInfo.title"></FormattedMessage>
                        </Typography>
                    }
                    {(isLoggedIn && !isBrand && !userPoints) &&
                        <Skeleton
                            sx={{ ml: 1, mr: 1 }}
                            variant="rounded"
                            animation="wave"
                            height={30}
                            width="95%"
                        />
                    }
                    {isLoggedIn && !isBrand && userPoints &&
                        <Chip sx={{ml: 1, mr: 1}}
                              label={isLoggedIn ? new Intl.NumberFormat('en', { notation: 'compact' }).format(userPoints.points) : 0}
                              color="secondary" variant="filled"
                              onClick={handlePointsClick}/>
                    }
                    <Box>
                        <Divider color="#9575cd" />
                    </Box>
                    <Typography variant="h2" sx={{ textAlign: "center", fontWeight: 'bold' }}>
                        <FormattedMessage id="project.brands.RewardsInfo.lastRewardsUnits"></FormattedMessage>
                    </Typography>
                    {!rewardsLastUnits ?
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: 360,
                                mr: 1,
                                mb: 1,
                            }}>
                            {Array.from({ length: 2 }).map((_, index) => (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-around',
                                        width: '97%',
                                        gap: 0.5,
                                    }}>
                                    <Box sx={{
                                        display: "column",
                                        alignItems: "center",
                                        justifyContent: "start",
                                        flexGrow: 1,
                                    }}>
                                        <Skeleton sx={{ ml: 0.5 }} width="100%" height={160} animation="wave" variant="rectangular" />
                                        <Box
                                            sx={{
                                                width: '90%',
                                            }}>
                                            <Skeleton
                                                sx={{ ml: 0.5, mr: 0.5, mb: 0.5 }}
                                                animation="wave"
                                                height={20}
                                                width="65%"
                                            />
                                            <Skeleton
                                                sx={{ ml: 0.5, mr: 0.5, mb: 0.5 }}
                                                animation="wave"
                                                height={10}
                                                width="40%"
                                            />
                                            <Skeleton
                                                sx={{ ml: 0.5, mr: 0.5, mb: 0.5 }}
                                                animation="wave"
                                                height={10}
                                                width="40%"
                                            />
                                            <Skeleton
                                                sx={{ ml: 0.5, mr: 0.5 }}
                                                animation="wave"
                                                height={10}
                                                width="40%"
                                            />
                                        </Box>
                                        <Skeleton
                                            sx={{ ml: 0.5, mr: 1, mb: 0.5 }}
                                            animation="wave"
                                            height={45}
                                            width="98%"
                                        />
                                    </Box>
                                    <Box sx={{
                                        display: "column",
                                        alignItems: "center",
                                        justifyContent: "start",
                                        flexGrow: 1,
                                    }}>
                                        <Skeleton sx={{ ml: 0.5, mr: 0.5 }} width="100%" height={160} animation="wave" variant="rectangular" />
                                        <Box
                                            sx={{
                                                width: '90%',
                                            }}>
                                            <Skeleton
                                                sx={{ ml: 0.5, mr: 0.5, mb: 0.5 }}
                                                animation="wave"
                                                height={20}
                                                width="65%"
                                            />
                                            <Skeleton
                                                sx={{ ml: 0.5, mr: 0.5, mb: 0.5 }}
                                                animation="wave"
                                                height={10}
                                                width="40%"
                                            />
                                            <Skeleton
                                                sx={{ ml: 0.5, mr: 0.5, mb: 0.5 }}
                                                animation="wave"
                                                height={10}
                                                width="40%"
                                            />
                                            <Skeleton
                                                sx={{ ml: 0.5, mr: 0.5 }}
                                                animation="wave"
                                                height={10}
                                                width="40%"
                                            />
                                        </Box>
                                        <Skeleton
                                            sx={{ ml: 0.5, mr: 1, mb: 0.5 }}
                                            animation="wave"
                                            height={45}
                                            width="98%"
                                        />
                                    </Box>
                                </Box>
                            ))
                            }
                        </Box>
                        :
                        <>
                            {rewardsLastUnits.result.items.length === 0 ?
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: { xs: "column", md: "column" },
                                        justifyContent: "center",
                                        gap: 4,
                                    }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mt: 2,
                                            mb: 2,
                                        }}>
                                        <Alert sx={{ ml: 1, mr: 1, mb: 1 }} variant="outlined" severity="warning">
                                            <FormattedMessage id="project.brands.FindRewards.noRewards" />
                                        </Alert>
                                    </Box>
                                </Box>
                                :
                                <Box
                                    sx={{
                                        width: '100%',
                                        maxWidth: 360,
                                        mr: 1,
                                        mb: 1,
                                    }}>
                                    <Rewards rewards={rewardsLastUnits.result.items} rewardsInfo={true}/>
                                </Box>
                            }
                        </>
                    }
                </Box>
            </Paper>
        </Container>
    )

}

export default RewardsInfo;