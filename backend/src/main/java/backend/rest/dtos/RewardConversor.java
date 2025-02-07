package backend.rest.dtos;

import backend.model.entities.Reward;

import java.util.List;
import java.util.stream.Collectors;

public class RewardConversor {

    public RewardConversor() {
    }

    public final static RewardDto toRewardDto(Reward reward) {
        return new RewardDto(reward.getId(), reward.getName(), reward.getDescription(), reward.getCreationDate(),
                reward.getEndDate(), reward.getPointsCost(), reward.getPublicationsNeeded(), reward.getStock(),
                reward.getImgFile(), reward.getHidden(), reward.getBrand().getId());
    }

    public final static List<RewardDto> toRewardDtos(List<Reward> rewards) {

        return rewards.stream().map(u -> toRewardDto(u)).collect(Collectors.toList());

    }

}
