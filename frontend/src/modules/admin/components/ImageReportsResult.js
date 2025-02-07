import {useDispatch, useSelector} from "react-redux";

import * as selectors from '../selectors';
import * as actions from '../actions';

import {FormattedMessage} from "react-intl";

import {Alert, Box, Button, ButtonGroup} from "@mui/material";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ImageReports from "./ImageReports";

const ImageReportsResult = () => {

    const imageReports = useSelector(selectors.getImageReports);
    const dispatch = useDispatch();

    if (!imageReports) {
        return null;
    }

    if (imageReports.result.items.length === 0) {
        return (
            <Alert sx={{ ml: 1, mr: 1, mb: 1 }} variant="outlined" severity="warning">
                <FormattedMessage id="project.admin.ImageReportsResult.noResults" />
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
            <ImageReports imageReports={imageReports.result.items}/>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 1,
                    mb: 1,
                }}>
                {(imageReports.result.existMoreItems || imageReports.criteria.page > 0) &&
                    <ButtonGroup color="primary" size="small" variant="contained" aria-label="Basic button group">
                        <Button
                            disabled={imageReports.criteria.page < 1}
                            onClick={() => dispatch(actions.previousFindImageReportsResultPage(imageReports.criteria))}>
                            <ArrowCircleLeftIcon />
                        </Button>
                        <Button
                            disabled={!imageReports.result.existMoreItems}
                            onClick={() => dispatch(actions.nextFindImageReportsResultPage(imageReports.criteria))}>
                            <ArrowCircleRightIcon />
                        </Button>
                    </ButtonGroup>
                }
            </Box>
        </Box>
    )

}

export default ImageReportsResult;