import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Avatar,
  Fade,
  Slide,
  IconButton,
  LinearProgress
} from '@mui/material';
import {
  Lock as LockIcon,
  ExitToApp as ExitIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const AuthGuard = ({ open, onLogin, onClose, darkMode = false }) => {
  const [countdown, setCountdown] = useState(10);
  const [isAutoRedirect, setIsAutoRedirect] = useState(true);

  useEffect(() => {
    if (!open || !isAutoRedirect) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onLogin();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, isAutoRedirect, onLogin]);

  const handleStopAutoRedirect = () => {
    setIsAutoRedirect(false);
    setCountdown(0);
  };

  const progress = ((10 - countdown) / 10) * 100;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          background: darkMode 
            ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: darkMode
            ? '0 25px 50px rgba(0, 0, 0, 0.5)'
            : '0 25px 50px rgba(79, 170, 132, 0.15)',
          border: `2px solid ${darkMode ? '#475569' : 'rgba(79, 170, 132, 0.2)'}`,
          position: 'relative'
        }
      }}
      TransitionComponent={Slide}
      TransitionProps={{
        direction: 'up',
        timeout: 600
      }}
    >
      {/* شريط التقدم العلوي */}
      {isAutoRedirect && (
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 4,
            backgroundColor: darkMode ? '#475569' : '#e2e8f0',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e)',
              transition: 'transform 1s linear'
            }
          }}
        />
      )}

      {/* زر الإغلاق */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
          color: darkMode ? '#cbd5e1' : '#64748b',
          bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          '&:hover': {
            bgcolor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
            transform: 'scale(1.1)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 0, textAlign: 'center', position: 'relative' }}>
        {/* خلفية متحركة */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: darkMode
              ? 'radial-gradient(circle at 30% 70%, rgba(239, 68, 68, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)'
              : 'radial-gradient(circle at 30% 70%, rgba(79, 170, 132, 0.05) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(34, 197, 94, 0.05) 0%, transparent 50%)',
            animation: 'pulse 4s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.3 },
              '50%': { opacity: 0.6 }
            }
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1, p: 4 }}>
          {/* الأيقونة الرئيسية */}
          <Fade in={open} timeout={800}>
            <Box sx={{ mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)',
                  animation: 'bounce 2s ease-in-out infinite',
                  '@keyframes bounce': {
                    '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                    '40%': { transform: 'translateY(-10px)' },
                    '60%': { transform: 'translateY(-5px)' }
                  }
                }}
              >
                <LockIcon sx={{ fontSize: 40, color: 'white' }} />
              </Avatar>
            </Box>
          </Fade>

          {/* العنوان الرئيسي */}
          <Fade in={open} timeout={1000}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Dubai-Bold, Dubai, sans-serif',
                fontWeight: 'bold',
                color: darkMode ? '#f1f5f9' : '#1e293b',
                mb: 2,
                background: darkMode
                  ? 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)'
                  : 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              انتهت صلاحية الجلسة
            </Typography>
          </Fade>

          {/* الوصف */}
          <Fade in={open} timeout={1200}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Dubai, sans-serif',
                color: darkMode ? '#94a3b8' : '#64748b',
                mb: 1,
                lineHeight: 1.6
              }}
            >
              غير مصرح بالوصول - يجب تسجيل الدخول مرة أخرى
            </Typography>
          </Fade>

          <Fade in={open} timeout={1400}>
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'Dubai, sans-serif',
                color: darkMode ? '#64748b' : '#94a3b8',
                mb: 4,
                lineHeight: 1.5
              }}
            >
              لأسباب أمنية، انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى للمتابعة
            </Typography>
          </Fade>

          {/* العد التنازلي */}
          {isAutoRedirect && countdown > 0 && (
            <Fade in={true} timeout={1600}>
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: 'Dubai-Bold, Dubai, sans-serif',
                    fontWeight: 'bold',
                    color: '#ef4444',
                    mb: 1,
                    textShadow: darkMode ? '0 2px 8px rgba(239, 68, 68, 0.3)' : '0 2px 8px rgba(239, 68, 68, 0.2)'
                  }}
                >
                  {countdown}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'Dubai, sans-serif',
                    color: darkMode ? '#94a3b8' : '#64748b'
                  }}
                >
                  سيتم التوجيه تلقائياً إلى صفحة تسجيل الدخول
                </Typography>
              </Box>
            </Fade>
          )}

          {/* الأزرار */}
          <Fade in={open} timeout={1800}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ExitIcon />}
                onClick={onLogin}
                sx={{
                  fontFamily: 'Dubai-Bold, Dubai, sans-serif',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(34, 197, 94, 0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                تسجيل الدخول الآن
              </Button>

              {isAutoRedirect && (
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<RefreshIcon />}
                  onClick={handleStopAutoRedirect}
                  sx={{
                    fontFamily: 'Dubai, sans-serif',
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    borderColor: darkMode ? '#475569' : '#d1d5db',
                    color: darkMode ? '#cbd5e1' : '#6b7280',
                    '&:hover': {
                      borderColor: darkMode ? '#64748b' : '#9ca3af',
                      bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  إيقاف العد التنازلي
                </Button>
              )}
            </Box>
          </Fade>

          {/* معلومات إضافية */}
          <Fade in={open} timeout={2000}>
            <Box
              sx={{
                mt: 4,
                p: 3,
                borderRadius: 3,
                bgcolor: darkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                border: `1px solid ${darkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)'}`
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'Dubai, sans-serif',
                  color: darkMode ? '#fca5a5' : '#dc2626',
                  textAlign: 'center',
                  lineHeight: 1.5
                }}
              >
                💡 نصيحة: لتجنب انتهاء الجلسة، تأكد من النشاط المنتظم في التطبيق
              </Typography>
            </Box>
          </Fade>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthGuard;