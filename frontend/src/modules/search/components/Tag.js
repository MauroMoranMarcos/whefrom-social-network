import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";

import * as selectors from '../selectors';
import * as actions from '../actions';

import admin from '../../admin';
import users from '../../users';

import {FormattedMessage} from "react-intl";

import {
    Box,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Link,
    TextField,
    useTheme
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AbcOutlinedIcon from "@mui/icons-material/AbcOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";

const Tag = ({tag}) => {

    const dispatch = useDispatch();
    const isLoggedIn = useSelector(users.selectors.isLoggedIn);
    const userLogged = useSelector(users.selectors.getUser);
    const isTagLikedByUser = useSelector(selectors.isTagLikedByUser);
    const numTagLikes = useSelector(selectors.getNumTagLikes);
    const usersThatLikedTag = useSelector(selectors.getUsersThatLikedTag);
    const [openDialog, setOpenDialog] = useState(false);
    const categoryName = useSelector(admin.selectors.getCategory);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [backendErrors, setBackendErrors] = useState(null);

    useEffect(() => {

        if (userLogged && userLogged.id && tag && tag.id) {
            dispatch(actions.isTagLikedByUser(tag.id, userLogged.id));
            dispatch(actions.getNumTagLikes(tag.id, userLogged.id));
            dispatch(actions.findUsersThatLikedTag({userLoggedId: userLogged.id, tagId: tag.id, dateDesc: true, page: 0}));
        }

    }, [isLoggedIn, userLogged, dispatch]);

    const handleClickOpenDialog = (tag) => {

        dispatch(admin.actions.findCategoryById(tag.categoryId));
        setOpenDialog(true);

    };

    const handleCloseDialog = () => {

        setOpenDialog(false);

    };

    const handleLikeTag = () => {

        dispatch(actions.likeTag(userLogged.id, tag.id,
            () => window.location.reload(),
            errors => setBackendErrors(errors)));

    }

    const handleDeleteTagLike = () => {

        dispatch(actions.deleteTagLike(userLogged.id, tag.id,
            () => window.location.reload(),
            errors => setBackendErrors(errors)));

    }

    if (!tag) {
        return null;
    }

    return (
        <Box>
            <Chip
                key={tag.id}
                label={tag.name}
                variant="outlined"
                size="small"
                onClick={() => handleClickOpenDialog(tag)}
                sx={{
                    zIndex: 1,
                    bgcolor: theme.palette.primary.main,
                    mb: 1,
                }}>
            </Chip>
            {isTagLikedByUser &&
                <Chip icon={<FavoriteIcon color="like" />} variant="outlined" label={numTagLikes}
                      onClick={handleDeleteTagLike}/>
            }
            {!isTagLikedByUser && isLoggedIn &&
                <Chip icon={<FavoriteIcon />} variant="outlined" label={numTagLikes}
                      onClick={handleLikeTag}/>
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
                        tag && categoryName &&
                        <Grid container spacing={2}>
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
                                        defaultValue={tag.name}
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
                                    <Link sx={{ ml: 2, mr: 1 }} href={tag.link} underline="hover" rel="noopener" target="_blank">
                                        {tag.link}
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
        </Box>

    )

}

export default Tag;