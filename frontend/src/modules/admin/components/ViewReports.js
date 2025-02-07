import {useEffect, useState} from "react";

import * as actions from '../actions';

import {
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Container,
    Grid,
    Input, MenuItem,
    Paper,
    Select, ToggleButton, ToggleButtonGroup,
    Typography
} from "@mui/material";
import {FormattedMessage} from "react-intl";
import UserReportsResult from "./UserReportsResult";
import {useDispatch} from "react-redux";
import ImageReportsResult from "./ImageReportsResult";
import useMediaQuery from "@mui/material/useMediaQuery";

const ViewReports = () => {

    const dispatch = useDispatch();
    const [reportType, setReportType] = useState('USERS');
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    useEffect(() => {

        if (reportType === "USERS") {
            dispatch(actions.findUserReports({page: 0}));
        } else if (reportType === "IMAGES") {
            dispatch(actions.findImageReports({page: 0}));
        }

    }, [reportType]);

    const handleReportTypeChange = (event, newReportType) => {

        setReportType(newReportType);

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
                        <Typography variant="h2" sx={{ mt: 0.5, mb: 0.5, fontWeight: 'bold' }}>
                            <FormattedMessage id="project.admin.ViewReports.title"></FormattedMessage>
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ml: 1,
                            mr: 1,
                            mb: 1,
                        }}>
                        <ToggleButtonGroup
                            color="primary"
                            value={reportType}
                            exclusive
                            onChange={handleReportTypeChange}>
                            <ToggleButton value="USERS">
                                <Typography>
                                    <FormattedMessage id="project.admin.ViewReports.userReports" />
                                </Typography>
                            </ToggleButton>
                            <ToggleButton value="IMAGES">
                                <Typography>
                                    <FormattedMessage id="project.admin.ViewReports.imageReports" />
                                </Typography>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    {reportType === "USERS" ?
                        <UserReportsResult />
                        :
                        <ImageReportsResult />
                        }
                </Paper>
            </Box>
        </Container>
    )

}

export default ViewReports;