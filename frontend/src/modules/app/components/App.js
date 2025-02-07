import {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import Header from './Header';
import Body from './Body';
import Footer from './Footer';
import users from '../../users';
import admin from '../../admin';
import brands from '../../brands';

import {Container} from "@mui/material";

const App = () => {

    const dispatch = useDispatch();

    useEffect(() => {

        dispatch(users.actions.tryLoginFromServiceToken(
            () => dispatch(users.actions.logout())));

        dispatch(admin.actions.findAllCategories());
    
    });

    return (
        <Container>
            <Header/>
            <Body/>
            <Footer/>
        </Container>
    );

}
    
export default App;
