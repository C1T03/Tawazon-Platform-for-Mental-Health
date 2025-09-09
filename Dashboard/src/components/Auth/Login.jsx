import React, { useState, useEffect, useContext } from "react";
import Art from '/Images/Art.svg'
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Typography,
  ThemeProvider,
  createTheme,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
  IconButton,
  Fade
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import CustomTextField from '../ui/CustomTextField';
import axios from "axios";
import { UserContext } from "../context/UserContext";

// إنشاء ثيم مخصص بالألوان المحددة مع تحسينات إضافية
const theme = createTheme({
  palette: {
    primary: {
      main: "#3c7168",
      contrastText: "#fff"
    },
    secondary: {
      main: "#3c7168",
    },
    background: {
      default: "#f5f7fa"
    }
  },
  typography: {
    fontFamily: "Dubai, Dubai-Regular, Arial, sans-serif",
    h4: {
      fontWeight: 600,
      color: "#3c7168"
    },
    body1: {
      color: "#555"
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '1rem',
          padding: '12px 24px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        }
      }
    }
  }
});

const Login = () => {
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoLogging, setIsAutoLogging] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const { login, isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();

  // إيقاف loading state عند التحميل
  useEffect(() => {
    setIsAutoLogging(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const { accessToken, refreshToken, user } = response.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        login(user, { accessToken, refreshToken });
        navigate("/");
      } else {
        setMessage(response.data.message || "فشل تسجيل الدخول");
        setOpenSnackbar(true);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء تسجيل الدخول";
      setMessage(errorMessage);
      setOpenSnackbar(true);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (isAutoLogging) {
    return (
      <ThemeProvider theme={theme}>
        <Container
          maxWidth="xl"
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "background.default",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Fade in={true} timeout={500}>
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress size={60} thickness={4} sx={{ color: "primary.main", mb: 3 }} />
              <Typography variant="h6" color="primary">
                جاري التحقق من بيانات الجلسة...
              </Typography>
            </Box>
          </Fade>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
          p: 3
        }}
      >
        <Container component="main" maxWidth="md">
          <Fade in={true} timeout={800}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                boxShadow: 3,
                borderRadius: 4,
                overflow: "hidden",
                bgcolor: "background.paper",
                maxWidth: 1000,
                width: "100%",
                mx: "auto"
              }}
            >
              {/* الجانب الجمالي */}
              <Box
                sx={{
                  flex: 1,
                  bgcolor: "primary.main",
                  p: 4,
                  display: { xs: "none", md: "flex" },
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  textAlign: "center"
                }}
              >
                <Box
                  component="img"
                  src={Art}
                  alt="Logo"
                  sx={{
                    height: 180,
                    mb: 3
                  }}
                />

                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#ffff' }}>
                  مرحباً بعودتك
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, color: '#f1f1f1' }}>
                  سجل الدخول للوصول إلى لوحة التحكم الخاصة بك
                </Typography>
              </Box>

              {/* نموذج تسجيل الدخول */}
              <Box
                sx={{
                  flex: 1,
                  p: { xs: 3, sm: 4, md: 5 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center"
                }}
              >
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                    تسجيل الدخول
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    أدخل بياناتك للوصول إلى حسابك
                  </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <CustomTextField
                    label="البريد الإلكتروني"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    icon={<EmailIcon />}
                    placeholder="أدخل بريدك الإلكتروني"
                  />

                  <CustomTextField
                    label="كلمة المرور"
                    type={showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                    icon={<LockIcon />}
                    placeholder="أدخل كلمة المرور"
                    endIcon={
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        size="small"
                        sx={{ color: data.password ? '#4faa84' : '#999' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    }
                  />

                  <Box sx={{ textAlign: "end", mb: 2 }}>
                    <Button
                      variant="text"
                      size="small"
                      sx={{ color: "primary.main" }}
                      onClick={() => navigate("/forgot-password")}
                    >
                      نسيت كلمة المرور؟
                    </Button>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    size="large"
                    sx={{
                      mt: 2,
                      mb: 3,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: "1rem"
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "دخول"
                    )}
                  </Button>

                  <Typography variant="body2" color="text.secondary" align="center">
                    ليس لديك حساب؟{" "}
                    <Button
                      variant="text"
                      size="small"
                      sx={{ color: "primary.main" }}
                      onClick={() => navigate("/register")}
                    >
                      إنشاء حساب جديد
                    </Button>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Fade>
        </Container>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default Login;