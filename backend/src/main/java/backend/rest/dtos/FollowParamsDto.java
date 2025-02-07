package backend.rest.dtos;

import javax.validation.constraints.NotNull;

public class FollowParamsDto {

    private Long userId;
    private Long userFollowedId;

    @NotNull
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @NotNull
    public Long getUserFollowedId() {
        return userFollowedId;
    }

    public void setUserFollowedId(Long userFollowedId) {
        this.userFollowedId = userFollowedId;
    }
}
