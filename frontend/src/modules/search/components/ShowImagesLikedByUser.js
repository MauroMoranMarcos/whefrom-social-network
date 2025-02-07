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
    Paper, Select, Skeleton,
    Typography, useTheme
} from "@mui/material";
import {FormattedMessage} from "react-intl";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import Images from "./Images";
import Tags from "./Tags";
import useMediaQuery from "@mui/material/useMediaQuery";
import {BackButton} from "../../common";
import {imageListFeedback} from "./SearchImagesResult";

const ShowImagesLikedByUser = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(users.selectors.isLoggedIn);
    const userLogged = useSelector(users.selectors.getUser);
    const userId = location.state.userId;
    const imagesLikedByUser = useSelector(selectors.getImagesLikedByUser);
    const tagsLikedByUser = useSelector(selectors.getTagsLikedByUser);
    const [recentFirst, setRecentFirst] = useState(true);
    const [showImageLikes, setShowImageLikes] = useState(true);
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    useEffect(() => {

        if (showImageLikes) {
            if (isLoggedIn) {
                dispatch(actions.findImagesLikedByUser({userId: userId, userLoggedId: userLogged.id, dateDesc: recentFirst, page: 0}));
            } else {
                dispatch(actions.findImagesLikedByUser({userId: userId, userLoggedId: 0, dateDesc: recentFirst, page: 0}));
            }
        } else if (!showImageLikes) {
            if (isLoggedIn) {
                dispatch(actions.findTagsLikedByUser({userLoggedId: userLogged.id, userId: userId, dateDesc: recentFirst, page: 0}));
            } else {
                dispatch(actions.findTagsLikedByUser({userLoggedId: 0, userId: userId, dateDesc: recentFirst, page: 0}));
            }
        }

    }, [recentFirst]);

    if (showImageLikes) {
        if (!imagesLikedByUser) {
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
                                    mb: 2,
                                    borderBottom: '1px solid #9575cd',
                                }}>
                                <BackButton />
                                <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                    <FormattedMessage id="project.search.ShowImagesLikedByUser.title"></FormattedMessage>
                                </Typography>
                            </Box>
                            {imageListFeedback(isMobile)}
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
                                mb: 2,
                                borderBottom: '1px solid #9575cd',
                            }}>
                            <BackButton />
                            <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                <FormattedMessage id="project.search.ShowImagesLikedByUser.title"></FormattedMessage>
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                ml: 1,
                                mr: 1,
                            }}>
                            <Grid container spacing={2}>
                                <Grid item xs={!isMobile ? 4.5 : 12}>
                                    <Select
                                        sx={!isMobile && { mb: 1.5 }}
                                        size="small"
                                        fullWidth
                                        value={showImageLikes}
                                        onChange={(e) => setShowImageLikes(e.target.value)}>
                                        <MenuItem value={true}>
                                            <Typography>
                                                <FormattedMessage id="project.search.ShowLikesFromUser.fields.showImageLikes" />
                                            </Typography>
                                        </MenuItem>
                                        <MenuItem value={false}>
                                            <Typography>
                                                <FormattedMessage id="project.search.ShowLikesFromUser.fields.showTagLikes" />
                                            </Typography>
                                        </MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={!isMobile ? 7.5 : 12}>
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
                        {imagesLikedByUser.result.items.length === 0 ?
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
                                    }}>
                                    <Alert
                                        sx={{ display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'start',
                                            ml: 1,
                                            mr: 1,
                                            mb: 2,
                                            mt: 1
                                        }}
                                        variant="outlined" severity="warning">
                                        <FormattedMessage id="project.search.ShowImagesLikedByUser.noLikes" />
                                    </Alert>
                                </Box>
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
                                <Images images={imagesLikedByUser.result.items}/>
                                {(imagesLikedByUser.result.existMoreItems || imagesLikedByUser.criteria.page > 0) &&
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
                                                disabled={imagesLikedByUser.criteria.page < 1}
                                                onClick={() => dispatch(actions.previousFindImagesLikedByUserResultPage(imagesLikedByUser.criteria))}>
                                                <ArrowCircleLeftIcon />
                                            </Button>
                                            <Button
                                                disabled={!imagesLikedByUser.result.existMoreItems}
                                                onClick={() => dispatch(actions.nextFindImagesLikedByUserResultPage(imagesLikedByUser.criteria))}>
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
    } else if (!showImageLikes) {
        if (!tagsLikedByUser) {
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
                                    <FormattedMessage id="project.search.ShowLikesFromUser.tagsTitle"></FormattedMessage>
                                </Typography>
                            </Box>
                            {tagListFeedback(isMobile)}
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
                                mb: 2,
                                borderBottom: '1px solid #9575cd',
                            }}>
                            <BackButton />
                            <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                <FormattedMessage id="project.search.ShowLikesFromUser.tagsTitle"></FormattedMessage>
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                ml: 1,
                                mr: 1,
                            }}>
                            <Grid container spacing={2}>
                                <Grid item xs={!isMobile ? 4.5 : 12}>
                                    <Select
                                        sx={!isMobile && { mb: 1.5 }}
                                        size="small"
                                        fullWidth
                                        value={showImageLikes}
                                        onChange={(e) => setShowImageLikes(e.target.value)}>
                                        <MenuItem value={true}>
                                            <Typography>
                                                <FormattedMessage id="project.search.ShowLikesFromUser.fields.showImageLikes" />
                                            </Typography>
                                        </MenuItem>
                                        <MenuItem value={false}>
                                            <Typography>
                                                <FormattedMessage id="project.search.ShowLikesFromUser.fields.showTagLikes" />
                                            </Typography>
                                        </MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={!isMobile ? 7.5 : 12}>
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
                        {tagsLikedByUser.result.items.length === 0 ?
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
                                    }}>
                                    <Alert
                                        sx={{ display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'start',
                                            ml: 1,
                                            mr: 1,
                                            mb: 1,
                                            mt: 1
                                        }}
                                        variant="outlined" severity="warning">
                                        <FormattedMessage id="project.search.ShowLikesFromUser.noTagLikes" />
                                    </Alert>
                                </Box>
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
                                <Tags tags={tagsLikedByUser.result.items}/>
                                {(tagsLikedByUser.result.existMoreItems || tagsLikedByUser.criteria.page > 0) &&
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
                                                disabled={tagsLikedByUser.criteria.page < 1}
                                                onClick={() => dispatch(actions.previousFindTagsLikedByUserResultPage(tagsLikedByUser.criteria))}>
                                                <ArrowCircleLeftIcon />
                                            </Button>
                                            <Button
                                                disabled={!tagsLikedByUser.result.existMoreItems}
                                                onClick={() => dispatch(actions.nextFindTagsLikedByUserResultPage(tagsLikedByUser.criteria))}>
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

}

export const tagListFeedback = (isMobile) => (
    <Box
        sx={{
            width: '100%',
            maxWidth: isMobile ? '95%' : '97%',
            ml: 1,
            mr: 1,
            mb: 1,
        }}>
        {Array.from({ length: 4 }).map((_, index) => (
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Skeleton variant="rounded" sx={{ m: 0.5 }} width="100%" height={20} animation="wave" />
                <Skeleton variant="rounded" sx={{ m: 0.5 }} width="100%" height={20} animation="wave" />
                <Skeleton variant="rounded" sx={{ m: 0.5 }} width="100%" height={20} animation="wave" />
            </Box>
        ))
        }
    </Box>
)

export default ShowImagesLikedByUser;