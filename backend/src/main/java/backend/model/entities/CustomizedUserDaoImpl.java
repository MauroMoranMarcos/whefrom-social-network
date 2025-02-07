package backend.model.entities;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;

public class CustomizedUserDaoImpl implements CustomizedUserDao {

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
    public Slice<User> find(String text, Boolean onlyBrands, int page, int size) {

        String[] tokens = getTokens(text);
        String queryString;

        if (!onlyBrands) {
            queryString = "SELECT u FROM User u WHERE u.role != 2 ";

            if (tokens.length > 0) {
                queryString += "AND ";
            }
        } else {
            queryString = "SELECT u FROM User u WHERE u.role = 1 ";

            if (tokens.length > 0) {
                queryString += "AND ";
            }
        }

        if (tokens.length != 0) {

            queryString += "(";

            for (int i = 0; i < tokens.length - 1; i++) {
                queryString += "LOWER(u.userName) LIKE LOWER(:token" + i + ") ";
                queryString += "OR LOWER(u.name) LIKE LOWER(:token" + i + ") AND ";
            }

            queryString += "LOWER(u.userName) LIKE LOWER(:token" + (tokens.length - 1) + ")";
            queryString += " OR LOWER(u.name) LIKE LOWER(:token" + (tokens.length - 1) + ")";
            queryString += ")";

        }

        if (onlyBrands) {
            queryString += " ORDER BY u.verified DESC";
        } else {
            queryString += " ORDER BY u.userName";
        }

        Query query = entityManager.createQuery(queryString).setFirstResult(page * size).setMaxResults(size + 1);

        if (tokens.length != 0) {
            for (int i = 0; i < tokens.length; i++) {
                query.setParameter("token" + i, '%' + tokens[i] + '%');
            }
        }

        List<User> users = query.getResultList();
        boolean hasNext = users.size() == (size + 1);

        if (hasNext) {
            users.remove(users.size() - 1);
        }

        return new SliceImpl<>(users, PageRequest.of(page, size), hasNext);

    }
}
