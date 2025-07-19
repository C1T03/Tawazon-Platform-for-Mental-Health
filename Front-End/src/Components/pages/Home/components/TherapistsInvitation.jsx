import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Grid, Typography, Box } from "@mui/material";
import CustomButton from "../../../ui/CustomButton";
import { useNavigate } from "react-router-dom";

export default function TherapistsInvitation() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const navigate = useNavigate();

  return (
    <Grid
      container
      spacing={2}
      sx={{
        py: 12,
        height: "auto",
        justifyContent: "center",
        textAlign: "center",
        backgroundImage: "url(/Images/SVG/Background_3.svg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "top",
      }}
      data-aos="fade-up"
    >
      <Grid item sm={6} xs={12}>
        <Box
          component="img"
          src="/Images/PNG/Dc.png"
          alt="دعم نفسي لسوريا"
          sx={{ width:380, height: 380, m: 0 }}
        />
      </Grid>
      <Grid item sm={6} xs={12} sx={{ display: "grid", placeItems: "center" }}>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#ffff",
              marginTop: "40px",
              fontFamily: "Dubai-Regular",
            }}
          >
            إعادة بناء الحياة النفسية لسوريا
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.2rem",
              color: "#ffff",
              marginTop: "10px",
              fontFamily: "Dubai-Regular",
            }}
          >
            في منصة <b>تَوَاْزُنْ</b>، نقدم الدعم النفسي للسوريين الذين يبحثون عن
            التعافي بعد سنوات الحرب. مع مجموعة من المعالجين المتخصصين، يمكننا
            مساعدتك في التغلب على القلق، الاكتئاب، الصدمات، والحزن، والمضي قدماً نحو حياة أكثر
            استقراراً وراحة. جلسات العلاج لدينا توفر لك الدعم المهني اللازم،
            حيث يمكنك التواصل مع معالجك بطريقة تناسب احتياجاتك.
          </Typography>
          <CustomButton
            label="ابدأ رحلتك نحو التعافي"
            onClick={() => navigate("/syrian-support")}
            bgcolor="#4faa85"
          />
        </Box>
      </Grid>
    </Grid>
  );
}