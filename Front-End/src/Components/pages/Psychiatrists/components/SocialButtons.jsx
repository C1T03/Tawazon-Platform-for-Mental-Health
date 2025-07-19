import React from 'react'
import { LinkedIn, Instagram, Telegram, Twitter, Email, Facebook } from '@mui/icons-material'
import { Button } from '@mui/material'

const iconMap = {
  telegram: <Telegram />,
  linkedin: <LinkedIn />,
  instagram: <Instagram />,
  twitter: <Twitter />,
  email: <Email />,
  facebook: <Facebook />,
};

export default function SocialButtons({object}) {
  const keys = object ? Object.keys(object) : []
  
  const handleButtonClick = (url) => {
    // فتح الرابط في نافذة/تبويب جديد
    window.open(`https://${url}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {keys.map((item, index) => (
        <Button 
          key={index} 
          sx={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            p: 0,
            minWidth: '40px',
            '&:hover': {
              boxShadow: 2,
              transform: 'scale(1.1)',
              transition: 'all 0.3s ease'
            }
          }}
          onClick={() => handleButtonClick(object.item)}
          aria-label={item}
        >
          {iconMap[item] || null}
        </Button>
      ))}
    </>
  )
}