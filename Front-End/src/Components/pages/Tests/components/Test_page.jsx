import React from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { Tests_Data } from './Test_Data'
import PsychologicalTest from './PsychologicalTest '
export default function Test_page() {
    const {id} = useParams()
  return (
   <Box sx={{
      minHeight: '100vh',
      py: 10,
      fontFamily: 'Dubai-Regular'
    }}>
      
      <PsychologicalTest testData={Tests_Data[id - 1]} />
      
      <Typography 
        variant="body2" 
        align="center" 
        sx={{ 
          mt: 4, 
          color: '#666',
          maxWidth: 800,
          mx: 'auto',
          px: 2,
          fontFamily: 'Dubai-Regular'
        }}
      >
        تم تصميم هذا التطبيق لأغراض التقييم الأولي فقط. لا يُعد تشخيصًا طبيًا ولا يُغني عن استشارة المختصين في الصحة النفسية.
      </Typography>
    </Box>
  )
}
