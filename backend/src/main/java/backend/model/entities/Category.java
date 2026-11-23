package backend.model.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Category {

    private Long id;
    private String name;
    private Boolean active;

    public Category() {
    }

    private Category(String name, boolean active) {
        this.name = name;
        this.active = active;
    }

    public static Category createNew(String name) {
        return new Category(name, true);
    }

    public static Category createNew(String name, Boolean active) {
        return new Category(name, active != null ? active : true);
    }

    public void updateCategory(String name, Boolean active) {
        this.name = name;
        this.active = active;
    }

    public void deactivate() {
        this.active = false;
    }

    public void activate() {
        this.active = true;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    private void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    private void setName(String name) {
        this.name = name;
    }

    public Boolean getActive() {
        return active;
    }

    private void setActive(Boolean active) {
        this.active = active;
    }
}
