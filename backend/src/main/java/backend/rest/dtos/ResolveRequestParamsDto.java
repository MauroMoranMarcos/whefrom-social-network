package backend.rest.dtos;

import javax.validation.constraints.NotNull;

public class ResolveRequestParamsDto {

    private Long userRequestingId;

    @NotNull
    public Long getUserRequestingId() {
        return userRequestingId;
    }

    public void setUserRequestingId(Long userRequestingId) {
        this.userRequestingId = userRequestingId;
    }

}
