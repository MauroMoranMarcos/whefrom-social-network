import PropTypes from "prop-types";

import {List, ListItem} from "@mui/material";
import ImageReport from "./ImageReport";

const ImageReports = ({ imageReports }) => {

    return(

        <nav>
            <List
                sx={{bgcolor: 'background.paper', width: '100%' }}>
                {imageReports.map(imageReport =>
                    <ListItem disablePadding key={imageReport.id} sx={{ width: '100%' }}>
                        <ImageReport imageReport={imageReport} />
                    </ListItem>
                )}
            </List>
        </nav>

    );

}

ImageReports.propTypes = {
    imageReports: PropTypes.array.isRequired,
};

export default ImageReports;