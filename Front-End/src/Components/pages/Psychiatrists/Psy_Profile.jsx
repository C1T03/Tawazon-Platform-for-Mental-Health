import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Grid,
  Typography,
  Avatar,
  Box,
  Skeleton,
  Alert,
  Fade,
  Zoom,
  Slide,
  Grow,
  useTheme,
  useMediaQuery,
  Paper
} from "@mui/material";
import SocialButtons from "./components/SocialButtons";
import CustomButton from "../../ui/CustomButton";

export default function Psy_Profile() {
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/doctors/${id}`
      );
      setDoctor(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBackClick = () => {
    navigate("/psychiatrists");
  };

  const DataOfDoctor = ({ text, des }) => (
    <Grow in={true} timeout={800}>
      <Box
        component="div"
        sx={{ 
          display: "flex", 
          gap: 1, 
          alignItems: "center", 
          pb: 1,
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateX(5px)',
            color: '#3c7168'
          }
        }}
      >
        {text && (
          <Typography variant="subtitle1" fontFamily="Dubai-Bold">
            {text}
          </Typography>
        )}
        <Typography variant="body2" fontFamily="Dubai-Regular">
          {des || "غير متوفر"}
        </Typography>
      </Box>
    </Grow>
  );

  if (loading) {
    return (
      <Fade in={loading}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Skeleton 
                variant="rectangular" 
                height={400} 
                animation="wave"
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          </Grid>
        </Container>
      </Fade>
    );
  }

  if (error) {
    return (
      <Zoom in={true}>
        <Container maxWidth="lg">
          <Alert 
            severity="error" 
            sx={{ 
              my: 4,
              boxShadow: 3,
              borderRadius: 2
            }}
          >
            حدث خطأ في جلب البيانات: {error}
          </Alert>
        </Container>
      </Zoom>
    );
  }

  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <Container
        maxWidth={"xl"}
        sx={{
          width: "100%",
          minHeight: "100vh",
          bgcolor: "#fff",
          zIndex: 9999,
          p: 4,
          py: 6,
          my: 4,
          [theme.breakpoints.down('sm')]: {
            px: 2,
            py: 4
          }
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper 
              elevation={3}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 4,
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, #f5f7fa 100%)`
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <Box 
                    component="div" 
                    sx={{ 
                      height: "60px", 
                      mt: isMobile ? 0 : -5,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <CustomButton 
                    
                      label="عودة" 
                      onClick={handleBackClick} 
                      variant="outlined"
                      sx={{
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box
                    component="div"
                    sx={{ 
                      display: "grid", 
                      placeItems: "center",
                      textAlign: 'center'
                    }}
                  >
                    <Zoom in={true} timeout={1000}>
                      <Avatar 
                        src={doctor.image || ""} 
                        alt={doctor.name} 
                        sx={{ 
                          height: 120, 
                          width: 120,
                          mb: 2,
                          border: `4px solid #3c7168`,
                          boxShadow: 3
                        }} 
                      />
                    </Zoom>
                    <Typography 
                      variant="h4" 
                      fontFamily="Dubai-Bold"
                      sx={{
                        color: '#3c7168',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                      }}
                    >
                      {doctor.name}
                    </Typography>
                    <Typography 
                      variant="overline" 
                      fontFamily="Dubai-Bold"
                      sx={{
                        fontSize: '1.1rem',
                        color: '#3C3D37',
                        letterSpacing: 1
                      }}
                    >
                      {doctor.title}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box component="div">
                    <DataOfDoctor text="السيرة الذاتية:" des={doctor.bio} />
                    <DataOfDoctor text="البلد:" des={doctor.country} />
                    <DataOfDoctor text="المدينة:" des={doctor.city} />
                    <DataOfDoctor text="العنوان:" des={doctor.address} />
                    <DataOfDoctor text="اللغات:" des={doctor.languages} />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <Typography 
                    variant="h5" 
                    fontFamily="Dubai-Bold" 
                    pb={2}
                    sx={{
                      borderBottom: '2px solid #4faa84',
                      color: '#3c7168', mb: 2
                    }}
                  >
                    المعلومات المهنية:
                  </Typography>
                  <DataOfDoctor
                    text="الدرجات العلمية والشهادات:"
                    des={doctor.certificate}
                  />
                  <Box component="div" sx={{ pb: 1 }}>
                    <Typography variant="subtitle1" fontFamily="Dubai-Bold">
                      التخصصات:
                    </Typography>
                    <Box component="div" sx={{ m: 2, mb: 1 }}>
                      <DataOfDoctor
                        text=" التخصص الرئيسي:"
                        des={doctor.specialization}
                      />
                      <DataOfDoctor
                        text="التخصص الفرعي:"
                        des={doctor.sub_specialization}
                      />
                      <DataOfDoctor
                        text="الاهتمامات البحثية:"
                        des={doctor.research_interests + " دراسة"}
                      />
                    </Box>
                  </Box>
                  <DataOfDoctor
                    text="الخبرة العملية:"
                    des={doctor.experience_years + " سنوات من الخبرة."}
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <Typography 
                    variant="h5" 
                    fontFamily="Dubai-Bold" 
                    pb={2}
                    sx={{
                      borderBottom: '2px solid #4faa84',
                      color: '#3c7168', mb: 2
                    }}
                  >
                    العضويات والمشاركات المهنية:
                  </Typography>
                  <DataOfDoctor des={doctor.professional_memberships} />
                  <Typography 
                    variant="h5" 
                    fontFamily="Dubai-Bold" 
                    pb={2}
                    sx={{
                      borderBottom: '2px solid #4faa84',
                      color: '#3c7168', mb: 2
                    }}
                  >
                    تفاصيل العيادة:
                  </Typography>
                  <DataOfDoctor text="أيام العمل:" des={doctor.available_days} />
                  <DataOfDoctor text="ساعات العمل:" des={doctor.working_hours} />
                  <DataOfDoctor
                    text="رسوم الاستشارة:"
                    des={doctor.consultation_fee + " ر.س"}
                  />
                  <DataOfDoctor
                    text="الاستشارات عبر الإنترنت:"
                    des={doctor.online_consultation === 1 ? "متاحة" : "غير متاحة"}
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <Typography 
                    variant="h5" 
                    fontFamily="Dubai-Bold" 
                    pb={2}
                    sx={{
                      borderBottom: '2px solid #4faa84',
                      color: '#3c7168', mb: 2
                    }}
                  >
                    وسائل التواصل:
                  </Typography>
                  <DataOfDoctor
                    text="البريد الإلكتروني:"
                    des={doctor.email}
                  />
                  <DataOfDoctor text="الهاتف:" des={doctor.phone} />
                  <DataOfDoctor
                    text="الموقع الإلكتروني:"
                    des={doctor.website}
                  />
                  <Box sx={{ mt: 2 }}>
                    <SocialButtons object={doctor.social_media_links} />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Slide>
  );
}