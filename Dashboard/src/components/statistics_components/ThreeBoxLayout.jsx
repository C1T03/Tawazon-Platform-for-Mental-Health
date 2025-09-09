import React from "react";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import AgeBarChart from "./AgeChart/AgeBarChart ";
import PieAgeChart from "./AgeChart/PieAgeChart";
import PopulationPyramid from "./AgeChart/PopulationPyramid";

const ThreeBoxLayout = ({ ageData }) => {
  // تحويل البيانات الحقيقية إلى تنسيق مناسب للرسوم البيانية
  const processAgeData = () => {
    if (!ageData || ageData.length === 0) {
      return {
        labels: ['18-25', '26-35', '36-45', '46-55', '55+'],
        values: [0, 0, 0, 0, 0]
      };
    }
    
    const labels = ageData.map(item => item.ageGroup);
    const values = ageData.map(item => item.count);
    
    return { labels, values };
  };

  const { labels, values } = processAgeData();

  return (
    <Box>
      <Grid container spacing={2} maxWidth={"xl"} justifyContent={'center'}>
        {/* Box الكبير - يأخذ نصف المساحة */}
        <Grid xs={12} md={8}>
          <Paper
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
            }}
            elevation={3}
          >
            <AgeBarChart
              title='توزيع أعمار المستخدمين'
              labels={labels}
              dataValues={values}
              datasetLabel="عدد المستخدمين"
              height={500}
              width={500}
            />
          </Paper>
        </Grid>

        {/* العمود الجانبي - يأخذ النصف الآخر ويحتوي على Boxين صغيرين */}
        <Grid xs={12} md={4}>
          <Grid
            container
            direction="column"
            spacing={1}
            sx={{ height: "100%"}}
          >
            {/* Box الصغير الأول */}
            <Grid xs={6}>
              <Paper
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                }}
              >
                <PieAgeChart
                  ageGroups={labels}
                  ageData={values}
                  height={350}
                  width={300}
                  legendPosition="bottom"
                />
              </Paper>
            </Grid>

            {/* Box الصغير الثاني */}
            <Grid xs={6}>
              <Paper
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                 
                  color: "white",
                }}
              >
                <PopulationPyramid
                  ageGroups={[
                    "0-9",
                    "10-19",
                    "20-29",
                    "30-39",
                    "40-49",
                    "50-59",
                    "60-69",
                    "70+",
                  ]}
                  maleData={[7, 8, 9, 8, 7, 5, 3, 2]}
                  femaleData={[6, 7, 8, 7, 6, 5, 4, 3]}
                  maleColor="#4A9782" // أزرق
                  femaleColor="rgba(220, 20, 60, 0.7)" // أحمر
                  height={300}
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ThreeBoxLayout;
