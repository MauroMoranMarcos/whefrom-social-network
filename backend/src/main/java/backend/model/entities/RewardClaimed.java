package backend.model.entities;

import javax.persistence.*;

@Entity
public class RewardClaimed {

    private Long id;
    private User user;
    private Reward reward;

    public RewardClaimed() {
    }

    public RewardClaimed(User user, Reward reward) {
        this.user = user;
        this.reward = reward;
    }

    public RewardClaimed(Long id, User user, Reward reward) {
        this.id = id;
        this.user = user;
        this.reward = reward;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "rewardId")
    public Reward getReward() {
        return reward;
    }

    public void setReward(Reward reward) {
        this.reward = reward;
    }

}
