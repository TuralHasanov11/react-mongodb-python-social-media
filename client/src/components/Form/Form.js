import useStyles from './styles'
import { TextField, Button, Typography, Paper } from '@mui/material'
import { createPost, updatePost } from '../../actions/posts';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { useNavigate } from 'react-router-dom';

export default function Form({ postId, setPostId }){
    const [postData, setPostData] = useState({ title: '', message: '', tags: [], selectedFile: '' });
    const post = useSelector((state) => (postId ? state.posts.posts.find((message) => message._id === postId) : null));
    const dispatch = useDispatch();
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));
    const navigate = useNavigate();


    useEffect(() => {
      if (!post?.title) clear();
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

    if (!user?.result?.name) {
        return (
          <Paper className={classes.paper} elevation={6}>
            <Typography variant="h6" align="center">
              Please Sign In to create your own memories and like other's memories.
            </Typography>
          </Paper>
        );
      }
    
      const handleAddTag = (tag) => {
        setPostData({ ...postData, tags: [...postData.tags, tag] });
      };
    
      const handleDeleteTag = (chipToDelete) => {
        setPostData({ ...postData, tags: postData.tags.filter((tag) => tag !== chipToDelete) });
      };
    

    return (
        <Paper className={classes.paper} elevation={6}>
        <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
            <Typography variant="h6">{postId ? `Editing "${post?.title}"` : 'Creating a Memory'}</Typography>
            <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />
            <TextField name="message" variant="outlined" label="Message" fullWidth multiline rows={4} value={postData.message} onChange={(e) => setPostData({ ...postData, message: e.target.value })} />
            <div style={{ padding: '5px 0', width: '94%' }}>
            <ChipInput
                name="tags"
                variant="outlined"
                label="Tags"
                fullWidth
                value={postData.tags}
                onAdd={(chip) => handleAddTag(chip)}
                onDelete={(chip) => handleDeleteTag(chip)}
            />
            </div>
            <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} /></div>
            <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
            <Button variant="contained" color="secondary" size="small" onClick={clearForm} fullWidth>Clear</Button>
        </form>
        </Paper>
    )
}