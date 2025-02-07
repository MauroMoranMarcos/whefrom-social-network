import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from "react-router-dom";
import {FormattedMessage, injectIntl} from 'react-intl';

import * as actions from '../actions';
import admin from '../../admin';

import {
    BottomNavigation, BottomNavigationAction,
    Box,
    Container, Grid,
    Input, MenuItem,
    Paper, Select,
    Typography, useTheme
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined';

import SearchUsersResult from "./SearchUsersResult";
import SearchImagesResult from "./SearchImagesResult";
import useMediaQuery from "@mui/material/useMediaQuery";
import search from "../index";


const Search = ({ intl }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const categories = useSelector(admin.selectors.getCategories);
    const [keywords, setKeywords] = useState('');
    const [categoryId, setCategoryId] = useState(0);
    // 0: User search, 1: Image search, 2: Brand search
    const [searchType, setSearchType] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    useEffect(() => {

        if (searchType === 0) {

            if (keywords === '') {
                dispatch(actions.searchUsers(
                    {keywords: " ", page: 0}
                ));
            } else {
                dispatch(actions.searchUsers(
                    {keywords: keywords.trim(), page: 0}
                ));
            }
        }

        if (searchType === 1) {

            if (keywords === '') {
                dispatch(actions.searchImages(
                    {categoryId: categoryId, keywords: " ", page: 0}
                ));
            } else {
                dispatch(actions.searchImages(
                    {categoryId: categoryId, keywords: keywords.trim(), page: 0}
                ));
            }
        }

        if (searchType === 2) {

            if (keywords === '') {
                dispatch(search.actions.searchUsers(
                    {keywords: " ", onlyBrands: true, page: 0}
                ));
            } else {
                dispatch(search.actions.searchUsers(
                    {keywords: keywords.trim(), onlyBrands: true, page: 0}
                ));
            }

        }

    }, [keywords, searchType, categoryId]);

    const handleImagesClick = event => {
        event.preventDefault();

        dispatch(admin.actions.findCategories(true));
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
                                mb: 1,
                                borderBottom: `1px solid ${theme.palette.primary.main}`,
                            }}>
                            <Typography variant="h2" sx={{ textAlign: 'center', mt: 1, mb: 1, ml: 0.5, mr: 0.5, fontWeight: 'bold' }}>
                                <FormattedMessage id="project.search.Search.title"></FormattedMessage>
                            </Typography>
                        </Box>
                    }
                    <Box
                         sx={{
                             display: "flex",
                             alignItems: "center",
                             justifyContent: "space-between",
                             mt: isMobile ? 1 : undefined,
                             ml: 0.5,
                             mr: 0.5,
                             mb: 1,
                             border: '2px solid #ccc',
                             borderRadius: '6px',
                         }}>
                        <Input
                            sx={{ ml: 1, mr: 1 }}
                            placeholder={intl.formatMessage({ id: 'project.search.Search.placeHolder' })}
                            onChange={(e) => setKeywords(e.target.value)}
                            color="secondary"
                            disableUnderline
                            fullWidth></Input>
                        <SearchIcon color="primary" sx={{ mr: 1 }}/>
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
                        <BottomNavigation
                            showLabels
                            value={searchType}
                            onChange={(e, newSearchType) => {
                                setSearchType(newSearchType);
                            }}
                        >
                            <BottomNavigationAction label={<FormattedMessage id="project.search.Search.searchUsers" />}
                                                    icon={<GroupIcon />}/>
                            <BottomNavigationAction label={<FormattedMessage id="project.search.Search.searchImages" />}
                                                    icon={<ImageSearchIcon />}
                                                    onClick={(e) => handleImagesClick(e)}/>
                            <BottomNavigationAction label={<FormattedMessage id="project.search.Search.searchBrands" />}
                                                    icon={<CorporateFareOutlinedIcon />} />
                        </BottomNavigation>
                    </Box>
                    {(searchType === 0 || searchType === 2) &&
                        <SearchUsersResult />
                    }
                    {searchType === 1 &&
                        <Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12}
                                      sx={{
                                          ml: 1,
                                          mr: 1,
                                      }}>
                                    <Select
                                        sx={{ mb: 1.5 }}
                                        size="small"
                                        fullWidth
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}>
                                        <MenuItem value={0}>
                                            <Typography>
                                                <FormattedMessage id="project.search.SearchImages.fields.allCategories" />
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
                                    <SearchImagesResult />
                                </Grid>
                            </Grid>
                        </Box>
                    }
                </Paper>
            </Box>
        </Container>
    )

}

export default injectIntl(Search);