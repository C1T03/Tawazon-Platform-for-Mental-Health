import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';

export default function VideoCard({ video, title, des }) {
  // استخراج معرف الفيديو من الرابط
  const getVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getVideoId(video);

  return (
    <Card sx={{
      width: 345,
      borderRadius: '12px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      mt: 2.5,
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
      }
    }}>
      {/* مشغل الفيديو المدمج */}
      <Box sx={{ 
        position: 'relative',
        paddingTop: '56.25%', // نسبة 16:9
        overflow: 'hidden',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px'
      }}>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
        />
      </Box>
         
      {/* محتوى البطاقة */}
      <CardContent sx={{ px: 3, py: 2.5 }}>
        <Typography 
          variant="h6" 
          component="div"
          sx={{ 
            fontWeight: 'bold',
            mb: 1,
            color: '#2d3748',
            lineHeight: 1.3,
            fontFamily: 'Dubai-Regular',
          }}
        >
          {title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mb: 2,
            color: '#4a5568',
            fontSize: '0.875rem',
            fontFamily: 'Dubai-Regular',
          }}
        >
          {des}
        </Typography>
      </CardContent>
    </Card>
  );
}