package backend.rest.dtos;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class UploadRewardParamsDto {

    private String name;
    private String description;
    private LocalDate endDate;
    private Long pointsCost;
    private Long publicationsNeeded;
    private Long stock;
    private MultipartFile imgFile;
    private Long brandId;

    @NotNull
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @NotNull
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @NotNull
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
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
    public MultipartFile getImgFile() {
        return imgFile;
    }

    public void setImgFile(MultipartFile imgFile) {
        this.imgFile = imgFile;
    }

    @NotNull
    public Long getBrandId() {
        return brandId;
    }

    public void setBrandId(Long brandId) {
        this.brandId = brandId;
    }
}
