package backend.rest.dtos;

public class UserSettingsDto {

    private Long id;
    private Boolean privacyPublic;
    private Boolean notifyMe;
    private Boolean showUplRewardHelp;
    private Boolean showUplImageHelp;

    public UserSettingsDto() {
    }

    public UserSettingsDto(Long id, Boolean privacyPublic, Boolean notifyMe, Boolean showUplRewardHelp, Boolean showUplImageHelp) {
        this.id = id;
        this.privacyPublic = privacyPublic;
        this.notifyMe = notifyMe;
        this.showUplRewardHelp = showUplRewardHelp;
        this.showUplImageHelp = showUplImageHelp;
    }

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
}
