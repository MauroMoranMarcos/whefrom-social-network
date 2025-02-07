package backend.rest.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AuthenticatedUserDto {

    private String serviceToken;
    private UserDto userDto;
    private UserSettingsDto userSettingsDto;
    private UserPointsDto userPointsDto;

    public AuthenticatedUserDto() {}

    public AuthenticatedUserDto(String serviceToken, UserDto userDto, UserSettingsDto userSettingsDto,
                                UserPointsDto userPointsDto) {

        this.serviceToken = serviceToken;
        this.userDto = userDto;
        this.userSettingsDto = userSettingsDto;
        this.userPointsDto = userPointsDto;

    }

    public String getServiceToken() {
        return serviceToken;
    }

    public void setServiceToken(String serviceToken) {
        this.serviceToken = serviceToken;
    }

    @JsonProperty("user")
    public UserDto getUserDto() {
        return userDto;
    }

    public void setUserDto(UserDto userDto) {
        this.userDto = userDto;
    }

    @JsonProperty("userSettings")
    public UserSettingsDto getUserSettingsDto() {
        return userSettingsDto;
    }

    public void setUserSettingsDto(UserSettingsDto userSettingsDto) {
        this.userSettingsDto = userSettingsDto;
    }

    @JsonProperty("userPoints")
    public UserPointsDto getUserPointsDto() {
        return userPointsDto;
    }

    public void setUserPointsDto(UserPointsDto userPointsDto) {
        this.userPointsDto = userPointsDto;
    }
}
