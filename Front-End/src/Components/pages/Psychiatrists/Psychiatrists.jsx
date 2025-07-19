import React from "react";
import ConsultantCard from "./components/ConsultantCard";
import {
  Container,
  LinearProgress,
  Alert,
  Box,
  Grid,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import SearchIcon from "@mui/icons-material/Search";

export default function Psychiatrists() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/doctors");
      setDoctors(response.data);
      setFilteredDoctors(response.data);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError("حدث خطأ أثناء جلب بيانات الأطباء. الرجاء المحاولة لاحقًا.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // فلترة الأطباء حسب اسم البحث
  useEffect(() => {
    const filtered = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchTerm, doctors]);

  if (loading) return <LinearProgress sx={{ mt: 4 }} />;
  if (error)
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        {error}
      </Alert>
    );

  return (
    <>
      <Box
        component="div"
        sx={{
          position: "relative",
          mt: 10,
          display: "flex",
          justifyContent: "center",
        }}
        data-aos="fade-down"
      >
        <Typography
          variant="h4"
          sx={{
            position: "absolute",
            top: 30,
            zIndex: 9999,
            color: "#fff",
            fontFamily: "Dubai-Regular",
          }}
        >
          أحصل على أفضل معالج لك...
        </Typography>
        <Box
          component="img"
          src="/Images/SVG/psy.svg"
          sx={{ position: "relative", zIndex: 0, transform: "scaleY(1.2)" }}
        />
      </Box>
      <Container sx={{ my: 4, py: 4 }} maxWidth="xl">
        {/* حقل البحث مع تنسيق متميز */}
        <Box
          sx={{
            mb: 4,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          data-aos="fade-up"
        >
          <TextField
            fullWidth
            variant="outlined"
            label="ابحث عن طبيب"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              maxWidth: 600,
              "& .MuiOutlinedInput-root": {
                borderRadius: 20,
                backgroundColor: "#f8fbf8",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#f9f9fa",
             
                },
                "&.Mui-focused": {
                  backgroundColor: "#f9f9fa",
                  boxShadow: "0 0 0 3px rgba(56, 142, 60, 0.2)",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4faa84",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4faa84",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4faa84",
                  borderWidth: 2,
                },
              },
              "& .MuiInputLabel-root": {
                color: "#3c7168",
                fontFamily: "Dubai-Regular"
              },
              "& .MuiInputLabel-root.Mui-focused": {
               color: "#3c7168",
                fontFamily: "Dubai-Bold"
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#4caf50" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {filteredDoctors.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }} data-aos="fade-up">
            <Typography variant="h6" color="textSecondary" fontFamily={'Dubai-Bold'}>
              لا توجد نتائج مطابقة للبحث
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredDoctors.map((item) => (
              <Grid
                key={item.id}
                item
                xs={12}
                sm={6}
                md={4}
                data-aos="fade-up"
                data-aos-delay={100 * (item.id % 3)}
              >
                <ConsultantCard consultant={item} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}
