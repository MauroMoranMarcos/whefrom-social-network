package backend.rest.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private JwtGenerator jwtGenerator;

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.cors().and().csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .addFilter(new JwtFilter(authenticationManager(), jwtGenerator))
                .authorizeRequests()
                .antMatchers(HttpMethod.POST, "/users/signUp").permitAll()
                .antMatchers(HttpMethod.POST, "/users/login").permitAll()
                .antMatchers(HttpMethod.POST, "/users/loginFromServiceToken").permitAll()
                .antMatchers(HttpMethod.PUT, "/users/updateProfile/*").permitAll()
                .antMatchers(HttpMethod.POST, "/users/updateProfile/{id}/changePassword").permitAll()
                .antMatchers(HttpMethod.PUT, "/users/updateProfile/{id}/addProfilePicture").permitAll()
                .antMatchers(HttpMethod.GET, "/users/userSettings/*").permitAll()
                .antMatchers(HttpMethod.POST, "/users/userSettings/*/dontShowUplRewardHelp").permitAll()
                .antMatchers(HttpMethod.POST, "/users/userSettings/*/dontShowUplImageHelp").permitAll()
                .antMatchers(HttpMethod.PUT, "/users/updateUserSettings/*").permitAll()
                .antMatchers(HttpMethod.GET, "/users/search").permitAll()
                .antMatchers(HttpMethod.POST, "/users/forgottenPassword").permitAll()
                .antMatchers(HttpMethod.POST, "/users/forgottenPassword/verificationCode").permitAll()
                .antMatchers(HttpMethod.POST, "/users/forgottenPassword/restorePassword").permitAll()
                .antMatchers(HttpMethod.POST, "/users/follow/*").permitAll()
                .antMatchers(HttpMethod.POST, "/users/unfollow/*").permitAll()
                .antMatchers(HttpMethod.GET, "/users/*").permitAll()
                .antMatchers(HttpMethod.GET, "/users/*/followers").permitAll()
                .antMatchers(HttpMethod.GET, "/users/*/followed").permitAll()
                .antMatchers(HttpMethod.GET, "/users/*/numFollowers").permitAll()
                .antMatchers(HttpMethod.GET, "/users/*/numFollowed").permitAll()
                .antMatchers(HttpMethod.GET, "/users/*/isFollowing").permitAll()
                .antMatchers(HttpMethod.POST, "/users/*/reportUser").permitAll()
                .antMatchers(HttpMethod.POST, "/users/requestFollow/*").permitAll()
                .antMatchers(HttpMethod.POST, "/users/deleteRequestFollow/*").permitAll()
                .antMatchers(HttpMethod.GET, "/users/followRequests/*").permitAll()
                .antMatchers(HttpMethod.GET, "/users/getNumFollowRequests/*").permitAll()
                .antMatchers(HttpMethod.POST, "/users/acceptFollowRequest/*").permitAll()
                .antMatchers(HttpMethod.POST, "/users/rejectFollowRequest/*").permitAll()
                .antMatchers(HttpMethod.GET, "/users/hasRequested/*").permitAll()
                .antMatchers(HttpMethod.POST, "/admin/categories/create").permitAll()
                .antMatchers(HttpMethod.PUT, "/admin/categories/update/*").permitAll()
                .antMatchers(HttpMethod.GET, "/admin/categories").permitAll()
                .antMatchers(HttpMethod.GET, "/admin/categories/*").permitAll()
                .antMatchers(HttpMethod.GET, "/admin/categories/*/numTimesUsed").permitAll()
                .antMatchers(HttpMethod.GET, "/admin/reports/userReports").permitAll()
                .antMatchers(HttpMethod.GET, "/admin/reports/userReports/*").permitAll()
                .antMatchers(HttpMethod.GET, "/admin/reports/imageReports").permitAll()
                .antMatchers(HttpMethod.GET, "/admin/reports/imageReports/*").permitAll()
                .antMatchers(HttpMethod.POST, "/admin/reports/imageReports/*/warning").permitAll()
                .antMatchers(HttpMethod.POST, "/admin/reports/userReports/*/warning").permitAll()
                .antMatchers(HttpMethod.POST, "/admin/reports/imageReports/*/silence").permitAll()
                .antMatchers(HttpMethod.POST, "/admin/reports/userReports/*/silence").permitAll()
                .antMatchers(HttpMethod.POST, "/admin/reports/imageReports/*/block").permitAll()
                .antMatchers(HttpMethod.POST, "/admin/reports/userReports/*/block").permitAll()
                .antMatchers(HttpMethod.PUT, "/admin/reports/userReports/*/markAsResolved").permitAll()
                .antMatchers(HttpMethod.PUT, "/admin/reports/imageReports/*/markAsResolved").permitAll()
                .antMatchers(HttpMethod.GET, "/admin/reports/userPenalty/*").permitAll()
                .antMatchers(HttpMethod.PUT, "/admin/reports/userPenalty/*/removeSilence").permitAll()
                .antMatchers(HttpMethod.PUT, "/admin/reports/userPenalty/*/removeBlock").permitAll()
                .antMatchers(HttpMethod.POST, "/admin/reports/*/silenceUser").permitAll()
                .antMatchers(HttpMethod.POST, "/admin/reports/*/blockUser").permitAll()
                .antMatchers(HttpMethod.GET, "/admin/verificationRequests").permitAll()
                .antMatchers(HttpMethod.PUT, "/admin/verificationRequests/accept").permitAll()
                .antMatchers(HttpMethod.PUT, "/admin/verificationRequests/reject").permitAll()
                .antMatchers(HttpMethod.GET, "/admin/verificationRequests/exists/*").permitAll()
                .antMatchers(HttpMethod.POST, "/brands/signUp").permitAll()
                .antMatchers(HttpMethod.POST, "/brands/login").permitAll()
                .antMatchers(HttpMethod.POST, "/brands/loginFromServiceToken").permitAll()
                .antMatchers(HttpMethod.POST, "/brands/upload").permitAll()
                .antMatchers(HttpMethod.POST, "/brands/deleteReward/*").permitAll()
                .antMatchers(HttpMethod.POST, "/brands/hideReward/*").permitAll()
                .antMatchers(HttpMethod.POST, "/brands/showReward/*").permitAll()
                .antMatchers(HttpMethod.GET, "/brands/*").permitAll()
                .antMatchers(HttpMethod.GET, "/brands/search").permitAll()
                .antMatchers(HttpMethod.POST, "/brands/*/claimReward").permitAll()
                .antMatchers(HttpMethod.GET, "/brands/*/isRewardClaimedByUser").permitAll()
                .antMatchers(HttpMethod.GET, "/brands/*/findUsersThatClaimedReward").permitAll()
                .antMatchers(HttpMethod.GET, "/brands/*/getNumPublicationsWithBrand").permitAll()
                .antMatchers(HttpMethod.POST, "/brands/requestVerification").permitAll()
                .antMatchers(HttpMethod.GET, "/brands/hasRequestedVerification").permitAll()
                .antMatchers(HttpMethod.POST, "/images/upload").permitAll()
                .antMatchers(HttpMethod.PUT, "/images/updateImage/*").permitAll()
                .antMatchers(HttpMethod.POST, "/images/deleteImage/*").permitAll()
                .antMatchers(HttpMethod.POST, "/images/hideImage/*").permitAll()
                .antMatchers(HttpMethod.POST, "/images/showImage/*").permitAll()
                .antMatchers(HttpMethod.POST, "/images/tagging").permitAll()
                .antMatchers(HttpMethod.PUT, "/images/updateTag/*").permitAll()
                .antMatchers(HttpMethod.POST, "/images/deleteTag/*").permitAll()
                .antMatchers(HttpMethod.GET, "/images/search").permitAll()
                .antMatchers(HttpMethod.GET, "/images/search/user").permitAll()
                .antMatchers(HttpMethod.GET, "/images/search/likedByUser").permitAll()
                .antMatchers(HttpMethod.GET, "/images/search/usersThatLiked").permitAll()
                .antMatchers(HttpMethod.GET, "/images/search/commentsFromImage").permitAll()
                .antMatchers(HttpMethod.GET, "/images/search/answersFromComment").permitAll()
                .antMatchers(HttpMethod.GET, "/images/*/findTags").permitAll()
                .antMatchers(HttpMethod.POST, "/images/*/like").permitAll()
                .antMatchers(HttpMethod.POST, "/images/*/deleteLike").permitAll()
                .antMatchers(HttpMethod.GET, "/images/*/getNumImageLikes").permitAll()
                .antMatchers(HttpMethod.GET, "/images/*/isImageLikedByUser").permitAll()
                .antMatchers(HttpMethod.POST, "/images/*/comment").permitAll()
                .antMatchers(HttpMethod.POST, "/images/*/deleteComment").permitAll()
                .antMatchers(HttpMethod.GET, "/images/*/getNumImageComments").permitAll()
                .antMatchers(HttpMethod.GET, "/images/*/getNumCommentAnswers").permitAll()
                .antMatchers(HttpMethod.POST, "/images/*/reportImage").permitAll()
                .antMatchers(HttpMethod.GET, "/images/*").permitAll()
                .antMatchers(HttpMethod.POST, "/images/tagging/*/likeTag").permitAll()
                .antMatchers(HttpMethod.POST, "/images/tagging/*/deleteTagLike").permitAll()
                .antMatchers(HttpMethod.GET, "/images/search/tagsLikedByUser").permitAll()
                .antMatchers(HttpMethod.GET, "/images/search/usersThatLikedTag").permitAll()
                .antMatchers(HttpMethod.GET, "/images/search/tagging/*/getNumTagLikes").permitAll()
                .antMatchers(HttpMethod.GET, "/images/search/tagging/*/isTagLikedByUser").permitAll()
                .antMatchers(HttpMethod.GET, "/images/search/getFeed").permitAll()
                .antMatchers(HttpMethod.POST, "/images/search/getFeed/markImageAsSeen").permitAll()
                .anyRequest().denyAll();

        //TODO: Add lines here for the rest of the HU
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(Arrays.asList("*"));
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        source.registerCorsConfiguration("/**", config);

        return source;

    }

}
