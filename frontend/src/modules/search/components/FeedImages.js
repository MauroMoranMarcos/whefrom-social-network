import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";

import {Box, Divider, Grid, ImageList, ImageListItem, Typography} from "@mui/material";
import {FormattedMessage} from "react-intl";
import FeedImage from "./FeedImage";

const FeedImages = ({ images }) => {

    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
        }}>
            {images.map(image => (
                <Grid container key={image.id} sx={{ mb: 1 }} wrap="nowrap" >
                    <Grid item xs={12}>
                        <FeedImage image={image} />
                    </Grid>
                </Grid>
            ))}
        </Box>

    );

}

FeedImages.propTypes = {
    images: PropTypes.array.isRequired,
};

export default FeedImages;