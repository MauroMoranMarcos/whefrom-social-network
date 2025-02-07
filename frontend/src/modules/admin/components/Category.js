import {
    Box, Button, Dialog, DialogActions, DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    ListItem,
    ListItemText,
    TextField,
    Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import {RemoveCircle} from "@mui/icons-material";
import {ModeEditOutlined} from "@mui/icons-material";
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import PropTypes from "prop-types";
import {FormattedMessage} from "react-intl";

import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import * as actions from "../actions";
import {useDispatch} from "react-redux";
import Categories from "./Categories";
import useMediaQuery from "@mui/material/useMediaQuery";

const Category = ({category, active}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [categoryName, setCategoryName] = useState(null);
    const [numTimesUsed, setNumTimesUsed] = useState(null);
    const [editing, setEditing] = useState(false);
    const [backendErrors, setBackendErrors] = useState(null);
    const [openDeactivateCategoryDialog, setOpenDeactivateCategoryDialog] = useState(false);
    const [openActivateCategoryDialog, setOpenActivateCategoryDialog] = useState(false);
    const [requiredAlertMessages, setRequiredAlertMessages] = useState({
        categoryName: false,
    });
    const [loaded, setLoaded] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {

        setCategoryName(category.name);

        dispatch(actions.getCategoryNumTimesUsed(category.id,
            numTimesUsed => setNumTimesUsed(numTimesUsed)));

    }, [category.id, dispatch]);

    const handleConfirmEdit = event => {

        event.preventDefault();

        handleValidation();

        dispatch(actions.editCategory(
            category.id,
            categoryName,
            category.active,
            () => {
                    dispatch(actions.findAllCategories());
                    setEditing(false);
                },
            errors => setBackendErrors(errors)));

    }

    const handleDeactivateCategory = (event) => {

        event.preventDefault();

        dispatch(actions.editCategory(
            category.id,
            categoryName,
            false,
            () => {
                dispatch(active === "noFilter" ? actions.findAllCategories() : actions.findCategories(active));
                handleCloseDeactivateCategoryDialog();
            },
            errors => setBackendErrors(errors)));

    }

    const handleActivateCategory = (event) => {

        event.preventDefault();

        dispatch(actions.editCategory(
            category.id,
            categoryName,
            true,
            () => {
                dispatch(active === "noFilter" ? actions.findAllCategories() : actions.findCategories(active));
                handleCloseActivateCategoryDialog();
            },
            errors => setBackendErrors(errors)));

    }

    const handleEditCategoryName = () => {

        setEditing(true);

    }

    const handleValidation = () => {
        const newRequiredAlerts = {
            categoryName: categoryName === '',
        };
        setRequiredAlertMessages(newRequiredAlerts);
    };

    const handleOpenDeactivateCategoryDialog = () => {

        setOpenDeactivateCategoryDialog(true);

    }

    const handleCloseDeactivateCategoryDialog = () => {

        setOpenDeactivateCategoryDialog(false);

    }

    const handleOpenActivateCategoryDialog = () => {

        setOpenActivateCategoryDialog(true);

    }

    const handleCloseActivateCategoryDialog = () => {

        setOpenActivateCategoryDialog(false);

    }

    if (numTimesUsed === undefined || categoryName === undefined) {
        return null;
    }

    return (
        <ListItem>
            <Box
                 sx={{
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     width: "100%",
                     p: 1,
                     borderTop: `1px solid ${category.active ? theme.palette.primary.main : theme.palette.alertRed.main}`,
                     borderBottom: `1px solid ${category.active ? theme.palette.primary.main : theme.palette.alertRed.main}`,
                     borderLeft: `1px solid ${category.active ? theme.palette.primary.main : theme.palette.alertRed.main}`,
                     borderRight: `1px solid ${category.active ? theme.palette.primary.main : theme.palette.alertRed.main}`,
                     borderRadius: '4px'
                 }}>
                <Grid container spacing={1.5}>
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                            <TextField
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                onClick={handleEditCategoryName}
                                name="categoryName"
                                required
                                fullWidth
                                id="categoryName"
                                size="small"
                                error={requiredAlertMessages.categoryName}
                                helperText={requiredAlertMessages.categoryName &&
                                    <FormattedMessage id="project.global.validator.required" />}
                            />
                            {editing &&
                                <IconButton edge="end" aria-label="delete"
                                            color="greenCheck" onClick={e => handleConfirmEdit(e)}
                                            sx={{ alignSelf: "end", mt: 1, mb: 1, ml: 0.5, mr: 0.5 }}>
                                    <CheckOutlinedIcon />
                                </IconButton>
                            }
                            {category.active &&
                                <Tooltip title={<FormattedMessage id="project.admin.Category.activeCategory.explanatoryText" />}>
                                    <IconButton edge="end" aria-label="delete"
                                                color="primary" onClick={e => handleOpenDeactivateCategoryDialog(e)}
                                                sx={{ alignSelf: "end", mt: 1, mb: 1, ml: 0.5, mr: 0.5 }}>
                                        <ToggleOnOutlinedIcon />
                                    </IconButton>
                                </Tooltip>
                            }
                            {!category.active &&
                                <Tooltip title={<FormattedMessage id="project.admin.Category.notActiveCategory.explanatoryText" />}>
                                    <IconButton edge="end" aria-label="delete"
                                                color="alertRed" onClick={e => handleOpenActivateCategoryDialog(e)}
                                                sx={{ alignSelf: "end", mt: 1, mb: 1, ml: 0.5, mr: 0.5 }}>
                                        <ToggleOffOutlinedIcon />
                                    </IconButton>
                                </Tooltip>
                            }
                            <Dialog
                                fullScreen={fullScreen}
                                open={openDeactivateCategoryDialog}
                                onClose={handleCloseDeactivateCategoryDialog}
                                aria-labelledby="responsive-dialog-title"
                            >
                                <DialogTitle id="responsive-dialog-title">
                                    <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                        <FormattedMessage id="project.admin.Category.deactivateCategory.title" />
                                    </Typography>
                                </DialogTitle>
                                <DialogContent>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        variant="contained"
                                        sx={{ mt: 1, mb: 1 }}
                                        onClick={handleDeactivateCategory}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.DeactivateCategory"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="alertRed"
                                        onClick={handleCloseDeactivateCategoryDialog}
                                        sx={{ mt: 1, mb: 1 }}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.Cancel"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <Dialog
                                fullScreen={fullScreen}
                                open={openActivateCategoryDialog}
                                onClose={handleCloseActivateCategoryDialog}
                                aria-labelledby="responsive-dialog-title"
                            >
                                <DialogTitle id="responsive-dialog-title">
                                    <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                                        <FormattedMessage id="project.admin.Category.ActivateCategory.title" />
                                    </Typography>
                                </DialogTitle>
                                <DialogContent>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        variant="contained"
                                        sx={{ mt: 1, mb: 1 }}
                                        onClick={handleActivateCategory}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.ActivateCategory"></FormattedMessage>
                                        </Typography>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="alertRed"
                                        onClick={handleCloseActivateCategoryDialog}
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
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="h3">
                                <FormattedMessage id="project.admin.Categories.numTimesUsedStart" />
                            </Typography>
                            <Typography variant="h3" sx={{ ml: 0.25 }}>
                                {numTimesUsed}
                            </Typography>
                            <Typography variant="h3" sx={{ ml: 0.25 }}>
                                <FormattedMessage id="project.admin.Categories.numTimesUsedEnd" />
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </ListItem>
    )

}

Category.propTypes = {
    category: PropTypes.array.isRequired
};

export default Category;
