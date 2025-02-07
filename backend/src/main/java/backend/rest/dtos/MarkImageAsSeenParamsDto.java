package backend.rest.dtos;

import javax.validation.constraints.NotNull;

public class MarkImageAsSeenParamsDto {

    private Long userId;
    private Long imageId;

    @NotNull
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @NotNull
    public Long getImageId() {
        return imageId;
    }

    public void setImageId(Long imageId) {
        this.imageId = imageId;
    }
}
