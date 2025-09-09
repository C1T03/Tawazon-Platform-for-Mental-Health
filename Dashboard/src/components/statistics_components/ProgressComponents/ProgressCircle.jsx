import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography } from '@mui/material';

const ProgressCircle = ({
  width = 200,
  height = 200,
  strokeColor = "#4CAF50",
  textColor = "#2E7D32",
  percentage = 79,
  strokeWidth = 12,
  bgStrokeColor = "#F5F5F5",
  bgStrokeWidth = 8,
  description = " ",
  fontSize = 36,
  fontWeight = 700,
  animationDuration = 1.5,
  className = "",
  style = {}
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [circleStyle, setCircleStyle] = useState({});
  const [textStyle, setTextStyle] = useState({});
  const [descStyle, setDescStyle] = useState({});
  const circleRef = useRef(null);
  const textRef = useRef(null);
  const descRef = useRef(null);
  
  const r = Math.min(width, height) / 2 - Math.max(strokeWidth, bgStrokeWidth) / 2;
  const cx = width / 2;
  const cy = height / 2;
  const circumference = 2 * Math.PI * r;

  useEffect(() => {
    // أنيميشن دائرة التقدم
    setCircleStyle({
      strokeDashoffset: circumference,
      opacity: 0
    });
    
    // أنيميشن النسبة المئوية
    setTextStyle({
      transform: 'scale(0.8)',
      opacity: 0
    });
    
    // أنيميشن الوصف
    setDescStyle({
      transform: 'translateY(20px)',
      opacity: 0
    });
    
    // بدء الأنيميشن بعد تأخير بسيط
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
      
      setCircleStyle({
        strokeDashoffset: circumference * (1 - percentage / 100),
        opacity: 1,
        transition: `stroke-dashoffset ${animationDuration}s ease-in-out, opacity ${animationDuration}s ease-in-out`
      });
      
      setTextStyle({
        transform: 'scale(1)',
        opacity: 1,
        transition: `transform ${animationDuration/2}s ease-out ${animationDuration*0.7}s, opacity ${animationDuration/2}s ease-out ${animationDuration*0.7}s`
      });
      
      setDescStyle({
        transform: 'translateY(0)',
        opacity: 1,
        transition: `transform ${animationDuration/2}s ease-out ${animationDuration*0.9}s, opacity ${animationDuration/2}s ease-out ${animationDuration*0.9}s`
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [percentage, circumference, animationDuration]);

  return (
    <Box 
      className={className}
      style={style}
      sx={{
        position: 'relative',
        width: width,
        height: height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        version="1.1" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* الدائرة الخلفية */}
        <circle 
          r={r} 
          cx={cx} 
          cy={cy} 
          fill="transparent" 
          stroke={bgStrokeColor} 
          strokeWidth={bgStrokeWidth}
        />
        
        {/* دائرة التقدم مع أنيميشن */}
        <circle
          ref={circleRef}
          r={r}
          cx={cx}
          cy={cy}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={circleStyle}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>
      
      {/* النسبة المئوية مع أنيميشن */}
      <Box sx={{
        position: 'absolute',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Box ref={textRef} style={textStyle}>
          <Typography 
            variant="h4" 
            fontWeight={fontWeight}
            color={textColor}
            sx={{ 
              fontSize,
              transition: 'all 0.3s ease'
            }}
          >
            {animatedPercentage}%
          </Typography>
        </Box>
        
        <Box ref={descRef} style={descStyle}>
          <Typography 
            variant="body1" 
            color="textSecondary"
            sx={{ 
              mt: 1,
              fontSize: fontSize * 0.5,
              fontWeight: 500,
              maxWidth: width * 0.7,
              transition: 'all 0.3s ease',
              fontFamily: 'Dubai'
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProgressCircle;