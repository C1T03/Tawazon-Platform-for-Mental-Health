/* eslint-disable no-unused-vars */
// src/components/ContentArea.js
import { useState, useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import Statistics from "./sections/Statistics";
import Users from "./sections/Users";
import Settings from "./sections/Settings";
import Profile from "./sections/Profile";

export default function ContentArea({ selectedMenuItem }) {
  const sections = {
    statistics: <Statistics />,
    users: <Users />,
    settings: <Settings />,
    profile: <Profile />,
  };
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);
  // تحديد العناوين حسب القسم المحدد
  const sectionTitles = {
    statistics: "الإحصائيات",
    users: "المستخدمون",
    settings: "الإعدادات",
    profile: "الملف الشخصي",
  };
  return (
    <div
      style={{
        p: 2,
        direction: "rtl",
        marginRight: { md: 0 },
        overflowY: "auto",
        height: "calc(100vh - 10px)",
        mr: 4,
      }}
    >
      <Box
  sx={{
    py: 1,
    px: 4,
    m: 2,
    bgcolor: 'background.paper',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backdropFilter: 'blur(2px)',
    transition: 'all 0.3s ease',
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: (theme) => theme.palette.mode === 'dark' 
      ? '0 4px 6px -1px rgba(0,0,0,0.3)' 
      : '0 1px 3px rgba(0,0,0,0.1)'
  }}
>
  <Typography
    variant="h5"
    fontWeight={700}
    fontFamily="Dubai"
    sx={{ 
      background: 'linear-gradient(90deg, #3c7168 0%, #4faa84 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }}
  >
    {sectionTitles[selectedMenuItem]}
  </Typography>

  <Box sx={{ textAlign: 'right' }}>
    <Typography
      variant="subtitle1"
      fontWeight={600}
      fontFamily="Dubai"
      color="text.primary"
    >
      {new Date().toLocaleDateString("ar-EG", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </Typography>
    <Typography
      variant="body2"
      fontFamily="Dubai"
      color="text.secondary"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        '&:before': {
          content: '"⏱"',
          fontSize: '0.8rem'
        }
      }}
    >
      {new Date().toLocaleTimeString("ar-EG", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })}
    </Typography>
  </Box>
</Box>
      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
          overflow: "scroll",
        }}
      >
        {sections[selectedMenuItem]}
      </Box>
    </div>
  );
}
