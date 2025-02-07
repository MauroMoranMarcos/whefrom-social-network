import * as actions from './actions';
import * as actionTypes from './actionTypes';
import reducer from './reducer';
import * as selectors from './selectors';

export {default as UploadImage} from './components/UploadImage';
export {default as TagImage} from './components/TagImage';
export {default as UpdateImage} from './components/UpdateImage';

export default {actions, actionTypes, reducer, selectors};