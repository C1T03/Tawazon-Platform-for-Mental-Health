import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Avatar
} from '@mui/material';
import {
  ErrorOutline as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon
} from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8fdfc 0%, #e8f5f0 100%)',
            p: 3
          }}
        >
          <Paper
            elevation={8}
            sx={{
              p: 6,
              textAlign: 'center',
              maxWidth: 500,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '2px solid rgba(239, 68, 68, 0.1)'
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3,
                bgcolor: '#ef4444',
                boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)'
              }}
            >
              <ErrorIcon sx={{ fontSize: 40, color: 'white' }} />
            </Avatar>

            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Dubai-Bold, Dubai, sans-serif',
                color: '#1e293b',
                mb: 2
              }}
            >
              حدث خطأ غير متوقع
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontFamily: 'Dubai, sans-serif',
                color: '#64748b',
                mb: 4,
                lineHeight: 1.6
              }}
            >
              نعتذر عن هذا الإزعاج. حدث خطأ في تحميل لوحة التحكم.
              يرجى المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleRefresh}
                sx={{
                  fontFamily: 'Dubai-Bold, Dubai, sans-serif',
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                  }
                }}
              >
                إعادة تحميل
              </Button>

              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                onClick={this.handleGoHome}
                sx={{
                  fontFamily: 'Dubai, sans-serif',
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  borderColor: '#d1d5db',
                  color: '#6b7280',
                  '&:hover': {
                    borderColor: '#9ca3af',
                    bgcolor: 'rgba(0,0,0,0.02)'
                  }
                }}
              >
                الصفحة الرئيسية
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;