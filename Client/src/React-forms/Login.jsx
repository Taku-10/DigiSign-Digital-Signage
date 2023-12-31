import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import jwt_decode from "jwt-decode";
import Axios from "axios";

import "react-toastify/dist/ReactToastify.css";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CircularIndeterminate from "../CircularIndeterminate";
import { useEffect, useState } from "react";
import { validationSchema } from "../Validations/validations.js";
import * as Yup from "yup";
import { useUser } from "../UserContext";
import ResponsiveAppBar from "../ResponsiveAppBar.jsx";
const theme = createTheme();

export default function Login() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [toastId, setToastId] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [username, setUserName] = useState("");

  useEffect(() => {
    if (loginSuccess && toastId) {
      // Check the status after a delay
      setShow(false);
      setTimeout(() => {
        const isActive = toast.isActive(toastId);
        if (isActive) {
          toast.done();
          navigate("/screens", { state: { username } });
        }
      }, 2000);
    }
  }, [show, loginSuccess, toastId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear the error for this field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });

      setShow(true);
      const response = await Axios.post("http://localhost:3000/login", {
        username: formData.username,
        password: formData.password,
      });

      if (response.status === 200) {
        // Successful login
        const responseData = response.data;
        const token = responseData.token;
        const user = jwt_decode(token);
        const usr = user.username;
        const role = user.role;
        setUserName(usr);
        setUser({ user: { username: usr, show: false }, other: { role: role, screenId: "" } })
        localStorage.setItem("token", token);
        const id = toast.success(`Welcome back, ${usr}`);

        setToastId(id);
        setLoginSuccess(true);
      } else {
        toast.error("Incorrect username and or password");

        setShow(false);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        toast.error("Incorrect username and or password");
        setShow(false);
      }
    }
  };

  return (
    <>
      <ResponsiveAppBar />
      <ToastContainer />
      <div style={{ position: "relative" }}>
        {show && <CircularIndeterminate info={"Logging in..."} />}
        <ThemeProvider theme={theme}>
          <Grid container component="main" sx={{ height: "100vh" }}>
            <CssBaseline />
            <Grid
              item
              xs={false}
              sm={4}
              md={7}
              sx={{
                backgroundImage:
                  "url(https://source.unsplash.com/random?wallpapers)",
                backgroundRepeat: "no-repeat",
                backgroundColor: (t) =>
                  t.palette.mode === "light"
                    ? t.palette.grey[50]
                    : t.palette.grey[900],
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Grid
              item
              xs={12}
              sm={8}
              md={5}
              component={Paper}
              elevation={6}
              square
            >
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 1 }}
                >
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    placeholder="johndoe123"
                    value={formData.username}
                    onChange={handleChange}
                    error={!!errors.username}
                    helperText={errors.username}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    placeholder="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Grid container justifyContent="center">
                    <Grid item>
                      <Link
                        component={RouterLink}
                        to="/register"
                        variant="body2"
                      >
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </ThemeProvider>
      </div>
    </>
  );
}
