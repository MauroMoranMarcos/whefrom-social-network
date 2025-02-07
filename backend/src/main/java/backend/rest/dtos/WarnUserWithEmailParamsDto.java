package backend.rest.dtos;

import javax.validation.constraints.NotNull;

public class WarnUserWithEmailParamsDto {

    private String warning;

    @NotNull
    public String getWarning() {
        return warning;
    }

    public void setWarning(String warning) {
        this.warning = warning;
    }
}
