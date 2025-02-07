import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

import * as selectors from "../selectors";
import * as actions from "../actions";

import users from '../../users';
import search from "../../search";

import {
    Alert, Avatar,
    Box, Button, ButtonGroup, Checkbox, Chip,
    Container, FormControlLabel, Grid, MenuItem,
    Paper, Select, Skeleton,
    Typography
} from "@mui/material";
import {FormattedMessage} from "react-intl";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import Rewards from "./Rewards";
import {CheckBox} from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";

const FindUploadedRewards = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(users.selectors.isLoggedIn);
    const userLogged = useSelector(users.selectors.getUser);
    const rewardSearch = useSelector(selectors.getRewardSearch);
    const brand = useSelector(search.selectors.getUser);
    const [filter, setFilter] = useState('CREATION_DATE_DESC');
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    useEffect(() => {

        if (isLoggedIn) {
            dispatch(actions.findRewards({brandId: location.state.brandId, userLoggedId: userLogged.id, filterType: filter, page: 0}));
            dispatch(search.actions.findUserById(location.state.brandId));
        }

    }, [filter]);

    if (!rewardSearch || !brand) {
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
                        gap: 4,
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
                                mb: 1,
                                borderBottom: '1px solid #9575cd',
                            }}>
                            <Typography variant="h2" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>
                                <FormattedMessage id="project.brands.FindRewards.title"></FormattedMessage>
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: isMobile ? '95%' : '97%',
                                ml: 1,
                                mr: 1,
                                mb: 1,
                            }}>
                            {isMobile ?
                                <>
                                    {Array.from({ length: 12 }).map((_, index) => (
                                        <Box sx={{
                                            display: "column",
                                            alignItems: "center",
                                            justifyContent: "start",
                                        }}>
                                            <Skeleton width="100%" height={160} animation="wave" variant="rectangular" />
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
                                                height={35}
                                                width="98%"
                                            />
                                        </Box>
                                    ))
                                    }
                                </>
                                :
                                <>
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-around',
                                                width: '100%',
                                                gap: 0.5,
                                            }}>
                                            <Box sx={{
                                                display: "column",
                                                alignItems: "center",
                                                justifyContent: "start",
                                                flexGrow: 1,
                                            }}>
                                                <Skeleton width="100%" height={160} animation="wave" variant="rectangular" />
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
                                                    height={35}
                                                    width="98%"
                                                />
                                            </Box>
                                            <Box sx={{
                                                display: "column",
                                                alignItems: "center",
                                                justifyContent: "start",
                                                flexGrow: 1,
                                            }}>
                                                <Skeleton width="100%" height={160} animation="wave" variant="rectangular" />
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
                                                    height={35}
                                                    width="98%"
                                                />
                                            </Box>
                                        </Box>
                                    ))
                                    }
                                </>
                            }
                        </Box>
                    </Paper>
                </Box>
            </Container>
        );
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
                    gap: 4,
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
                            mb: 1,
                            borderBottom: '1px solid #9575cd',
                        }}>
                        <Typography variant="h2" sx={{ mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                            <FormattedMessage id="project.brands.FindRewards.yourUploadedRewards"></FormattedMessage>
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            ml: 1,
                            mr: 1,
                        }}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Select
                                    size="small"
                                    fullWidth
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}>
                                    <MenuItem value={'CREATION_DATE_DESC'}>
                                        <Typography>
                                            <FormattedMessage id="project.brands.FindRewards.fields.recentFirst" />
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem value={'CREATION_DATE_ASC'}>
                                        <Typography>
                                            <FormattedMessage id="project.brands.FindRewards.fields.oldestFirst" />
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem value={'POINTS_COST_DESC'}>
                                        <Typography>
                                            <FormattedMessage id="project.brands.FindRewards.fields.pointsCostDesc" />
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem value={'POINTS_COST_ASC'}>
                                        <Typography>
                                            <FormattedMessage id="project.brands.FindRewards.fields.pointsCostAsc" />
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem value={'STOCK_DESC'}>
                                        <Typography>
                                            <FormattedMessage id="project.brands.FindRewards.fields.stockDesc" />
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem value={'STOCK_ASC'}>
                                        <Typography>
                                            <FormattedMessage id="project.brands.FindRewards.fields.stockAsc" />
                                        </Typography>
                                    </MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                    </Box>
                    {rewardSearch.result.items.length === 0 ?
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
                                    mt: 1,
                                    mb: 1,
                                }}>
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
                                    variant="outlined" severity="warning">
                                    <FormattedMessage id="project.brands.FindUploadedRewards.noRewards" />
                                </Alert>
                            </Box>
                        </Box>
                        :
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: isMobile ? '95%' : '96%',
                                ml: 1,
                                mr: 1,
                                mb: 1,
                            }}>
                            <Rewards rewards={rewardSearch.result.items} rewardsInfo={false}/>
                            {(rewardSearch.result.existMoreItems || rewardSearch.criteria.page > 0) &&
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mt: 1,
                                        mb: 1,
                                    }}>
                                    <ButtonGroup color="primary" size="small" variant="contained" aria-label="Basic button group">
                                        <Button
                                            disabled={rewardSearch.criteria.page < 1}
                                            onClick={() => dispatch(actions.previousFindRewardsResultPage(rewardSearch.criteria))}>
                                            <ArrowCircleLeftIcon />
                                        </Button>
                                        <Button
                                            disabled={!rewardSearch.result.existMoreItems}
                                            onClick={() => dispatch(actions.nextFindRewardsResultPage(rewardSearch.criteria))}>
                                            <ArrowCircleRightIcon />
                                        </Button>
                                    </ButtonGroup>
                                </Box>
                            }
                        </Box>
                    }
                </Paper>
            </Box>
        </Container>
    )

}

export default FindUploadedRewards;