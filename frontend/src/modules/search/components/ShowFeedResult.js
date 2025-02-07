import {useSelector, useDispatch} from 'react-redux';

import * as selectors from '../selectors';
import * as actions from '../actions';

import {FormattedMessage} from "react-intl";

import {Alert, Box, Button, ButtonGroup, CircularProgress} from "@mui/material";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import FeedImages from "./FeedImages";

const ShowFeedResult = () => {

    const dispatch = useDispatch();
    const feed = useSelector(selectors.getFeed);

    if (!feed) {
        return feedFeedback();
    }

    if (feed.result.items.length === 0) {
        return (
            <Alert sx={{ ml: 2, mr: 2, mb: 2, mt: 1 }} variant="outlined" severity="warning">
                <FormattedMessage id="project.search.ShowFeedResult.noResults" />
            </Alert>
        );
    }

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '95%',
            }}>
            <FeedImages images={feed.result.items}/>
            {(feed.result.existMoreItems || feed.criteria.page > 0) &&
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
                            disabled={feed.criteria.page < 1}
                            onClick={() => dispatch(actions.previousGetFeedResultPage(feed.criteria))}>
                            <ArrowCircleLeftIcon />
                        </Button>
                        <Button
                            disabled={!feed.result.existMoreItems}
                            onClick={() => dispatch(actions.nextGetFeedResultPage(feed.criteria))}>
                            <ArrowCircleRightIcon />
                        </Button>
                    </ButtonGroup>
                </Box>
            }
        </Box>
    )

}

export const feedFeedback = () => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: '100vh'
        }}>
        <CircularProgress />
    </Box>
)

export default ShowFeedResult;