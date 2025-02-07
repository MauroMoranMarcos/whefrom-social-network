package backend.rest.dtos;

import backend.model.entities.Image;

import java.util.List;
import java.util.stream.Collectors;

public class ImageConversor {

    private ImageConversor() {}

    public final static ImageDto toImageDto(Image image) {
        return new ImageDto(image.getId(), image.getTitle(), image.getDescription(), image.getLocation(), image.getImgFile(),
                image.getDate(), image.getHidden(), image.getUser().getId());
    }

    public final static List<ImageDto> toImageDtos(List<Image> images) {

        return images.stream().map(u -> toImageDto(u)).collect(Collectors.toList());

    }
    
}
