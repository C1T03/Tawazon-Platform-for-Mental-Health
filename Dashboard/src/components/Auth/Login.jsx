import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Typography,
  Paper,
  ThemeProvider,
  createTheme,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { UserContext } from "../context/UserContext"; // استيراد Context

// إنشاء ثيم مخصص بالألوان المحددة
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

const Login = () => {
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoLogging, setIsAutoLogging] = useState(true);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const { login, isAuthenticated } = useContext(UserContext); // استخدام Context بدلاً من Redux
  const navigate = useNavigate();

  // التحقق التلقائي من الجلسة عند التحميل
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          const response = await axios.get(
            "http://localhost:5000/api/verify-token",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (response.data.success) {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user) {
              login(user, {
                accessToken,
                refreshToken: localStorage.getItem("refreshToken"),
              });
              navigate("/");
            }
          }
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      } finally {
        setIsAutoLogging(false);
      }
    };

    checkAuth();
  }, [login, navigate]);

  // إذا كان المستخدم مسجلًا بالفعل، توجيهه للصفحة الرئيسية
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

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

        // حفظ البيانات في localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        // تسجيل الدخول باستخدام Context
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

  if (isAutoLogging) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          bgcolor: "#fff",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThemeProvider theme={theme}>
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={60} sx={{ color: "#3c7168", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#3c7168" }}>
              جاري التحقق من بيانات الجلسة...
            </Typography>
          </Box>
        </ThemeProvider>
      </Container>
    );
  }

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
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              py: 4,
              position: "relative",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                width: "100%",
                borderRadius: 2,
                position: "relative",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                
              </Box>

              <Typography
                component="h1"
                variant="h4"
                align="center"
                sx={{ mb: 3, color: "#3c7168" }}
              >
                تسجيل الدخول
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <Box sx={{ mb: 2 }}>
                  <input
                    type="email"
                    name="email"
                    placeholder="البريد الإلكتروني"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 15px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "16px",
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <input
                    type="password"
                    name="password"
                    placeholder="كلمة المرور"
                    value={data.password}
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px 15px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "16px",
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    backgroundColor: "#3c7168",
                    "&:hover": {
                      backgroundColor: "#2c5a52",
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "دخول"
                  )}
                </Button>
              </Box>
            </Paper>
          </Box>
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
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </Container>
  );
};

export default Login;