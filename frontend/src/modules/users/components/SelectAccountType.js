import {FormattedMessage} from 'react-intl';
import {useNavigate} from 'react-router-dom';

import {Box, Button, Container, Paper, Typography} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

const SelectAccountType = () => {

    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    const handleCreateBrandAccount = event => {
        event.preventDefault();

        navigate('/brands/signup');
    }

    const handleMyBrandAlreadyHasAccount = event => {
        event.preventDefault();

        navigate('/users/login');
    }

    const handleBackToNormalAccount = () => {

        navigate('/users/signup');

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
                    border: '1px solid #9575cd',
                    borderRadius: '4px',
                    flexGrow: 1,
                }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderBottom: '1px solid #9575cd',
                    }}>
                    <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                        <FormattedMessage id="project.users.SelectAccountType.title"></FormattedMessage>
                    </Typography>
                </Box>
                <Paper
                    elevation={12}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                        minHeight: '75vh',
                    }}>
                    <Box sx={{ ml: 1, mr: 1, mt: isMobile ? 4 : 8 }}>
                        <Button
                            variant="contained"
                            align="center"
                            onClick={handleCreateBrandAccount}
                            sx={{
                                width: '100%',
                                height: '100%',
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: 'linear-gradient(135deg, #9575cd 0%, #673ab7 100%)', // Gradiente moderno
                                color: '#fff', // Texto blanco
                                borderRadius: '4px',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #673ab7 0%, #9575cd 100%)', // Invertir colores al pasar el mouse
                                },
                            }}>
                            <Box sx={{ m: isMobile ? 1 : 3, textAlign: 'center' }}>
                                <Typography variant="h2">
                                    <FormattedMessage id="project.users.SignUp.buttons.brandAccount" />
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 2 }}>
                                    <FormattedMessage id="project.users.SignUp.text.brandAccountExplanation" />
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                                    <FormattedMessage id="project.users.SignUp.text.brandAccountContinue" />
                                </Typography>
                            </Box>
                        </Button>
                        <Button
                            variant="contained"
                            align="center"
                            onClick={handleMyBrandAlreadyHasAccount}
                            sx={{
                                mt: 1,
                                flex: 1,
                                width: '100%',
                                p: 3,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: 'linear-gradient(135deg, #9575cd 0%, #673ab7 100%)', // Gradiente moderno
                                color: '#fff', // Texto blanco
                                borderRadius: '4px',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #673ab7 0%, #9575cd 100%)', // Invertir colores al pasar el mouse
                                },
                            }}>
                            <Typography variant="h4">
                                <FormattedMessage id="project.users.SignUp.text.myBrandAlreadyHasAccount" />
                            </Typography>
                        </Button>
                    </Box>
                    <Box sx={{ mt: "auto", ml: 1, mr: 1, mb: isMobile ? 1 : 6 }}>
                        <Button
                            variant="contained"
                            align="center"
                            onClick={handleBackToNormalAccount}
                            startIcon={<ArrowBackIosNewOutlinedIcon />}
                            sx={{
                                flex: 1,
                                width: '100%',
                                p: 1.5,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: 'linear-gradient(135deg, #9575cd 0%, #673ab7 100%)', // Gradiente moderno
                                color: '#fff', // Texto blanco
                                borderRadius: '4px',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #673ab7 0%, #9575cd 100%)', // Invertir colores al pasar el mouse
                                },
                            }}>
                            <Typography variant="h4">
                                <FormattedMessage id="project.users.SelectAccountType.backToNormalAccount" />
                            </Typography>
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );


}

export default SelectAccountType;