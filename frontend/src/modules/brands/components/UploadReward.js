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
import {styled} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";

const UploadReward = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const brand = useSelector(users.selectors.getUser);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [endDate, setEndDate] = useState("");
    const [pointsCost, setPointsCost] = useState("");
    const [publicationsNeeded, setPublicationsNeeded] = useState("0");
    const [stock, setStock] = useState("");
    const [imgFile, setImgFile] = useState(null);
    const [backendErrors, setBackendErrors] = useState(null);
    const [imgFileRequired, setImgFileRequired] = useState(false);
    const [requiredAlertMessages, setRequiredAlertMessages] = useState({
        name: false,
        description: false,
        endDate: false,
        pointsCost: false,
        stock: false,
    });
    const [requiredAlertMessageImgFile, setRequiredAlertMessageImgFile] = useState({
        imgFile: false,
    });
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    let form;

    const handleSubmit = event => {

        event.preventDefault();

        handleValidation();
        handleValidationImg();

        if (requiredAlertMessageImgFile.imgFile) {
            setImgFileRequired(true);
            return;
        }

        const dateObject = new Date(endDate);

        const isoDateObject = dateObject.toISOString();

        if (form.checkValidity()) {

            const formData = new FormData();

            formData.append('name', name.trim());
            formData.append('description', description.trim());
            formData.append('endDate', isoDateObject);
            formData.append('pointsCost', pointsCost.trim());
            formData.append('publicationsNeeded', publicationsNeeded.trim());
            formData.append('stock', stock.trim());
            formData.append('imgFile', imgFile);
            formData.append('brandId', brand.id.toString());

            dispatch(actions.uploadReward(
                formData,
                () => navigate('/'),
                errors => setBackendErrors(errors)));

        } else {

            setBackendErrors(null);
            form.classList.add('was-validated');

        }

    }

    const handleRemoveImage = event => {

        setImgFile(null);

    }

    const handleValidation = () => {
        const newRequiredAlerts = {
            name: name === '',
            description: description === '',
            endDate: endDate === '',
            pointsCost: pointsCost === '',
            stock: stock === '',
        };
        setRequiredAlertMessages(newRequiredAlerts);
    };

    const handleValidationImg = () => {
        const newRequiredAlerts = {
            imgFile: imgFile === null,
        };
        setRequiredAlertMessageImgFile(newRequiredAlerts);
    };

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
                            <FormattedMessage id="project.brands.UploadReward.title"></FormattedMessage>
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
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    name="name"
                                    required
                                    fullWidth
                                    id="name"
                                    label={<FormattedMessage id="project.brands.fields.name" />}
                                    autoFocus
                                    error={requiredAlertMessages.name}
                                    helperText={requiredAlertMessages.name &&
                                        <FormattedMessage id="project.global.validator.required" />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    name="description"
                                    required
                                    fullWidth
                                    id="description"
                                    label={<FormattedMessage id="project.brands.fields.description" />}
                                    error={requiredAlertMessages.description}
                                    helperText={requiredAlertMessages.description &&
                                        <FormattedMessage id="project.global.validator.required" />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    value={pointsCost}
                                    onChange={(e) => setPointsCost(e.target.value)}
                                    name="pointsCost"
                                    inputProps={{ type: 'number'}}
                                    required
                                    fullWidth
                                    id="pointsCost"
                                    label={<FormattedMessage id="project.brands.fields.pointsCost" />}
                                    error={requiredAlertMessages.pointsCost}
                                    helperText={requiredAlertMessages.pointsCost &&
                                        <FormattedMessage id="project.global.validator.required" />}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    value={publicationsNeeded}
                                    onChange={(e) => setPublicationsNeeded(e.target.value)}
                                    name="publicationsNeeded"
                                    inputProps={{ type: 'number'}}
                                    fullWidth
                                    id="publicationsNeeded"
                                    label={<FormattedMessage id="project.brands.fields.publicationsNeeded" />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    name="stock"
                                    inputProps={{ type: 'number'}}
                                    required
                                    fullWidth
                                    id="stock"
                                    label={<FormattedMessage id="project.brands.fields.stock" />}
                                    error={requiredAlertMessages.stock}
                                    helperText={requiredAlertMessages.stock &&
                                        <FormattedMessage id="project.global.validator.required" />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{
                                    display: "flex",
                                    alignContent: "center",
                                }}>
                                    <Typography variant="h3" sx={{ mb: 1 }}>
                                        <FormattedMessage id="project.brands.fields.endDate"></FormattedMessage>
                                    </Typography>
                                </Box>
                                <TextField
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    name="endDate"
                                    type="date"
                                    required
                                    fullWidth
                                    id="endDate"
                                    error={requiredAlertMessages.endDate}
                                    helperText={requiredAlertMessages.endDate &&
                                        <FormattedMessage id="project.global.validator.required" />}></TextField>
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
                                            mb: 1,
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
                                        mb: 1,
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
                                            mt: "auto",
                                            ml: "auto",
                                            mr: "auto",
                                            mb: "auto",
                                        }}>
                                        <img
                                            src={URL.createObjectURL(imgFile)}
                                            alt="Uploaded Image"
                                            style={{ maxWidth: '100%', maxHeight: 400 }}
                                        />
                                    </Box>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mt: "auto",
                                        ml: "auto",
                                        mr: "auto",
                                        mb: 1,
                                    }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{ mt: 1, mb: 1 }}   >
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.UploadReward"></FormattedMessage>
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

export default UploadReward;