import PropTypes from 'prop-types';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";

import {FormattedMessage} from "react-intl";

import users from "../../users";

import * as actions from '../actions';
import * as selectors from '../selectors';

import {
    Box,
    Button, Dialog, DialogActions, DialogContent,
    DialogTitle, Fab, Grid, IconButton, Link,
    List,
    ListItem,
    ListItemButton,
    ListItemText, TextField,
    Typography, useTheme
} from "@mui/material";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import useMediaQuery from "@mui/material/useMediaQuery";

import {Errors} from "../../common";
import ShowAnswersFromComment from "./ShowAnswersFromComment";
import Comment from "./Comment";

const Comments = ({ comments, openCommentsDialog, setOpenCommentsDialog, showAnswers }) => {

    const [openAnswersDialog, setOpenAnswersDialog] = useState(false);
    const [backendErrors, setBackendErrors] = useState(null);

    return(

        <nav>
            <Errors errors={backendErrors} onClose={() => setBackendErrors(null)}/>
            <List
                sx={{bgcolor: 'background.paper', width: '100%' }}>
                {comments.map(comment =>
                    (
                        <Comment comment={comment} setOpenCommentsDialog={setOpenAnswersDialog} showAnswers={showAnswers} />
                    )
                )}
            </List>
        </nav>

    );

}

Comments.propTypes = {
    comments: PropTypes.array.isRequired,
};

export default Comments;