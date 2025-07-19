import React from 'react';
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
  IconButton
} from '@mui/material';
import {
  Email as EmailIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Cake as CakeIcon,
  Flag as FlagIcon,
  Description as BioIcon,
  Edit as EditIcon,
  Lock as PasswordIcon
} from '@mui/icons-material';
import { useUser } from '../context/UserContext';

export default function Profile() {
  const { user } = useUser();

  if (!user) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">الرجاء تسجيل الدخول لعرض الملف الشخصي</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ direction: 'rtl', p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        الملف الشخصي
      </Typography>
      
      <Typography paragraph sx={{ mb: 4, textAlign: 'right', color: 'text.secondary' }}>
        هذا قسم الملف الشخصي حيث يمكنك عرض وتحديث معلوماتك الشخصية.
      </Typography>
      
      <Grid container spacing={4}>
        {/* العمود الأول - الصورة والمعلومات الأساسية */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={user.profile_picture}
                sx={{ 
                  width: 150, 
                  height: 150,
                  mb: 2,
                  border: '3px solid',
                  borderColor: 'primary.main'
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {user.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {user.role}
              </Typography>
              
              <Button 
                variant="outlined" 
                startIcon={<EditIcon />}
                sx={{ mt: 3 }}
              >
                تغيير الصورة
              </Button>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                الإعدادات
              </Typography>
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <EditIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="تعديل الملف الشخصي" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <PasswordIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="تغيير كلمة المرور" />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>
        
        {/* العمود الثاني - التفاصيل الشخصية */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3
            }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                المعلومات الشخصية
              </Typography>
              <IconButton color="primary">
                <EditIcon />
              </IconButton>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <DetailItem 
                  icon={<PersonIcon color="primary" />}
                  label="الاسم الكامل"
                  value={user.name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DetailItem 
                  icon={<EmailIcon color="primary" />}
                  label="البريد الإلكتروني"
                  value={user.email}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DetailItem 
                  icon={<WorkIcon color="primary" />}
                  label="الدور"
                  value={user.role}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DetailItem 
                  icon={<CakeIcon color="primary" />}
                  label="العمر"
                  value={user.age}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DetailItem 
                  icon={<FlagIcon color="primary" />}
                  label="البلد"
                  value={user.country}
                />
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                السيرة الذاتية
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex' }}>
                  <BioIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                  <Typography>
                    {user.bio || "لم يتم إضافة سيرة ذاتية بعد"}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

// مكون مساعد لعرض تفاصيل الملف
function DetailItem({ icon, label, value }) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <Box sx={{ mr: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {value || 'غير محدد'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}