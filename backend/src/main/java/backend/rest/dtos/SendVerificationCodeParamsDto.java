package backend.rest.dtos;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

public class SendVerificationCodeParamsDto {

    private String email;

    @NotNull
    @Email
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
