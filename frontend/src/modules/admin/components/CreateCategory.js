import {useState} from 'react';
import { useDispatch} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {useNavigate} from 'react-router-dom';

import {Errors} from '../../common';
import * as actions from '../actions';
import {Box, Button, Container, Grid, MenuItem, Paper, Select, TextField, Typography} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

const CreateCategory = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [categoryName, setCategoryName] = useState("");
    const [active, setActive] = useState(true);
    const [backendErrors, setBackendErrors] = useState(null);
    const [requiredAlertMessages, setRequiredAlertMessages] = useState({
        categoryName: false,
    });
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    let form;

    const handleSubmit = event => {

        event.preventDefault();

        handleValidation();

        if (form.checkValidity()) {

            dispatch(actions.createCategory(
                categoryName, active,
                () => {
                    dispatch(actions.findAllCategories());
                    navigate('/admin/categories');
                },
                errors => setBackendErrors(errors)));

        } else {

            setBackendErrors(null);
            form.classList.add('was-validated');

        }

    }

    const handleValidation = () => {
        const newRequiredAlerts = {
            categoryName: categoryName === '',
        };
        setRequiredAlertMessages(newRequiredAlerts);
    };

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
                        <Typography variant="h2" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>
                            <FormattedMessage id="project.admin.CreateCategory.title"></FormattedMessage>
                        </Typography>
                    </Box>
                    <Box component="form" ref={node => form = node} noValidate onSubmit={handleSubmit}
                         sx={{
                             display: "flex",
                             alignItems: "center",
                             justifyContent: "center",
                             mt: 1,
                             ml: 2,
                             mr: 2,
                             mb: 1,
                         }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    name="categoryName"
                                    required
                                    fullWidth
                                    id="categoryName"
                                    label={<FormattedMessage id="project.global.fields.categoryName" />}
                                    autoFocus
                                    error={requiredAlertMessages.categoryName}
                                    helperText={requiredAlertMessages.categoryName &&
                                        <FormattedMessage id="project.global.validator.required" />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mt: 1,
                                        mb: 1,
                                    }}>
                                    <Typography variant="h3">
                                        <FormattedMessage id="project.admin.CreateCategory.fields.active" />
                                    </Typography>
                                </Box>
                                <Select
                                    value={active}
                                    fullWidth
                                    onChange={(e) => setActive(e.target.value)}>
                                    <MenuItem value="true">
                                        <Typography>
                                            <FormattedMessage id="project.admin.CreateCategory.fields.active.true" />
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem value="false">
                                        <Typography>
                                            <FormattedMessage id="project.admin.CreateCategory.fields.active.false" />
                                        </Typography>
                                    </MenuItem>
                                </Select>
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
                                        type="submit"
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}>
                                        <Typography>
                                            <FormattedMessage id="project.global.buttons.CreateCategory"></FormattedMessage>
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

export default CreateCategory;