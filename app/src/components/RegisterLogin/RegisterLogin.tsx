import { DevTool } from "@hookform/devtools";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import bcrypt from "bcryptjs";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Logo from "../../assets/logo.jpg";
import { history } from "../../history";
import { IUser } from "../../services/types";
import { useAppDispatch, useAppSelector } from "../../store";
import { selectUserData } from "../../store/selectors/user";
import {
  createUserAndSafeToDB,
  fetchUserDataFromDB,
} from "../../store/userSlice";
import { LOGIN_MESSAGE } from "./constants";
import { Copyright } from "./Copyright";
import {
  SAppTitle,
  SCopyrightWrapper,
  SErrorMessage,
} from "./RegisterLogin.styles";
import "./RegisterLogin.txt";
import { ILoginCredentials } from "./types";
import { useYupValidationResolver } from "./validation/resolver";
import { loginSchema, registerSchema } from "./validation/schema";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const RegisterLogin = (): JSX.Element => {
  const initialUserCredentials = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };
  const [input, setInput] = useState({
    ...initialUserCredentials,
    isUser: false,
    isUserMessage: LOGIN_MESSAGE["isUser"],
    error: "",
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: useYupValidationResolver(
      input.isUser ? loginSchema : registerSchema
    ),
  });

  useEffect(() => {
    setInput((prevState) => ({
      ...prevState,
      ...getValues(),
    }));
  }, [setInput, getValues]);

  console.log({ errors, v: getValues() });

  const dispatch = useAppDispatch();

  const classes = useStyles();

  const createUserAndSafeToDBCallback = useCallback(
    (user: IUser) => dispatch(createUserAndSafeToDB(user)),
    []
  );

  const fetchUserDataFromDBCallBack = useCallback(
    (loginCredentials: ILoginCredentials) =>
      dispatch(fetchUserDataFromDB(loginCredentials)),
    []
  );

  const selectedUser = useAppSelector(selectUserData);

  const saltRounds = 10;
  const handleRegisterOrLogin = async (event: any) => {
    const userData = selectedUser; // previously getState

    if (!input.isUser) {
      const { firstName, lastName, email, password } = getValues();
      const user = {
        firstName,
        lastName,
        email,
        password: await bcrypt.hash(password, saltRounds),
      };

      await createUserAndSafeToDBCallback(user);

      if (userData?.error) {
        setInput((prevState) => {
          return {
            ...prevState,
            ...initialUserCredentials,
            error: userData.message,
          };
        });
      } else {
        history.push("/profile");
      }
    } else {
      const { email, password } = input;
      const loginCredentials = { email, password };

      await fetchUserDataFromDBCallBack(loginCredentials);

      if (userData?.error) {
        setInput((prevState) => {
          return {
            ...prevState,
            email: "",
            password: "",
            error: userData.message,
          };
        });
      } else {
        history.push("/profile");
      }
    }
  };

  const handleLoginByUser = async (event: any) => {
    event.preventDefault();
    setInput({
      ...input,
      email: "",
      password: "",
      isUser: !input.isUser,
      isUserMessage: input.isUser
        ? LOGIN_MESSAGE["isUser"]
        : LOGIN_MESSAGE["isNewUser"],
    });
  };

  const handleChange = async (event: any) => {
    const { name, value } = event.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  return (
    <Container component="main" maxWidth="xs" style={{ paddingTop: "5%" }}>
      {/*<CssBaseline />*/}
      <div className={classes.paper}>
        <Avatar
          style={{ height: "100px", width: "100px" }}
          alt="Remy Sharp"
          src={Logo}
        ></Avatar>
        <SAppTitle>Appetize</SAppTitle>
        {/*{import.meta.env.DEVELOPMENT === "true" && (*/}
        <DevTool control={control} placement="top-right" />
        {/*)}*/}
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit(handleRegisterOrLogin)}
        >
          <Grid container spacing={2}>
            {!input.isUser ? (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="fname"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    {...register("firstName")}
                  />
                  <SErrorMessage>{errors.firstName?.message}</SErrorMessage>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    autoComplete="lname"
                    {...register("lastName")}
                  />
                  <SErrorMessage>{errors.lastName?.message}</SErrorMessage>
                </Grid>
              </>
            ) : (
              ""
            )}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                {...register("email")}
              />
              <SErrorMessage>{errors.email?.message}</SErrorMessage>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                {...register("password")}
              />
              <SErrorMessage>{errors.password?.message}</SErrorMessage>
            </Grid>
            <Grid item xs={12}>
              <label id="register-login-error" value={input.error}>
                {input.error}
              </label>
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
            // onClick={handleRegisterOrLogin}
          >
            {input.isUser ? "Sign in" : "Sign up"}
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link
                href="#"
                variant="body2"
                id="switch-user-link"
                onClick={handleLoginByUser}
              >
                {input.isUserMessage}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <SCopyrightWrapper>
        <Copyright />
      </SCopyrightWrapper>
    </Container>
  );
};
