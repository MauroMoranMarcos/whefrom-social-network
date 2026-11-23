package backend.model.entities;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import java.time.LocalDate;
import java.util.Objects;

@Entity
public class User {

    public enum RoleType {NORMAL_USER, BRAND_USER, ADMIN_USER};

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
    private RoleType role;
    private String verificationCode;
    private UserSettings userSettings;
    private UserPoints userPoints;
    private UserPenalty userPenalty;

    public User() {}

    /*
    Constructor to create a new object User with all attributes (Normal/Brand User with all info).
     */
    public User(String userName, String password, String name, String surname, String about, String email,
                LocalDate birthDate, String phoneNumber, byte[] profilePicture, RoleType role, String verificationCode) {
        this.userName = userName;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.about = about;
        this.email = email;
        this.birthDate = birthDate;
        this.phoneNumber = phoneNumber;
        this.profilePicture = profilePicture;
        this.role = role;
        this.silenced = false;
        this.blocked = false;
        this.verified = false;
        this.verificationCode = verificationCode;
    }

    public User(String userName, String password, String name, String surname, String about, String email,
                LocalDate birthDate, String phoneNumber, byte[] profilePicture, RoleType role) {
        this.userName = userName;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.about = about;
        this.email = email;
        this.birthDate = birthDate;
        this.phoneNumber = phoneNumber;
        this.profilePicture = profilePicture;
        this.role = role;
        this.silenced = false;
        this.blocked = false;
        this.verified = false;
        this.verificationCode = "";
    }

    public User(String userName, String password, String name, String email, LocalDate birthDate, RoleType role) {
        this.userName = userName;
        this.password = password;
        this.name = name;
        this.email = email;
        this.about = "";
        this.birthDate = birthDate;
        this.role = role;
        this.silenced = false;
        this.blocked = false;
        this.verified = false;
        this.verificationCode = "";
    }

    public User(String userName, String password, String name, String surname, String email, LocalDate birthDate,
                RoleType role) {
        this.userName = userName;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.about = "";
        this.birthDate = birthDate;
        this.role = role;
        this.silenced = false;
        this.blocked = false;
        this.verified = false;
        this.verificationCode = "";
    }

    public User(String userName, String password, String name, String surname, String about, String email,
                LocalDate birthDate, RoleType role) {
        this.userName = userName;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.about = about;
        this.email = email;
        this.birthDate = birthDate;
        this.role = role;
        this.silenced = false;
        this.blocked = false;
        this.verified = false;
        this.verificationCode = "";
    }

    public User(String userName, String password, String name, String surname, String about, String email,
                LocalDate birthDate, byte[] profilePicture, RoleType role) {
        this.userName = userName;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.about = about;
        this.email = email;
        this.birthDate = birthDate;
        this.profilePicture = profilePicture;
        this.role = role;
        this.verificationCode = "";
    }

    public User(String userName, String password, String email, LocalDate birthDate, RoleType role) {
        this.userName = userName;
        this.password = password;
        this.email = email;
        this.about = "";
        this.birthDate = birthDate;
        this.role = role;
        this.silenced = false;
        this.blocked = false;
        this.verified = false;
        this.verificationCode = "";
    }

    public User(String userName, String password, String name, String about, String email, String phoneNumber,
                byte[] profilePicture, Boolean silenced, Boolean blocked, Boolean verified, RoleType role,
                UserSettings userSettings) {
        this.userName = userName;
        this.password = password;
        this.name = name;
        this.about = about;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.profilePicture = profilePicture;
        this.silenced = silenced;
        this.blocked = blocked;
        this.verified = verified;
        this.role = role;
        this.userSettings = userSettings;
    }

    public User(String userName, String password, String name, String about, String email, String phoneNumber,
                byte[] profilePicture, Boolean silenced, Boolean blocked, Boolean verified, RoleType role) {
        this.userName = userName;
        this.password = password;
        this.name = name;
        this.about = about;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.profilePicture = profilePicture;
        this.silenced = silenced;
        this.blocked = blocked;
        this.verified = verified;
        this.role = role;
    }

    public User(String userName, String password, String name, String about, String email, String phoneNumber,
                byte[] profilePicture, RoleType role) {
        this.userName = userName;
        this.password = password;
        this.name = name;
        this.about = about;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.profilePicture = profilePicture;
        this.role = role;
        this.silenced = false;
        this.blocked = false;
        this.verified = false;
    }

    public User(String userName, String password, String name, String surname, String about, String email,
                LocalDate birthDate, String phoneNumber, byte[] profilePicture, Boolean silenced, Boolean blocked,
                Boolean verified, RoleType role, String verificationCode, UserSettings userSettings, UserPoints userPoints) {
        this.userName = userName;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.about = about;
        this.email = email;
        this.birthDate = birthDate;
        this.phoneNumber = phoneNumber;
        this.profilePicture = profilePicture;
        this.silenced = silenced;
        this.blocked = blocked;
        this.verified = verified;
        this.role = role;
        this.verificationCode = verificationCode;
        this.userSettings = userSettings;
        this.userPoints = userPoints;
    }

    //TODO: Add more constructors

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

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

    private void setSilenced(Boolean silenced) {
        this.silenced = silenced;
    }

    public void silence() {
        this.silenced = true;
    }

    public void unsilence() {
        this.silenced = false;
    }

    public Boolean getBlocked() {
        return blocked;
    }

    private void setBlocked(Boolean blocked) {
        this.blocked = blocked;
    }

    public void block() {
        this.blocked = true;
    }

    public void unblock() {
        this.blocked = false;
    }

    public Boolean getVerified() {
        return verified;
    }

    private void setVerified(Boolean verified) {
        this.verified = verified;
    }

    public void verify() {
        this.verified = true;
    }

    public void unverify() {
        this.verified = false;
    }

    public RoleType getRole() {
        return role;
    }

    public void setRole(RoleType role) {
        this.role = role;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    @OneToOne(mappedBy = "user", optional = false, fetch = FetchType.LAZY)
    public UserSettings getUserSettings() {
        return userSettings;
    }

    public void setUserSettings(UserSettings userSettings) {
        this.userSettings = userSettings;
    }

    @OneToOne(mappedBy = "user", optional = false, fetch = FetchType.LAZY)
    public UserPoints getUserPoints() {
        return userPoints;
    }

    public void setUserPoints(UserPoints userPoints) {
        this.userPoints = userPoints;
    }

    @OneToOne(mappedBy = "user", optional = false, fetch = FetchType.LAZY)
    public UserPenalty getUserPenalty() {
        return userPenalty;
    }

    public void setUserPenalty(UserPenalty userPenalty) {
        this.userPenalty = userPenalty;
    }

    @Override
    public boolean equals(Object obj) {

        if (obj == this) {
            return true;
        }

        if (!(obj instanceof User)) {
            return false;
        }

        User user = (User) obj;

        return Objects.equals(id, user.id)
                && Objects.equals(userName, user.userName)
                && Objects.equals(password, user.password)
                && Objects.equals(name, user.name)
                && Objects.equals(surname, user.surname)
                && Objects.equals(about, user.about)
                && Objects.equals(email, user.email)
                && birthDate == user.birthDate
                && Objects.equals(phoneNumber, user.phoneNumber)
                && profilePicture == user.profilePicture
                && role == user.role;
    }
}
