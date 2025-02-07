import {useDispatch, useSelector} from "react-redux";

import * as selectors from '../selectors';
import * as actions from '../actions';

import {FormattedMessage} from "react-intl";
import UserReports from "./UserReports";

import {Alert, Box, Button, ButtonGroup} from "@mui/material";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

const UserReportsResult = () => {

    const userReports = useSelector(selectors.getUserReports);
    const dispatch = useDispatch();

    if (!userReports) {
        return null;
    }

    if (userReports.result.items.length === 0) {
        return (
            <Alert sx={{ ml: 1, mr: 1, mb: 1 }} variant="outlined" severity="warning">
                <FormattedMessage id="project.admin.UserReportsResult.noResults" />
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
            <UserReports userReports={userReports.result.items}/>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 1,
                    mb: 1,
                }}>
                {(userReports.result.existMoreItems || userReports.criteria.page > 0) &&
                    <ButtonGroup color="primary" size="small" variant="contained" aria-label="Basic button group">
                        <Button
                            disabled={userReports.criteria.page < 1}
                            onClick={() => dispatch(actions.previousFindUserReportsResultPage(userReports.criteria))}>
                            <ArrowCircleLeftIcon />
                        </Button>
                        <Button
                            disabled={!userReports.result.existMoreItems}
                            onClick={() => dispatch(actions.nextFindUserReportsResultPage(userReports.criteria))}>
                            <ArrowCircleRightIcon />
                        </Button>
                    </ButtonGroup>
                }
            </Box>
        </Box>
    )

}

export default UserReportsResult;