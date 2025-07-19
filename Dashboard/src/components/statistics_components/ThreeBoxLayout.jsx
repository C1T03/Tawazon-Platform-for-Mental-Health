import React from "react";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import AgeBarChart from "./AgeChart/AgeBarChart ";
import PieAgeChart from "./AgeChart/PieAgeChart";
import PopulationPyramid from "./AgeChart/PopulationPyramid";

const ThreeBoxLayout = () => {
  return (
    <Box>
      <Grid container spacing={2} maxWidth={"xl"}>
        {/* Box الكبير - يأخذ نصف المساحة */}
        <Grid item xs={12} md={10}>
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
              labels={[
                 "10-19",
                    "20-29",
                    "30-39",
                    "40-49",
                    "50-59",
                    "60-69",
              ]}
              dataValues={[22, 23, 24, 25, 21,23]}
              datasetLabel="متوسط الأعمار "
              height={500}
              width={500}
            />
          </Paper>
        </Grid>

        {/* العمود الجانبي - يأخذ النصف الآخر ويحتوي على Boxين صغيرين */}
        <Grid item xs={12} md={2}>
          <Grid
            container
            direction="column"
            spacing={2}
            sx={{ height: "100%" }}
          >
            {/* Box الصغير الأول */}
            <Grid item xs={6}>
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
                  ageGroups={[
                    "0-17",
                    "18-29",
                    "30-39",
                    "40-49",
                    "50-59",
                    "60+",
                  ]}
                  ageData={[22, 35, 28, 18, 12, 8]}
                  height={250}
                  width={300}
                  legendPosition="bottom"
                />
              </Paper>
            </Grid>

            {/* Box الصغير الثاني */}
            <Grid item xs={6}>
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
