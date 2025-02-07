import {useSelector, useDispatch} from 'react-redux';

import * as selectors from '../selectors';
import * as actions from '../actions';
import {Alert, Box, Button, ButtonGroup, IconButton, Skeleton} from "@mui/material";
import {FormattedMessage} from "react-intl";
import Images from "./Images";

import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import useMediaQuery from "@mui/material/useMediaQuery";
import {useIsMobile} from "./ShowImagesLikedByUser";

const SearchImagesResult = () => {

    const imageSearch = useSelector(selectors.getImageSearch);
    const dispatch = useDispatch();
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    if (!imageSearch) {
        return imageListFeedback(isMobile);
    }

    if (imageSearch.result.items.length === 0) {
        return (
            <Alert sx={{ ml: 1, mr: 1, mb: 1, mt: 1 }} variant="outlined" severity="warning">
                <FormattedMessage id="project.search.SearchImagesResult.noResults" />
            </Alert>
        );
    }

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: isMobile ? '95%' : '97%',
                ml: 1,
                mr: 1,
                mb: 1,
            }}>
            <Images images={imageSearch.result.items}/>
            {(imageSearch.result.existMoreItems || imageSearch.criteria.page > 0) &&
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
                            disabled={imageSearch.criteria.page < 1}
                            onClick={() => dispatch(actions.previousSearchImagesResultPage(imageSearch.criteria))}>
                            <ArrowCircleLeftIcon />
                        </Button>
                        <Button
                            disabled={!imageSearch.result.existMoreItems}
                            onClick={() => dispatch(actions.nextSearchImagesResultPage(imageSearch.criteria))}>
                            <ArrowCircleRightIcon />
                        </Button>
                    </ButtonGroup>
                </Box>
            }
        </Box>
    )

}

export const imageListFeedback = (isMobile) => (
    <Box
        sx={{
            width: '100%',
            maxWidth: isMobile ? '95%' : '97%',
            ml: 1,
            mr: 1,
            mb: 1,
        }}>
        {Array.from({ length: 4 }).map((_, index) => (
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <Skeleton sx={{ m: 0.5 }} width="100%" height={isMobile ? 90 : 200} animation="wave" variant="rectangular" />
                <Skeleton sx={{ m: 0.5 }} width="100%" height={isMobile ? 90 : 200} animation="wave" variant="rectangular" />
                <Skeleton sx={{ m: 0.5 }} width="100%" height={isMobile ? 90 : 200} animation="wave" variant="rectangular" />
            </Box>
        ))
        }
    </Box>
)

export default SearchImagesResult;