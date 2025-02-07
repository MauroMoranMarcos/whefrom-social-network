import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";

import {Box, Chip, ImageList, ImageListItem, useTheme} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

const Tags = ({ tags }) => {

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    const handleTagClick = (imageId) => {

        navigate(`/search/imagedetails/${imageId}`);

    }

    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 1,
            mb: 1,
        }}>
            <ImageList sx={{ width: '100%' }} cols={isMobile ? 2 : 3} rowHeight={34}>
                {tags.map(tag => (
                    <ImageListItem key={tag.id}>
                        <Chip
                            key={tag.id}
                            label={tag.name}
                            variant="outlined"
                            size="small"
                            onClick={() => handleTagClick(tag.imageId)}
                            sx={{
                                zIndex: 1,
                                bgcolor: theme.palette.primary.main,
                            }}>
                        </Chip>
                    </ImageListItem>
                ))}
            </ImageList>
        </Box>

    );

}

Tags.propTypes = {
    tags: PropTypes.array.isRequired,
};

export default Tags;