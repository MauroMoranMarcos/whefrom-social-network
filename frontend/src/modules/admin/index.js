import * as actions from './actions';
import reducer from './reducer';
import * as selectors from './selectors';

export {default as ViewCategories} from './components/ViewCategories';
export {default as CreateCategory} from './components/CreateCategory';
export {default as Categories} from './components/Categories';
export {default as EditCategory} from './components/EditCategory';
export {default as ViewReports} from './components/ViewReports';
export {default as UserReportDetails} from './components/UserReportDetails';
export {default as ImageReportDetails} from './components/ImageReportDetails';
export {default as ViewVerificationRequests} from './components/ViewVerificationRequests';

// eslint-disable-next-line
export default {actions, reducer, selectors};