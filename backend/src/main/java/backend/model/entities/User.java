package backend.model.entities;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import java.time.LocalDate;
import java.util.Objects;
import java.util.Random;

@Entity
public class User {

    public enum RoleType {NORMAL_USER, BRAND_USER, ADMIN_USER};

    private final int RANDOM_INIT = 100000;
    private final int RANDOM_BOUND = 900000;

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

    protected User() {}

    public void initNormalUser(User user, String password) {
        UserSettings userSettings = UserSettings.createNew(user);
        UserPoints userPoints = UserPoints.createNew(user);
        UserPenalty userPenalty = UserPenalty.createNew(user);

        this.userSettings = userSettings;
        this.userPoints = userPoints;
        this.userPenalty = userPenalty;
        this.password = password;
    }

    public void initBrandUser(User user, String password) {
        UserSettings userSettings = UserSettings.createNew(user);
        UserPenalty userPenalty = UserPenalty.createNew(user);

        this.userSettings = userSettings;
        this.userPenalty = userPenalty;
        this.password = password;
        this.role = User.RoleType.BRAND_USER;
    }

    public void updateUser(String firstName, String lastName, String email, String phoneNumber, String about) {
        this.name = firstName;
        this.surname = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.about = about;
    }

    public void updateUser(byte[] profilePicture) {
        this.profilePicture = profilePicture;
    }

    public static User createNew(String userName, String password, String name, String surname, String about, String email,
                                 LocalDate birthDate, String phoneNumber, byte[] profilePicture, RoleType role, String verificationCode) {
        return new User(userName, password, name, surname, about, email, birthDate, phoneNumber, profilePicture, role, verificationCode);
    }

    private User(String userName, String password, String name, String surname, String about, String email,
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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    private void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    private void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    private void setPassword(String password) {
        this.password = password;
    }

    public void changePassword(String password) {
        this.password = password;
    }

    public void restorePassword(String password) {
        this.password = password;
        this.verificationCode = "";
    }

    public String getName() {
        return name;
    }

    private void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    private void setSurname(String surname) {
        this.surname = surname;
    }

    public String getAbout() {
        return about;
    }

    private void setAbout(String about) {
        this.about = about;
    }

    public String getEmail() {
        return email;
    }

    private void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    private void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    private void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public byte[] getProfilePicture() {
        return profilePicture;
    }

    private void setProfilePicture(byte[] profilePicture) {
        this.profilePicture = profilePicture;
    }

    public Boolean getSilenced() {
        return silenced;
    }

    private void setSilenced(Boolean silenced) {
        this.silenced = silenced;
    }

    public void silence(LocalDate silencedUntil) {
        this.silenced = true;
        this.userPenalty.silenceUntil(silencedUntil);
    }

    public void unsilence() {
        this.silenced = false;
        this.userPenalty.resetSilence();
    }

    public Boolean getBlocked() {
        return blocked;
    }

    private void setBlocked(Boolean blocked) {
        this.blocked = blocked;
    }

    public void block(LocalDate blockedUntil) {
        this.blocked = true;
        this.userPenalty.blockUntil(blockedUntil);
    }

    public void unblock() {
        this.blocked = false;
        this.userPenalty.resetBlock();
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

    private void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public void establishVerificationCode() {
        Random random = new Random();
        this.verificationCode = String.valueOf((RANDOM_INIT + random.nextInt(RANDOM_BOUND)));
    }

    @OneToOne(mappedBy = "user", optional = false, fetch = FetchType.LAZY)
    public UserSettings getUserSettings() {
        return userSettings;
    }

    private void setUserSettings(UserSettings userSettings) {
        this.userSettings = userSettings;
    }

    @OneToOne(mappedBy = "user", optional = false, fetch = FetchType.LAZY)
    public UserPoints getUserPoints() {
        return userPoints;
    }

    private void setUserPoints(UserPoints userPoints) {
        this.userPoints = userPoints;
    }

    @OneToOne(mappedBy = "user", optional = false, fetch = FetchType.LAZY)
    public UserPenalty getUserPenalty() {
        return userPenalty;
    }

    private void setUserPenalty(UserPenalty userPenalty) {
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
