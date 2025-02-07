import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {useLocation, useNavigate} from 'react-router-dom';

import {BackButton, Errors} from '../../common';
import * as actions from '../actions';
import * as selectors from '../selectors';
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Grid,
    Link,
    Container,
    Avatar,
    IconButton,
    Tooltip, Fab
} from "@mui/material";
import {CloudUpload, HighlightOffOutlined} from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";

const AddProfilePicture = () => {

    const user = useSelector(selectors.getUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [image, setImage] = useState(null);
    const [hasProfilePicture, setHasProfilePicture] = useState(user.profilePicture);
    const [noImage, setNoImage] = useState(!user.profilePicture && !image);
    const [backendErrors, setBackendErrors] = useState(null);
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    let form;

    const handleAddProfilePicture = () => {

        const formData = new FormData();

        formData.append('image', image);

        dispatch(actions.addProfilePicture(
            formData, user.id,
            () => navigate('/'),
            errors => setBackendErrors(errors)));

    }

    const handleRemoveImage = event => {

        setImage(null);
        setNoImage(true);

        if (hasProfilePicture) {
            setHasProfilePicture(false);
        }

    }

    const handleLoadProfilePicture = event => {

        setNoImage(false);

    }

    const handleLoadNewProfilePicture = event => {

        setNoImage(false);

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
                            justifyContent: (location.state && location.state.editing) ? "flex-start" : "center",
                            mb: 1,
                            borderBottom: '1px solid #9575cd',
                        }}>
                        {location.state && location.state.editing &&
                            <BackButton />
                        }
                        <Typography variant="h2" sx={{ mt: 0.5, mb: 0.5, fontWeight: 'bold' }}>
                            <FormattedMessage id="project.users.SignUp.addProfilePicture"></FormattedMessage>
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 1,
                            ml: 1,
                            mr: 1,
                        }}>
                        <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                            <FormattedMessage id="project.users.SignUp.addProfilePicture.subtitle"></FormattedMessage>
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
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "right",
                                        justifyContent: "right",
                                    }}>
                                    {!noImage &&
                                        <IconButton
                                            aria-label="remove"
                                            color="alertRed"
                                            variant="contained"
                                            onClick={e => handleRemoveImage(e)}
                                            sx={{ ml: 1.5, alignSelf: "flex-end"}}>
                                            <HighlightOffOutlined />
                                        </IconButton>
                                    }
                                </Box>
                                <Box
                                    sx={{
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mt: 1,
                                        mb: 1,
                                        ml: 1,
                                        mr: 1,
                                    }}>
                                    {hasProfilePicture &&
                                        <Avatar
                                            sx={{ width: 200, height: 200 }}
                                            src={`data:image/jpeg;base64,${user.profilePicture}`}
                                            onLoad={handleLoadProfilePicture}></Avatar>
                                    }
                                    {image &&
                                        <Avatar
                                            sx={{ width: 200, height: 200 }}
                                            src={URL.createObjectURL(image)}
                                            onLoad={handleLoadNewProfilePicture}></Avatar>
                                    }
                                    {noImage &&
                                        <Avatar
                                            sx={{ width: 200, height: 200 }}></Avatar>
                                    }

                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                {isMobile ?
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 6,
                                            ml: "auto",
                                            mr: "auto",
                                            mb: 1,
                                        }}>
                                        <input
                                            accept="image/*"
                                            style={{display: 'none'}}
                                            id="contained-button-camera"
                                            type="file"
                                            capture="environment"
                                            onChange={(e) => setImage(e.target.files[0])}
                                        />
                                        <label htmlFor="contained-button-camera">
                                            <Tooltip title={<FormattedMessage
                                                id="project.images.UploadImage.takePicture.explanatoryText"/>}>
                                                <Fab
                                                    sx={{ zIndex: 0 }}
                                                    size="medium"
                                                    color="primary"
                                                    variant="outlined"
                                                    component="span">
                                                    <AddAPhotoOutlinedIcon/>
                                                </Fab>
                                            </Tooltip>
                                        </label>
                                        <input
                                            accept="image/*"
                                            style={{display: 'none'}}
                                            id="contained-button-file"
                                            multiple
                                            type="file"
                                            onChange={(e) => setImage(e.target.files[0])}
                                        />
                                        <label htmlFor="contained-button-file">
                                            <Tooltip title={<FormattedMessage
                                                id="project.images.UploadImage.selectFile.explanatoryText"/>}>
                                                <Fab
                                                    sx={{ zIndex: 0 }}
                                                    size="medium"
                                                    color="primary"
                                                    variant="outlined"
                                                    component="span">
                                                    <CloudUpload/>
                                                </Fab>
                                            </Tooltip>
                                        </label>
                                    </Box>
                                :
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                        <input
                                            accept="image/*"
                                            style={{display: 'none'}}
                                            id="contained-button-file"
                                            multiple
                                            type="file"
                                            onChange={(e) => setImage(e.target.files[0])}
                                        />
                                        <label htmlFor="contained-button-file">
                                            <Button
                                                variant="contained"
                                                component="span"
                                                startIcon={<CloudUpload />}>
                                                <FormattedMessage id="project.global.buttons.selectProfilePicture" />
                                            </Button>
                                        </label>
                                    </Box>
                                }
                            </Grid>
                        </Grid>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: "auto",
                            mb: 4,
                        }}>
                        <Button
                            type="submit"
                            variant="contained"
                            onClick={handleAddProfilePicture}
                            sx={{ mb: 1 }}>
                            <Typography>
                                <FormattedMessage id="project.global.buttons.AddProfilePictureContinue"></FormattedMessage>
                            </Typography>
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )

}

export default AddProfilePicture;