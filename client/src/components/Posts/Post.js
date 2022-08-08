import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpAltOutlined from '@mui/icons-material/ThumbUpAltOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import moment from 'moment';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';

import { likePost, deletePost } from '../../actions/posts';
import { useState } from 'react';

const Post = ({ post, setPostId }) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const [likes, setLikes] = useState(post?.likes);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = user?.googleId || user?.id;
  const hasLikedPost = post.likes.find((like) => like === userId);

  const handleLike = async () => {
    dispatch(likePost(post.id));

    if (hasLikedPost) {
      setLikes(post.likes.filter((id) => id !== userId));
    } else {
      setLikes([...post.likes, userId]);
    }
  };

  const Likes = () => {
    if (likes.length > 0) {
      return likes.find((like) => like === userId)
        ? (
          <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}` }</>
        ) : (
          <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
        );
    }

    return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
  };

  const openPost = (e) => {
    // dispatch(getPost(post.id, navigate));
    navigate(`/posts/${post.id}`);
  };

  return (
    <Card sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRadius: '15px',
      height: '100%',
      position: 'relative',
    }} raised elevation={6}>
      <ButtonBase
        component="span"
        name="test"
        sx={{
          display: 'block',
          textAlign: 'initial',
        }}
        onClick={openPost}
      >
        <CardMedia sx={{
            height: 0,
            paddingTop: '56.25%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backgroundBlendMode: 'darken',
          }} image={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.title} />
        <div sx={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            color: 'white',
          }}>
          <Typography variant="h6">{post.name}</Typography>
          <Typography sx={{m: '0.5em'}} variant="body2">{moment(post.createdAt).fromNow()}</Typography>
        </div>
        {(user?.googleId === post?.user?.id || user?.id === post?.user?.id) && (
        <div sx={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          color: 'white',
        }} name="edit">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setPostId(post.id);
            }}
            style={{ color: 'white' }}
            size="small"
          >
            <MoreHorizIcon fontSize="default" />
          </Button>
        </div>
        )}
        <div sx={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '20px',
          }}>
          <Typography mx="0.5em" variant="body2" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
        </div>
        <Typography sx={{
            padding: '0 16px',
          }} gutterBottom variant="h5" component="h2">{post.title}</Typography>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">{post.message.split(' ').splice(0, 20).join(' ')}...</Typography>
        </CardContent>
      </ButtonBase>
      <CardActions sx={{
          padding: '0 16px 8px 16px',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
        <Button size="small" color="primary" disabled={!user} onClick={handleLike}>
          <Likes />
        </Button>
        {(user?.googleId === post?.user?.id || user?.id === post?.user?.id) && (
          <Button size="small" color="secondary" onClick={() => dispatch(deletePost(post.id))}>
            <DeleteIcon fontSize="small" /> &nbsp; Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default Post;