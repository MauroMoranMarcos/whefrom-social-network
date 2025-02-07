package backend.rest.dtos;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class RewardDto {

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
    private Long brandId;

    public RewardDto() {
    }

    public RewardDto(Long id, String name, String description, LocalDateTime creationDate, LocalDate endDate, Long pointsCost,
                     Long publicationsNeeded, Long stock, byte[] imgFile, Boolean hidden, Long brandId) {
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
        this.brandId = brandId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @NotNull
    @Size(min = 1, max = 60)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @NotNull
    @Size(min = 1, max = 120)
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

    @NotNull
    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    @NotNull
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

    @NotNull
    public Long getStock() {
        return stock;
    }

    public void setStock(Long stock) {
        this.stock = stock;
    }

    @NotNull
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

    @NotNull
    public Long getBrandId() {
        return brandId;
    }

    public void setBrandId(Long brandId) {
        this.brandId = brandId;
    }
}
