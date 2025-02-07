package backend.model.entities;

public class ImageWithLikes {

    private final Image image;
    private final Long numImageLikes;

    public ImageWithLikes(Image image, Long numImageLikes) {
        this.image = image;
        this.numImageLikes = numImageLikes;
    }

    public Image getImage() {
        return image;
    }

    public Long getNumImageLikes() {
        return numImageLikes;
    }

}
