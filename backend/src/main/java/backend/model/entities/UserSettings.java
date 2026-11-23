package backend.model.entities;

import javax.persistence.*;

@Entity
public class UserSettings {

    private Long id;
    private Boolean privacyPublic;
    private Boolean notifyMe;
    private Boolean showUplRewardHelp;
    private Boolean showUplImageHelp;
    private User user;

    public UserSettings() {
    }

    public static UserSettings createNew(User user) {
        return new UserSettings(user);
    }

    private UserSettings(User user) {
        this.user = user;
        this.privacyPublic = true;
        this.notifyMe = true;
        this.showUplRewardHelp = true;
        this.showUplImageHelp = true;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getPrivacyPublic() {
        return privacyPublic;
    }

    public void setPrivacyPublic(Boolean privacyPublic) {
        this.privacyPublic = privacyPublic;
    }

    public Boolean getNotifyMe() {
        return notifyMe;
    }

    public void setNotifyMe(Boolean notifyMe) {
        this.notifyMe = notifyMe;
    }

    public Boolean getShowUplRewardHelp() {
        return showUplRewardHelp;
    }

    public void setShowUplRewardHelp(Boolean showUplRewardHelp) {
        this.showUplRewardHelp = showUplRewardHelp;
    }

    public Boolean getShowUplImageHelp() {
        return showUplImageHelp;
    }

    public void setShowUplImageHelp(Boolean showUplImageHelp) {
        this.showUplImageHelp = showUplImageHelp;
    }

    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
