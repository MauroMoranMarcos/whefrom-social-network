import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

import * as selectors from "../selectors";
import * as actions from "../actions";

import users from '../../users';

import {
    Alert,
    Box, Button, ButtonGroup,
    Container, Grid, MenuItem,
    Paper, Select,
    Typography
} from "@mui/material";
import {FormattedMessage} from "react-intl";
import Users from "./Users";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import useMediaQuery from "@mui/material/useMediaQuery";
import {BackButton} from "../../common";
import {userListFeedback} from "./SearchUsersResult";

const ShowFollows = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const showFollowers = location.state.showFollowers;
    const userId = location.state.userId;
    const isLoggedIn = useSelector(users.selectors.isLoggedIn);
    const userLogged = useSelector(users.selectors.getUser);
    const userFollowers = useSelector(selectors.getUserFollowers);
    const userFollowed = useSelector(selectors.getUserFollowed);
    const [recentFirst, setRecentFirst] = useState(true);
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    useEffect(() => {

        if (showFollowers) {
            if (isLoggedIn) {
                dispatch(actions.findUserFollowers(userId, {userLoggedId: userLogged.id, dateDesc: recentFirst, page: 0}));
            } else {
                dispatch(actions.findUserFollowers(userId, {userLoggedId: 0, dateDesc: recentFirst, page: 0}));
            }
        } else {
            if (isLoggedIn) {
                dispatch(actions.findUserFollowed(userId, {userLoggedId: userLogged.id, dateDesc: recentFirst, page: 0}));
            } else {
                dispatch(actions.findUserFollowed(userId, {userLoggedId: 0, dateDesc: recentFirst, page: 0}));
            }
        }

    }, [recentFirst]);

    if (showFollowers) {
        if (!userFollowers) {
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
                                    justifyContent: "flex-start",
                                    mb: 2,
                                    borderBottom: '1px solid #9575cd',
                                }}>
                                <BackButton />
                                <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                    <FormattedMessage id="project.search.ShowFollows.userFollowers.title"></FormattedMessage>
                                </Typography>
                            </Box>
                            {userListFeedback(isMobile)}
                        </Paper>
                    </Box>
                </Container>
            );
        }

        if (userFollowers.result.items.length === 0) {
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
                                    justifyContent: "flex-start",
                                    mb: 2,
                                    borderBottom: '1px solid #9575cd',
                                }}>
                                <BackButton />
                                <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                    <FormattedMessage id="project.search.ShowFollows.userFollowers.title"></FormattedMessage>
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                <Alert sx={{ ml: 2, mr: 2, mb: 2 }} variant="outlined" severity="warning">
                                    <FormattedMessage id="project.search.ShowFollows.noFollowers" />
                                </Alert>
                            </Box>
                        </Paper>
                    </Box>
                </Container>
            );
        }
    } else {
        if (!userFollowed) {
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
                                    justifyContent: "flex-start",
                                    mb: 2,
                                    borderBottom: '1px solid #9575cd',
                                }}>
                                <BackButton />
                                <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                    <FormattedMessage id="project.search.ShowFollows.userFollows.title"></FormattedMessage>
                                </Typography>
                            </Box>
                            {userListFeedback(isMobile)}
                        </Paper>
                    </Box>
                </Container>
            );
        }

        if (userFollowed.result.items.length === 0) {
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
                        <Paper elevation={8}sx={{
                            minHeight: isMobile ? '80vh' : '75vh',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    mb: 2,
                                    borderBottom: '1px solid #9575cd',
                                }}>
                                <BackButton />
                                <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                    <FormattedMessage id="project.search.ShowFollows.userFollowed.title"></FormattedMessage>
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                <Alert sx={{ ml: 2, mr: 2, mb: 2 }} variant="outlined" severity="warning">
                                    <FormattedMessage id="project.search.ShowFollows.noFollowed" />
                                </Alert>
                            </Box>
                        </Paper>
                    </Box>
                </Container>
            );
        }
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
                            justifyContent: "flex-start",
                            mb: 2,
                            borderBottom: '1px solid #9575cd',
                        }}>
                        <BackButton />
                        {showFollowers ?
                            <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                <FormattedMessage id="project.search.ShowFollows.userFollowers.title"></FormattedMessage>
                            </Typography>
                            :
                            <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                <FormattedMessage id="project.search.ShowFollows.userFollowed.title"></FormattedMessage>
                            </Typography>
                        }
                    </Box>
                    <Box
                        sx={{
                            ml: 1,
                            mr: 1,
                        }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Select
                                    sx={{ mb: 1.5 }}
                                    size="small"
                                    fullWidth
                                    value={recentFirst}
                                    onChange={(e) => setRecentFirst(e.target.value)}>
                                    <MenuItem value={true}>
                                        <Typography>
                                            <FormattedMessage id="project.search.ShowFollows.fields.recentFirst" />
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem value={false}>
                                        <Typography>
                                            <FormattedMessage id="project.search.ShowFollows.fields.oldFirst" />
                                        </Typography>
                                    </MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                    </Box>
                    {showFollowers ?
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: '95%',
                                ml: 1,
                                mr: 1,
                                mb: 1,
                            }}>
                            <Users users={userFollowers.result.items}/>
                            {(userFollowers.result.existMoreItems || userFollowers.criteria.page > 0) &&
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
                                            disabled={userFollowers.criteria.page < 1}
                                            onClick={() => dispatch(actions.previousFindUserFollowersResultPage(userId, userFollowers.criteria))}>
                                            <ArrowCircleLeftIcon />
                                        </Button>
                                        <Button
                                            disabled={!userFollowers.result.existMoreItems}
                                            onClick={() => dispatch(actions.nextFindUserFollowersResultPage(userId, userFollowers.criteria))}>
                                            <ArrowCircleRightIcon />
                                        </Button>
                                    </ButtonGroup>
                                </Box>
                            }
                        </Box>
                        :
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: '95%',
                                ml: 1,
                                mr: 1,
                                mb: 1,
                            }}>
                            <Users users={userFollowed.result.items}/>
                            {(userFollowed.result.existMoreItems || userFollowed.criteria.page > 0) &&
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
                                            disabled={userFollowed.criteria.page < 1}
                                            onClick={() => dispatch(actions.previousFindUserFollowedResultPage(userId, userFollowed.criteria))}>
                                            <ArrowCircleLeftIcon />
                                        </Button>
                                        <Button
                                            disabled={!userFollowed.result.existMoreItems}
                                            onClick={() => dispatch(actions.nextFindUserFollowedResultPage(userId, userFollowed.criteria))}>
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

export default ShowFollows;