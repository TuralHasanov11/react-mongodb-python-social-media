import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { alpha } from '@mui/material/styles';

import Icon from '../Auth/icon';
import { login, register } from '../../actions/auth';
import { AUTH } from '../../constants/actionTypes';
import Input from '../../components/Auth/Input';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
  const [form, setForm] = useState(initialState);
  const [isRegister, setIsRegister] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  const switchMode = () => {
    setForm(initialState);
    setIsRegister((prevRegister) => !prevRegister);
    setShowPassword(false);
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (isRegister) {
      dispatch(register(form, navigate));
    } else {
      dispatch(login(form, navigate));
    }
  };

  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;

    try {
      dispatch({ type: AUTH, data: { result, token } });

      navigate('/', { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const googleError = () => console.log('Google Sign In was unsuccessful. Try again later');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Container component="main" maxWidth="xs">
      <Paper sx={{
          marginTop: (theme) => alpha(theme.spacing(8)),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: (theme) => alpha(theme.spacing(2)),
        }} elevation={6}>
        <Avatar sx={{
            margin: (theme) => alpha(theme.spacing(1)),
            backgroundColor: (theme) => alpha(theme.palette.secondary.main),
          }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">{ isRegister ? 'Sign up' : 'Sign in' }</Typography>
        <form sx={{
            width: '100%', // Fix IE 11 issue.
            marginTop: (theme) => alpha(theme.spacing(3)),
          }} onSubmit={submitForm}>
          <Grid container spacing={2}>
            { isRegister && (
            <>
              <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
              <Input name="lastName" label="Last Name" handleChange={handleChange} half />
            </>
            )}
            <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
            { isRegister && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ margin: (theme) => alpha(theme.spacing(3, 0, 2))}}>
            { isRegister ? 'Sign Up' : 'Sign In' }
          </Button>
          <GoogleLogin
            clientId="510679744080-1463savaa0fuigldr4i4gvmpa06l41n3.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button sx={{
                marginBottom: (theme) => alpha(theme.spacing(2)),
              }} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleError}
            cookiePolicy="single_host_origin"
          />
          <Grid container justify="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                { isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign Up" }
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;