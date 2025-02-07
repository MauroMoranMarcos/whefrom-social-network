import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {useLocation, useNavigate} from 'react-router-dom';

import users from '../../users/index';
import admin from '../../admin/index';
import search from '../../search/index';

import {Errors} from '../../common';
import * as actions from '../actions';
import * as selectors from '../selectors';
import {
    Box,
    Button, Chip,
    Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText,
    Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput,
    Paper, Select,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import SearchBrands from "./SearchBrands";
import {AccountCircle, HighlightOffOutlined} from "@mui/icons-material";

const TagImage = () => {

    // Definition of Tag class to create Tag objects.
    class Tag {
        tagName;
        link;
        coordinateX;
        coordinateY;
        categoryId;
        brandId;

        constructor(
            tagName,
            link,
            coordinateX,
            coordinateY,
            categoryId,
            brandId
        ) {
            this.tagName = tagName;
            this.link = link;
            this.coordinateX = coordinateX;
            this.coordinateY = coordinateY;
            this.categoryId = categoryId;
            this.brandId = brandId;
        }
    }

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const categories = useSelector(admin.selectors.getCategories);
    const user = useSelector(users.selectors.getUser);
    const image = useSelector(selectors.getLastImageUploaded);
    const existentTags = useSelector(search.selectors.getTags);
    const brand = useSelector(search.selectors.getUser);
    const imgFile = location.state.imgFile;
    const editing = location.state.editing;
    const imageId = location.state.imageId;
    const [tagName, setTagName] = useState('');
    const [link, setLink] = useState('');
    const [coordinateX, setCoordinateX] = useState(null);
    const [coordinateY, setCoordinateY] = useState(null);
    const [categoryId, setCategoryId] = useState(-1);
    const [brandId, setBrandId] = useState(0);
    const [tags, setTags] = useState([]);
    const [tagToDelete, setTagToDelete] = useState(null);
    const [openDeleteTagDialog, setOpenDeleteTagDialog] = useState(false);
    const [openUpdateTagDialog, setOpenUpdateTagDialog] = useState(false);
    const [openConfirmUpdateTagDialog, setOpenConfirmUpdateTagDialog] = useState(false);
    const [backendErrors, setBackendErrors] = useState(null);
    const [requiredAlertMessages, setRequiredAlertMessages] = useState({
        tagName: false,
        categoryId: false,
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [incorrectLink, setIncorrectLink] = useState(false);
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    useEffect(() => {

        dispatch(search.actions.clearUser());

    }, []);

    useEffect(() => {

        if (brand && brand.id) {
            setBrandId(brand.id);
        } else if (!brand) {
            setBrandId(0);
        }

    }, [brand]);

    const resetFormFields = () => {

        dispatch(search.actions.clearUser());

        setTagName("");
        setLink("");
        setCategoryId(-1);
        setBrandId(0);

    }

    const handleClickOpen = () => {
        setOpen(true);

        dispatch(admin.actions.findCategories(true));
    };

    const handleClose = () => {
        setOpen(false);

        resetFormFields();
    };

    const handleImageClick = (e) => {

        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setCoordinateX(x);
        setCoordinateY(y);

        handleClickOpen();

    }

    const handleAddTag = () => {

        handleValidation();

    }

    const handleDeleteTag = (deleteTag) => {

        const tagsWithoutTag = tags.filter(tag => tag !== deleteTag);
        setTags(tagsWithoutTag);

    }

    const handleConfirmTags = () => {

        if (tags.length === 0) {
            navigate('/');
            return
        }

        for (let i = 0; i < tags.length; i++) {

            const tag = tags[i];

            if (editing) {
                dispatch(actions.tagImage(
                    tag.tagName.trim(),
                    tag.link === '' ? null : tag.link.trim(),
                    tag.coordinateX,
                    tag.coordinateY,
                    tag.categoryId,
                    imageId,
                    tag.brandId,
                    user.id,
                    () => navigate('/'),
                    errors => setBackendErrors(errors)
                ));
            } else {
                dispatch(actions.tagImage(
                    tag.tagName.trim(),
                    tag.link === '' ? null : tag.link.trim(),
                    tag.coordinateX,
                    tag.coordinateY,
                    tag.categoryId,
                    image.id,
                    tag.brandId,
                    user.id,
                    () => navigate('/'),
                    errors => setBackendErrors(errors)
                ));
            }

        }

    }

    const handleValidation = () => {

        const newIncorrectLink = (link !== '') && !isValidUrl(link);
        setIncorrectLink((link !== '') && !isValidUrl(link));

        const newRequiredAlerts = {
            tagName: tagName === '',
            categoryId: categoryId === -1,
        };
        setRequiredAlertMessages(newRequiredAlerts);
        const newIsFormValid = !newRequiredAlerts.tagName &&
            !newRequiredAlerts.categoryId && !newIncorrectLink;
        setIsFormValid(newIsFormValid);

        if (newIsFormValid) {

            const newTag = new Tag(
                tagName,
                link,
                coordinateX,
                coordinateY,
                categoryId,
                brandId
            );

            setTags([...tags, newTag]);

            setOpen(false);

            resetFormFields();
        }
    };

    const handleOpenDeleteTagDialog = (tag) => {

        setTagToDelete(tag)
        setOpenDeleteTagDialog(true);

    }

    const handleCloseDeleteTagDialog = () => {

        setOpenDeleteTagDialog(false);

    }

    const handleDeleteExistentTag = () => {

        dispatch(actions.deleteTagFromImage(tagToDelete.id, imageId,
            () => {
                dispatch(search.actions.findImageTags(imageId, user.id));
                handleCloseDeleteTagDialog();
            },
            errors => setBackendErrors(errors)));

    }

    const handleOpenUpdateTagDialog = (tag) => {

        if (tag.brandId) {
            dispatch(search.actions.findUserById(tag.brandId,
                user => {
                    setTagToDelete(tag);
                    setTagName(tag.name);
                    setLink(tag.link);
                    setCategoryId(tag.categoryId);
                    setBrandId(user.id)
                }));
        } else {
            dispatch(search.actions.clearUser());
            setTagToDelete(tag);
            setTagName(tag.name);
            setLink(tag.link);
            setCategoryId(tag.categoryId);
            setBrandId(0);
        }

        setOpenUpdateTagDialog(true);

    }

    const handleCloseUpdateTagDialog = () => {

        setOpenUpdateTagDialog(false);

    }

    const handleConfirmUpdateTag = () => {

        const newIncorrectLink = (link !== '') && !isValidUrl(link);
        setIncorrectLink((link !== '') && !isValidUrl(link));

        const newRequiredAlerts = {
            tagName: tagName === '',
            categoryId: categoryId === -1,
        };
        setRequiredAlertMessages(newRequiredAlerts);
        const newIsFormValid = !newRequiredAlerts.tagName &&
            !newRequiredAlerts.categoryId && !newIncorrectLink;
        setIsFormValid(newIsFormValid);

        if (newIsFormValid) {
            setOpenConfirmUpdateTagDialog(true);
        }

    }

    const handleCloseConfirmUpdateTagDialog = () => {

        setOpenConfirmUpdateTagDialog(false);

    }

    const handleUpdateTag = () => {

        if (isFormValid) {

            dispatch(actions.updateTag(
                tagName.trim(),
                link === '' ? null : link.trim(),
                categoryId,
                brandId,
                tagToDelete.id,
                () => {
                    dispatch(search.actions.findImageTags(imageId, user.id));
                    handleCloseConfirmUpdateTagDialog();
                    handleCloseUpdateTagDialog();
                    resetFormFields();
                },
                errors => setBackendErrors(errors)));

        }
    }

    const handleCancelEditing = () => {

        navigate(-1);

    }

    const handleClickRemoveBrand = () => {

        dispatch(search.actions.clearUser());
        setBrandId(0);

    }

    // Function to validate a URL
    const isValidUrl = (link) => {

        const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/\S*)?$/;
        return regex.test(link);

    }

    if (editing && !existentTags) {
        return null;
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
                        <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                            <FormattedMessage id="project.images.TagImage.title"></FormattedMessage>
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 1,
                            mb: "auto",
                        }}>
                        <Typography variant="h3" sx={{ textAlign: 'center', mb: 1 }}>
                            <FormattedMessage id="project.images.TagImage.text"></FormattedMessage>
                        </Typography>
                    </Box>
                    <Box
                         sx={{
                             display: "flex",
                             alignItems: "center",
                             justifyContent: "center",
                         }}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderTop: '1px solid #9575cd',
                                        borderBottom: '1px solid #9575cd',
                                    }}>
                                    {editing ?
                                        <img
                                            src={`data:image/jpeg;base64,${imgFile}`}
                                            alt="Uploaded Image"
                                            onClick={handleImageClick}
                                            style={{maxWidth: '100%', maxHeight: 400}}>
                                        </img>
                                        :
                                        <img
                                            src={URL.createObjectURL(imgFile)}
                                            alt="Uploaded Image"
                                            onClick={handleImageClick}
                                            style={{maxWidth: '100%', maxHeight: 400}}
                                        />
                                    }
                                    {tags.map(tag =>
                                        <Chip
                                            label={tag.tagName}
                                            variant="outlined"
                                            size="small"
                                            onDelete={() => handleDeleteTag(tag)}
                                            sx={{
                                                position: 'absolute',
                                                top: `${tag.coordinateY}px`,
                                                left: `${tag.coordinateX}px`,
                                                zIndex: 1,
                                                bgcolor: theme.palette.primary.main,
                                            }}>
                                        </Chip>
                                    )}
                                    {editing && existentTags.length > 0 &&
                                        existentTags.map(tag =>
                                            <Chip
                                                label={tag.name}
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleOpenUpdateTagDialog(tag)}
                                                onDelete={() => handleOpenDeleteTagDialog(tag)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: `${tag.coordinateY}px`,
                                                    left: `${tag.coordinateX}px`,
                                                    zIndex: 1,
                                                    bgcolor: theme.palette.primary.main,
                                                }}>
                                            </Chip>
                                        )
                                    }
                                    <Dialog
                                        fullScreen={fullScreen}
                                        open={openUpdateTagDialog}
                                        onClose={handleCloseUpdateTagDialog}
                                        aria-labelledby="responsive-dialog-title">
                                        <DialogContent>
                                            <Errors errors={backendErrors} onClose={() => setBackendErrors(null)}/>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        value={tagName}
                                                        onChange={(e) => setTagName(e.target.value)}
                                                        name="tagName"
                                                        required
                                                        fullWidth
                                                        id="tagName"
                                                        label={<FormattedMessage id="project.images.fields.tagName" />}
                                                        error={requiredAlertMessages.tagName}
                                                        helperText={requiredAlertMessages.tagName &&
                                                            <FormattedMessage id="project.global.validator.required" />}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        value={link}
                                                        onChange={(e) => setLink(e.target.value)}
                                                        name="link"
                                                        fullWidth
                                                        id="link"
                                                        label={<FormattedMessage id="project.images.fields.tagLink" />}
                                                        error={link !== '' && incorrectLink}
                                                        helperText={link !== '' && incorrectLink && <FormattedMessage id="project.global.validator.incorrectLink" />}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FormControl fullWidth error={requiredAlertMessages.categoryId}>
                                                        <InputLabel id="demo-simple-select-helper-label">
                                                            <FormattedMessage id="project.images.fields.category" />
                                                        </InputLabel>
                                                        <Select
                                                            value={categoryId}
                                                            fullWidth
                                                            label={<FormattedMessage id="project.images.fields.category" />}
                                                            onChange={(e) => setCategoryId(e.target.value)}>
                                                            <MenuItem value={-1}>
                                                                <Typography>
                                                                    <FormattedMessage id="project.images.TagImage.selectCategory" />
                                                                </Typography>
                                                            </MenuItem>
                                                            {categories.map(category =>
                                                                <MenuItem value={category.id}>
                                                                    <Typography>
                                                                        {category.name}
                                                                    </Typography>
                                                                </MenuItem>
                                                            )}
                                                        </Select>
                                                        <FormHelperText color="alertRed">
                                                            {requiredAlertMessages.categoryId &&
                                                                <FormattedMessage id="project.global.validator.required" />}
                                                        </FormHelperText>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}>
                                                        <TextField
                                                            value={brand ? brand.name : " "}
                                                            name="brandId"
                                                            id="brandId"
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                            fullWidth
                                                            endAdornment={
                                                                <InputAdornment position="start">
                                                                    <AccountCircle />
                                                                </InputAdornment>
                                                            }
                                                            label={<FormattedMessage id="project.images.fields.brandId" />}
                                                        />
                                                        <IconButton
                                                            aria-label="remove"
                                                            color="alertRed"
                                                            variant="contained"
                                                            disabled={!brand}
                                                            onClick={e => handleClickRemoveBrand(e)}
                                                            sx={{ mt: 1, mb: 1, ml: 1.5, alignSelf: "flex-end"}}>
                                                            <HighlightOffOutlined />
                                                        </IconButton>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <SearchBrands />
                                                </Grid>
                                            </Grid>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button
                                                variant="contained"
                                                onClick={handleConfirmUpdateTag}
                                                sx={{ mt: 1, mb: 1 }}>
                                                <Typography>
                                                    <FormattedMessage id="project.global.buttons.UpdateTag"></FormattedMessage>
                                                </Typography>
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="alertRed"
                                                onClick={handleCloseUpdateTagDialog}
                                                sx={{ mt: 1, mb: 1 }}>
                                                <Typography>
                                                    <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                                </Typography>
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                    <Dialog
                                        fullScreen={fullScreen}
                                        open={openConfirmUpdateTagDialog}
                                        onClose={handleCloseConfirmUpdateTagDialog}
                                        aria-labelledby="responsive-dialog-title"
                                    >
                                        <DialogTitle id="responsive-dialog-title">
                                            <FormattedMessage id="project.images.UpdateImage.updateTag.title" />
                                        </DialogTitle>
                                        <DialogActions>
                                            <Button
                                                variant="contained"
                                                sx={{ mt: 1, mb: 1 }}
                                                onClick={handleUpdateTag}>
                                                <Typography>
                                                    <FormattedMessage id="project.global.buttons.UpdateTag"></FormattedMessage>
                                                </Typography>
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="alertRed"
                                                onClick={handleCloseConfirmUpdateTagDialog}
                                                sx={{ mt: 1, mb: 1 }}>
                                                <Typography>
                                                    <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                                </Typography>
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                    <Dialog
                                        fullScreen={fullScreen}
                                        open={openDeleteTagDialog}
                                        onClose={handleCloseDeleteTagDialog}
                                        aria-labelledby="responsive-dialog-title"
                                    >
                                        <DialogTitle id="responsive-dialog-title">
                                            <FormattedMessage id="project.images.UpdateImage.deleteTag.title" />
                                        </DialogTitle>
                                        <DialogActions>
                                            <Button
                                                variant="contained"
                                                sx={{ mt: 1, mb: 1 }}
                                                onClick={handleDeleteExistentTag}>
                                                <Typography>
                                                    <FormattedMessage id="project.global.buttons.DeleteTag"></FormattedMessage>
                                                </Typography>
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="alertRed"
                                                onClick={handleCloseDeleteTagDialog}
                                                sx={{ mt: 1, mb: 1 }}>
                                                <Typography>
                                                    <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                                </Typography>
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </Box>
                            </Grid>
                            <Dialog
                                fullScreen={fullScreen}
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="responsive-dialog-title">
                                <DialogContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                value={tagName}
                                                onChange={(e) => setTagName(e.target.value)}
                                                name="tagName"
                                                required
                                                fullWidth
                                                id="tagName"
                                                label={<FormattedMessage id="project.images.fields.tagName" />}
                                                error={requiredAlertMessages.tagName}
                                                helperText={requiredAlertMessages.tagName &&
                                                    <FormattedMessage id="project.global.validator.required" />}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                value={link}
                                                onChange={(e) => setLink(e.target.value)}
                                                name="link"
                                                required
                                                fullWidth
                                                id="link"
                                                label={<FormattedMessage id="project.images.fields.tagLink" />}
                                                error={requiredAlertMessages.link || incorrectLink}
                                                helperText={requiredAlertMessages.link ? <FormattedMessage id="project.global.validator.required" />
                                                    :
                                                    incorrectLink && <FormattedMessage id="project.global.validator.incorrectLink" />}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth error={requiredAlertMessages.categoryId}>
                                                <InputLabel id="demo-simple-select-helper-label">
                                                    <FormattedMessage id="project.images.fields.category" />
                                                </InputLabel>
                                                <Select
                                                    value={categoryId}
                                                    fullWidth
                                                    label={<FormattedMessage id="project.images.fields.category" />}
                                                    onChange={(e) => setCategoryId(e.target.value)}>
                                                    <MenuItem value={-1}>
                                                        <Typography>
                                                            <FormattedMessage id="project.images.TagImage.selectCategory" />
                                                        </Typography>
                                                    </MenuItem>
                                                    {categories.map(category =>
                                                            <MenuItem value={category.id}>
                                                                <Typography>
                                                                    {category.name}
                                                                </Typography>
                                                            </MenuItem>
                                                    )}
                                                </Select>
                                                <FormHelperText color="alertRed">
                                                    {requiredAlertMessages.categoryId &&
                                                        <FormattedMessage id="project.global.validator.required" />}
                                                </FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}>
                                                <TextField
                                                    value={brand ? brand.name : " "}
                                                    name="brandId"
                                                    id="brandId"
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    fullWidth
                                                    endAdornment={
                                                        <InputAdornment position="start">
                                                            <AccountCircle />
                                                        </InputAdornment>
                                                    }
                                                    label={<FormattedMessage id="project.images.fields.brandId" />}
                                                />
                                                <IconButton
                                                    aria-label="remove"
                                                    color="alertRed"
                                                    variant="contained"
                                                    disabled={!brand}
                                                    onClick={e => handleClickRemoveBrand(e)}
                                                    sx={{ mt: 1, mb: 1, ml: 1.5, alignSelf: "flex-end"}}>
                                                    <HighlightOffOutlined />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <SearchBrands />
                                        </Grid>
                                    </Grid>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        variant="contained"
                                        onClick={handleAddTag}
                                        sx={{ mt: 1, mb: 1 }}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.TagImage"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="alertRed"
                                        onClick={handleClose}
                                        sx={{ mt: 1, mb: 1 }}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 4,
                            ml: "auto",
                            mr: "auto",
                            mt: "auto",
                        }}>
                        <Button
                            onClick={handleConfirmTags}
                            variant="contained"
                            sx={{ mt: 1, mb: 1 }}>
                            <Typography>
                                <FormattedMessage id="project.global.buttons.ConfirmTags"></FormattedMessage>
                            </Typography>
                        </Button>
                        {editing &&
                            <Button
                                onClick={handleCancelEditing}
                                color="secondary"
                                variant="contained"
                                sx={{ mt: 1, mb: 1, ml: 0.5 }}>
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.Back"></FormattedMessage>
                                </Typography>
                            </Button>
                        }
                    </Box>
                </Paper>
            </Box>
        </Container>
    )

}

export default TagImage;