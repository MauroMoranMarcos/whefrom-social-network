package backend.rest.dtos;

import backend.model.entities.UserSettings;

public class UserSettingsConversor {

    private UserSettingsConversor() {}

    public final static UserSettingsDto toUserSettingsDto(UserSettings userSettings) {
        return new UserSettingsDto(userSettings.getId(), userSettings.getPrivacyPublic(), userSettings.getNotifyMe(),
                userSettings.getShowUplRewardHelp(), userSettings.getShowUplImageHelp());
    }

}
