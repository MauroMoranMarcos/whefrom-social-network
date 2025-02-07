package backend.model.entities;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class CustomizedImageDaoImpl implements CustomizedImageDao {

    @Autowired
    private TagDao tagDao;

    @Autowired
    private UserSettingsDao userSettingsDao;

    @PersistenceContext
    private EntityManager entityManager;

    private String[] getTokens(String keywords) {

        if (keywords == null || keywords.length() == 0) {
            return new String[0];
        } else {
            return keywords.split("\\s");
        }

    }

    @Override
    public Slice<Image> find(Long categoryId, String text, int page, int size) {

        String[] tokens = getTokens(text);
        String queryString = "SELECT i FROM Image i WHERE i.hidden = false";

        if (tokens.length > 0) {
            queryString += " AND ";
        }

        if (tokens.length != 0) {

            for (int i = 0; i < tokens.length - 1; i++) {
                queryString += "LOWER(i.title) LIKE LOWER(:token" + i + ") AND ";
            }

            queryString += "LOWER(i.title) LIKE LOWER(:token" + (tokens.length - 1) + ")";

        }

        queryString += " ORDER BY i.title";

        Query query = entityManager.createQuery(queryString).setFirstResult(page * size).setMaxResults(size + 1);

        if (tokens.length != 0) {
            for (int i = 0; i < tokens.length; i++) {
                query.setParameter("token" + i, '%' + tokens[i] + '%');
            }
        }

        List<Image> images = query.getResultList();

        List<Image> publicImages = new ArrayList<>();

        for (Image image : images) {
            Optional<UserSettings> userSettingsOpt = userSettingsDao.findByUser(image.getUser());
            if (userSettingsOpt.isPresent() && userSettingsOpt.get().getPrivacyPublic()) {
                publicImages.add(image);
            }
        }

        List<Image> filteredImages = new ArrayList<>();

        // If categoryId is used, we loop over all Tags in all Images
        if (categoryId != null) {
            for (Image image : publicImages) {
                boolean hasCategory = false;
                List<Tag> tags = tagDao.findByImageId(image.getId());

                for (Tag tag : tags) {
                    if (tag.getCategory().getId() == categoryId) {
                        hasCategory = true;
                        break;
                    }
                }

                if (hasCategory) {
                    filteredImages.add(image);
                }
            }
        } else {
            filteredImages.addAll(publicImages);
        }

        boolean hasNext = filteredImages.size() == (size + 1);

        if (hasNext) {
            filteredImages.remove(filteredImages.size() - 1);
        }

        return new SliceImpl<>(filteredImages, PageRequest.of(page, size), hasNext);

    }

    @Override
    public Slice<Image> findByUserId(Long userId, Boolean sameUser, int page, int size) {

        String queryString;

        if (!sameUser) {
            queryString = "SELECT i FROM Image i WHERE i.user.id = :userId AND i.hidden = false";
        } else {
            queryString = "SELECT i FROM Image i WHERE i.user.id = :userId";
        }

        queryString += " ORDER BY i.title";

        Query query = entityManager.createQuery(queryString).setFirstResult(page*size).setMaxResults(size+1);

        if (userId != null) {
            query.setParameter("userId", userId);
        }

        List<Image> images = query.getResultList();
        boolean hasNext = images.size() == (size+1);

        if (hasNext) {
            images.remove(images.size()-1);
        }

        return new SliceImpl<>(images, PageRequest.of(page, size), hasNext);

    }
}
