import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box,
  Typography,
  Button,
  useTheme
} from '@mui/material';

const AuthSwitcher = ({ isLogin }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ textAlign: 'center', mt: 2 }}>
      {isLogin ? (
        <Typography variant="body1">
          لا تملك حساباً؟{' '}
          <Button
            onClick={() => navigate('/register')}
            sx={{
              color: theme.palette.primary.main,
              textDecoration: 'underline',
              p: 0,
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
                color: '#2c5a52',
              },
            }}
          >
            إنشاء حساب جديد
          </Button>
        </Typography>
      ) : (
        <Typography variant="body1">
          لديك حساب بالفعل؟{' '}
          <Button
            onClick={() => navigate('/login')}
            sx={{
              color: theme.palette.primary.main,
              textDecoration: 'underline',
              p: 0,
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
                color: '#2c5a52',
              },
            }}
          >
            تسجيل الدخول
          </Button>
        </Typography>
      )}
    </Box>
  );
};

export default AuthSwitcher;