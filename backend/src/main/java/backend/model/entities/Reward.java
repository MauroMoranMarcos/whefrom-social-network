package backend.model.entities;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class Reward {

    public enum FilterType {CREATION_DATE_DESC, CREATION_DATE_ASC, POINTS_COST_DESC, POINTS_COST_ASC, STOCK_DESC,
        STOCK_ASC, STOCK_ASC_ONLY_IN_STOCK};

    private Long id;
    private String name;
    private String description;
    private LocalDateTime creationDate;
    private LocalDate endDate;
    private Long pointsCost;
    private Long publicationsNeeded;
    private Long stock;
    private byte[] imgFile;
    private Boolean hidden;
    private User brand;

    public Reward() {
    }

    public Reward(Long id, String name, String description, LocalDateTime creationDate, LocalDate endDate,
                  Long pointsCost, Long publicationsNeeded, Long stock, byte[] imgFile, Boolean hidden, User brand) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.creationDate = creationDate;
        this.endDate = endDate;
        this.pointsCost = pointsCost;
        this.publicationsNeeded = publicationsNeeded;
        this.stock = stock;
        this.imgFile = imgFile;
        this.hidden = hidden;
        this.brand = brand;
    }

    public Reward(String name, String description, LocalDateTime creationDate, LocalDate endDate, Long pointsCost,
                  Long publicationsNeeded, Long stock, byte[] imgFile, Boolean hidden, User brand) {
        this.name = name;
        this.description = description;
        this.creationDate = creationDate;
        this.endDate = endDate;
        this.pointsCost = pointsCost;
        this.publicationsNeeded = publicationsNeeded;
        this.stock = stock;
        this.imgFile = imgFile;
        this.hidden = hidden;
        this.brand = brand;
    }

    public Reward(String name, String description, LocalDateTime creationDate, LocalDate endDate, Long pointsCost,
                  Long stock, byte[] imgFile, Boolean hidden, User brand) {
        this.name = name;
        this.description = description;
        this.creationDate = creationDate;
        this.endDate = endDate;
        this.pointsCost = pointsCost;
        this.stock = stock;
        this.imgFile = imgFile;
        this.hidden = hidden;
        this.brand = brand;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Long getPointsCost() {
        return pointsCost;
    }

    public void setPointsCost(Long pointsCost) {
        this.pointsCost = pointsCost;
    }

    public Long getPublicationsNeeded() {
        return publicationsNeeded;
    }

    public void setPublicationsNeeded(Long publicationsNeeded) {
        this.publicationsNeeded = publicationsNeeded;
    }

    public Long getStock() {
        return stock;
    }

    public void setStock(Long stock) {
        this.stock = stock;
    }

    public byte[] getImgFile() {
        return imgFile;
    }

    public void setImgFile(byte[] imgFile) {
        this.imgFile = imgFile;
    }

    public Boolean getHidden() {
        return hidden;
    }

    public void setHidden(Boolean hidden) {
        this.hidden = hidden;
    }

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "brandId")
    public User getBrand() {
        return brand;
    }

    public void setBrand(User brand) {
        this.brand = brand;
    }
}
