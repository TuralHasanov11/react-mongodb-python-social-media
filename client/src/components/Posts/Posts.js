import { useSelector } from 'react-redux'
import Post from './Post'
import useStyles from './styles'
import {Grid, CircularProgress}


export default function Posts(){
    const classes = useStyles()
    const posts = useSelector(state => state.posts)

    return (
        !posts.length ? <CircularProgress /> : (
            <Grid className={classes.container} container alignItems="stretch" spacing={3}>
                {posts.map((post) => (
                <Grid key={post._id} item xs={12} sm={6} md={6}>
                    <Post post={post} setCurrentId={setCurrentId} />
                </Grid>
                ))}
            </Grid>
        )
    )
}