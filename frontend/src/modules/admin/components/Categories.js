import {List} from "@mui/material";
import PropTypes from "prop-types";

import Category from "./Category";

const Categories = ({categories, active}) => {

    return (
        <List>
            {categories.map(category =>
                <Category category={category} active={active} />
            )}
        </List>

    );

}

Categories.propTypes = {
    categories: PropTypes.array.isRequired
};

export default Categories;