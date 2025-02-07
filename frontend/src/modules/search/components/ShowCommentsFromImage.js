import {useDispatch, useSelector} from "react-redux";

import Comments from "./Comments";

import * as selectors from "../selectors";

import {FormattedMessage} from "react-intl";

import * as actions from "../actions";

import {Alert, Box, Button, ButtonGroup, Skeleton} from "@mui/material";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

const ShowCommentsFromImage = ({ openCommentsDialog, setOpenCommentsDialog, numComments }) => {

    const dispatch = useDispatch();
    const imageComments = useSelector(selectors.getCommentsFromImage);

    if (!imageComments) {
        return commentsFeedBack(numComments);
    }

    if (imageComments.result.items.length === 0) {
        return (
            <Alert sx={{ ml: 0.5, mr: 0.5 }} variant="outlined" severity="warning">
                <FormattedMessage id="project.search.ShowCommentsFromImage.noComments" />
            </Alert>
        );
    }

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 360,
            }}>
            <Comments comments={imageComments.result.items}
                      openCommentsDialog={openCommentsDialog}
                      setOpenCommentsDialog={setOpenCommentsDialog} />
            {(imageComments.result.existMoreItems || imageComments.criteria.page > 0) &&
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <ButtonGroup color="primary" size="small" variant="contained" aria-label="Basic button group">
                        <Button
                            disabled={imageComments.criteria.page < 1}
                            onClick={() => dispatch(actions.previousFindCommentsFromImageResultPage(imageComments.criteria))}>
                            <ArrowCircleLeftIcon />
                        </Button>
                        <Button
                            disabled={!imageComments.result.existMoreItems}
                            onClick={() => dispatch(actions.nextFindCommentsFromImageResultPage(imageComments.criteria))}>
                            <ArrowCircleRightIcon />
                        </Button>
                    </ButtonGroup>
                </Box>
            }
        </Box>
    )

}

export const commentsFeedBack = (numComments) => (
    <Box
        sx={{
            alignItems: "center",
            justifyContent: "center",
            width: '100%',
            maxWidth: 360,
        }}>
        {Array.from({ length: numComments !== undefined ? numComments : 10 }).map((_, index) => (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                    mb: 1.5,
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
                    <Box
                        sx={{
                            width: '90%',
                            display: 'flex',
                            flexDirection: 'row',
                        }}>
                        <Skeleton
                            sx={{ ml: 0.5, mr: 0.5 }}
                            animation="wave"
                            height={20}
                            width="30%"
                        />
                        <Skeleton
                            sx={{ ml: 0.5, mr: 0.5 }}
                            animation="wave"
                            height={20}
                            width="60%"
                        />
                    </Box>
                    <Skeleton
                        sx={{ ml: 0.5, mr: 0.5 }}
                        animation="wave"
                        height={12}
                        width="30%"
                    />
                    <Skeleton
                        sx={{ ml: 0.5, mr: 0.5 }}
                        animation="wave"
                        height={12}
                        width="15%"
                    />
                </Box>
            </Box>
        ))
        }
    </Box>
)

export default ShowCommentsFromImage;