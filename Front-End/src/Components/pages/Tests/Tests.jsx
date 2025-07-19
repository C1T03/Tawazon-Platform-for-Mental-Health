import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Container,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CustomButton from "../../ui/CustomButton";
import { useNavigate } from "react-router-dom";

const TestCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  height: 350,
  margin: theme.spacing(2),
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[6],
  },
}));

export default function Tests() {
  const psychological_tests = [
    {
      id: 1,
      name: "مقياس بيك للاكتئاب",
      abbreviation: "BDI",
      description: "يقيّم شدة أعراض الاكتئاب بناءً على التقرير الذاتي.",
      question_count: 21,
      image: "/Images/SVG/Tests_Img/img_1.svg",
      path: "/tests/bdi",
    },
    {
      id: 2,
      name: "مقياس هاملتون للاكتئاب",
      abbreviation: "HAMD",
      description: "يستخدمه الأطباء لتقييم شدة الاكتئاب عبر ملاحظة الأعراض.",
      question_count: 17,
      image: "/Images/SVG/Tests_Img/img_5.svg",
      path: "/tests/hamd",
    },
    {
      id: 3,
      name: "مقياس زونغ للاكتئاب",
      abbreviation: "SDS",
      description: "استبيان ذاتي للكشف عن الاكتئاب.",
      question_count: 20,
      image: "/Images/SVG/Tests_Img/img_3.svg",
      path: "/tests/sds",
    },
    {
      id: 4,
      name: "مقياس هاملتون للقلق",
      abbreviation: "HAM-A",
      description: "يقيس شدة أعراض القلق العام.",
      question_count: 14,
      image: "/Images/SVG/Tests_Img/img_4.svg",
      path: "/tests/hama",
    },
    {
      id: 5,
      name: "مقياس بان للذهان",
      abbreviation: "PANSS",
      description: "يقيس أعراض الفصام الإيجابية والسلبية.",
      question_count: 30,
      image: "/Images/SVG/Tests_Img/img_2.svg",
      path: "/tests/panss",
    },
    {
      id: 6,
      name: "اختبار تناول الطعام",
      abbreviation: "EAT-26",
      description: "يكشف عن اضطرابات الأكل مثل فقدان الشهية العصبي.",
      question_count: 26,
      image: "/Images/SVG/Tests_Img/img_6.svg",
      path: "/tests/eat26",
    },
    
    {
      id: 7,
      name: "استبيان ADHD للبالغين",
      abbreviation: "ASRS",
      description:
        "صممته منظمة الصحة العالمية للكشف عن اضطراب فرط الحركة ونقص الانتباه.",
      question_count: 18,
      image: "/Images/SVG/Tests_Img/img_9.svg",
      path: "/tests/asrs",
    },
  ];
  const navigate = useNavigate()

  return (
    <Container sx={{ py: 5 }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ fontFamily: "Dubai-Bold", mt: 6, mb: 4 }}
      >
        الاختبارات النفسية
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {psychological_tests.map((test, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <TestCard>
              <CardMedia
                component="img"
                height="140"
                image={test.image}
                alt={test.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" fontFamily={"Dubai-Bold"}>
                  {test.name} ({test.abbreviation})
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontFamily={"Dubai-Regular"}
                  m={1}
                >
                  {test.description}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  fontFamily={"Dubai-Regular"}
                >
                  عدد الأسئلة: {test.question_count}
                </Typography>
                <CustomButton
                  label="ابدأ الاختبار"
                  href={test.path}
                  variant="contained"
                  fullWidth={true}
                  onClick={()=>navigate(`/tests/${test.id}`)}
                />
              </CardContent>
            </TestCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
