import React from "react";
import { Box, Grid2 as Grid, Paper } from "@mui/material";
import AgeBarChart from "./AgeChart/AgeBarChart ";
import PieAgeChart from "./AgeChart/PieAgeChart";
import PopulationPyramid from "./AgeChart/PopulationPyramid";

const SixChartsLayout = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {/* الصف الأول - مخططان كبيران */}
        <Grid xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }} elevation={3}>
            <AgeBarChart
              title='توزيع أعمار المرضى'
              labels={["10-19", "20-29", "30-39", "40-49", "50-59", "60-69"]}
              dataValues={[15, 35, 28, 18, 12, 8]}
              datasetLabel="عدد المرضى"
              height={400}
              width="100%"
            />
          </Paper>
        </Grid>

        <Grid xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }} elevation={3}>
           <AgeBarChart
              title='توزيع أعمار المرضى'
              labels={["10-19", "20-29", "30-39", "40-49", "50-59", "60-69"]}
              dataValues={[15, 35, 28, 18, 12, 8]}
              datasetLabel="عدد المرضى"
              height={400}
              width="100%"
            />
          </Paper>
        </Grid>

        {/* الصف الثاني - مخططان متوسطان */}
        <Grid xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }} elevation={3}>
           <AgeBarChart
              title='توزيع أعمار المرضى'
              labels={["10-19", "20-29", "30-39", "40-49", "50-59", "60-69"]}
              dataValues={[15, 35, 28, 18, 12, 8]}
              datasetLabel="عدد المرضى"
              height={400}
              width="100%"
            />
          </Paper>
        </Grid>

        <Grid xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }} elevation={3}>
            <AgeBarChart
              title='توزيع أعمار المرضى'
              labels={["10-19", "20-29", "30-39", "40-49", "50-59", "60-69"]}
              dataValues={[15, 35, 28, 18, 12, 8]}
              datasetLabel="عدد المرضى"
              height={400}
              width="100%"
            />
          </Paper>
        </Grid>

        {/* الصف الثالث - مخططان صغيران */}
        <Grid xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }} elevation={3}>
            <PieAgeChart
              title='التوزيع الجنسي'
              ageGroups={["ذكور", "إناث"]}
              ageData={[45, 55]}
              height={300}
              width="100%"
              legendPosition="bottom"
            />
          </Paper>
        </Grid>

        <Grid xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }} elevation={3}>
            <PopulationPyramid
              title='التوزيع العمري حسب الجنس'
              ageGroups={["10-19", "20-29", "30-39", "40-49", "50-59", "60+"]}
              maleData={[5, 15, 12, 8, 4, 1]}
              femaleData={[10, 20, 16, 10, 8, 7]}
              maleColor="#4A9782"
              femaleColor="rgba(220, 20, 60, 0.7)"
              height={300}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SixChartsLayout;