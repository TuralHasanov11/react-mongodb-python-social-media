import React, { useEffect } from 'react';
import { Paper, Typography, CircularProgress, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { getPost, getPostsBySearch } from '../../actions/posts';
import Comments from '../../components/PostDetail/Comments';
import { alpha } from '@mui/material/styles';
import { ThemeProvider, createTheme } from '@mui/system';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const theme = createTheme({
  
});

const Post = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPost(id));
  }, [id]);

  useEffect(() => {
    if (post) {
      dispatch(getPostsBySearch({ search: '', tags: post?.tags.join(',') }));
    }
  }, [post]);

  if (!post) return null;

  const openPost = (id) => navigate(`/posts/${id}`);

  if (isLoading) {
    return (
      <Paper elevation={6} sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        borderRadius: '15px',
        height: '39vh',
      }}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  const recommendedPosts = posts.filter(({ id }) => id !== post.id);

  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      <div sx={{
          display: 'flex',
          width: '100%',
          [(theme)=>alpha(theme.breakpoints.down('sm'))]: {
            flexWrap: 'wrap',
            flexDirection: 'column',
          },
        }}>
        <div sx={{
            borderRadius: '20px',
            margin: '10px',
            flex: 1,
          }}>
          <Typography variant="h3" component="h2">{post.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => (
            <Link to={`/tags/${tag}`} style={{ textDecoration: 'none', color: '#3f51b5' }}>
              {` #${tag} `}
            </Link>
          ))}
          </Typography>
          <Typography variant="h6">
            Created by:
            <Link to={`/creators/${post.user.username}`} style={{ textDecoration: 'none', color: '#3f51b5' }}>
              {` ${post.user.username}`}
            </Link>
          </Typography>
          <Typography sx={{ color: 'primary.main' }} variant="body1"><span className='post_created_at'>{moment.unix(post.createdAt).fromNow()}</span></Typography>
          <div sx={{
            marginLeft: '20px',
            [(theme) => alpha(theme.breakpoints.down('sm'))]: {
              marginLeft: 0,
            },
          }}>
            <Divider style={{ margin: '20px 0' }} />
            <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
            <Divider style={{ margin: '20px 0' }} />
            <img sx={{
              borderRadius: '20px',
              objectFit: 'cover',
              width: '90%',
              maxHeight: 300,

            }} src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
          </div>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="body1"><strong>Realtime Chat - coming soon!</strong></Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Comments post={post} />
          <Divider style={{ margin: '20px 0' }} />
        </div>
      </div>
      {!!recommendedPosts.length && (
        <div sx={{
            borderRadius: '20px',
            margin: '10px',
            flex: 1,
          }}>
          <Typography gutterBottom variant="h5">You might also like:</Typography>
          <Divider />
          <div sx={{
              display: 'flex',
              flexDirection:"row",
              [(theme)=>alpha(theme.breakpoints.down('sm'))]: {
                flexDirection: 'column',
              },
            }}>
            {recommendedPosts.map(({ title, name, message, likes, selectedFile, id }, index) => (
              <div style={{ margin: '20px', cursor: 'pointer' }} onClick={() => openPost(id)} key={index}>
                <Typography gutterBottom variant="h6">{title}</Typography>
                <Typography gutterBottom variant="subtitle2">{name}</Typography>
                <Typography gutterBottom variant="subtitle2">{message}</Typography>
                <Typography gutterBottom variant="subtitle1">Likes: {likes.length}</Typography>
                <img src={selectedFile} width="200px" alt="" />
              </div>
            ))}
          </div>
        </div>
      )}
    </Paper>
    
  );
};

export default Post;