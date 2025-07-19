import React, { useState, useEffect } from "react";
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
import AuthSwitcher from "./AuthSwitcher";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../../features/auth/userSlice";
import { setLogIn } from "../../../features/auth/AuthLogIn";
import FormTextField from "../../ui/FormTextField";

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

// دوال مساعدة للتعامل مع localStorage
const setLocalStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
};

const getLocalStorage = (key) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error getting from localStorage", error);
    return null;
  }
};

const removeLocalStorage = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage", error);
  }
};

const Login = ({ setIsAuthenticated }) => {
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoLogging, setIsAutoLogging] = useState(true);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // إعداد axios interceptors
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = getLocalStorage("accessToken");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = getLocalStorage("refreshToken");
            if (!refreshToken) throw new Error("No refresh token");

            const response = await axios.post(
              "http://localhost:5000/api/refresh-token",
              {
                refreshToken,
              }
            );

            const { accessToken } = response.data;
            setLocalStorage("accessToken", accessToken);

            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            handleLogout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // التحقق التلقائي من التوكن
  useEffect(() => {
    const autoLogin = async () => {
      const accessToken = getLocalStorage("accessToken");
      if (accessToken) {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/verify-token",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (response.data.success) {
            const user = getLocalStorage("user");
            if (user) {
              dispatch(setUser(user));
              dispatch(setLogIn());
              setIsAuthenticated(true);
              navigate("/");
            }
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          handleLogout();
        }
      }
      setIsAutoLogging(false);
    };

    autoLogin();
  }, [dispatch, navigate, setIsAuthenticated]);

  const handleLogout = () => {
    removeLocalStorage("accessToken");
    removeLocalStorage("refreshToken");
    removeLocalStorage("user");
    setIsAuthenticated(false);
    navigate("/login");
  };

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

        // طباعة بيانات المستخدم في الكونسول
        console.log("بيانات المستخدم المسجلة:", {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          age: user.age,
          country: user.country,
          bio: user.bio,
          profile_picture: user.profile_picture,
          accessToken: accessToken ? "*****" : "غير متوفر",
          refreshToken: refreshToken ? "*****" : "غير متوفر",
        });
        const userData = {
          name: user.name,
          email: user.email,
          role: user.role,
          gender: user.gender,
          age: user.age,
          country: user.country,
          bio: user.bio,
          profile_picture: user.profile_picture,
        };
        setLocalStorage("accessToken", accessToken);
        setLocalStorage("refreshToken", refreshToken);
        setLocalStorage("user", user);
        dispatch(setUser(userData));
        dispatch(setLogIn());
        setIsAuthenticated(true);

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

      // طباعة تفاصيل الخطأ إن وجدت
      if (error.response) {
        console.error("تفاصيل الخطأ:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
      }
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
                component={"div"}
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <Box
                  component={"img"}
                  sx={{
                    height: 100,
                    width: 120,
                    mt: -5,
                  }}
                  src="/Images/SVG/Logo.svg"
                />
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
                <FormTextField
                  name="email"
                  label="البريد الإلكتروني"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
                <FormTextField
                  name="password"
                  label="كلمة المرور"
                  type="password"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                />
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
                  {isLoading ? "جاري التحميل..." : "دخول"}
                </Button>

                <AuthSwitcher isLogin={true} />
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
