import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {useNavigate} from 'react-router-dom';

import {Errors} from '../../common';
import * as actions from '../actions';
import * as selectors from '../selectors';
import {
    Box,
    Container,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Select,
    Typography
} from '@mui/material';
import { AddCircleOutlined } from '@mui/icons-material';
import Categories from "./Categories";
import useMediaQuery from "@mui/material/useMediaQuery";

const ViewCategories = () => {

    const categories = useSelector(selectors.getCategories);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [active, setActive] = useState("noFilter");
    const [backendErrors, setBackendErrors] = useState(null);
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    let form;

    const handleCreateCategory = event => {
        event.preventDefault();

        navigate('/admin/categories/create');
    }

    useEffect(() => {

        if (active === "noFilter") {
            dispatch(actions.findAllCategories());
        } else {
            dispatch(actions.findCategories(active));
        }

    }, [dispatch, active]);

    if (!categories) {
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
                    gap: 4,
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
                        <Typography variant="h2" sx={{ mt: 0.5, mb: 0.5, fontWeight: 'bold' }}>
                            <FormattedMessage id="project.admin.ViewCategories.title"></FormattedMessage>
                        </Typography>
                    </Box>
                    <Box
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
                                <Box
                                    sx={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                    <IconButton
                                        aria-label="create"
                                        color="primary"
                                        variant="contained"
                                        onClick={e => handleCreateCategory(e)}>
                                        <AddCircleOutlined />
                                    </IconButton>
                                    <Typography
                                        variant="h21"
                                        onClick={handleCreateCategory}
                                        sx={{
                                            textAlign: 'start',
                                            fontWeight: 'bold',
                                            mr: 0.5,
                                            transition: 'color 0.3s ease',
                                            '&:hover': {
                                                color: 'primary.main',
                                                cursor: 'pointer',
                                            },
                                        }}>
                                        <FormattedMessage id="project.admin.ViewCategories.createCategory" />
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                    <Select
                                        size="small"
                                        value={active}
                                        sx={{ width: "70%" }}
                                        onChange={(e) => setActive(e.target.value)}>
                                        <MenuItem value="noFilter">
                                            <Typography>
                                                <FormattedMessage id="project.admin.ViewCategories.fields.active.noFilter" />
                                            </Typography>
                                        </MenuItem>
                                        <MenuItem value="true">
                                            <Typography>
                                                <FormattedMessage id="project.admin.ViewCategories.fields.active.true" />
                                            </Typography>
                                        </MenuItem>
                                        <MenuItem value="false">
                                            <Typography>
                                                <FormattedMessage id="project.admin.ViewCategories.fields.active.false" />
                                            </Typography>
                                        </MenuItem>
                                    </Select>
                                </Box>
                                <Categories categories={categories} active={active} />
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )


}

export default ViewCategories;