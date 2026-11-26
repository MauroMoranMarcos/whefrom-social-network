package backend.rest.dtos;

import static backend.rest.dtos.UserSettingsConversor.toUserSettingsDto;
import static backend.rest.dtos.UserPointsConversor.toUserPointsDto;

import backend.model.entities.User;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class UserConversor {

    private UserConversor() {}

    public final static UserDto toUserDto(User user) {
        return new UserDto(user.getId(), user.getUserName(), user.getName(), user.getSurname(), user.getAbout(),
                user.getEmail(), user.getBirthDate(), user.getPhoneNumber(), user.getProfilePicture(), user.getVerified(),
                user.getRole().toString(), user.getVerificationCode());
    }

    public final static User toUser(UserDto userDto) {

        return User.createNew(userDto.getUserName(), userDto.getPassword(), userDto.getName(), userDto.getSurname(), userDto.getAbout(),
                userDto.getEmail(), userDto.getBirthDate(), userDto.getPhoneNumber(), userDto.getProfilePicture(),
                Objects.equals(userDto.getRole(), "NORMAL_USER") ? User.RoleType.NORMAL_USER : User.RoleType.BRAND_USER,
                userDto.getVerificationCode());
    }

    public final static List<UserDto> toUserDtos(List<User> users) {

        return users.stream().map(u -> toUserDto(u)).collect(Collectors.toList());

    }

    public final static AuthenticatedUserDto toAuthenticatedUserDto(String serviceToken, User user) {

        return new AuthenticatedUserDto(serviceToken, toUserDto(user), toUserSettingsDto(user.getUserSettings()),
                toUserPointsDto(user.getUserPoints()));

    }

}
