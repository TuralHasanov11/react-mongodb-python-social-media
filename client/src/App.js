import {Container} from '@mui/material';
import Navbar from './components/Inc/Navbar/Navbar';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './views/Home';
import Auth from './views/Auth/Auth';
import PostDetail from './views/Posts/PostDetail'

function App() {

  const user = JSON.parse(localStorage.getItem('profile'));

  return (
    <div className="App">
      <Container maxWidth="lg">
        <Navbar />
        <Routes>
          <Route path='/' exact element={ <Home />}></Route>
          <Route path='/search' exact element={ <Home />}></Route>
          <Route path='/posts/:id' exact element={ <PostDetail />}></Route>
          <Route path='/auth' exact element={ !user ? <Auth /> : <Navigate to='/' />}></Route>
          <Route path='*' element={<Navigate to='/' />}></Route>
        </Routes>
      </Container>
    </div>
  );
}

export default App;
