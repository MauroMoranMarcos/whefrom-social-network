package backend.rest.dtos;

import backend.model.entities.UserPoints;

public class UserPointsConversor {

    public UserPointsConversor() {
    }

    public final static UserPointsDto toUserPointsDto(UserPoints userPoints) {
        return new UserPointsDto(userPoints.getId(), userPoints.getPoints(), userPoints.getPublicationTime(),
                userPoints.getPublishedToday());
    }

}
