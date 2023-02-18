import {useCallback, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Logo from './logo.jpg';
import {history} from '../../history';
import { useDispatch } from 'react-redux';
import { fetchUserDataFromDB, createUserAndSafeToDB } from '../../store/userSlice';
import { store } from '../../store/index';
import './RegisterLogin.scss';
import bcrypt from 'bcryptjs';
import {LOGIN_MESSAGE} from "./constants";
import React from 'react';
import {IUser} from "../../services/types";
import {selectUser} from "../../store/selectors";
import {ILoginCredentials} from "./types";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'All rights reserved - Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Appetize
      </Link>
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const RegisterLogin = (): JSX.Element => {
  const dispatch = useDispatch();

  const classes = useStyles();
  const initialUserCredentials = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  }
  const [input, setInput] = useState({
    ...initialUserCredentials,
    isUser: false,
    isUserMessage: LOGIN_MESSAGE['isUser'],
    error: '',
  });

  // const asyncWrapper = async (dispatch, asyncFunc, data) => {
  //   await dispatch(asyncFunc(data));
  // }

  const createUserAndSafeToDBCallback = useCallback((user: IUser) => createUserAndSafeToDB(user), []);

  const fetchUserDataFromDBCallBack = useCallback((loginCredentials: ILoginCredentials) => fetchUserDataFromDB(loginCredentials), []);

  const selectedUser = selectUser();

  const saltRounds = 10;
  const handleRegisterOrLogin = async (event: any) => {
    event.preventDefault();

    const userData = selectedUser?.userData;

    if(!input.isUser) {
      const {
        firstName, lastName, email, password,
      } = input;
      const user = { firstName, lastName, email, password: await bcrypt.hash(password, saltRounds), };
      //await asyncWrapper(dispatch, createUserAndSafeToDB, user);

      await createUserAndSafeToDBCallback(user);

      // userData = store.getState().user.userData;

      if(userData?.error) {
        setInput((prevState) => {
          return {
            ...prevState,
            ...initialUserCredentials,
            error: userData.message
          }
        });
      } else {
        history.push('/profile');
      }
    } else {
      const {
        email, password,
      } = input;
      const loginCredentials = { email, password, };

      // await asyncWrapper(dispatch, fetchUserDataFromDB, loginCredentials);
      await fetchUserDataFromDBCallBack(loginCredentials);

      if(userData?.error) {
        setInput((prevState) => {
          return {
            ...prevState,
            email: '',
            password: '',
            error: userData.message
          }
        });
      } else {
        history.push('/profile');
      }
    }
  }

  const handleLoginByUser = async (event: any) => {
    event.preventDefault();
    setInput({
      email: '',
      password: '',
      isUser: !input.isUser,
      isUserMessage: input.isUser ? LOGIN_MESSAGE['isUser'] : LOGIN_MESSAGE['isNewUser'],
    });
  }

  const handleChange = async (event: any) => {
    const { name, value } = event.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value
    }));
  }

  return (
    <Container component="main" maxWidth="xs" style={{ paddingTop: '5%' }}>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar
          style={{ height: '100px', width: '100px' }}
          alt="Remy Sharp"
          src={Logo}
        >
        </Avatar>
        <div className="appName">Appetize</div>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            {!input.isUser ?
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={handleChange}
                  value={input.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  onChange={handleChange}
                  value={input.lastName}
                />
              </Grid>
            </>
            : ''}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleChange}
                value={input.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
                value={input.password}
              />
            </Grid>
            <Grid item xs={12}>
            <label id="register-login-error" value={input.error}>{input.error}</label>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            id="register-login"
            label="register-login"
            className={classes.submit}
            onClick={handleRegisterOrLogin}
          >
          {input.isUser ? 'Sign in' : 'Sign up'}
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="#" variant="body2" id="switch-user-link" onClick={handleLoginByUser}>
                {input.isUserMessage}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
