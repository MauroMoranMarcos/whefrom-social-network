package backend.rest.dtos;

import backend.model.entities.UserPoints;

public class UserPointsConversor {

    public UserPointsConversor() {
    }

    public final static UserPointsDto toUserPointsDto(UserPoints userPoints) {
        return new UserPointsDto(userPoints.getId(), userPoints.getPoints(), userPoints.getPublicationTime(),
                userPoints.getPublishedToday());
    }

    public final static UserPoints toUserPoints(UserPointsDto userPointsDto) {

        return new UserPoints(userPointsDto.getId(), userPointsDto.getPoints(),
                userPointsDto.getPublicationTime(), userPointsDto.getPublishedToday());
    }

}
