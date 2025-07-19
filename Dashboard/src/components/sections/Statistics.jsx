import React from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DataBox from "../statistics_components/DataBox"; // تم تعديل الاسم إلى DataBox (أفضل في التسمية)
import ChartSelector from "../statistics_components/ChartSelector";

// بيانات وهمية للإحصائيات (يمكن استبدالها ببيانات حقيقية من API)
const statsData = [
  { title: "إجمالي عدد المستخدمين", count: "1,2452894" },
  { title: "عدد الأخصائيين", count: "12,5745" },
  { title: "معدل التحويل", count: "٧٤٪" },
];

export default function Statistics() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        direction: "rtl",
        py: 4,
        px: isMobile ? 2 : 4,
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/*=========================================*/}
      <Grid container spacing={3} justifyContent="center">
        {statsData.map((stat, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <DataBox title={stat.title} count={stat.count} />
          </Grid>
        ))}
      </Grid>
      {/*=========================================*/}

      <ChartSelector />
    </Box>
  );
}
