import { useState } from 'react';
import { Container, Grow, Grid, AppBar, TextField, Button, Paper } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
// import ChipInput from 'material-ui-chip-input';

import { getPostsBySearch } from '../actions/posts';
import Posts from '../components/Posts/Posts';
import Form from '../components/Form/Form';
import Pagination from '../components/Pagination'
import { alpha } from '@mui/material/styles';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const query = useQuery();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');

  const [postId, setPostId] = useState(0);
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  const searchPosts = () => {
    if (search.trim() || tags) {
      dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
      navigate(`/posts/search?searchQuery=${search}&tags=${tags.join(',')}`);
    } else {
      navigate('/');
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPosts();
    }
  };

  const handleAddTag = (tag) => setTags([...tags, tag]);

  const handleDeleteTag = (chipToDelete) => setTags(tags.filter((tag) => tag !== chipToDelete));

  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid container justify="space-between" alignItems="stretch" spacing={3} sx={{
          [(theme)=>alpha(theme.breakpoints.down('xs'))]: {
            flexDirection: 'column-reverse',
          },
        }}>
          <Grid item xs={12} sm={6} md={9}>
            <Posts setPostId={setPostId} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBar 
              sx={{
                borderRadius: 4,
                marginBottom: '1rem',
                display: 'flex',
                padding: '16px',
              }} 
              position="static" 
              color="inherit"
            >
              <TextField onKeyDown={handleKeyPress} name="search" variant="outlined" label="Search Memories" fullWidth value={search} onChange={(e) => setSearch(e.target.value)} />
              {/* <ChipInput
                style={{ margin: '10px 0' }}
                value={tags}
                onAdd={(chip) => handleAddTag(chip)}
                onDelete={(chip) => handleDeleteTag(chip)}
                label="Search Tags"
                variant="outlined"
              /> */}
              <Button onClick={searchPosts} variant="contained" color="primary">Search</Button>
            </AppBar>
            <Form postId={postId} setPostId={setPostId} />
            {(!searchQuery && !tags.length) && (
              <Paper sx={{
                borderRadius: 4,
                marginTop: '1rem',
                padding: '16px',
              }} elevation={6}>
                <Pagination page={page} />
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;