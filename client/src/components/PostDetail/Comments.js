import { useState, useRef } from 'react';
import { Typography, TextField, Button } from '@mui/material';
import { useDispatch } from 'react-redux';

import { commentPost } from '../../actions/posts';

const Comments = ({ post }) => {
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const [comments, setComments] = useState(post?.comments);
  const commentsRef = useRef();

  const handleComment = async () => {
    const newComments = await dispatch(commentPost(comment, post.id));

    setComment('');
    setComments(newComments);

    commentsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
        <div style={{ width: '70%', marginBottom:'1.75em' }}>
          <Typography gutterBottom variant="h6">Write a comment</Typography>
          <TextField fullWidth rows={4} variant="outlined" label="Comment" multiline value={comment} onChange={(e) => setComment(e.target.value)} />
          <br />
          <Button style={{ marginTop: '10px' }} fullWidth disabled={!comment.length} color="primary" variant="contained" onClick={handleComment}>
            Comment
          </Button>
        </div>
        <div sx={{
            height: '200px',
            overflowY: 'auto',
            marginRight: '30px',
          }}>
          <Typography gutterBottom variant="h4">Comments</Typography>
          {comments?.map((c, i) => (
            <Typography key={i} gutterBottom variant="subtitle1">
              <strong style={{ textDecoration: 'none', color: '#3f51b5' }}>{c["username"]}: </strong>
              {c["comment"]}
            </Typography>
          ))}
          <div ref={commentsRef} />
        </div>
      </div>
    </div>
  );
};

export default Comments;