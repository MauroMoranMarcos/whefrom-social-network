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
    Typography, useTheme
} from "@mui/material";
import {FormattedMessage} from "react-intl";
import Users from "./Users";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import useMediaQuery from "@mui/material/useMediaQuery";
import {BackButton} from "../../common";
import {userListFeedback} from "./SearchUsersResult";

const ShowUsersThatLiked = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(users.selectors.isLoggedIn);
    const userLogged = useSelector(users.selectors.getUser);
    const isUserFollowing = useSelector(selectors.isUserFollowing);
    const userSettings = useSelector(selectors.getUserSettings);
    const imageId = location.state.imageId;
    const tagId = location.state.tagId;
    const showImageLikes = location.state.showImageLikes;
    const usersThatLiked = useSelector(selectors.getUsersThatLikedImage);
    const usersThatLikedTag = useSelector(selectors.getUsersThatLikedTag);
    const [recentFirst, setRecentFirst] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    useEffect(() => {

        if (showImageLikes) {

            if (isLoggedIn) {
                dispatch(actions.findUsersThatLikedImage({imageId: imageId, userLoggedId: userLogged.id, dateDesc: recentFirst, page: 0}));
            } else {
                dispatch(actions.findUsersThatLikedImage({imageId: imageId, userLoggedId: 0, dateDesc: recentFirst, page: 0}));
            }

        } else if (!showImageLikes) {

            if (isLoggedIn) {
                dispatch(actions.findUsersThatLikedTag({userLoggedId: userLogged.id, tagId: tagId, dateDesc: recentFirst, page: 0}));
            } else {
                dispatch(actions.findUsersThatLikedTag({userLoggedId: 0, tagId: tagId, dateDesc: recentFirst, page: 0}));
            }

        }

    }, [recentFirst]);

    if (showImageLikes) {
        if (!usersThatLiked) {
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
                                    mb: 1,
                                    borderBottom: `1px solid ${theme.palette.primary.main}`,
                                }}>
                                <BackButton />
                                <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                    <FormattedMessage id="project.search.ShowUsersThatLiked.title"></FormattedMessage>
                                </Typography>
                            </Box>
                            {userListFeedback()}
                        </Paper>
                    </Box>
                </Container>
            );
        }

        if (usersThatLiked.result.items.length === 0) {
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
                                    mb: 1,
                                    borderBottom: `1px solid ${theme.palette.primary.main}`,
                                }}>
                                <BackButton />
                                <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                    <FormattedMessage id="project.search.ShowUsersThatLiked.title"></FormattedMessage>
                                </Typography>
                            </Box>
                            <Alert sx={{ ml: 1, mr: 1, mb: 1 }} variant="outlined" severity="warning">
                                <FormattedMessage id="project.search.ShowUsersThatLiked.noLikes" />
                            </Alert>
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
                                justifyContent: "flex-start",
                                mb: 1,
                                borderBottom: `1px solid ${theme.palette.primary.main}`,
                            }}>
                            <BackButton />
                            <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                <FormattedMessage id="project.search.ShowUsersThatLiked.title"></FormattedMessage>
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                ml: 1,
                                mr: 1,
                            }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Select
                                        sx={{ mb: 1 }}
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
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: '95%',
                                ml: 1,
                                mr: 1,
                                mb: 1,
                            }}>
                            <Users users={usersThatLiked.result.items}/>
                            {(usersThatLiked.result.existMoreItems || usersThatLiked.criteria.page > 0) &&
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
                                            disabled={usersThatLiked.criteria.page < 1}
                                            onClick={() => dispatch(actions.previousFindUsersThatLikedImageResultPage(usersThatLiked.criteria))}>
                                            <ArrowCircleLeftIcon />
                                        </Button>
                                        <Button
                                            disabled={!usersThatLiked.result.existMoreItems}
                                            onClick={() => dispatch(actions.nextFindUsersThatLikedImageResultPage(usersThatLiked.criteria))}>
                                            <ArrowCircleRightIcon />
                                        </Button>
                                    </ButtonGroup>
                                </Box>
                            }
                        </Box>
                    </Paper>
                </Box>
            </Container>
        )
    } else if (!showImageLikes) {
        if (!usersThatLikedTag) {
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
                                    mb: 1,
                                    borderBottom: `1px solid ${theme.palette.primary.main}`,
                                }}>
                                <BackButton />
                                <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                    <FormattedMessage id="project.search.ShowUsersThatLikedTag.title"></FormattedMessage>
                                </Typography>
                            </Box>
                            {userListFeedback()}
                        </Paper>
                    </Box>
                </Container>
            );
        }

        if (usersThatLikedTag.result.items.length === 0) {
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
                                    borderBottom: `1px solid ${theme.palette.primary.main}`,
                                }}>
                                <BackButton />
                                <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                    <FormattedMessage id="project.search.ShowUsersThatLikedTag.title"></FormattedMessage>
                                </Typography>
                            </Box>
                            <Alert sx={{ ml: 1, mr: 1, mb: 1 }} variant="outlined" severity="warning">
                                <FormattedMessage id="project.search.ShowUsersThatLikedTag.noLikes" />
                            </Alert>
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
                           justifyContent: "flex-start",
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
                                mb: 1,
                                borderBottom: `1px solid ${theme.palette.primary.main}`,
                            }}>
                            <BackButton />
                            <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                <FormattedMessage id="project.search.ShowUsersThatLikedTag.title"></FormattedMessage>
                            </Typography>
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
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: '95%',
                                ml: 1,
                                mr: 1,
                                mb: 1,
                            }}>
                            <Users users={usersThatLikedTag.result.items}/>
                            {(usersThatLikedTag.result.existMoreItems || usersThatLikedTag.criteria.page > 0) &&
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
                                            disabled={usersThatLikedTag.criteria.page < 1}
                                            onClick={() => dispatch(actions.previousFindUsersThatLikedTagResultPage(usersThatLikedTag.criteria))}>
                                            <ArrowCircleLeftIcon />
                                        </Button>
                                        <Button
                                            disabled={!usersThatLikedTag.result.existMoreItems}
                                            onClick={() => dispatch(actions.nextFindUsersThatLikedTagResultPage(usersThatLikedTag.criteria))}>
                                            <ArrowCircleRightIcon />
                                        </Button>
                                    </ButtonGroup>
                                </Box>
                            }
                        </Box>
                    </Paper>
                </Box>
            </Container>
        )
    }

}

export default ShowUsersThatLiked;