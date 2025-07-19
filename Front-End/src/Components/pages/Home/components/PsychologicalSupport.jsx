import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import CustomButton from '../../../ui/CustomButton';

export default function PsychologicalSupport() {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 6, px: 4, my: 4 }}>
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: '#f8f9fa' }}>
        <Box
          component="img"
          src="/Images/JPG/Refugees.jpg"
          alt="Therapy Session"
          sx={{
            width: '100%',
            maxWidth: 500,
            height: 'auto',
            borderRadius: 2, // زوايا مدورة
            objectFit: 'cover', // تغطية المساحة دون تشويه
            mb: 3,
            
          }}
        />
<Box sx={{textAlign: 'right'}}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4faa84', mb: 3, fontFamily: 'Dubai-Bold' }}>
          دعم نفسي متكامل للاجئين والمغتربين
        </Typography>

        <Typography variant="body1" sx={{ color: 'text.secondary', fontFamily: 'Dubai-Regular', fontSize: '1rem', mb: 4 }}>
          في منصة <b>تَوَاْزُنْ</b>، نحن ندرك التحديات النفسية التي يواجهها اللاجئون والمغتربون بعد سنوات الحرب والانتقال القسري. 
          لهذا، نقدم دعمًا شاملاً لمساعدتهم على تجاوز الصعوبات وإعادة بناء حياتهم النفسية بروح من الطمأنينة والثقة.  
        </Typography>

        <Typography variant="body2" sx={{ fontFamily: 'Dubai-Regular', fontSize: '0.95rem', color: '#555', lineHeight: 1.8, mr: 5 }}>
          • جلسات علاج فردية مع خبراء متخصصين لمعالجة القلق والاكتئاب والتوتر.<br />
          • مجتمع داعم يخلق مساحة آمنة للتواصل ومشاركة التجارب.<br />
          • برامج التأهيل الاجتماعي لتعزيز المهارات والاندماج في البيئة الجديدة.<br />
          • موارد معرفية تفاعلية لفهم الحالة النفسية وتحسينها.
        </Typography>


</Box>
      </Paper>
    </Container>
  );
}