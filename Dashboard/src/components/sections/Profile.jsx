import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  Badge,
  Card,
  CardContent,
  Fade,
  Grow,
  Slide,
  useTheme
} from '@mui/material';
import {
  Email as EmailIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  CalendarToday as DateIcon,
  Verified as VerifiedIcon,
  Edit as EditIcon,
  MoreVert as MoreIcon,
  Business as DepartmentIcon,
  AccessTime as LastLoginIcon,
  LockReset as ResetPasswordIcon,
  Assignment as ReportsIcon,
  Shield as PermissionsIcon,
} from '@mui/icons-material';
import { useUser } from '../context/UserContext';

export default function AdminProfile() {
  const { user } = useUser();
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  if (!user) {
    return (
      <Box sx={{ direction: 'rtl', maxWidth: 1400, margin: '0 auto', p: 3, bgcolor: 'background.default', fontFamily: 'Dubai, Arial, sans-serif' }}>
        <Typography variant="h6" sx={{ fontFamily: 'Dubai', color: 'text.primary' }}>الرجاء تسجيل الدخول لعرض الملف الشخصي</Typography>
      </Box>
    );
  }

  // بيانات افتراضية للأدمن
  const adminStats = {
    lastLogin: '2023-05-15 14:30',
    registrationDate: '2022-01-10',
    adminLevel: 'مدير نظام',
    department: 'التقنية',
    permissions: ['إدارة المستخدمين', 'إعدادات النظام', 'تحليل البيانات'],
    tasksCompleted: 85,
    reportsGenerated: 42,
    usersManaged: 156
  };

  // معالجة مسار الصورة ليكون كاملاً
  // إذا كان user.profile_picture يبدأ بـ /uploads أو uploads فقط، أضف رابط السيرفر
  const getProfileImageUrl = () => {
    if (!user.profile_picture) {
      // صورة افتراضية إذا لم توجد صورة للمستخدم
      return 'http://localhost:5000/uploads/default_profile.jpg';
    }
    // إذا كان المسار يبدأ بـ http أو https، أعده كما هو
    if (user.profile_picture.startsWith('http')) {
      return user.profile_picture;
    }
    // إذا كان المسار يبدأ بـ /uploads أو uploads، أضف رابط السيرفر
    return `http://localhost:5000${user.profile_picture.startsWith('/') ? '' : '/'}${user.profile_picture}`;
  };

  return (
    <Box sx={{ direction: 'rtl', width: '100%', minHeight: '100vh', p: { xs: 1, md: 3 }, bgcolor: 'background.default', fontFamily: 'Dubai, Arial, sans-serif' }}>
      {/* معلومات الأدمن الأساسية */}
      <Grid container spacing={3}>
        {/* العمود الأيسر - الصورة والمعلومات الشخصية */}
        <Grid item xs={12} md={6}>
          <Grow in={true} timeout={800}>
            <Card 
              elevation={2} 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              sx={{ 
                fontFamily: 'Dubai', 
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.mode === 'dark' ? 'rgba(79, 170, 132, 0.05)' : 'rgba(79, 170, 132, 0.02)'} 100%)`,
                height: '100%',
                borderRadius: 4,
                border: `2px solid ${isHovered ? '#4faa84' : theme.palette.divider}`,
                boxShadow: isHovered 
                  ? '0 12px 40px rgba(79, 170, 132, 0.15)'
                  : theme.palette.mode === 'dark' 
                    ? '0 4px 20px rgba(0,0,0,0.3)'
                    : '0 2px 12px rgba(0,0,0,0.08)',
                transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: 'linear-gradient(90deg, #4faa84, #2196f3, #ff9800)',
                  backgroundSize: '200% 100%',
                  animation: isHovered ? 'gradient-shift 2s ease-in-out infinite' : 'none',
                  '@keyframes gradient-shift': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' }
                  }
                }
              }}
            >
            <CardContent sx={{ textAlign: 'center', pt: 4 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <IconButton size="small" sx={{ bgcolor: '#4faa84', color: 'white' }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                }
              >
                <Avatar
                  src={getProfileImageUrl()}
                  sx={{ 
                    width: 140, 
                    height: 140,
                    margin: '0 auto 16px',
                    border: '4px solid',
                    borderColor: '#4faa84',
                    bgcolor: 'background.default',
                    boxShadow: '0 8px 25px rgba(79, 170, 132, 0.3)',
                    transition: 'all 0.3s ease',
                    transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)'
                  }}
                />
              </Badge>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, fontFamily: 'Dubai', color: 'text.primary' }}>
                {user.name}
                <VerifiedIcon sx={{ ml: 1, fontSize: '1.2rem', color: '#4faa84' }} />
              </Typography>
              <Chip 
                icon={<AdminIcon />} 
                label={adminStats.adminLevel} 
                sx={{ mb: 2, fontFamily: 'Dubai', bgcolor: '#4faa84', color: 'white', '& .MuiChip-icon': { color: 'white' } }} 
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontFamily: 'Dubai' }}>
                {user.bio || "مسؤول النظام - إدارة وتشغيل المنصة"}
              </Typography>
              <Slide direction="up" in={true} timeout={1000}>
                <Box>
                  <Button 
                    variant="contained" 
                    startIcon={<EditIcon />}
                    fullWidth
                    sx={{ 
                      mb: 2, 
                      fontFamily: 'Dubai', 
                      background: 'linear-gradient(135deg, #4faa84 0%, #3c8a6b 100%)',
                      borderRadius: 3,
                      py: 1.5,
                      boxShadow: '0 4px 15px rgba(79, 170, 132, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        background: 'linear-gradient(135deg, #3c8a6b 0%, #2c5530 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(79, 170, 132, 0.4)'
                      }
                    }}
                  >
                    تعديل الملف الشخصي
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<ResetPasswordIcon />}
                    fullWidth
                    sx={{ 
                      fontFamily: 'Dubai', 
                      color: '#4faa84', 
                      borderColor: '#4faa84',
                      borderWidth: 2,
                      borderRadius: 3,
                      py: 1.5,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        bgcolor: 'rgba(79, 170, 132, 0.08)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 15px rgba(79, 170, 132, 0.2)'
                      }
                    }}
                  >
                    تغيير كلمة المرور
                  </Button>
                </Box>
              </Slide>
            </CardContent>
            <Divider sx={{ my: 1 }} />
            <List dense sx={{ px: 2 }}>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <EmailIcon sx={{ color: '#4faa84' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={<span style={{ fontFamily: 'Dubai' }}>البريد الإلكتروني</span>} 
                  secondary={<span style={{ fontFamily: 'Dubai' }}>{user.email}</span>} 
                  secondaryTypographyProps={{ color: 'text.primary' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <DateIcon sx={{ color: '#4faa84' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={<span style={{ fontFamily: 'Dubai' }}>تاريخ التسجيل</span>} 
                  secondary={<span style={{ fontFamily: 'Dubai' }}>{adminStats.registrationDate}</span>} 
                  secondaryTypographyProps={{ color: 'text.primary' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <LastLoginIcon sx={{ color: '#4faa84' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={<span style={{ fontFamily: 'Dubai' }}>آخر دخول</span>} 
                  secondary={<span style={{ fontFamily: 'Dubai' }}>{adminStats.lastLogin}</span>} 
                  secondaryTypographyProps={{ color: 'text.primary' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <DepartmentIcon sx={{ color: '#4faa84' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={<span style={{ fontFamily: 'Dubai' }}>القسم</span>} 
                  secondary={<span style={{ fontFamily: 'Dubai' }}>{adminStats.department}</span>} 
                  secondaryTypographyProps={{ color: 'text.primary' }}
                />
              </ListItem>
            </List>
          </Card>
          </Grow>
          
        </Grid>
        {/* العمود الأيمن - الإحصائيات والأدوات */}
        <Grid item xs={12} md={8}>
          {/* بطاقات الإحصائيات */}
          <Grid container spacing={3}>
         
            <Grid item xs={12} sm={4}>
              {/* صلاحيات الأدمن */}
          <Fade in={true} timeout={1200}>
            <Card 
              elevation={2} 
              onMouseEnter={() => setActiveCard('permissions')}
              onMouseLeave={() => setActiveCard(null)}
              sx={{ 
                mt: 3, 
                fontFamily: 'Dubai', 
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(79, 170, 132, 0.02) 100%)`,
                borderRadius: 4,
                border: `2px solid ${activeCard === 'permissions' ? '#4faa84' : theme.palette.divider}`,
                boxShadow: activeCard === 'permissions'
                  ? '0 8px 25px rgba(79, 170, 132, 0.15)'
                  : theme.palette.mode === 'dark' 
                    ? '0 4px 20px rgba(0,0,0,0.3)'
                    : '0 2px 12px rgba(0,0,0,0.08)',
                transform: activeCard === 'permissions' ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: 'linear-gradient(90deg, #4faa84, #2196f3)',
                  transform: activeCard === 'permissions' ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.3s ease'
                }
              }}
            >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', fontFamily: 'Dubai', color: 'text.primary' }}>
                <SecurityIcon sx={{ ml: 1, color: '#4faa84' }} /> الصلاحيات
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {adminStats.permissions.map((permission, index) => (
                  <Chip 
                    key={index}
                    icon={<PermissionsIcon sx={{ color: '#4faa84' }} />}
                    label={permission}
                    size="small"
                    sx={{ fontFamily: 'Dubai', bgcolor: '#e6f4ef', color: '#4faa84', border: '1px solid #4faa84' }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
          </Fade>
            </Grid>
           
          </Grid>
          {/* نشاط الأدمن الأخير */}
          <Slide direction="up" in={true} timeout={1400}>
            <Card 
              elevation={2} 
              onMouseEnter={() => setActiveCard('activity')}
              onMouseLeave={() => setActiveCard(null)}
              sx={{ 
                mt: 3, 
                fontFamily: 'Dubai', 
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, rgba(33, 150, 243, 0.02) 100%)`,
                borderRadius: 4,
                border: `2px solid ${activeCard === 'activity' ? '#2196f3' : theme.palette.divider}`,
                boxShadow: activeCard === 'activity'
                  ? '0 8px 25px rgba(33, 150, 243, 0.15)'
                  : theme.palette.mode === 'dark' 
                    ? '0 4px 20px rgba(0,0,0,0.3)'
                    : '0 2px 12px rgba(0,0,0,0.08)',
                transform: activeCard === 'activity' ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: 'linear-gradient(90deg, #2196f3, #ff9800)',
                  transform: activeCard === 'activity' ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.3s ease'
                }
              }}
            >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: 'Dubai', color: 'text.primary' }}>
                  النشاط الأخير
                </Typography>
                <Button size="small" sx={{ fontFamily: 'Dubai', color: '#4faa84' }}>عرض الكل</Button>
              </Box>
              <List dense>
                {[
                  { action: 'قام بتعطيل مستخدم', time: 'منذ 15 دقيقة', icon: <PersonIcon sx={{ color: '#4faa84' }} /> },
                  { action: 'أنشأ تقرير جديد', time: 'منذ ساعتين', icon: <ReportsIcon sx={{ color: '#4faa84' }} /> },
                  { action: 'قام بتحديث إعدادات النظام', time: 'منذ 5 ساعات', icon: <SettingsIcon sx={{ color: '#4faa84' }} /> },
                  { action: 'أضاف صلاحية جديدة', time: 'منذ يوم', icon: <SecurityIcon sx={{ color: '#4faa84' }} /> },
                ].map((item, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={<span style={{ fontFamily: 'Dubai' }}>{item.action}</span>}
                      secondary={<span style={{ fontFamily: 'Dubai' }}>{item.time}</span>}
                    />
                    <IconButton size="small">
                      <MoreIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
          </Slide>
        </Grid>
      </Grid>
    </Box>
  );
}