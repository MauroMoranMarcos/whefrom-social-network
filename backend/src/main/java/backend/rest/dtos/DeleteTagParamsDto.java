package backend.rest.dtos;

import javax.validation.constraints.NotNull;

public class DeleteTagParamsDto {

    private Long imageId;

    public DeleteTagParamsDto() {
    }

    public DeleteTagParamsDto(Long imageId) {
        this.imageId = imageId;
    }

    @NotNull
    public Long getImageId() {
        return imageId;
    }

    public void setImageId(Long imageId) {
        this.imageId = imageId;
    }
}
