package backend.rest.dtos;

import backend.model.entities.Tag;

import java.util.List;
import java.util.stream.Collectors;

public class TagConversor {

    private TagConversor() {}

    public final static TagDto toTagDto(Tag tag) {
        return new TagDto(tag.getId(), tag.getName(), tag.getLink(), tag.getCoordinateX(), tag.getCoordinateY(),
                tag.getCategory().getId(), tag.getImage().getId(), tag.getBrand() == null ? null : tag.getBrand().getId());
    }

    public final static List<TagDto> toTagDtos(List<Tag> tags) {

        return tags.stream().map(u -> toTagDto(u)).collect(Collectors.toList());

    }

}
