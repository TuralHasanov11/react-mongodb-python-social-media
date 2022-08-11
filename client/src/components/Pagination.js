import { useSelector } from 'react-redux';
import { Pagination, PaginationItem } from '@mui/material';
import { Link } from 'react-router-dom';


const Paginate = ({ page }) => {
  const { numberOfPages } = useSelector((state) => state.posts);


  return (
    <Pagination
      count={numberOfPages}
      page={Number(page) || 1}
      variant="outlined"
      color="primary"
      renderItem={(item) => (
        <PaginationItem {...item} component={Link} to={`?page=${item.page}`} />
      )}
    />
  );
};

export default Paginate;