import React from "react";
import {
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  Box,
  TextField,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  Email,
  Phone,
  LocationOn,
  Send,
} from "@mui/icons-material";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const currentYear = new Date().getFullYear();

  return (
    <Box
      sx={{
        background: "#3c7168",
        color: "#fff",
        py: 6,
        borderTop: '#d3edeb 8px solid',
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "4px",
        },
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          left: "3%",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={3}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  position: "relative",
                  display: "inline-block",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "50px",
                    height: "3px",
                    background: "#d3edeb",
                    borderRadius: "3px",
                  },
                }}
              >
                الشركة المبتكرة
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#e0e0e0", lineHeight: 1.8 }}
              >
                نقدم حلولاً رقمية مبتكرة منذ 2010. نساعد الشركات على النمو
                والتطور في العالم الرقمي من خلال خدمات متكاملة وتصميمات إبداعية.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <IconButton
                sx={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  transition: "all 0.3s",
                  "&:hover": {
                    background: "#3c7168",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                sx={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  transition: "all 0.3s",
                  "&:hover": {
                    background: "#3c7168",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                sx={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  transition: "all 0.3s",
                  "&:hover": {
                    background: "#3c7168",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                sx={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  transition: "all 0.3s",
                  "&:hover": {
                    background: "#3c7168",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <LinkedIn />
              </IconButton>
              <IconButton
                sx={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  transition: "all 0.3s",
                  "&:hover": {
                    background: "#3c7168",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <YouTube />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={2}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: "bold",
                mb: 2,
                position: "relative",
                display: "inline-block",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "50px",
                  height: "3px",
                  background: "#fff",
                  borderRadius: "3px",
                },
              }}
            >
              روابط سريعة
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", pl: 0, mt: 2 }}>
              {[
                "الرئيسية",
                "عن الشركة",
                "الخدمات",
                "المشاريع",
                "المدونة",
                "وظائف",
              ].map((item) => (
                <Box component="li" key={item} sx={{ mb: 1.5 }}>
                  <Link
                    href="#"
                    sx={{
                      color: "#e0e0e0",
                      fontSize: 20,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      transition: "all 0.3s",
                      "&:hover": {
                        transformOrigin: "center",
                        transform: "scale(1.2)",
                        fontWeight: "bold",
                        pl: 1,
                      },
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        mr: 1,
                        color: "#3c7168",
                        opacity: 0,
                        transition: "all 0.3s",
                      }}
                    >
                      →
                    </Box>
                    {item}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Services */}
          <Grid item xs={12} md={2}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: "bold",
                mb: 2,
                position: "relative",
                display: "inline-block",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "50px",
                  height: "3px",
                  background: "#fff",
                  borderRadius: "3px",
                },
              }}
            >
              خدماتنا
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", pl: 0, mt: 2 }}>
              {[
                "تصميم المواقع",
                "تطوير التطبيقات",
                "التسويق الرقمي",
                "تحسين محركات البحث",
                "الهوية البصرية",
                "استشارات تقنية",
              ].map((item) => (
                <Box component="li" key={item} sx={{ mb: 1.5 }}>
                  <Link
                    href="#"
                    sx={{
                      color: "#e0e0e0",
                      fontSize: 20,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      transition: "all 0.3s",
                      "&:hover": {
                        transformOrigin: "center",
                        transform: "scale(1.2)",
                        fontWeight: "bold",
                        pl: 1,
                      },
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        mr: 1,
                        color: "#f46b45",
                        opacity: 0,
                        transition: "all 0.3s",
                      }}
                    >
                      →
                    </Box>
                    {item}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Contact & Newsletter */}
          <Grid item xs={12} md={5}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: "bold",
                mb: 2,
                position: "relative",
                display: "inline-block",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "50px",
                  height: "3px",
                  background: "#fff",
                  borderRadius: "3px",
                },
              }}
            >
              تواصل معنا
            </Typography>

            <Box component="ul" sx={{ listStyle: "none", pl: 0, mt: 2 }}>
              <Box
                component="li"
                sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
              >
                <LocationOn sx={{ color: "#fff", ml: 1, mt: 0.5 }} />
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  الرياض، المملكة العربية السعودية
                </Typography>
              </Box>
              <Box
                component="li"
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <Phone sx={{ color: "#fff", ml: 1 }} />
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  +966 11 123 4567
                </Typography>
              </Box>
              <Box
                component="li"
                sx={{ display: "flex", alignItems: "center", mb: 3 }}
              >
                <Email sx={{ color: "#fff", ml: 1 }} />
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  info@example.com
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                اشترك في النشرة البريدية
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: 2,
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="بريدك الإلكتروني"
                  variant="outlined"
                  InputProps={{
                    sx: {
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "30px",
                      color: "#fff",
                      "& fieldset": {
                        border: "none",
                      },
                      "&:hover fieldset": {
                        border: "1px solid rgba(255,255,255,0.3)",
                      },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    background: "linear-gradient(90deg, #f46b45, #eea849)",
                    borderRadius: "30px",
                    minWidth: isMobile ? "100%" : "150px",
                    fontWeight: "bold",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                    },
                  }}
                  startIcon={<Send />}
                >
                  اشتراك
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, background: "rgba(255,255,255,0.1)" }} />

        {/* Bottom Footer */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: isMobile ? "center" : "left",
            gap: isMobile ? 2 : 0,
          }}
        >
          <Typography variant="body2" sx={{ color: "#aaa" }}>
            &copy; {currentYear} جميع الحقوق محفوظة. تصميم وتطوير شركة التقنية
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            {["الشروط والأحكام", "سياسة الخصوصية", "سياسة ملفات الارتباط"].map(
              (item) => (
                <Link
                  key={item}
                  href="#"
                  sx={{
                    color: "#aaa",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    transition: "color 0.3s",
                    "&:hover": {
                      color: "#f46b45",
                    },
                  }}
                >
                  {item}
                </Link>
              )
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
