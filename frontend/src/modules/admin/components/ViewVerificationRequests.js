import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {FormattedMessage} from "react-intl";

import * as selectors from "../selectors";
import * as actions from "../actions";

import useMediaQuery from "@mui/material/useMediaQuery";
import {Alert, Box, Button, ButtonGroup, Container, Paper, Typography} from "@mui/material";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import VerificationRequests from "./VerificationRequests";

const ViewVerificationRequests = () => {

    const dispatch = useDispatch();
    const verificationRequests = useSelector(selectors.getVerificationRequests);
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    useEffect(() => {

        dispatch(actions.findVerificationRequests({page: 0}));

    }, []);

    if (!verificationRequests) {
        return null;
    }

    if (verificationRequests.result.items.length === 0) {
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
                                <FormattedMessage id="project.admin.ViewVerificationRequests.title"></FormattedMessage>
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
                            <FormattedMessage id="project.admin.ViewVerificationRequests.noVerificationRequests" />
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
                        <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                            <FormattedMessage id="project.admin.ViewVerificationRequests.title"></FormattedMessage>
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: '95%',
                            ml: 1,
                            mr: 1,
                            mb: 1,
                        }}>
                        <VerificationRequests users={verificationRequests.result.items}/>
                        {(verificationRequests.result.existMoreItems || verificationRequests.criteria.page > 0) &&
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
                                        disabled={verificationRequests.criteria.page < 1}
                                        onClick={() => dispatch(actions.previousFindVerificationRequestsResultPage(verificationRequests.criteria))}>
                                        <ArrowCircleLeftIcon />
                                    </Button>
                                    <Button
                                        disabled={!verificationRequests.result.existMoreItems}
                                        onClick={() => dispatch(actions.nextFindVerificationRequestsResultPage(verificationRequests.criteria))}>
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

export default ViewVerificationRequests;