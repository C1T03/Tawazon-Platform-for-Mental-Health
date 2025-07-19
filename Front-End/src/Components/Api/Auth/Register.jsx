import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Paper,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import AuthSwitcher from "./AuthSwitcher";
import { useDispatch } from "react-redux";
import { setUser } from "../../../features/auth/userSlice";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3c7168",
    },
    secondary: {
      main: "#3c7168",
    },
  },
   typography: {
    fontFamily: "Dubai-Regular",
    h4: {
      fontWeight: 600,
    },
  },
});

const Register = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // إنشاء كائن البيانات الكامل
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      name: "",
      age: "",
      gender: "",
      role: "user",
      country: "",
    };

    // إرسال البيانات إلى Redux
    dispatch(setUser(userData));

    console.log("تم إرسال البيانات إلى Redux:", userData);
    setIsAuthenticated(false);
    navigate("/verify");
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        bgcolor: "#fff",
        zIndex: 9999,
      }}
    >
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              py: 4,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                width: "100%",
                borderRadius: 2,
              }}
            >
              <Typography
                component="h1"
                variant="h4"
                align="center"
                sx={{ mb: 3, color: "#3c7168" }}
              >
                إنشاء حساب جديد
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="firstName"
                    label="الاسم الأول"
                    name="firstName"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#3c7168" },
                        "&:hover fieldset": { borderColor: "#3c7168" },
                      },
                    }}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="lastName"
                    label="الاسم الأخير"
                    name="lastName"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#3c7168" },
                        "&:hover fieldset": { borderColor: "#3c7168" },
                      },
                    }}
                  />
                </Box>

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="email"
                  label="البريد الإلكتروني"
                  type="email"
                  id="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#3c7168" },
                      "&:hover fieldset": { borderColor: "#3c7168" },
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    backgroundColor: "#3c7168",
                    "&:hover": { backgroundColor: "#2c5a52" },
                  }}
                >
                  إنشاء حساب
                </Button>

                <AuthSwitcher isLogin={false} />
              </Box>
            </Paper>
          </Box>
        </Container>
      </ThemeProvider>
    </Container>
  );
};

export default Register;
