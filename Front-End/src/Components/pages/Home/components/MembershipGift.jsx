import React from 'react';
import {Box, Typography, Container } from '@mui/material';
import CustomButton from '../../../ui/CustomButton';
export default function MembershipGift() {
  return (
    <Container maxWidth="md" sx={{ 
        textAlign: 'center', 
        py: 6,
        px: 4,
        my: 4
      }}>
        <Box
  component="img"
  src="/Images/JPG/Gift.jpg"
  alt=""
  sx={{
    width: 300,
    height: 200,
    borderRadius: 2, // زوايا مدورة
    objectFit: 'cover' // تغطية المساحة دون تشويه
  }}
/>
        
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold',
          color: '#4faa84',
          mb: 3,
          fontFamily: 'Dubai-Bold'
        }}>
          غيّر حياة من تحب بإهدائهم جلسات علاجية
        </Typography>
        
        
        <CustomButton
          label="إهداء العضوية"
          onClick={() => 5}
          bgcolor="#4faa85"
        />
        <Typography variant="body1" sx={{ 
          color: 'text.secondary',
          fontFamily: 'Dubai-Regular',
          fontSize: '0.9rem',
          mt: 6
        }}>
          ملاحظة: يمكنك إهداء جلسات علاج فردي للأفراد بعمر 18+ فقط.<br />
          لجلسات العلاج الزوجي أو علاج الأطفالي، يرجى زيارة الصفحة الرئيسية.
        </Typography>
      </Container>
  )
}
