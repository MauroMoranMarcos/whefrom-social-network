import {useSelector, useDispatch} from 'react-redux';

import * as selectors from '../selectors';
import * as actions from '../actions';
import {Alert, Box, Button, ButtonGroup, IconButton, Skeleton} from "@mui/material";
import Users from "./Users";
import {useState} from "react";
import {FormattedMessage} from "react-intl";

import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

const SearchUsersResult = ({ onlyBrands }) => {

    const userSearch = useSelector(selectors.getUserSearch);
    const dispatch = useDispatch();

    if (!userSearch) {
        return userListFeedback();
    }

    if (userSearch.result.items.length === 0) {
        return (
            <Alert sx={{ ml: 2, mr: 2, mb: 2 }} variant="outlined" severity="warning">
                <FormattedMessage id="project.search.SearchUsersResult.noResults" />
            </Alert>
        );
    }

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '95%',
                ml: 1,
                mr: 1,
                mb: 1,
            }}>
            <Users users={userSearch.result.items} onlyBrands={onlyBrands}/>
            {(userSearch.result.existMoreItems || userSearch.criteria.page > 0) &&
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 1,
                        mb: 1,
                    }}>
                    <ButtonGroup color="primary" size="small" variant="contained" aria-label="Basic button group">
                        <Button
                            disabled={userSearch.criteria.page < 1}
                            onClick={() => dispatch(actions.previousSearchUsersResultPage(userSearch.criteria))}>
                            <ArrowCircleLeftIcon />
                        </Button>
                        <Button
                            disabled={!userSearch.result.existMoreItems}
                            onClick={() => dispatch(actions.nextSearchUsersResultPage(userSearch.criteria))}>
                            <ArrowCircleRightIcon />
                        </Button>
                    </ButtonGroup>
                </Box>
            }
        </Box>
    )

}

export const userListFeedback = () => (
    <>
        {Array.from({ length: 10 }).map((_, index) => (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                    width: '100%',
                    maxWidth: '95%',
                    mt: 3.8,
                    ml: 2.5,
                    mr: 1,
                    mb: 1,
                }}>
                <Skeleton
                    sx={{ ml: 0.5, mb: 0.5 }}
                    variant="circular"
                    width={40}
                    height={40}
                    animation="wave" />
                <Box
                    sx={{
                        width: '90%',
                    }}>
                    <Skeleton
                        sx={{ ml: 0.5, mr: 0.5, mb: 0.5 }}
                        animation="wave"
                        height={20}
                        width="40%"
                    />
                    <Skeleton
                        sx={{ ml: 0.5, mr: 0.5, mb: 0.5 }}
                        animation="wave"
                        height={10}
                        width="60%"
                    />
                </Box>
            </Box>
        ))
        }
    </>
)

export default SearchUsersResult;