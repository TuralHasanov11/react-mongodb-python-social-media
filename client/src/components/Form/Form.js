import { TextField, Button, Typography, Paper, Chip, Stack } from '@mui/material'
import { createPost, updatePost } from '../../actions/posts';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


export default function Form({ postId, setPostId }){
    const [postData, setPostData] = useState({ title: '', message: '', tags: [], selectedFile: '' });
    const post = useSelector((state) => (postId ? state.posts.posts.find((message) => message.id === postId) : null));
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const navigate = useNavigate();
    const [postTags, setPostTags] = useState(['asda', 'asdas']);
    const [tagsInput, setTagsInput] = useState('');


    useEffect(() => {
      if (!post?.title) clearForm();
      if (post) setPostData(post);
    }, [post]);

    const clearForm = () => {
        setPostId(0);
        setPostData({ title: '', message: '', tags: [], selectedFile: '' });
    };

    const submitForm = async (e) => {
        e.preventDefault();

        if (postId === 0) {
          dispatch(createPost(postData, navigate));
          clearForm();
        } else {
          dispatch(updatePost(postId, postData));
          clearForm();
        }
    };

    if (!user?.id) {
      return (
        <Paper sx={{
            padding: 2,
          }} elevation={6}>
          <Typography variant="h6" align="center">
            Please Sign In to create your own posts and like other's posts.
          </Typography>
        </Paper>
      );
    }
  
    function handleAddTag(event){
      if(event.keyCode === 32){
        setPostData({ ...postData, tags: [...postData.tags, event.target.value] });
        setTagsInput('');
      }
    };
  
    const handleDeleteTag = (chipToDelete) => () => {
      setPostData({ ...postData, tags: postData.tags.filter((chip) => chip !== chipToDelete) });
    };
    

    return (
        <Paper sx={{
            padding: 2,
          }} elevation={6}>
        <form autoComplete="off" noValidate sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            '& .MuiTextField-root': {
              margin: 1,
            },
          }} onSubmit={submitForm}>
            <Typography sx={{
              mt: '0.5em',
            }} variant="h6">{postId ? `Editing "${post?.title}"` : 'Creating a Memory'}</Typography>
            <TextField sx={{
              mt: '0.5em',
            }} name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />
            <TextField sx={{
              mt: '0.5em',
            }} name="message" variant="outlined" label="Message" fullWidth multiline rows={4} value={postData.message} onChange={(e) => setPostData({ ...postData, message: e.target.value })} />
            <div style={{ padding: '5px 0', width: '94%' }}>
              <TextField sx={{
                  mt: '0.5em',
                }} value={tagsInput} variant="outlined" label="Tags" fullWidth onChange={event => setTagsInput(event.target.value)} onKeyDown={handleAddTag} />
              <Stack sx={{
                  mt: '0.5em',
                  display: 'flex'
                }} spacing={1}>
                {postData.tags.map((tag, index) => (<Chip
                  key={index}
                  style={{ margin: '10px 0' }}
                  label={tag}
                  onDelete={handleDeleteTag(tag)}
                  variant="outlined"
                />))}
              </Stack>
            </div>
            <div sx={{
                width: '97%',
                margin: '10px 0',
              }}>
            <FileBase sx={{
              mt: '0.5em',
            }} type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} /></div>
            <Button sx={{
                mt:"0.5em",
                marginBottom: 1,
              }} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
            <Button variant="contained" color="secondary" size="small" onClick={clearForm} fullWidth>Clear</Button>
        </form>

        </Paper>
    )
}