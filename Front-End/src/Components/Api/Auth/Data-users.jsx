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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../features/auth/userSlice";
import axios from "axios";
import { setLogIn } from "../../../features/auth/AuthLogIn";
import FormTextField from "../../ui/FormTextField";

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

const DataUsers = ({ setIsAuthenticated }) => {
  const userData = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    name: "",
    email: userData.email || "",
    password: "",
    age: "",
    city: "",
    address: "",
    country: "",
    gender: "",
    role: "user",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLogIn());
    if (!formData.name || !formData.email || !formData.password) {
      alert("الرجاء إدخال جميع البيانات المطلوبة");
      return;
    }

    try {
      // 1. حفظ البيانات في Redux
      dispatch(setUser(formData));

      // 2. إرسال البيانات إلى الخلفية
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: formData.age,
        gender: formData.gender,
        role: formData.role,
        city: formData.city,
        address: formData.address,
        country: formData.country,
        bio: userData.bio,
      });

      console.log("تم حفظ المستخدم في قاعدة البيانات:", response.data);

      // 3. تحديث حالة المصادقة والتوجيه
      setIsAuthenticated(true);
      navigate("/home");
    } catch (error) {
      console.error(
        "حدث خطأ أثناء حفظ البيانات:",
        error.response?.data || error.message
      );
      alert("حدث خطأ أثناء حفظ البيانات. الرجاء المحاولة مرة أخرى.");
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <ThemeProvider theme={theme}>
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
          
          <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: 2 }}>
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
              إكمال بيانات المستخدم
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <FormTextField
                name="name"
                label="اسم المستخدم"
                id="name"
                value={formData.name}
                onChange={handleChange}
              />
              <FormTextField
                name="email"
                label="البريد الإلكتروني"
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
              />
              <FormTextField
                name="password"
                label="كلمة المرور"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
              />
              <FormTextField
                name="age"
                label="العمر"
                type="number"
                id="age"
                value={formData.age}
                onChange={handleChange}
              />
              <FormTextField
                name="country"
                label="البلد"
                id="country"
                value={formData.country}
                onChange={handleChange}
              />
              <FormTextField
                name="city"
                label="المدينة"
                id="city"
                value={formData.city}
                onChange={handleChange}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="gender-label">الجنس</InputLabel>
                <Select
                  labelId="gender-label"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#3c7168" },
                    },
                  }}
                >
                  <MenuItem value="male">ذكر</MenuItem>
                  <MenuItem value="female">أنثى</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">الصفة</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#3c7168" },
                    },
                  }}
                >
                  <MenuItem value="doctor">طبيب</MenuItem>
                  <MenuItem value="user">مستخدم</MenuItem>
                </Select>
              </FormControl>

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
                إكمال التسجيل
              </Button>
            </Box>
          </Paper>
        </Box>
      </ThemeProvider>
    </Container>
  );
};

export default DataUsers;
