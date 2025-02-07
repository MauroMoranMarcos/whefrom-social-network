package backend.rest.dtos;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

public class ImageDto {

    public interface AllValidations {}

    private Long id;
    private String title;
    private String description;
    private String location;
    private byte[] imgFile;
    private LocalDateTime date;
    private Boolean hidden;
    private Long userId;

    public ImageDto() {
    }

    public ImageDto(Long id, String title, String description, String location, byte[] imgFile, LocalDateTime date,
                    Boolean hidden, Long userId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.imgFile = imgFile;
        this.date = date;
        this.hidden = hidden;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @NotNull(groups={ImageDto.AllValidations.class})
    @Size(min=1, max=60, groups={ImageDto.AllValidations.class})
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    @NotNull(groups={UserDto.AllValidations.class})
    public byte[] getImgFile() {
        return imgFile;
    }

    public void setImgFile(byte[] imgFile) {
        this.imgFile = imgFile;
    }

    @NotNull(groups={UserDto.AllValidations.class})
    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Boolean getHidden() {
        return hidden;
    }

    public void setHidden(Boolean hidden) {
        this.hidden = hidden;
    }

    @NotNull(groups={UserDto.AllValidations.class})
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
