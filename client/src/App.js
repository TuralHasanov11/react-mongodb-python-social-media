import './App.css';
import {Container, AppBar, Typography, Grow} from '@mui/material';
import Posts from './components/Posts/Posts';
import Form from './components/Form/Form';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import {getPosts} from './actions/posts'

function App() {

  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(getPosts())
  }, [ dispatch ])

  return (
    <div className="App">
      <Container maxWidth="lg">
        <AppBar position='static' color='inherit'>
          <Typography variant="h2" align="center">
            Socio
            <img src={''} height="60"/>
          </Typography>
        </AppBar>

        <Grow in>
          <Container>
            <Grid container justify="space-between" alignItems="stretch" spacing="3">
              <Grid item xs={12} sm={7}>
                <Posts/>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Form/>
              </Grid>
            </Grid>
          </Container>
        </Grow>

      </Container>
    </div>
  );
}

export default App;
