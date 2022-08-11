import { useSelector } from 'react-redux'
import Post from './Post'
import {Grid, CircularProgress} from "@mui/material"


export default function Posts({ setPostId }){
    const { posts, isLoading } = useSelector((state) => state.posts);
  
    if (!posts.length && !isLoading) return 'No posts';
  
    return (
      isLoading ? <CircularProgress /> : (
        <Grid sx={{
          borderRadius: 15,
          margin: '30px 0',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '10px 50px',
        }} container alignItems="stretch" spacing={3}>
          {posts?.map((post) => (
            <Grid key={post.id} item xs={12} sm={12} md={6} lg={3}>
              <Post post={post} setPostId={setPostId} />
            </Grid>
          ))}
        </Grid>
      )
    );
};