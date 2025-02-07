import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {FormattedMessage} from "react-intl";

import * as selectors from "../selectors";
import * as actions from "../actions";

import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    Container,
    Grid,
    MenuItem,
    Paper,
    Select,
    Skeleton,
    Typography
} from "@mui/material";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

import FollowRequests from "./FollowRequests";
import useMediaQuery from "@mui/material/useMediaQuery";

const ShowFollowRequests = () => {

    const dispatch = useDispatch();
    const numFollowRequests = useSelector(selectors.getNumFollowRequests);
    const followRequests = useSelector(selectors.getFollowRequests);
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    const feedback = () => (
        <Container component="main" maxWidth={isMobile ? false : "lg"} disableGutters={true}
                   sx={{
                       display: "flex",
                       flexDirection: "column",
                       justifyContent: "center",
                       padding: 0,
                   }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "column" },
                    justifyContent: "center",
                    gap: 4,
                    border: '1px solid #9575cd',
                    borderRadius: '4px'
                }}>
                <Paper elevation={8}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                            borderBottom: '1px solid #9575cd',
                        }}>
                        <Skeleton
                            sx={{ ml: 0.5, mr: 0.5 }}
                            variant="text"
                            animation="wave"
                            height={45}
                            width="70%"
                        />
                    </Box>
                    {Array.from({ length: 10 }).map((_, index) => (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "start",
                                width: '100%',
                                maxWidth: '95%',
                                mt: 3.8,
                                ml: 1,
                                mr: 1,
                                mb: 1,
                            }}>
                            <Skeleton
                                sx={{ ml: 0.5, mb: 0.5 }}
                                variant="circular"
                                width={40}
                                height={40}
                                animation="wave" />
                            <Box
                                sx={{
                                    width: isMobile ? '55%' : '75%',
                                }}>
                                <Skeleton
                                    sx={{ ml: 0.5, mr: 0.5, mb: 0.5 }}
                                    animation="wave"
                                    height={20}
                                    width="40%"
                                />
                                <Skeleton
                                    sx={{ ml: 0.5, mr: 0.5, mb: 0.5 }}
                                    animation="wave"
                                    height={10}
                                    width="60%"
                                />
                            </Box>
                            <Skeleton
                                sx={{ ml: 0.5, mb: 0.5 }}
                                variant="circular"
                                width={40}
                                height={40}
                                animation="wave" />
                            <Skeleton
                                sx={{ ml: 0.5, mb: 0.5 }}
                                variant="circular"
                                width={40}
                                height={40}
                                animation="wave" />
                        </Box>
                    ))
                    }
                </Paper>
            </Box>
        </Container>
    )

    if (!followRequests) {
        return feedback();
    }

    if (followRequests.result.items.length === 0) {
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
                            <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                <FormattedMessage id="project.users.ShowFollowRequests.title"></FormattedMessage>
                            </Typography>
                        </Box>
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
                            <FormattedMessage id="project.users.ShowFollowRequests.noFollowRequests" />
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
                            justifyContent: "center",
                            mb: 2,
                            borderBottom: '1px solid #9575cd',
                        }}>
                        {numFollowRequests === 0 &&
                            <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                <FormattedMessage id="project.users.ShowFollowRequests.titleStart"></FormattedMessage>
                                {numFollowRequests}
                                <FormattedMessage id="project.users.ShowFollowRequests.titleEnd"></FormattedMessage>
                            </Typography>
                        }
                        {numFollowRequests === 1 &&
                            <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                <FormattedMessage id="project.users.ShowFollowRequests.titleStart"></FormattedMessage>
                                {numFollowRequests}
                                <FormattedMessage id="project.users.ShowFollowRequests.titleEndSingular"></FormattedMessage>
                            </Typography>
                        }
                        {numFollowRequests > 1 &&
                            <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                <FormattedMessage id="project.users.ShowFollowRequests.titleStart"></FormattedMessage>
                                {numFollowRequests}
                                <FormattedMessage id="project.users.ShowFollowRequests.titleEnd"></FormattedMessage>
                            </Typography>
                        }
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: '95%',
                            ml: 1,
                            mr: 1,
                            mb: 1,
                        }}>
                        <FollowRequests users={followRequests.result.items}/>
                        {(followRequests.result.existMoreItems || followRequests.criteria.page > 0) &&
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
                                        disabled={followRequests.criteria.page < 1}
                                        onClick={() => dispatch(actions.previousFindUserFollowRequestsResultPage(followRequests.criteria))}>
                                        <ArrowCircleLeftIcon />
                                    </Button>
                                    <Button
                                        disabled={!followRequests.result.existMoreItems}
                                        onClick={() => dispatch(actions.nextFindUserFollowRequestsResultPage(followRequests.criteria))}>
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

export default ShowFollowRequests;