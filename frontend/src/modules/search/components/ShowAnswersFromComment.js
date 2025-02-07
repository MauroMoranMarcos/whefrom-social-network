import {useDispatch, useSelector} from "react-redux";

import Comments from "./Comments";

import * as selectors from "../selectors";

import {FormattedMessage} from "react-intl";

import * as actions from "../actions";

import {Alert, Box, Button, ButtonGroup} from "@mui/material";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import {commentsFeedBack} from "./ShowCommentsFromImage";

const ShowAnswersFromComment = () => {

    const dispatch = useDispatch();
    const commentAnswers = useSelector(selectors.getAnswersFromComment);

    if (!commentAnswers) {
        return commentsFeedBack();
    }

    if (commentAnswers.result.items.length === 0) {
        return (
            <Alert sx={{ ml: 1, mr: 1, mb: 1 }} variant="outlined" severity="warning">
                <FormattedMessage id="project.search.ShowCommentsFromImage.noAnswers" />
            </Alert>
        );
    }

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 360,
            }}>
            <Comments comments={commentAnswers.result.items} showAnswers={true} />
            {(commentAnswers.result.existMoreItems || commentAnswers.criteria.page > 0) &&
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <ButtonGroup color="primary" size="small" variant="contained" aria-label="Basic button group">
                        <Button
                            disabled={commentAnswers.criteria.page < 1}
                            onClick={() => dispatch(actions.previousFindAnswersFromCommentResultPage(commentAnswers.criteria))}>
                            <ArrowCircleLeftIcon />
                        </Button>
                        <Button
                            disabled={!commentAnswers.result.existMoreItems}
                            onClick={() => dispatch(actions.nextFindAnswersFromCommentResultPage(commentAnswers.criteria))}>
                            <ArrowCircleRightIcon />
                        </Button>
                    </ButtonGroup>
                </Box>
            }
        </Box>
    )

}

export default ShowAnswersFromComment;