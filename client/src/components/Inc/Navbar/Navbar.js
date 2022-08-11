import { AppBar, Typography, Toolbar, Avatar, Button } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';
import { alpha } from '@mui/material/styles';
import appLogo from '../../../images/appLogo1.png';
import * as actionType from '../../../constants/actionTypes';
import { useEffect, useState } from 'react';
import { deepPurple } from '@mui/material/colors';
import { styled } from '@mui/system';

const UserNav = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '400px',
  width:{
    sm: 'auto'
  },
  marginTop:{
    sm: 20
  },
  justifyContent:{
    sm: 'center'
  }
});

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    dispatch({ type: actionType.LOGOUT });

    navigate('/auth', { replace:true });

    setUser(null);
  };

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  return (
    <AppBar sx={{
      borderRadius: 15,
      margin: '30px 0',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 50px',
    }} position="static" color="inherit">
      <Link to="/" sx={{
          display: 'flex',
          alignItems: 'center',
        }}>
        <img component={Link} to="/" className="app-logo" src={appLogo} height="45px" alt="icon"/>
      </Link>
      <Toolbar sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '400px',
          width: {
            sm: 'auto',
          },
        }}>
        {user ? (
          <UserNav>
            <Avatar sx={{
                color: (theme) => alpha(theme.palette.getContrastText(deepPurple[500])),
                backgroundColor: deepPurple[500],
                mx:1
              }} alt={user?.username} src={user?.imageUrl}>{user?.username[0]}</Avatar>
            <Typography sx={{
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
              }} variant="h6">{user?.username}</Typography>
            <Button variant="contained" 
              sx={{
                marginLeft: '20px',
              }} 
              color="secondary" onClick={logout}>Logout</Button>
          </UserNav>
        ) : (
          <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;