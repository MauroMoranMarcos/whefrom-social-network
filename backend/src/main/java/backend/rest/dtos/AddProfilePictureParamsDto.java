package backend.rest.dtos;

import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotNull;

public class AddProfilePictureParamsDto {

    Long userId;

    MultipartFile image;

    public AddProfilePictureParamsDto() {
        super();
    }

    @NotNull
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @NotNull
    public MultipartFile getImage() {
        return image;
    }

    public void setImage(MultipartFile image) {
        this.image = image;
    }
}
