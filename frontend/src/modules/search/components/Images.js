import PropTypes from 'prop-types';

import {
    Avatar,
    Box, Button,
    ImageList,
    ImageListItem, Typography,
} from "@mui/material";
import {styled} from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import {useNavigate} from "react-router-dom";

const Images = ({ images }) => {

    const navigate = useNavigate();

    const handleImageClick = (imageId) => {

        navigate(`/search/imagedetails/${imageId}`, { state: {seeComments: false} });

    }

    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <ImageList sx={{ width: '100%' }} cols={3}>
                {images.map(image => (
                    <ImageListItem key={image.id}>
                        <ImageButton
                            onClick={() => handleImageClick(image.id)}
                            focusRipple
                            style={{
                                width: image.width,
                            }}
                        >
                            <ImageSrc style={{ backgroundImage: `url(data:image/jpeg;base64,${image.imgFile})` }} />
                        </ImageButton>
                    </ImageListItem>
                ))}
            </ImageList>
        </Box>

    );

}

export const ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: 'relative',
    height: 200,
    [theme.breakpoints.down('sm')]: {
        width: '100% !important', // Overrides inline-style
        height: 100,
    },
    '&:hover, &.Mui-focusVisible': {
        zIndex: 1,
        '& .MuiImageBackdrop-root': {
            opacity: 0.15,
        },
        '& .MuiImageMarked-root': {
            opacity: 0,
        },
        '& .MuiTypography-root': {
            border: '4px solid currentColor',
        },
    },
}));

export const ImageSrc = styled('span')({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
});

Images.propTypes = {
    images: PropTypes.array.isRequired,
};

export default Images;