package backend.rest.dtos;

import backend.model.entities.UserPenalty;

public class UserPenaltyConversor {

    public UserPenaltyConversor() {
    }

    public final static UserPenaltyDto toUserPenaltyDto(UserPenalty userPenalty) {

        return new UserPenaltyDto(userPenalty.getId(), userPenalty.getSilencedUntil(), userPenalty.getBlockedUntil());

    }

    public final static UserPenalty toUserPenalty(UserPenaltyDto userPenaltyDto) {

        return new UserPenalty(userPenaltyDto.getId(), userPenaltyDto.getSilencedUntil(), userPenaltyDto.getBlockedUntil());

    }
}
