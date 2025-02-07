import {useDispatch, useSelector} from "react-redux";
import {FormattedMessage} from "react-intl";

import * as actions from "../actions";
import * as selectors from "../selectors";

import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    Container,
    Paper,
    Typography,
    useTheme
} from "@mui/material";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import UsersThatClaimed from "./UsersThatClaimed";
import useMediaQuery from "@mui/material/useMediaQuery";
import {BackButton} from "../../common";
import {userListFeedback} from "../../search/components/SearchUsersResult";

const ShowUsersThatClaimed = () => {

    const dispatch = useDispatch();
    const usersThatClaimed = useSelector(selectors.getUsersThatClaimedReward);
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const theme = useTheme();

    if (!usersThatClaimed) {
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
                                <FormattedMessage id="project.brands.ShowUsersThatClaimed.title"></FormattedMessage>
                            </Typography>
                        </Box>
                        {userListFeedback()}
                    </Paper>
                </Box>
            </Container>
        );
    }

    if (usersThatClaimed.result.items.length === 0) {
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
                                <FormattedMessage id="project.brands.ShowUsersThatClaimed.title"></FormattedMessage>
                            </Typography>
                        </Box>
                        <Alert sx={{ ml: 1, mr: 1, mb: 1 }} variant="outlined" severity="warning">
                            <FormattedMessage id="project.brands.ShowUsersThatClaimed.noUsersClaimed" />
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
                            <FormattedMessage id="project.brands.ShowUsersThatClaimed.title"></FormattedMessage>
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
                        <UsersThatClaimed usersThatClaimed={usersThatClaimed.result.items}/>
                        {(usersThatClaimed.result.existMoreItems || usersThatClaimed.criteria.page > 0) &&
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
                                        disabled={usersThatClaimed.criteria.page < 1}
                                        onClick={() => dispatch(actions.previousFindUsersThatClaimedRewardResultPage(usersThatClaimed.criteria))}>
                                        <ArrowCircleLeftIcon />
                                    </Button>
                                    <Button
                                        disabled={!usersThatClaimed.result.existMoreItems}
                                        onClick={() => dispatch(actions.nextFindUsersThatClaimedRewardResultPage(usersThatClaimed.criteria))}>
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

export default ShowUsersThatClaimed;