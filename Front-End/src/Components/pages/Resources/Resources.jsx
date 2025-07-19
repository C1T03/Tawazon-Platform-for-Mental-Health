import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, Paper } from "@mui/material";
import VideoCard from "./components/VideoCard";
import MusicCard from "./components/MusicCard";
import { useParams } from "react-router-dom";
// مكون لوحة التبويب
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Resources() {
  const { id } = useParams();
  const [value, setValue] = useState(Number(id));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const yogaVideos = [
    {
      title: "مقدمة",
      link: "https://youtu.be/Z9Q6RNoMrWk?si=fxozyrndv7iswPZc",
      description: "مقدمة تمهيدية لسلسلة تمارين اليوجا",
    },
    {
      title: "اليوم الأول",
      link: "https://youtu.be/eCvsOOJFJrs?si=3PYPOLXJWc_CTy_O",
      description: "تمارين اليوجا لليوم الأول للمبتدئين",
    },
    {
      title: "اليوم الثاني",
      link: "https://youtu.be/K40cAP3h6R0?si=KxWbGpWeBhn6AW6R",
      description: "تمارين اليوجا لليوم الثاني",
    },
    {
      title: "اليوم الثالث",
      link: "https://youtu.be/YXQZPNnpfew?si=bQnZoD_qb3btYzAJ",
      description: "تمارين اليوجا لليوم الثالث",
    },
    {
      title: "اليوم الرابع",
      link: "https://youtu.be/BEkXKveUOrM?si=Xemd42_-wBy_va2e",
      description: "تمارين اليوجا لليوم الرابع",
    },
    {
      title: "اليوم الخامس",
      link: "https://youtu.be/G9u7zFMCyB8?si=gC2sFPNpd7N0KWud",
      description: "تمارين اليوجا لليوم الخامس",
    },
    {
      title: "اليوم السادس",
      link: "https://youtu.be/spu9AglwBIo?si=ioewKHPa3d0M3Q2p",
      description: "تمارين اليوجا لليوم السادس",
    },
    {
      title: "اليوم السابع",
      link: "https://youtu.be/UM00gq_gwCw?si=xVRdKzjSNb3U6vze",
      description: "تمارين اليوجا لليوم السابع",
    },
    {
      title: "اليوم الثامن",
      link: "https://youtu.be/L8P2-tAC4To?si=mH9e6p19ulARIPAG",
      description: "تمارين اليوجا لليوم الثامن",
    },
    {
      title: "اليوم التاسع",
      link: "https://youtu.be/GRug9w2d6Wk?si=qL2z4ku8mRRdVnCM",
      description: "تمارين اليوجا لليوم التاسع",
    },
    {
      title: "اليوم العاشر",
      link: "https://youtu.be/xkcoBU_ioTE?si=VR3EWU9CTUvw9yZp",
      description: "تمارين اليوجا لليوم العاشر",
    },
    {
      title: "اليوم الحادي عشر",
      link: "https://youtu.be/j0R4LU2PrY0?si=Fil5uBLRitHTvqto",
      description: "تمارين اليوجا لليوم الحادي عشر",
    },
    {
      title: "اليوم الثاني عشر",
      link: "https://youtu.be/yipZoQ7nfgk?si=Ey5VGqVzuAsZv-Y9",
      description: "تمارين اليوجا لليوم الثاني عشر",
    },
    {
      title: "اليوم الثالث عشر",
      link: "https://youtu.be/f9vH5MI5Ut8?si=M38kA5eHVZly8ppD",
      description: "تمارين اليوجا لليوم الثالث عشر",
    },
    {
      title: "اليوم الرابع عشر",
      link: "https://youtu.be/9HRdIo4SwGg?si=ro6KFijE3fgc1HIc",
      description: "تمارين اليوجا لليوم الرابع عشر",
    },
    {
      title: "اليوم الخامس عشر",
      link: "https://youtu.be/iEvJH1K2lyQ?si=CEsqTzYpN4-9nv3N",
      description: "تمارين اليوجا لليوم الخامس عشر",
    },
    {
      title: "اليوم السادس عشر",
      link: "https://youtu.be/iEvJH1K2lyQ?si=jiT4ic0O20NaFmpo",
      description: "تمارين اليوجا لليوم السادس عشر",
    },
    {
      title: "اليوم السابع عشر",
      link: "https://youtu.be/NnmQjEmswYs?si=-5lSQGeDxx7oI0Pc",
      description: "تمارين اليوجا لليوم السابع عشر",
    },
    {
      title: "اليوم الثامن عشر",
      link: "https://youtu.be/vb1sdF24UUQ?si=EFqivwKXKWIQHtH-",
      description: "تمارين اليوجا لليوم الثامن عشر",
    },
    {
      title: "اليوم التاسع عشر",
      link: "https://youtu.be/cDEclXw2vM4?si=mKhcvcj_nrcda4x6",
      description: "تمارين اليوجا لليوم التاسع عشر",
    },
    {
      title: "اليوم العشرون",
      link: "https://youtu.be/PVSgcLeDNeU?si=1dOcZBIYu2_6P9Ia",
      description: "تمارين اليوجا لليوم العشرون",
    },
    {
      title: "اليوم الحادي والعشرون",
      link: "https://youtu.be/oK3BpZHppiU?si=67ehIUZ6zfUM7rpS",
      description: "تمارين اليوجا لليوم الحادي والعشرون",
    },
    {
      title: "اليوم الثاني والعشرون",
      link: "https://youtu.be/9VQ-KlaNHJ8?si=zQ4zpo4_HDFDt9Rd",
      description: "تمارين اليوجا لليوم الثاني والعشرون",
    },
    {
      title: "اليوم الثالث والعشرون",
      link: "https://youtu.be/VUrhlbCv4C8?si=VvxUH_OQq5oRQE8h",
      description: "تمارين اليوجا لليوم الثالث والعشرون",
    },
    {
      title: "اليوم الرابع والعشرون",
      link: "https://youtu.be/iURfQYxGfmI?si=ttAOuBYl2XbKiTjS",
      description: "تمارين اليوجا لليوم الرابع والعشرون",
    },
    {
      title: "اليوم الخامس والعشرون",
      link: "https://youtu.be/52WhTJ5v0rk?si=HIaFb1t5eEy1vCWa",
      description: "تمارين اليوجا لليوم الخامس والعشرون",
    },
    {
      title: "اليوم السادس والعشرون",
      link: "https://youtu.be/aMhkfcfrsNI?si=M4R9mwKJ_qmaSZEa",
      description: "تمارين اليوجا لليوم السادس والعشرون",
    },
    {
      title: "اليوم السابع والعشرون",
      link: "https://youtu.be/VpZiDFc19Ws?si=7gRlHQ619rnE7uTF",
      description: "تمارين اليوجا لليوم السابع والعشرون",
    },
    {
      title: "اليوم الثامن والعشرون",
      link: "https://youtu.be/Fcq205HBwDk?si=2guaILi5SjoTt1h9",
      description: "تمارين اليوجا لليوم الثامن والعشرون",
    },
    {
      title: "اليوم التاسع والعشرون",
      link: "https://youtu.be/zGrO8ToP14U?si=jNbM8Y2oewzjDwD2",
      description: "تمارين اليوجا لليوم التاسع والعشرون",
    },
    {
      title: "اليوم الثلاثون",
      link: "https://youtu.be/w4QYLaGFD1A?si=k2cfLae4ZuI6QGkQ",
      description: "تمارين اليوجا لليوم الثلاثون",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 10,
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 800,
          borderRadius: "10px 10px 0 0",
          overflow: "hidden",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          centered
          sx={{
            backgroundColor: "#f5f9f8",
            position: "fixed",
            right: 0,
            zIndex: 9999,
            width: "100%",
            boxShadow: 2,
            "& .MuiTab-root": {
              color: "#3c7168",
              fontSize: "1rem",
              fontWeight: "bold",
              fontFamily: "Dubai-Regular",
              "&.Mui-selected": {
                color: "#4faa84",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#4faa84",
              height: 3,
            },
          }}
        >
          <Tab label="الفيديوهات" />
          <Tab label="الموسيقى" />
        </Tabs>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 1500,
          borderRadius: "0 0 10px 10px",
          mt: -1,
          height: "90vh",
          overflowY: "scroll",
          padding: 5,
        }}
      >
        <TabPanel value={value} index={0}>
          <Typography
            variant="body1"
            sx={{
              color: "#3c7168",
              display: "flex",
              justifyContent: "space-evenly",
              flexWrap: "wrap",
            }}
          >
            {yogaVideos.map((item, index) => (
              <VideoCard
                key={index}
                title={item.title}
                video={item.link}
                des={item.description}
              />
            ))}
          </Typography>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Typography
            variant="body1"
            sx={{
              color: "#3c7168",
              height: "90vh",
              overflowY: "scroll",
              padding: 5,
            }}
          >
            <MusicCard />
          </Typography>
        </TabPanel>
      </Paper>
    </Box>
  );
}
