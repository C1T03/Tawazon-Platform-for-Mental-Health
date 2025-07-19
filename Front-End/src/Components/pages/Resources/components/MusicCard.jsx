import { Avatar, Box, Typography, IconButton } from "@mui/material";
import { PlayArrow, Pause, SkipPrevious, SkipNext } from "@mui/icons-material";
import React, { useState, useRef } from "react";

export default function MusicCard({
  title = "اسم الأغنية",
  artist = "الفنان",
  coverImage = "",
  audioSrc = "",
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
        maxWidth: 500,
        width: "100%",
      }}
    >
      {/* غلاف الأغنية */}
      <Avatar
        src={coverImage}
        alt={`غلاف أغنية ${title}`}
        sx={{ width: 64, height: 64 }}
       
      />

      {/* معلومات الأغنية */}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography noWrap variant="h6" component="div">
          {title}
        </Typography>
        <Typography noWrap variant="body2" color="text.secondary">
          {artist}
        </Typography>
      </Box>

      {/* عناصر التحكم */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton aria-label="الأغنية السابقة">
          <SkipPrevious />
        </IconButton>
        
        <IconButton 
          aria-label={isPlaying ? "إيقاف" : "تشغيل"}
          onClick={togglePlay}
          color="primary"
          size="large"
        >
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
        
        <IconButton aria-label="الأغنية التالية">
          <SkipNext />
        </IconButton>
      </Box>

      {/* العنصر الصوتي المخفي */}
      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={() => setIsPlaying(false)}
        style={{ display: "none" }}
      />
    </Box>
  );
}