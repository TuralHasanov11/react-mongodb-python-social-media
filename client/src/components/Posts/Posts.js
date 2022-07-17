import { useSelector } from 'react-redux'
import Post from './Post'
import useStyles from './styles'
import {Grid, CircularProgress} from "@mui/material"


export default function Posts({ setPostId }){
    const { posts, isLoading } = useSelector((state) => state.posts);
    const classes = useStyles();
  
    if (!posts.length && !isLoading) return 'No posts';
  
    return (
      isLoading ? <CircularProgress /> : (
        <Grid className={classes.container} container alignItems="stretch" spacing={3}>
          {posts?.map((post) => (
            <Grid key={post._id} item xs={12} sm={12} md={6} lg={3}>
              <Post post={post} setPostId={setPostId} />
            </Grid>
          ))}
        </Grid>
      )
    );
};