import PropTypes from "prop-types";
import {Box, ImageList, useTheme} from "@mui/material";
import Reward from "./Reward";
import useMediaQuery from "@mui/material/useMediaQuery";

const Rewards = ({ rewards, rewardsInfo }) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    if (rewardsInfo) {

        return (
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ml: 0.5,
                mr: 0.5,
            }}>
                <ImageList sx={{ width: 300, height: '100%' }} cols={2} rowHeight={250}>
                    {rewards.slice(0, 4).map(reward => (
                        <Reward reward={reward} rewardsInfo={rewardsInfo} />
                    ))}
                </ImageList>
            </Box>

        );

    } else {

        return (
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 1,
                mb: 1,
            }}>
                <ImageList sx={{ width: '100%', height: '100%' }} cols={isMobile ? 1 : 2} rowHeight={isMobile ? 350 : 250}>
                    {rewards.map(reward => (
                        <Reward reward={reward} />
                    ))}
                </ImageList>
            </Box>

        );

    }

}

Rewards.propTypes = {
    rewards: PropTypes.array.isRequired,
};

export default Rewards;