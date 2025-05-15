import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Link,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import logo from "../../../public/play-school-logo.png";
import leftBg from "../../../public/login-left-bg.png";
import rightBg from "../../../public/login-right-bg.png";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/slices/authSlice";
import API from "../../utils/api";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";

const StyledPaper = styled(Paper)({
  padding: "2rem",
  maxWidth: 400,
  margin: "auto",
  textAlign: "center",
  borderRadius: "12px",
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await API.post("Auth/admin/login", formData);

      if (response.status === 200) {
        dispatch(
          login({
            user: response?.data?.data,
            token: response?.data.data?.token,
          })
        );
        navigate("/dashboard");
        toast.success("Login successful");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <Container
      component="main"
      maxWidth="false"
      sx={{
        display: "flex",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#fff",
        backgroundImage: "url('/login-bg.png')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <img
        src={leftBg}
        alt="sdv"
        width={550}
        style={{ position: "absolute", bottom: 0, left: 0 }}
      />
      <img
        src={rightBg}
        alt="sdv"
        width={550}
        style={{ position: "absolute", bottom: 0, right: 0 }}
      />
      <StyledPaper elevation={3}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <img
            style={{ transition: "ease", marginBottom: 20 }}
            src={logo}
            alt=""
            width={"90%"}
          />
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* <TextField fullWidth label="Password" margin="normal" variant="outlined" type="password" onChange={(e) => setPassword(e.target.value)} /> */}
          <TextField
            fullWidth
            label="Password"
            margin="normal"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {/* <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            alignItems="center"
            mt={1}
          >
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Remember this Device"
            />
            <Link href="#" variant="body2">
              Forgot Password?
            </Link>
          </Box> */}
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2, py: 1.2, backgroundColor: "#5d87ff" }}
            onClick={() => handleLogin()}
          >
            Sign In
          </Button>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Login;
