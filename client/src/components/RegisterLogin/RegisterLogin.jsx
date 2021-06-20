import { useState } from 'react';
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

import ApiClient from '../../services/ApiClient';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
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

const LOGIN_MESSAGE = { isUser: 'Already have an account? Sign in!', isNewUser: 'Please click here to register!' }
export default function RegisterLogin ({isUserForRouting, onRegister, onLogin }) {
  const classes = useStyles();
  const [input, setInput] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    isUser: isUserForRouting.isUser,
    isUserMessage: LOGIN_MESSAGE['isUser'],
    error: '',
  });
  const handleRegisterOrLogin = async (event) => {
    event.preventDefault();

    if(!input.isUser) {
      const registerResponse = await ApiClient.registerUser(input);
      if(registerResponse.error === '409' ) {
        setInput('');
        setInput({error: registerResponse.message})
      } else {
        onLogin(registerResponse._id);
      }
    } else {
      console.log("LOGIN REACT")
      const loginResponse = await ApiClient.loginUser(input);
      if(loginResponse.error === '401' ) {
        setInput('');
        setInput({error: loginResponse.message})
      } else {
        onLogin(loginResponse._id);
      }
    }
  }

  const handleLogIn = async (event) => {
    event.preventDefault();
    setInput({
      isUser: !input.isUser,
      isUserMessage: input.isUser ? LOGIN_MESSAGE['isUser'] : LOGIN_MESSAGE['isNewUser'],
    });
    onRegister(input.isUser);
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput((prevInput) => ({ ...prevInput, [name]: value }));
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
        <Typography component="h1" variant="h3" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
          Appetize
        </Typography>
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
            <label>{input.error}</label>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleRegisterOrLogin}
          >
          {input.isUser ? 'Sign in' : 'Sign up'}
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="#" variant="body2" onClick={handleLogIn}>
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
