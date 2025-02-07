import {useSelector} from 'react-redux';
import {Route, Routes} from 'react-router-dom';

import AppGlobalComponents from './AppGlobalComponents';
import Home from './Home';
import users from '../../users';

import {SelectAccountType} from '../../users';
import {SignUpNormalAccount} from '../../users';
import {AddProfilePicture} from '../../users';
import {Login} from '../../users';
import {Logout} from '../../users';
import {ChangePassword} from '../../users';
import {EnterVerificationCode} from '../../users';
import {ForgotPassword} from '../../users';
import {UpdateProfile} from '../../users';
import {UpdateUserSettings} from '../../users';
import {ShowFollowRequests} from '../../users';
import {CreateCategory} from '../../admin';
import {ViewVerificationRequests} from '../../admin';
import {ViewCategories} from '../../admin';
import {ViewReports} from '../../admin';
import {UserReportDetails} from '../../admin';
import {ImageReportDetails} from '../../admin';
import {UploadImage} from '../../images';
import {UpdateImage} from '../../images';
import {TagImage} from '../../images';
import {EditCategory} from '../../admin';
import {RestorePassword} from '../../users';
import {Search} from "../../search";
import {Feed} from "../../search";
import {ShowImagesLikedByUser} from "../../search";
import {ShowUsersThatLiked} from "../../search";
import {ShowFollows} from "../../search";
import {UserDetails} from "../../search";
import {ImageDetails} from "../../search";
import {FindRewardsFromBrand} from "../../brands";
import {FindUploadedRewards} from "../../brands";
import {SignUpBrandAccount} from "../../brands";
import {LoginBrandAccount} from "../../brands";
import {UploadReward} from "../../brands";
import {RewardDetails} from "../../brands";
import {FindRewards} from "../../brands";
import {RewardClaimedSuccessfully} from "../../brands";
import {RewardsInfo} from "../../brands";
import {PointsHelp} from "../../brands";
import {ShowUsersThatClaimed} from "../../brands";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material";
import LeftBar from "./LeftBar";

const Body = () => {

    const loggedIn = useSelector(users.selectors.isLoggedIn);
    const isBrand = useSelector(users.selectors.isBrand);
    const isAdmin = useSelector(users.selectors.isAdmin);
    const theme = useTheme();
    const isNotMobile = useMediaQuery(theme.breakpoints.up('sm'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    
   return (

        <div className="container">
            {isNotMobile &&
                <div className="additional-component left-bar">
                    <LeftBar/>
                </div>
            }
            <div className={isNotMobile ? "content-wrapper" : "container"}>
                <br/>
                <AppGlobalComponents/>
                <Routes>
                    <Route path="/*" element={<Home/>}/>
                    <Route path="/search" element={<Search/>}/>
                    <Route path="/search/rewards" element={<FindRewards/>}/>
                    <Route path="/search/brandrewards" element={<FindRewardsFromBrand/>}/>
                    <Route path="/search/feed" element={<Feed/>}/>
                    <Route path="/search/imagedetails/:id" element={<ImageDetails/>}/>
                    <Route path="/search/imagedetails/:id/usersthatliked" element={<ShowUsersThatLiked/>}/>
                    <Route path="/search/rewarddetails/:id" element={<RewardDetails/>}/>
                    <Route path="/rewards/help" element={<PointsHelp/>}/>
                    <Route path="/rewards/rewardsinfo" element={<RewardsInfo/>}/>
                    <Route path="/search/userdetails/:id" element={<UserDetails/>}/>
                    <Route path="/search/userdetails/:id/follows" element={<ShowFollows/>}/>
                    <Route path="/search/userdetails/:id/imagesliked" element={<ShowImagesLikedByUser/>}/>
                    {loggedIn && <Route path="/users/logout" element={<Logout/>}/>}
                    {loggedIn && !isAdmin && <Route path="/users/updateprofile" element={<UpdateProfile/>}/>}
                    {loggedIn && !isAdmin && <Route path="/users/updateprofile/addprofilepicture" element={<AddProfilePicture/>}/>}
                    {loggedIn && !isAdmin && <Route path="/users/updateprofile/changepassword" element={<ChangePassword/>}/>}
                    {loggedIn && !isAdmin && <Route path="/users/updateusersettings" element={<UpdateUserSettings/>}/>}
                    {loggedIn && !isAdmin && <Route path="/users/followrequests" element={<ShowFollowRequests/>}/>}
                    {loggedIn && isAdmin && <Route path="/admin/categories" element={<ViewCategories/>}/>}
                    {loggedIn && isAdmin && <Route path="/admin/categories/create" element={<CreateCategory/>}/>}
                    {loggedIn && isAdmin && <Route path="/admin/categories/update" element={<EditCategory/>}/>}
                    {loggedIn && isAdmin && <Route path="/admin/reports" element={<ViewReports/>}/>}
                    {loggedIn && isAdmin && <Route path="/admin/reports/user/:id" element={<UserReportDetails/>}/>}
                    {loggedIn && isAdmin && <Route path="/admin/reports/image/:id" element={<ImageReportDetails/>}/>}
                    {loggedIn && isAdmin && <Route path="/admin/verificationrequests" element={<ViewVerificationRequests/>}/>}
                    {loggedIn && !isAdmin && <Route path="/images/upload" element={<UploadImage/>}/>}
                    {loggedIn && !isAdmin && <Route path="/images/update" element={<UpdateImage/>}/>}
                    {loggedIn && !isAdmin && <Route path="/images/tagging" element={<TagImage/>}/>}
                    {loggedIn && !isAdmin &&
                        <Route path="/search/rewarddetails/:id/rewardclaimed" element={<RewardClaimedSuccessfully/>}/>}
                    {loggedIn && isBrand && <Route path="/brands/upload" element={<UploadReward/>}/>}
                    {loggedIn && isBrand && <Route path="/search/uploadedrewards" element={<FindUploadedRewards/>}/>}
                    {loggedIn && isBrand && <Route path="/brands/seeusersthatclaimedreward" element={<ShowUsersThatClaimed/>}/>}
                    {!loggedIn && <Route path="/users/signup" element={<SignUpNormalAccount/>}/>}
                    {!loggedIn && <Route path="/users/login" element={<Login/>}/>}
                    {!loggedIn && <Route path="/users/signup/brandaccount" element={<SelectAccountType/>}/>}
                    {!loggedIn && <Route path="/users/forgottenpassword" element={<ForgotPassword/>}/>}
                    {!loggedIn &&
                        <Route path="/users/forgottenpassword/verificationcode" element={<EnterVerificationCode/>}/>}
                    {!loggedIn && <Route path="/users/forgottenpassword/restorepassword" element={<RestorePassword/>}/>}
                    {!loggedIn && <Route path="/brands/signup" element={<SignUpBrandAccount/>}/>}
                    {!loggedIn && <Route path="/brands/login" element={<LoginBrandAccount/>}/>}
                </Routes>
            </div>
            {isNotMobile && isDesktop && !isAdmin &&
                <div className="additional-component right-bar">
                    <RewardsInfo/>
                </div>
            }
        </div>

   );

};

export default Body;
