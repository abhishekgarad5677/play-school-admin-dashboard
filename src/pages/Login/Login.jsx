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
import group from "../../../public/group.png";
import loginIcon from "../../../public/Login-icon.png";
import leftBg from "../../../public/login-left-bg.png";
import rightBg from "../../../public/login-right-bg.png";
import backgroundCover from "../../../public/background-cover2.png";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/slices/authSlice";
import API from "../../utils/api";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid2";

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
      const response = await API.post("Admin/login", formData);

      if (response.status === 200) {
        const user = response?.data?.data;
        dispatch(
          login({
            user: user,
            token: user?.token,
          }),
        );

        if (user.isSuper) {
          navigate("/dashboard"); // Redirect to dashboard if user is super admin
        } else {
          // Redirect to the first route from the permissions array if user is not super admin
          navigate(user?.permissions[0]);
        }
        toast.success("Login successful");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('/background-cover2.png')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
      }}
    >
      <Box
        component="img"
        src={leftBg}
        alt="Left Decoration"
        width={300}
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          display: { xs: "none", md: "block" },
        }}
      />

      <Box
        component="img"
        src={rightBg}
        alt="Right Decoration"
        width={300}
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          display: { xs: "none", md: "block" },
        }}
      />

      <Grid
        container
        sx={{
          maxWidth: "1200px",
          borderRadius: 5,
          border: "1px solid #ccc",
          overflow: "hidden",
        }}
      >
        {/* Left Content */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            p: 4,
            backgroundImage:
              "radial-gradient(circle, #00CAFF 20%, #0066FF 150%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <img
            src={"./login-top-banner.png"}
            alt="Header Graphic"
            style={{
              position: "absolute",
              top: -24,
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
              maxWidth: "100%",
              zIndex: 1,
            }}
          />
          <Box
            component="img"
            src={logo}
            alt="PlaySchool Logo"
            sx={{
              width: { xs: "70%", sm: "24%" },
              mb: { xs: 0.5, md: 2.5 },
            }}
          />
          <Typography
            variant="h5"
            fontWeight={600}
            color="white"
            gutterBottom
            textAlign="center"
          >
            Welcome to PlaySchool
          </Typography>
          <Typography variant="body2" color="white" textAlign="center">
            Access your admin panel to manage the PlaySchool ecosystem and view
            all performance data in one place!
          </Typography>
          <Box
            component="img"
            src={group}
            alt="Illustration"
            width="100%"
            sx={{
              display: { xs: "none", md: "block" },
            }}
          />
        </Grid>

        {/* Right Content (Login Form) */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            p: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            alignItems="center"
          >
            <Box
              component="img"
              src={loginIcon}
              alt="PlaySchool Logo"
              sx={{
                width: { xs: "70%", sm: "40%" },
                mb: { xs: 0.5, md: 2.5 },
                display: { xs: "none", md: "block" },
              }}
            />
            <Typography
              variant="h5"
              color="#00CAFF"
              fontWeight={600}
              gutterBottom
            >
              Login to Admin Dashboard
            </Typography>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
            />
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
            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              sx={{
                mt: 2,
                py: 1.2,
                color: "#fff",
                backgroundImage:
                  "radial-gradient(circle, #00CAFF 0%, #0066FF 100%)",
                backgroundSize: "150%",
                backgroundPosition: "center",
                transition: "background 0.3s ease-in-out",
                "&:hover": {
                  backgroundImage:
                    "radial-gradient(circle, #00CAFF 0%, #0055DD 100%)",
                },
                borderRadius: "20px",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              Sign In
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
