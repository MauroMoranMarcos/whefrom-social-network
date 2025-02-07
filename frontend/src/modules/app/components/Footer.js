import {useEffect, useState} from "react";

import {FormattedMessage} from 'react-intl';
import useMediaQuery from "@mui/material/useMediaQuery";
import {BottomNavigation, BottomNavigationAction, Box, CssBaseline, Paper, useTheme} from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import {useLocation, useNavigate} from "react-router-dom";

const Footer = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isNotMobile = useMediaQuery(theme.breakpoints.up('sm'));
    const [pageValue, setPageValue] = useState(0);

    useEffect(() => {

        if (pageValue === 0) {
            navigate('/search/feed');
        }

        if (pageValue === 1) {
            navigate('/search');
        }

        if (pageValue === 2) {
            navigate('/search/rewards');
        }

    }, [pageValue]);

    useEffect(() => {

        switch (location.pathname) {
            case `/`:
                setPageValue(0);
                break;
            case `/search/feed`:
                setPageValue(0);
                break;
            case `/search`:
                setPageValue(1);
                break;
            case `/search/rewards`:
                setPageValue(2);
                break;
            default:
                setPageValue(null);
                break;
        }

    }, [location.pathname]);

    const handleOnClickHome = () => {

        if (location.pathname !== "/search/feed") {
            navigate('/search/feed');
        }

    }

    const handleOnDoubleClickHome = () => {

        navigate('/search/feed');

    }

    return (
        <div>
            <br/>
            <hr/>
            {isNotMobile ?
                <footer>
                    <p className="text-center">
                        <FormattedMessage id="project.app.Footer.text" />
                    </p>
                </footer>
                :
                <footer>
                    <Box sx={{ pb: 7 }}>
                        <CssBaseline />
                        <Paper className="bottom-navigation"
                               sx={{ position: 'fixed',
                                   bottom: 0,
                                   left: 0,
                                   right: 0,
                                   borderTop: '1px solid #9575cd'}}
                               elevation={24}>
                            <BottomNavigation
                                value={pageValue}
                                onChange={(event, newPageValue) => {
                                    setPageValue(newPageValue);
                                }}
                            >
                                <BottomNavigationAction label={<FormattedMessage id="project.app.Footer.Home" />}
                                                        value={0} onClick={handleOnClickHome} onDoubleClick={handleOnDoubleClickHome} icon={<HomeOutlinedIcon />} />
                                <BottomNavigationAction label={<FormattedMessage id="project.app.Footer.Search" />}
                                                        value={1} icon={<SearchOutlinedIcon />} />
                                <BottomNavigationAction label={<FormattedMessage id="project.app.Footer.Rewards" />}
                                                        value={2} icon={<EmojiEventsOutlinedIcon />} />
                            </BottomNavigation>
                        </Paper>
                    </Box>
                </footer>
            }
        </div>
    )

};

export default Footer;
