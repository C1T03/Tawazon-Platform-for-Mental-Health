import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Container,
  Avatar,
} from "@mui/material";

const BenefitsSection = () => {
  const benefits = [
    {
      img: "./Images/SVG/professional.svg",
      title: "إنه احترافي.",
      description:
        "جميع المعالجين مؤهلون وذوو خبرة. يتيح لك توازن التواصل معهم عبر الإنترنت في بيئة آمنة ومريحة.",
    },
    {
      img: "./Images/SVG/affordable.svg",
      title: "إنه بسعر معقول.",
      description:
        "ادفع رسومًا ثابتة منخفضة للجلسات المباشرة والمراسلة مع معالجك. العلاج ليس بالضرورة مكلفًا.",
    },
    {
      img: "./Images/SVG/convenient.svg",
      title: "إنه مريح.",
      description:
        "افعل ذلك في وقتك الخاص وبالسرعة التي تناسبك. تواصل مع معالجك كلما أردت وكلما شعرت بالحاجة لذلك.",
    },
    {
      img: "./Images/SVG/effective.svg",
      title: "إنه فعال.",
      description:
        "استفاد ملايين الأشخاص حول العالم من العلاج. مع توازن يمكنك تغيير المعالج في أي وقت إذا لم تشعر أنك تحصل على فائدة كافية.",
    },
  ];

  return (
    <Container sx={{ py: 4, mt: "40px" }}>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        align="center"
        fontWeight="bold"
        fontFamily="Dubai-Regular"
      >
        لماذا تختار توازن؟
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {benefits.map((benefit, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: "none",
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Avatar
                  sx={{ width: 80, height: 80 }}
                  src={benefit.img}
                  alt={benefit.title}
                />
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  fontWeight="bold"
                  fontFamily="Dubai-Regular"
                  py={2}
                >
                  {benefit.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontFamily="Dubai-Regular"
                >
                  {benefit.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BenefitsSection;
