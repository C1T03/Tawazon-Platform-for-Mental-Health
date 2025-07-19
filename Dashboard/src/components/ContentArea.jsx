// src/components/ContentArea.js
import React from "react";
import { Box, Typography } from "@mui/material";
import Statistics from "./sections/Statistics";
import Dashboard from "./sections/Dashboard";
import Reports from "./sections/Reports";
import Settings from "./sections/Settings";
import Profile from "./sections/Profile";

export default function ContentArea({ selectedMenuItem }) {


  const sections = {
    statistics: <Statistics />,
    dashboard: <Dashboard />,
    reports: <Reports />,
    settings: <Settings />,
    profile: <Profile />,
  };


  return (
    <Box
      component="main"
      sx={{
        p: 3,
        direction: "rtl",
        marginRight: { md: 0 },
        overflowY: "auto", 
        height: "calc(100vh - 24px)", 
      }}
    >
      {" "}
      {/* إضافة direction هنا */}
      <Box sx={{ maxWidth: 1400, mx: "auto", overflow: "scroll" }}>
        {sections[selectedMenuItem]}
      </Box>
    </Box>
  );
}

