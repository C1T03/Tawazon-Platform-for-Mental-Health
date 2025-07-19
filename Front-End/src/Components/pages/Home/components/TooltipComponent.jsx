import React from 'react'
import { Tooltip, IconButton } from '@mui/material'
import { QuestionMark } from '@mui/icons-material'
export default function TooltipComponent({title}) {
  return (
    <Tooltip title={title} componentsProps={{
      tooltip: {
        sx: {
          bgcolor: "#fff",
          color: '#000',
          height: 'auto',
          fontSize: 12,
          fontFamily: 'Dubai-Bold',
          "& .MuiTooltip-arrow": {
            color: "#000",
          },
        },
      },
    }}
  >
    <IconButton>
      <QuestionMark sx={{transform: 'scaleX(-1)' , color: '#fff'}}/>
    </IconButton>
  </Tooltip>
  )
}
