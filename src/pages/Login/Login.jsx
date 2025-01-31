import React, { useState } from "react";
import { Container, Box, TextField, FormControlLabel, Checkbox, Button, Typography, Link, Paper } from "@mui/material";
import { styled } from "@mui/system";
import logo from '../../../public/play-school-logo.png'
import leftBg from '../../../public/login-left-bg.png'
import rightBg from '../../../public/login-right-bg.png'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/slices/authSlice";
import API from "../../utils/api";

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

    const handleLogin = async () => {

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        try {
            const response = await API.post("Auth/admin/login", formData);

            if (response.status === 200) {
                dispatch(login({ user: response?.data?.data, token: response?.data.data?.token }));
                navigate("/dashboard");
            }
            
        } catch (error) {

            console.error("Login failed:", error);
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
                backgroundImage: "url('../../public/login-bg.png')",
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
            }}
        >
            <img src={leftBg} alt="sdv" width={550} style={{ position: 'absolute', bottom: 0, left: 0 }} />
            <img src={rightBg} alt="sdv" width={550} style={{ position: 'absolute', bottom: 0, right: 0 }} />
            <StyledPaper elevation={3}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <img style={{ transition: 'ease', marginBottom: 20 }} src={logo} alt="" width={'90%'} height={'80'} />
                    <TextField fullWidth label="Username" margin="normal" variant="outlined" onChange={(e) => setEmail(e.target.value)} />
                    <TextField fullWidth label="Password" margin="normal" variant="outlined" type="password" onChange={(e) => setPassword(e.target.value)} />
                    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center" mt={1}>
                        <FormControlLabel control={<Checkbox color="primary" />} label="Remember this Device" />
                        <Link href="#" variant="body2">
                            Forgot Password?
                        </Link>
                    </Box>
                    <Button fullWidth variant="contained" sx={{ mt: 2, py: 1.2 }} onClick={() => handleLogin()}>
                        Sign In
                    </Button>
                </Box>
            </StyledPaper>
        </Container>
    );
};

export default Login;
