import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {FormattedMessage} from 'react-intl';

import * as actions from '../actions';

import users from '../../users';

import {
    Box,
    Container,
    Paper,
    Typography
} from "@mui/material";
import {Errors} from "../../common";
import ShowFeedResult, {feedFeedback} from "./ShowFeedResult";
import useMediaQuery from "@mui/material/useMediaQuery";

const Feed = () => {

    const dispatch = useDispatch();
    const isLoggedIn = useSelector(users.selectors.isLoggedIn);
    const userLogged = useSelector(users.selectors.getUser);
    const [backendErrors, setBackendErrors] = useState(null);
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    useEffect(() => {

        if (isLoggedIn && userLogged && userLogged.id) {
            dispatch(actions.getFeed({userLoggedId: userLogged.id, page: 0}));
        }

        if (!isLoggedIn) {
            dispatch(actions.getFeed({userLoggedId: 0, page: 0}));
        }

    }, [dispatch, userLogged]);

    if (isLoggedIn && !userLogged) {
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
                                mb: 1,
                                borderBottom: '1px solid #9575cd',
                            }}>
                            <Typography variant="h2" sx={{ mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                <FormattedMessage id="project.search.Feed.title"></FormattedMessage>
                            </Typography>
                        </Box>
                        {feedFeedback()}
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
                            mb: 1,
                            borderBottom: '1px solid #9575cd',
                        }}>
                        <Typography variant="h2" sx={{ mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                            <FormattedMessage id="project.search.Feed.title"></FormattedMessage>
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: { xs: "column", md: "column" },
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                        <ShowFeedResult />
                    </Box>
                </Paper>
            </Box>
        </Container>
    )

}

export default Feed;