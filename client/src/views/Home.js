import { useEffect, useRef, useState } from 'react';
import { Container, Grow, Grid, AppBar, TextField, Button, Paper, Chip, Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPostsBySearch } from '../actions/posts';
import Posts from '../components/Posts/Posts';
import Form from '../components/Form/Form';
import Pagination from '../components/Pagination'
import { alpha } from '@mui/material/styles';
import { getPosts } from '../actions/posts';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const query = useQuery();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');
  const dispatch = useDispatch();

  const [postId, setPostId] = useState(0);

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

  useEffect(() => {
    if (page) {
      dispatch(getPosts(page));
    }
  }, [dispatch, page]);

  const [searchTags, setSearchTags] = useState('');

  function handleAddTag(event){
    if(event.keyCode === 32){
      setTags([...tags, event.target.value])
      setSearchTags('');
    }
  };

  const handleDeleteTag = (chipToDelete) => () => {
    setTags((chips) => chips.filter((chip) => chip !== chipToDelete));
  };

  return (
    <Grow in>
      <Container maxWidth="xl" sx={{ paddingLeft: "0" }}>
        <Grid container justify="space-between" alignItems="stretch" spacing={3} sx={{
          paddingLeft: "0",
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
              <TextField sx={{
                  mt: '0.5em',
                }} onKeyDown={handleKeyPress} name="search" variant="outlined" label="Search posts" fullWidth value={search} onChange={(e) => setSearch(e.target.value)} />
              <TextField sx={{
                  mt: '0.5em',
                }} value={searchTags} variant="outlined" label="Search Tags" fullWidth onChange={event => setSearchTags(event.target.value)} onKeyDown={handleAddTag} />
              <Stack sx={{
                  mt: '0.5em',
                  display: 'flex'
                }} spacing={1}>
                {tags.map((tag, index) => (<Chip
                  key={index}
                  style={{ margin: '10px 0' }}
                  label={tag}
                  onDelete={handleDeleteTag(tag)}
                  variant="outlined"
                />))}
              </Stack>
              <Button sx={{
                mt: '0.5em',
              }} onClick={searchPosts} variant="contained" color="primary">Search</Button>
            </AppBar>
            <Form postId={postId} setPostId={setPostId} />
            {(!searchQuery && !tags.length) && (
              <Paper sx={{
                borderRadius: 4,
                mt: '1rem',
                p: '16px',
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