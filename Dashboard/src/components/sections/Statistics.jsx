import React from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert
} from "@mui/material";
import DataBox from "../statistics_components/DataBox";
import ChartSelector from "../statistics_components/ChartSelector";
import PDFDownloadButton from "../statistics_components/PDFDownloadButton";
import { People, Psychology, Article } from "@mui/icons-material";
import useStatistics from "../../hooks/useStatistics";

export default function Statistics() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { statistics, doctorStatistics, patientStatistics, loading, error } = useStatistics();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4, px: isMobile ? 2 : 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const statsData = statistics ? [
    { 
      title: "إجمالي عدد المستخدمين", 
      count: statistics.overview.totalUsers.toLocaleString('ar-EG'), 
      icon: <People /> 
    },
    { 
      title: "عدد الأخصائيين", 
      count: statistics.overview.totalDoctors.toLocaleString('ar-EG'), 
      icon: <Psychology /> 
    },
    { 
      title: "عدد المنشورات", 
      count: statistics.overview.totalPosts.toLocaleString('ar-EG'), 
      icon: <Article /> 
    },
  ] : [];

  return (
    <Box
      sx={{
        direction: "rtl",
        py: 2,
        px: isMobile ? 2 : 4,
        position: 'relative',
      }}
    >
      {/*=========================================*/}
      <Box sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 5,
        p: 1,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 4px 6px -1px rgba(0,0,0,0.3)' 
          : '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <Grid container spacing={3} justifyContent="center" >
        {statsData.map((stat, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <DataBox title={stat.title} count={stat.count} icon={stat.icon}/>
          </Grid>
        ))}
      </Grid>
      </Box>
    

      <ChartSelector statistics={statistics} />
      
      
      <PDFDownloadButton 
        statistics={statistics}
        doctorStatistics={doctorStatistics}
        patientStatistics={patientStatistics}
      />
    </Box>
  );
}
