package backend.rest.dtos;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;

public class UserDto {

    public interface AllValidations {}

    public interface UpdateValidations {}

    private Long id;
    private String userName;
    private String password;
    private String name;
    private String surname;
    private String about;
    private String email;
    private LocalDate birthDate;
    private String phoneNumber;
    private byte[] profilePicture;
    private Boolean silenced;
    private Boolean blocked;
    private Boolean verified;
    private String role;
    private String verificationCode;

    public UserDto(Long id, String userName, String name, String surname, String about, String email,
                   LocalDate birthDate, String phoneNumber, byte[] profilePicture,  Boolean verified, String role,
                   String verificationCode) {
        this.id = id;
        this.userName = userName != null ? userName.trim() : null;
        this.name = name;
        this.surname = surname;
        this.about = about;
        this.email = email;
        this.birthDate = birthDate;
        this.phoneNumber = phoneNumber;
        this.profilePicture = profilePicture;
        this.role = role;
        this.silenced = false;
        this.verified = verified;
        this.blocked = false;
        this.verificationCode = verificationCode;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @NotNull(groups = {AllValidations.class})
    @Size(min = 1, max = 60, groups = {AllValidations.class})
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    @NotNull(groups={AllValidations.class})
    @Size(min=1, max=60, groups={AllValidations.class})
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    @NotNull(groups={AllValidations.class, UpdateValidations.class})
    @Size(min=1, max=60, groups={AllValidations.class, UpdateValidations.class})
    @Email(groups={AllValidations.class, UpdateValidations.class})
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public byte[] getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(byte[] profilePicture) {
        this.profilePicture = profilePicture;
    }

    public Boolean getSilenced() {
        return silenced;
    }

    public void setSilenced(Boolean silenced) {
        this.silenced = silenced;
    }

    public Boolean getBlocked() {
        return blocked;
    }

    public void setBlocked(Boolean blocked) {
        this.blocked = blocked;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }

    @NotNull(groups={AllValidations.class})
    public String getRole() {
        return role;
    }

    public void setRole(String type) {
        this.role = type;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }
}
