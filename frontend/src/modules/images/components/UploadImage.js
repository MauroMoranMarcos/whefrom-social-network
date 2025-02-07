import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {useNavigate} from 'react-router-dom';

import users from "../../users/index";

import {Errors} from '../../common';
import * as actions from '../actions';
import {
    Alert,
    Box,
    Button,
    Container,
    Fab,
    Grid,
    IconButton,
    Paper,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {HighlightOffOutlined, CloudUpload} from '@mui/icons-material';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import {styled} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const UploadImage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(users.selectors.getUser);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [imgFile, setImgFile] = useState(null);
    const [backendErrors, setBackendErrors] = useState(null);
    const [imgFileRequired, setImgFileRequired] = useState(false);
    const [requiredAlertMessageTitle, setRequiredAlertMessageTitle] = useState({
        title: false,
    });
    const [requiredAlertMessageImgFile, setRequiredAlertMessageImgFile] = useState({
        imgFile: false,
    });
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    let form;

    const handleSubmit = event => {

        event.preventDefault();

        handleValidationTitle();
        handleValidationImg();

        if (requiredAlertMessageImgFile.imgFile) {
            setImgFileRequired(true);
            return;
        }

        if (form.checkValidity()) {

            const formData = new FormData();

            formData.append('title', title.trim());
            formData.append('description', description.trim());
            formData.append('location', location.trim());
            formData.append('imgFile', imgFile);
            formData.append('userId', user.id.toString());

            dispatch(actions.uploadImage(
                formData,
                () => {
                    dispatch(users.actions.tryLoginFromServiceToken());
                    navigate('/images/tagging', { state: {imgFile} });
                },
                errors => setBackendErrors(errors)));
            
        } else {

            setBackendErrors(null);
            form.classList.add('was-validated');

        }

    }

    const handleRemoveImage = event => {

        setImgFile(null);

    }

    const handleValidationTitle = () => {
        const newRequiredAlerts = {
            title: title === '',
        };
        setRequiredAlertMessageTitle(newRequiredAlerts);
    };

    const handleValidationImg = () => {
        const newRequiredAlerts = {
            imgFile: imgFile === null,
        };
        setRequiredAlertMessageImgFile(newRequiredAlerts);
    };

    const openCamera = () => {

        const input = document.getElementById('contained-button-camera');
        input.click();

    }


    useEffect(() => {
        handleValidationImg();
    }, [imgFile]);

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
                            mb: 2,
                            borderBottom: '1px solid #9575cd',
                        }}>
                        <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                            <FormattedMessage id="project.images.UploadImage.title"></FormattedMessage>
                        </Typography>
                    </Box>
                    <Box component="form" ref={node => form = node} noValidate onSubmit={handleSubmit}
                         sx={{
                             display: "flex",
                             alignItems: "center",
                             justifyContent: "center",
                             ml: 2,
                             mr: 2,
                             mb: 1,
                         }}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <TextField
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    name="title"
                                    required
                                    fullWidth
                                    id="title"
                                    label={<FormattedMessage id="project.images.fields.title" />}
                                    autoFocus
                                    error={requiredAlertMessageTitle.title}
                                    helperText={requiredAlertMessageTitle.title &&
                                        <FormattedMessage id="project.global.validator.required" />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    name="description"
                                    fullWidth
                                    id="description"
                                    label={<FormattedMessage id="project.images.fields.description" />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    name="location"
                                    fullWidth
                                    id="location"
                                    label={<FormattedMessage id="project.images.fields.location" />}
                                />
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
                                        }}>
                                        <input
                                            accept="image/*"
                                            style={{display: 'none'}}
                                            id="contained-button-camera"
                                            type="file"
                                            capture="environment"
                                            onChange={(e) => setImgFile(e.target.files[0])}
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
                                            onChange={(e) => setImgFile(e.target.files[0])}
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
                                            ml: "auto",
                                            mr: "auto",
                                        }}>
                                        <input
                                            accept="image/*"
                                            style={{display: 'none'}}
                                            id="contained-button-file"
                                            multiple
                                            type="file"
                                            onChange={(e) => setImgFile(e.target.files[0])}
                                        />
                                        <label htmlFor="contained-button-file">
                                            <Button
                                                variant="contained"
                                                component="span"
                                                startIcon={<CloudUpload />}>
                                                <FormattedMessage id="project.images.fields.imgFile" />
                                            </Button>
                                        </label>
                                    </Box>
                                }
                                {imgFileRequired &&
                                    <Alert variant="outlined" severity="error" onClose={() => setImgFileRequired(false)}>
                                        <FormattedMessage id="project.images.validator.imageRequired" />
                                    </Alert>
                                }
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "right",
                                        justifyContent: "right",
                                        ml: "auto",
                                        mr: "auto",
                                    }}>
                                    {imgFile &&
                                        <IconButton
                                            aria-label="remove"
                                            color="alertRed"
                                            variant="contained"
                                            onClick={e => handleRemoveImage(e)}
                                            sx={{ mt: 1, mb: 1, ml: 1.5, alignSelf: "flex-end"}}>
                                            <HighlightOffOutlined />
                                        </IconButton>
                                    }
                                </Box>
                                {imgFile && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            ml: "auto",
                                            mr: "auto",
                                            mb: 1,
                                        }}>
                                        <img
                                            src={URL.createObjectURL(imgFile)}
                                            alt="Uploaded Image"
                                            style={{ maxWidth: '100%', maxHeight: 400 }}
                                        />
                                    </Box>
                                )}
                            </Grid>
                            <Grid item xs={12} sx={{ marginTop: isMobile ? (imgFile ? undefined : 5) : (imgFile ? undefined : 10) }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        ml: "auto",
                                        mr: "auto",
                                        mb: 4,
                                    }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{ mt: 1, mb: 1 }}   >
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.UploadImage"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )

}

export default UploadImage;