package backend.rest.dtos;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class TagDto {

    private Long id;
    private String name;
    private String link;
    private int coordinateX;
    private int coordinateY;
    private Long categoryId;
    private Long imageId;
    private Long brandId;

    public TagDto() {
    }

    public TagDto(Long id, String name, String link, int coordinateX, int coordinateY, Long categoryId, Long imageId, Long brandId) {
        this.id = id;
        this.name = name;
        this.link = link;
        this.coordinateX = coordinateX;
        this.coordinateY = coordinateY;
        this.categoryId = categoryId;
        this.imageId = imageId;
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
    @Size(min = 1, max = 600)
    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    @NotNull
    public int getCoordinateX() {
        return coordinateX;
    }

    public void setCoordinateX(int coordinateX) {
        this.coordinateX = coordinateX;
    }

    @NotNull
    public int getCoordinateY() {
        return coordinateY;
    }

    public void setCoordinateY(int coordinateY) {
        this.coordinateY = coordinateY;
    }

    @NotNull
    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    @NotNull
    public Long getImageId() {
        return imageId;
    }

    public void setImageId(Long imageId) {
        this.imageId = imageId;
    }

    public Long getBrandId() {
        return brandId;
    }

    public void setBrandId(Long brandId) {
        this.brandId = brandId;
    }
}
