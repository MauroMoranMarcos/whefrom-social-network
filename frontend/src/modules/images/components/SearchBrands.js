import {FormattedMessage, injectIntl} from 'react-intl';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

import search from "../../search";

import {
    Box,
    Container,
    Input,
    Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SearchUsersResult from "../../search/components/SearchUsersResult";

const SearchBrands = ({ intl }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [keywords, setKeywords] = useState('');
    const [onlyBrands, setOnlyBrands] = useState(true);

    useEffect(() => {

        dispatch(search.actions.searchUsers(
            {keywords: keywords === '' ? ' ' : keywords.trim(), onlyBrands: onlyBrands, page: 0}
        ));

    }, [keywords]);

    return (
        <Container component="main" maxWidth={false} disableGutters={true}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "column" },
                    justifyContent: "center",
                    gap: 4,
                }}>
                <Paper elevation={4}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mt: 1,
                            ml: 1,
                            mr: 1,
                            mb: 1,
                            border: '2px solid #ccc',
                            borderRadius: '6px',
                        }}>
                        <Input
                            sx={{ ml: 1, mr: 1 }}
                            placeholder={intl.formatMessage({ id: 'project.images.SearchBrands.placeHolder' })}
                            onChange={(e) => setKeywords(e.target.value)}
                            color="secondary"
                            disableUnderline
                            fullWidth></Input>
                        <SearchIcon color="primary" sx={{ mr: 1 }}/>
                    </Box>
                    <SearchUsersResult onlyBrands={onlyBrands} />
                </Paper>
            </Box>
        </Container>
    )

}

export default injectIntl(SearchBrands);