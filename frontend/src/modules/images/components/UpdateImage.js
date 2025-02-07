import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useLocation} from "react-router-dom";
import {useState, useEffect} from "react";

import users from "../../users";
import admin from "../../admin";
import search from "../../search";

import * as actions from "../actions";

import {
    Box,
    Button,
    Chip,
    Container,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    Grid,
    IconButton, Link,
    Paper, Stack, TextField, Typography, useTheme
} from "@mui/material";
import {Errors} from "../../common";
import {FormattedMessage} from "react-intl";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AbcOutlinedIcon from "@mui/icons-material/AbcOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import useMediaQuery from "@mui/material/useMediaQuery";

const UpdateImage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const userLogged = useSelector(users.selectors.getUser);
    const image = location.state.image;
    const tags = useSelector(search.selectors.getTags);
    const categoryName = useSelector(admin.selectors.getCategory);
    const [title, setTitle] = useState(image.title);
    const [description, setDescription] = useState(image.description);
    const [locationParam, setLocationParam] = useState(image.location);
    const [imgFile, setImgFile] = useState(image.imgFile);
    const [showTag, setShowTag] = useState(false);
    const [detailedTag, setDetailedTag] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteTagDialog, setOpenDeleteTagDialog] = useState(false);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [locale, setLocale] = useState(navigator.language || navigator.languages[0]);
    const [backendErrors, setBackendErrors] = useState(null);
    const [requiredAlertMessageTitle, setRequiredAlertMessageTitle] = useState({
        title: false,
    });
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    let form;

    useEffect(() => {

        if (image && image.id) {
            dispatch(search.actions.findImageTags(image.id, userLogged.id));
        }

    }, [image, dispatch]);

    const handleSubmit = event => {

        event.preventDefault();

        handleValidationTitle();

        if (form.checkValidity()) {

            dispatch(actions.updateImage(
                title.trim(),
                description.trim(),
                locationParam.trim(),
                image.id,
                () => navigate(`/search/imagedetails/${image.id}`),
                errors => setBackendErrors(errors)));

        } else {

            setBackendErrors(null);
            form.classList.add('was-validated');

        }

    }

    const handleValidationTitle = () => {
        const newRequiredAlerts = {
            title: title === '',
        };
        setRequiredAlertMessageTitle(newRequiredAlerts);
    };

    const handleImageLoad = (event) => {

        const img = event.target;
        setImageSize({ width: img.width, height: img.height });

    };

    const handleOnTagClick = () => {

        if (showTag) {
            setShowTag(false);
        } else {
            setShowTag(true);
        }

    }

    const handleClickOpenDialog = (tag) => {

        setDetailedTag(tag);
        dispatch(admin.actions.findCategoryById(tag.categoryId));
        setOpenDialog(true);

    };

    const handleCloseDialog = () => {

        setOpenDialog(false);

    };

    const handleOpenDeleteTagDialog = () => {

        setOpenDeleteTagDialog(true);

    }

    const handleCloseDeleteTagDialog = () => {

        setOpenDeleteTagDialog(false);

    }

    const handleDeleteTag = () => {

        dispatch(actions.deleteTagFromImage(detailedTag.id, image.id,
            () => {
                dispatch(search.actions.findImageTags(image.id, userLogged.id));
                handleCloseDialog();
            },
                errors => setBackendErrors(errors)));

    }

    const handleAddTags = () => {

        navigate('/images/tagging', { state: {imgFile: imgFile, editing: true, imageId: image.id} });

    }

    if (!image || !tags) {
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
                    {!isMobile &&
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderBottom: `1px solid ${theme.palette.primary.main}`,
                            }}>
                            <Typography variant="h2" sx={{ mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                <FormattedMessage id="project.images.UpdateImage.title"></FormattedMessage>
                            </Typography>
                        </Box>
                    }
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderBottom: `1px solid ${theme.palette.primary.main}`,
                        }}>
                        <img
                            src={`data:image/jpeg;base64,${image.imgFile}`}
                            style={{ maxWidth: '100%', maxHeight: 400 }}
                            onLoad={(e) => handleImageLoad(e)}>
                        </img>
                        {tags.map(tag => {

                                const adjustedX = tag.coordinateX;
                                const adjustedY = tag.coordinateY;

                                return(
                                    <div>
                                        {
                                            showTag ?
                                                <Chip
                                                    key={tag.id}
                                                    label={tag.name}
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => handleClickOpenDialog(tag)}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: `${adjustedY}px`,
                                                        left: `${adjustedX}px`,
                                                        zIndex: 1,
                                                        bgcolor: theme.palette.primary.main,
                                                    }}>
                                                </Chip>
                                                :
                                                <Fab
                                                    size="small"
                                                    color="primary"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: `${adjustedY}px`,
                                                        left: `${adjustedX}px`,
                                                        zIndex: 1,
                                                        bgcolor: 'transparent',
                                                        width: '24px',
                                                        height: '24px',
                                                        minWidth: '24px',
                                                        minHeight: '24px',
                                                        padding: '0',
                                                    }}></Fab>
                                        }
                                        <Dialog
                                            fullScreen={fullScreen}
                                            open={openDialog}
                                            onClose={handleCloseDialog}
                                            aria-labelledby="responsive-dialog-title"
                                        >
                                            <DialogTitle id="responsive-dialog-title">
                                                {<FormattedMessage id="project.search.TagDetails.title" />}
                                            </DialogTitle>
                                            <IconButton
                                                aria-label="close"
                                                onClick={handleCloseDialog}
                                                sx={{
                                                    position: 'absolute',
                                                    right: 8,
                                                    top: 8,
                                                }}
                                            >
                                                <CloseOutlinedIcon color="primary" />
                                            </IconButton>
                                            <DialogContent>
                                                {
                                                    detailedTag && categoryName &&
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12}>
                                                            <Box
                                                                sx={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                }}>
                                                                <Fab
                                                                    size="small"
                                                                    color="alertRed"
                                                                    onClick={() => handleOpenDeleteTagDialog()}
                                                                    sx={{ marginLeft: 1 }}>
                                                                    <DeleteOutlineOutlinedIcon />
                                                                </Fab>
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
                                                                            onClick={handleDeleteTag}>
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
                                                        <Grid item xs={12}>
                                                            <Box
                                                                sx={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                }}>
                                                                <AbcOutlinedIcon color="primary" fontSize="large" />
                                                                <TextField
                                                                    sx={{ ml: 1, mr: 1 }}
                                                                    fullWidth
                                                                    color="primary"
                                                                    size="small"
                                                                    id="filled-read-only-input"
                                                                    label={<FormattedMessage id="project.search.TagDetails.fields.name" />}
                                                                    defaultValue={detailedTag.name}
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                    }}
                                                                    variant="filled"
                                                                />
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Box
                                                                sx={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "start",
                                                                    mt: 1,
                                                                }}>
                                                                <StoreOutlinedIcon color="primary" fontSize="large" />
                                                                <Link sx={{ ml: 2, mr: 1 }} href={detailedTag.link} underline="hover" rel="noopener" target="_blank">
                                                                    {detailedTag.link}
                                                                </Link>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Box
                                                                sx={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    mt: 1,
                                                                }}>
                                                                <CategoryOutlinedIcon color="primary" fontSize="large" />
                                                                <TextField
                                                                    sx={{ ml: 1, mr: 1 }}
                                                                    fullWidth
                                                                    color="primary"
                                                                    size="small"
                                                                    id="filled-read-only-input"
                                                                    label={<FormattedMessage id="project.search.TagDetails.fields.category" />}
                                                                    defaultValue={categoryName.name}
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                    }}
                                                                    variant="filled"
                                                                />
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                }
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                )

                            }
                        )}
                        {tags.length > 0 &&
                            <Fab
                                size="small"
                                color="primary"
                                onClick={handleOnTagClick}
                                sx={{
                                    position: 'absolute',
                                    bottom: '10px',
                                    left: '10px',
                                    zIndex: 1,
                                    width: '28px',
                                    height: '28px',
                                    minWidth: '28px',
                                    minHeight: '28px',
                                    padding: '0',
                                }}>
                                <SellOutlinedIcon />
                            </Fab>
                        }
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            mb: 0.5,
                            overflowX: 'auto',
                            borderBottom: tags.length > 0 ? `1px solid ${theme.palette.primary.main}` : undefined,
                        }}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={{ xs: 1, sm: 2, md: 1 }}
                            sx={{ ml: 0.5, mr: 0.5, mt: 0.2, mb: 0.2 }}
                        >
                            {tags.map(tag =>
                                <Chip
                                    key={tag.id}
                                    label={tag.name}
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleClickOpenDialog(tag)}
                                    sx={{
                                        ml: 0.5,
                                        mb: 1,
                                        zIndex: 1,
                                        bgcolor: theme.palette.primary.main,
                                    }}>
                                </Chip>
                            )}
                        </Stack>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ml: "auto",
                            mr: "auto",
                            mb: 1,
                        }}>
                        <Button
                            onClick={handleAddTags}
                            variant="contained"
                            sx={{ mt: 0.5, mb: 0.5 }}>
                            <Typography>
                                <FormattedMessage id="project.global.buttons.ModifyTags"></FormattedMessage>
                            </Typography>
                        </Button>
                    </Box>
                    <Box component="form" ref={node => form = node} noValidate onSubmit={handleSubmit}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mt: 1,
                                mb: 1,
                                ml: 1,
                                mr: 1,
                            }}>
                            <TextField
                                sx={{ zIndex: 0 }}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                name="title"
                                size="small"
                                fullWidth
                                id="title"
                                label={<FormattedMessage id="project.images.fields.title" />}></TextField>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mt: 1,
                                mb: 1,
                                ml: 1,
                                mr: 1,
                            }}>
                            <TextField
                                sx={{ zIndex: 0 }}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                name="description"
                                size="small"
                                fullWidth
                                id="description"
                                label={<FormattedMessage id="project.images.fields.description" />}></TextField>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mt: 1,
                                mb: 1,
                                ml: 1,
                                mr: 1,
                            }}>
                            <TextField
                                sx={{ zIndex: 0 }}
                                value={locationParam}
                                onChange={(e) => setLocationParam(e.target.value)}
                                name="location"
                                size="small"
                                fullWidth
                                id="location"
                                label={<FormattedMessage id="project.images.fields.location" />}></TextField>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mt: isMobile ? 12 : 6,
                                ml: "auto",
                                mr: "auto",
                                mb: 4,
                            }}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 1, mb: 1 }}>
                                <Typography>
                                    <FormattedMessage id="project.global.buttons.UpdateImage"></FormattedMessage>
                                </Typography>
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )

}

export default UpdateImage;