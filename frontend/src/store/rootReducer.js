import {combineReducers} from 'redux';

import app from '../modules/app';
import users from '../modules/users';
import admin from '../modules/admin';
import images from '../modules/images';
import search from '../modules/search';
import brands from '../modules/brands';

const rootReducer = combineReducers({
    app: app.reducer,
    users: users.reducer,
    admin: admin.reducer,
    images: images.reducer,
    search: search.reducer,
    brands: brands.reducer,
});

export default rootReducer;
