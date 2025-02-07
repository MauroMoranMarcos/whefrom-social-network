import { FormattedMessage } from "react-intl";

import {Box, Button, Container, Paper, Typography} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useNavigate} from "react-router-dom";

const PointsHelp = () => {

    const navigate = useNavigate();
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

    const handleSeeRewards = () => {

        navigate("/search/rewards");

    }

    return (
        <Container
            component="main"
            maxWidth={isMobile ? false : "lg"}
            disableGutters={true}
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: 0,
                minHeight: isMobile ? '80vh' : '75vh',
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 4,
                    border: "1px solid #9575cd",
                    borderRadius: "4px",
                    backgroundColor: "#ffffff",
                    flexGrow: 1,
                }}
            >
                <Paper elevation={8}
                       sx={{
                           minHeight: isMobile ? '80vh' : '75vh',
                           display: 'flex',
                           flexDirection: 'column',
                           justifyContent: 'space-between',
                       }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderBottom: '1px solid #9575cd',
                        }}>
                        <Typography variant="h2" sx={{ textAlign: "center", fontWeight: 'bold', mt: 1, mb: 1 }}>
                            <FormattedMessage id="project.brands.PointsHelp.title" />
                        </Typography>
                    </Box>
                    <Box sx={{ padding: 2 }}>
                        <Typography variant="h6" sx={{ textAlign: "center" }}>
                            <FormattedMessage id="project.brands.PointsHelp.subtitle1" />
                        </Typography>
                        <Typography variant="h6" sx={{ textAlign: "center" }}>
                            <FormattedMessage id="project.brands.PointsHelp.subtitle2" />
                        </Typography>
                        <Typography variant="h6" sx={{ textAlign: "center" }}>
                            <FormattedMessage id="project.brands.PointsHelp.subtitle3" />
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                        <div className="loader"/>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 1,
                            mb: 1,
                        }}>
                        <Button variant="outlined" color="primary" onClick={handleSeeRewards}>
                            <FormattedMessage id="project.global.buttons.SeeRewards" />
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default PointsHelp;