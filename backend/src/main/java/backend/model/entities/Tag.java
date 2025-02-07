package backend.model.entities;

import javax.persistence.*;

@Entity
public class Tag {

    private Long id;
    private String name;
    private String link;
    private int coordinateX;
    private int coordinateY;
    private Category category;
    private Image image;
    private User brand;

    public Tag() {
    }

    public Tag(Long id, String name, String link, int coordinateX, int coordinateY, Category category, Image image, User brand) {
        this.id = id;
        this.name = name;
        this.link = link;
        this.coordinateX = coordinateX;
        this.coordinateY = coordinateY;
        this.category = category;
        this.image = image;
        this.brand = brand;
    }

    public Tag(String name, String link,  int coordinateX, int coordinateY, Category category, Image image) {
        this.name = name;
        this.link = link;
        this.coordinateX = coordinateX;
        this.coordinateY = coordinateY;
        this.category = category;
        this.image = image;
    }

    public Tag(String name, String link, int coordinateX, int coordinateY, Category category, Image image, User brand) {
        this.name = name;
        this.link = link;
        this.coordinateX = coordinateX;
        this.coordinateY = coordinateY;
        this.category = category;
        this.image = image;
        this.brand = brand;
    }

    public Tag(String name, int coordinateX, int coordinateY, Category category, Image image, User brand) {
        this.name = name;
        this.coordinateX = coordinateX;
        this.coordinateY = coordinateY;
        this.category = category;
        this.image = image;
        this.brand = brand;
    }

    public Tag(String name, int coordinateX, int coordinateY, Category category, Image image) {
        this.name = name;
        this.coordinateX = coordinateX;
        this.coordinateY = coordinateY;
        this.category = category;
        this.image = image;
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

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public int getCoordinateX() {
        return coordinateX;
    }

    public void setCoordinateX(int coordinateX) {
        this.coordinateX = coordinateX;
    }

    public int getCoordinateY() {
        return coordinateY;
    }

    public void setCoordinateY(int coordinateY) {
        this.coordinateY = coordinateY;
    }

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "categoryId")
    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "imageId")
    public Image getImage() {
        return image;
    }

    public void setImage(Image image) {
        this.image = image;
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
