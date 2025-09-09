/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tab,
  Tabs,
  CircularProgress,
  Avatar,
  Chip,
  Stack,
  Skeleton,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Snackbar,
  ThemeProvider,
  createTheme,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  useTheme
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Psychology,
  Favorite as FavoriteIcon,
  WorkHistory as WorkHistoryIcon,
  StarRate as StarRateIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon
} from "@mui/icons-material";
import CustomTextField from '../ui/CustomTextField';
import { styled } from "@mui/material/styles";
import { useUser } from "../context/UserContext";

// إنشاء theme مخصص يدعم النظام المظلم
const createCustomTheme = (isDark) => createTheme({
  palette: {
    mode: isDark ? 'dark' : 'light',
    primary: {
      main: "#3c7168",
      contrastText: "#fff"
    },
    secondary: {
      main: "#3c7168",
    },
    background: {
      default: isDark ? "#0f172a" : "#f5f7fa",
      paper: isDark ? "#1e293b" : "#ffffff"
    },
    text: {
      primary: isDark ? "#f8fafc" : "#1e293b",
      secondary: isDark ? "#cbd5e1" : "#64748b"
    }
  },
  typography: {
    fontFamily: "Dubai, Dubai-Regular, Arial, sans-serif",
    h4: {
      fontWeight: 600,
      color: isDark ? "#f8fafc" : "#3c7168"
    },
    body1: {
      color: isDark ? "#cbd5e1" : "#555"
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '1rem',
          padding: '12px 24px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        }
      }
    }
  }
});

// المكونات المخصصة مع خط دبي
const DubaiTypography = styled(Typography)({
  fontFamily: "Dubai, sans-serif",
});

const DubaiTableCell = styled(TableCell)({
  fontFamily: "Dubai, sans-serif",
  textAlign: "right",
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor:
    status === "active"
      ? theme.palette.success.light
      : theme.palette.error.light,
  color:
    status === "active" ? theme.palette.success.dark : theme.palette.error.dark,
  fontWeight: "bold",
  fontFamily: "Dubai, sans-serif",
}));

export default function Users() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const customTheme = createCustomTheme(isDark);
  
  const [activeTab, setActiveTab] = useState("users");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [adminPassword, setAdminPassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [addDoctorDialog, setAddDoctorDialog] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: 'male',
    date_of_birth: '',
    specialization: '',
    sub_specialization: '',
    title: 'دكتور',
    bio: '',
    experience_years: 0,
    languages: 'العربية',
    consultation_fee: 0,
    country: 'سوريا',
    city: '',
    address: '',
    certificate: 'شهادة في الطب النفسي',
    profile_picture: null
  });
  
  const subSpecializations = {
    'أخصائي نفسي': ['علم النفس الإكلينيكي', 'علم النفس الإرشادي', 'علم النفس الشرعي', 'علم النفس الصحي'],
    'طبيب نفسي': ['الطب النفسي', 'الطب النفسي للأطفال والمراهقين'],
    'معالج نفسي': ['علم النفس الإرشادي', 'علم النفس العائلي'],
    'بروفيسور في علم النفس': ['علم النفس المعرفي', 'علم النفس البيولوجي', 'علم النفس التنموي', 'علم النفس الاجتماعي', 'علم النفس التربوي', 'علم النفس الصناعي والتنظيمي', 'علم نفس الشخصية']
  };
  const [addDoctorLoading, setAddDoctorLoading] = useState(false);
  const [viewDialog, setViewDialog] = useState({ open: false, user: null, loading: false });
  const { accessToken, user: currentUser } = useUser();

  const checkTokenValidity = async () => {
    const token = accessToken || localStorage.getItem("accessToken");
    if (!token) return false;
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-token', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let endpoint = "";
        switch (activeTab) {
          case "users":
            endpoint = "http://localhost:5000/api/users/all";
            break;
          case "doctors":
            endpoint = "http://localhost:5000/api/doctors";
            break;
          case "patients":
            endpoint = "http://localhost:5000/api/patients";
            break;
          default:
            endpoint = "http://localhost:5000/api/users/all";
        }

        const headers = {
          "Authorization": `Bearer ${
            accessToken || localStorage.getItem("accessToken")
          }`
        };

        const res = await fetch(endpoint, { headers });
        if (!res.ok) {
          console.error(`API Error: ${res.status} - ${res.statusText}`);
          if (res.status === 401) {
            throw new Error('انتهت صلاحية الجلسة - يرجى تسجيل الدخول مرة أخرى');
          }
          throw new Error(`فشل في جلب ${activeTab}`);
        }
        const responseData = await res.json();
        // التأكد من أن البيانات هي مصفوفة
        const dataArray = Array.isArray(responseData) ? responseData : 
                         responseData.data ? responseData.data : 
                         responseData.doctors ? responseData.doctors :
                         responseData.users ? responseData.users :
                         responseData.patients ? responseData.patients : [];
        setData(dataArray);
      } catch (err) {
        setError(`حدث خطأ أثناء جلب ${activeTab}: ${err.message}`);
      }
      setLoading(false);
    };

    fetchData();
  }, [activeTab, accessToken]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDeleteClick = (user) => {
    setDeleteDialog({ open: true, user });
  };

  const handleDeleteConfirm = async () => {
    if (!adminPassword.trim()) {
      setSnackbar({ open: true, message: "يرجى إدخال الرمز السري", severity: "error" });
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete-user/${deleteDialog.user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          adminCode: adminPassword
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        setData(prev => prev.filter(item => item.id !== deleteDialog.user.id));
        setSnackbar({ open: true, message: "تم حذف المستخدم بنجاح", severity: "success" });
        setDeleteDialog({ open: false, user: null });
        setAdminPassword("");
      } else {
        setSnackbar({ open: true, message: result.message || "فشل في حذف المستخدم", severity: "error" });
      }
    } catch (error) {
      console.error('Delete error:', error);
      setSnackbar({ open: true, message: "حدث خطأ أثناء حذف المستخدم", severity: "error" });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, user: null });
    setAdminPassword("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString("ar-EG");
  };

  const getRoleText = (role) => {
    const roles = {
      user: "مستخدم",
      doctor: "مختص",
      admin: "مدير",
      content_creator: "منشئ محتوى"
    };
    return roles[role] || role;
  };

  const getGenderText = (gender) => {
    const genders = {
      male: "ذكر",
      female: "أنثى",
      other: "آخر"
    };
    return genders[gender] || "غير محدد";
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleViewUser = async (userId, isDoctor = false) => {
    setViewDialog({ open: true, user: null, loading: true });
    
    try {
      // استخدام البيانات المحملة مسبقاً للجميع
      const userData = data.find(item => (item.id || item._id) === userId);
      if (userData) {
        // إضافة role للتمييز
        const userWithRole = { ...userData, role: isDoctor ? 'doctor' : 'user' };
        setViewDialog({ open: true, user: userWithRole, loading: false });
      } else {
        setSnackbar({ open: true, message: 'لم يتم العثور على بيانات المستخدم', severity: 'error' });
        setViewDialog({ open: false, user: null, loading: false });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'حدث خطأ أثناء عرض البيانات', severity: 'error' });
      setViewDialog({ open: false, user: null, loading: false });
    }
  };

  const handleToggleVerification = async (doctorId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/doctors/${doctorId}/toggle-verification`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken || localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        // تحديث البيانات في الجدول
        setData(prev => prev.map(doctor => 
          doctor.id === doctorId 
            ? { ...doctor, verified: result.data.verified }
            : doctor
        ));
        setSnackbar({ 
          open: true, 
          message: result.message, 
          severity: 'success' 
        });
      } else {
        setSnackbar({ 
          open: true, 
          message: result.message || 'فشل في تغيير حالة التوثيق', 
          severity: 'error' 
        });
      }
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: 'حدث خطأ أثناء تغيير حالة التوثيق', 
        severity: 'error' 
      });
    }
  };

  const handleAddDoctor = async () => {
    setAddDoctorLoading(true);
    try {
      const formData = new FormData();
      
      // إضافة جميع البيانات إلى FormData
      Object.keys(doctorForm).forEach(key => {
        if (key === 'profile_picture' && doctorForm[key]) {
          formData.append('profile_picture', doctorForm[key]);
        } else if (key !== 'profile_picture') {
          formData.append(key, doctorForm[key]);
        }
      });
      formData.append('role', 'doctor');

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken || localStorage.getItem('accessToken')}`
        },
        body: formData
      });

      const result = await response.json();
      
      if (response.ok) {
        setSnackbar({ open: true, message: 'تم إنشاء حساب المختص بنجاح', severity: 'success' });
        setAddDoctorDialog(false);
        setDoctorForm({
          name: '',
          email: '',
          password: '',
          phone: '',
          gender: 'male',
          date_of_birth: '',
          specialization: '',
          sub_specialization: '',
          title: 'دكتور',
          bio: '',
          experience_years: 0,
          languages: 'العربية',
          consultation_fee: 0,
          country: 'سوريا',
          city: '',
          address: '',
          certificate: 'شهادة في الطب النفسي',
          profile_picture: null
        });
        // إعادة تحميل البيانات
        if (activeTab === 'doctors') {
          const fetchData = async () => {
            try {
              const res = await fetch('http://localhost:5000/api/doctors', {
                headers: { 'Authorization': `Bearer ${accessToken || localStorage.getItem('accessToken')}` }
              });
              const responseData = await res.json();
              const dataArray = Array.isArray(responseData) ? responseData : responseData.doctors || [];
              setData(dataArray);
            } catch (err) {
              console.error(err);
            }
          };
          fetchData();
        }
      } else {
        setSnackbar({ open: true, message: result.message || 'فشل في إنشاء حساب المختص', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'حدث خطأ أثناء إنشاء حساب المختص', severity: 'error' });
    } finally {
      setAddDoctorLoading(false);
    }
  };

  const renderTableContent = () => {
    switch (activeTab) {
      case "users":
        return (
          <>
            <TableHead>
              <TableRow>
                <DubaiTableCell> </DubaiTableCell>
                <DubaiTableCell>البيانات الشخصية</DubaiTableCell>
                <DubaiTableCell>البريد والهاتف</DubaiTableCell>
                <DubaiTableCell>الموقع</DubaiTableCell>
                <DubaiTableCell>الدور</DubaiTableCell>
                <DubaiTableCell>تاريخ التسجيل</DubaiTableCell>
                <DubaiTableCell>الإجراءات</DubaiTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(data) && data.map((user) => (
                <StyledTableRow key={user.id || user._id}>
                  <DubaiTableCell>
                    <Avatar 
                      src={user.profile_picture ? `http://localhost:5000${user.profile_picture}` : null} 
                      alt={user.name}
                      sx={{ width: 50, height: 50 }}
                    />
                  </DubaiTableCell>
                  <DubaiTableCell>
                    <DubaiTypography fontWeight="bold">{user.name}</DubaiTypography>
                    <DubaiTypography variant="body2" color="text.secondary">
                      {getGenderText(user.gender)} • {user.age ? `${user.age} سنة` : "العمر غير محدد"}
                    </DubaiTypography>
                  </DubaiTableCell>
                  <DubaiTableCell>
                    <DubaiTypography>{user.email}</DubaiTypography>
                    <DubaiTypography variant="body2" color="text.secondary">
                      {user.phone || "لا يوجد هاتف"}
                    </DubaiTypography>
                  </DubaiTableCell>
                  <DubaiTableCell>
                    <DubaiTypography>{user.country || "غير محدد"}</DubaiTypography>
                    <DubaiTypography variant="body2" color="text.secondary">
                      {user.city || "المدينة غير محددة"}
                    </DubaiTypography>
                  </DubaiTableCell>
                  <DubaiTableCell>
                    <Chip
                      label={getRoleText(user.role)}
                      color={user.role === 'admin' ? 'error' : user.role === 'doctor' ? 'primary' : 'default'}
                      size="small"
                      sx={{ fontFamily: "Dubai, sans-serif" }}
                    />
                  </DubaiTableCell>
                  <DubaiTableCell>
                    <DubaiTypography variant="body2">
                      {formatDate(user.registration_date)}
                    </DubaiTypography>
                  </DubaiTableCell>
                  <DubaiTableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleViewUser(user.id || user._id, false)}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                     
                      {currentUser?.role === 'admin' && user.id !== currentUser.id && (
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>
                  </DubaiTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </>
        );
      case "patients":
        return (
          <>
            <TableHead>
              <TableRow>
                <DubaiTableCell>الطبيب</DubaiTableCell>
                <DubaiTableCell>المريض</DubaiTableCell>
                <DubaiTableCell>تاريخ البدء</DubaiTableCell>
                <DubaiTableCell>الجلسة القادمة</DubaiTableCell>
                <DubaiTableCell>نوع العلاقة</DubaiTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(data) && data.map((patient) => (
                <StyledTableRow key={patient.id}>
                  <DubaiTableCell>
                    <DubaiTypography>{patient.doctor_id}</DubaiTypography>
                  </DubaiTableCell>
                  <DubaiTableCell>
                    <DubaiTypography>{patient.user_id}</DubaiTypography>
                  </DubaiTableCell>
                  <DubaiTableCell>
                    <DubaiTypography>
                      {new Date(patient.start_date).toLocaleDateString()}
                    </DubaiTypography>
                  </DubaiTableCell>
                  <DubaiTableCell>
                    <DubaiTypography>
                      {patient.next_session_date
                        ? new Date(
                            patient.next_session_date
                          ).toLocaleDateString()
                        : "غير محدد"}
                    </DubaiTypography>
                  </DubaiTableCell>
                  <DubaiTableCell>
                    <DubaiTypography>
                      {patient.relationship_type || "غير محدد"}
                    </DubaiTypography>
                  </DubaiTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </>
        );
      case "doctors":
      default:
        return (
          <>
            <TableHead>
              <TableRow>
                <DubaiTableCell> </DubaiTableCell>
                <DubaiTableCell>بيانات الطبيب</DubaiTableCell>
                <DubaiTableCell>التخصص</DubaiTableCell>
                <DubaiTableCell>الخبرة والتقييم</DubaiTableCell>
                <DubaiTableCell>الموقع</DubaiTableCell>
                <DubaiTableCell>رسوم الاستشارة</DubaiTableCell>
                <DubaiTableCell>الإجراءات</DubaiTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(data) && data.map((doctor) => (
                <StyledTableRow key={doctor.id}>
                  <DubaiTableCell>
                    <Avatar 
                      src={doctor.profile_picture ? `http://localhost:5000${doctor.profile_picture}` : null} 
                      alt={doctor.name}
                      sx={{ width: 50, height: 50 }}
                    />
                  </DubaiTableCell>
                  <DubaiTableCell>
                    <DubaiTypography fontWeight="bold">{doctor.name}</DubaiTypography>
                    <DubaiTypography variant="body2" color="text.secondary">
                      {doctor.title} • {doctor.age ? `${doctor.age} سنة` : 'غير محدد'}
                    </DubaiTypography>
                    <DubaiTypography variant="body2" color="text.secondary">
                      {doctor.email}
                    </DubaiTypography>
                  </DubaiTableCell>
                  <DubaiTableCell>
                    <DubaiTypography fontWeight="bold">{doctor.specialization}</DubaiTypography>
                    {doctor.sub_specialization && (
                      <DubaiTypography variant="body2" color="text.secondary">
                        {doctor.sub_specialization}
                      </DubaiTypography>
                    )}
                  </DubaiTableCell>
                  <DubaiTableCell>
                    <DubaiTypography>{doctor.experience_years || 0} سنة</DubaiTypography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <DubaiTypography variant="body2" fontWeight="bold">
                        ★ {doctor.rating || 0}
                      </DubaiTypography>
                      <DubaiTypography variant="body2" color="text.secondary">
                        ({doctor.reviews_count || 0})
                      </DubaiTypography>
                    </Stack>
                  </DubaiTableCell>
                  <DubaiTableCell>
                    <DubaiTypography>{doctor.country || "غير محدد"}</DubaiTypography>
                    <DubaiTypography variant="body2" color="text.secondary">
                      {doctor.city || "المدينة غير محددة"}
                    </DubaiTypography>
                  </DubaiTableCell>
                  <DubaiTableCell>
                    <DubaiTypography fontWeight="bold">
                      {doctor.consultation_fee && doctor.consultation_fee > 0 ? `${doctor.consultation_fee} ر.س` : 'غير محدد'}
                    </DubaiTypography>
                    <Chip
                      label={doctor.verified ? "موثق" : "غير موثق"}
                      color={doctor.verified ? "success" : "default"}
                      size="small"
                      clickable={currentUser?.role === 'admin'}
                      onClick={currentUser?.role === 'admin' ? () => handleToggleVerification(doctor.id, doctor.verified) : undefined}
                      sx={{ 
                        fontFamily: "Dubai, sans-serif", 
                        mt: 0.5,
                        cursor: currentUser?.role === 'admin' ? 'pointer' : 'default',
                        '&:hover': currentUser?.role === 'admin' ? { opacity: 0.8 } : {}
                      }}
                    />
                  </DubaiTableCell>
                  <DubaiTableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleViewUser(doctor.id, true)}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      
                      {currentUser?.role === 'admin' && (
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteClick(doctor)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>
                  </DubaiTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </>
        );
    }
  };

  return (
    <Box sx={{ direction: "rtl", p: 3 }}>
      {/* Specializations Info Boxes */}
      <Box sx={{ mb: 4 }}>
        <DubaiTypography
          variant="h5"
          sx={{
            mb: 3,
            textAlign: "center",
            color: "#3c7168",
            fontWeight: "bold",
          }}
        >
          تعرف على تخصصات المعالجين النفسيين
        </DubaiTypography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
          {/* أخصائي نفسي */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              background: isDark 
                ? "linear-gradient(135deg, rgba(79, 170, 132, 0.15) 0%, rgba(79, 170, 132, 0.25) 100%)"
                : "linear-gradient(135deg, #e8f5f0 0%, #d4f1e4 100%)",
              border: "2px solid rgba(79, 170, 132, 0.3)",
              borderRadius: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 25px rgba(79, 170, 132, 0.2)",
                borderColor: "#3c7168",
              },
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "#4faa84",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <Psychology sx={{ fontSize: 30, color: "white" }} />
            </Box>
            <DubaiTypography
              variant="h6"
              sx={{
                mb: 2,
                color: "#4faa84",
                fontWeight: "bold",
              }}
            >
              أخصائي نفسي
            </DubaiTypography>
            <DubaiTypography
              variant="body2"
              sx={{
                mb: 2,
                lineHeight: 1.6,
                fontSize: "0.9rem"
              }}
            >
              متخصص في تقييم وعلاج الاضطرابات النفسية والسلوكية باستخدام العلاج النفسي والتقنيات السلوكية
            </DubaiTypography>
            <Box sx={{ textAlign: "right", fontSize: "0.85rem" }}>
              <DubaiTypography variant="caption" sx={{ fontWeight: "bold", color: "#3c7168" }}>
                المؤهل:
              </DubaiTypography>
              <DubaiTypography variant="caption" sx={{ display: "block", mb: 1 }}>
                ماجستير أو دكتوراه في علم النفس الإكلينيكي
              </DubaiTypography>
              <DubaiTypography variant="caption" sx={{ fontWeight: "bold", color: "#3c7168" }}>
                وصف الأدوية:
              </DubaiTypography>
              <DubaiTypography variant="caption" sx={{ display: "block", color: "#d32f2f" }}>
                غير مخول لوصف الأدوية
              </DubaiTypography>
            </Box>
          </Paper>

          {/* معالج نفسي */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              background: isDark 
                ? "linear-gradient(135deg, rgba(102, 187, 106, 0.15) 0%, rgba(102, 187, 106, 0.25) 100%)"
                : "linear-gradient(135deg, #e0f7e9 0%, #c8f2d4 100%)",
              border: "2px solid rgba(102, 187, 106, 0.3)",
              borderRadius: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 25px rgba(102, 187, 106, 0.2)",
                borderColor: "#66bb6a",
              },
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "#66bb6a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <FavoriteIcon sx={{ fontSize: 30, color: "white" }} />
            </Box>
            <DubaiTypography
              variant="h6"
              sx={{
                mb: 2,
                color: "#66bb6a",
                fontWeight: "bold",
              }}
            >
              معالج نفسي
            </DubaiTypography>
            <DubaiTypography
              variant="body2"
              sx={{
                mb: 2,
                lineHeight: 1.6,
                fontSize: "0.9rem"
              }}
            >
              يقدم العلاج النفسي والإرشاد النفسي للأفراد والأزواج والعائلات لحل المشاكل النفسية والعاطفية
            </DubaiTypography>
            <Box sx={{ textAlign: "right", fontSize: "0.85rem" }}>
              <DubaiTypography variant="caption" sx={{ fontWeight: "bold", color: "#66bb6a" }}>
                المؤهل:
              </DubaiTypography>
              <DubaiTypography variant="caption" sx={{ display: "block", mb: 1 }}>
                دبلوم أو بكالوريوس في العلاج النفسي أو الإرشاد
              </DubaiTypography>
              <DubaiTypography variant="caption" sx={{ fontWeight: "bold", color: "#66bb6a" }}>
                وصف الأدوية:
              </DubaiTypography>
              <DubaiTypography variant="caption" sx={{ display: "block", color: "#d32f2f" }}>
                غير مخول لوصف الأدوية
              </DubaiTypography>
            </Box>
          </Paper>

          {/* طبيب نفسي */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              background: isDark 
                ? "linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.25) 100%)"
                : "linear-gradient(135deg, #d7f4e8 0%, #b8edc7 100%)",
              border: "2px solid rgba(76, 175, 80, 0.3)",
              borderRadius: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 25px rgba(76, 175, 80, 0.2)",
                borderColor: "#4caf50",
              },
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "#4caf50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <WorkHistoryIcon sx={{ fontSize: 30, color: "white" }} />
            </Box>
            <DubaiTypography
              variant="h6"
              sx={{
                mb: 2,
                color: "#4caf50",
                fontWeight: "bold",
              }}
            >
              طبيب نفسي
            </DubaiTypography>
            <DubaiTypography
              variant="body2"
              sx={{
                mb: 2,
                lineHeight: 1.6,
                fontSize: "0.9rem"
              }}
            >
              طبيب متخصص في تشخيص وعلاج الاضطرابات النفسية والعقلية، يجمع بين العلاج الدوائي والنفسي
            </DubaiTypography>
            <Box sx={{ textAlign: "right", fontSize: "0.85rem" }}>
              <DubaiTypography variant="caption" sx={{ fontWeight: "bold", color: "#4caf50" }}>
                المؤهل:
              </DubaiTypography>
              <DubaiTypography variant="caption" sx={{ display: "block", mb: 1 }}>
                دكتور في الطب + تخصص في الطب النفسي
              </DubaiTypography>
              <DubaiTypography variant="caption" sx={{ fontWeight: "bold", color: "#4caf50" }}>
                وصف الأدوية:
              </DubaiTypography>
              <DubaiTypography variant="caption" sx={{ display: "block", color: "#2e7d32" }}>
                مخول لوصف الأدوية النفسية
              </DubaiTypography>
            </Box>
          </Paper>

          {/* بروفيسور في علم النفس */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: "center",
              background: isDark 
                ? "linear-gradient(135deg, rgba(56, 142, 60, 0.15) 0%, rgba(56, 142, 60, 0.25) 100%)"
                : "linear-gradient(135deg, #cef2e0 0%, #a8e6ba 100%)",
              border: "2px solid rgba(56, 142, 60, 0.3)",
              borderRadius: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 25px rgba(56, 142, 60, 0.2)",
                borderColor: "#388e3c",
              },
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "#388e3c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <StarRateIcon sx={{ fontSize: 30, color: "white" }} />
            </Box>
            <DubaiTypography
              variant="h6"
              sx={{
                mb: 2,
                color: "#388e3c",
                fontWeight: "bold",
              }}
            >
              بروفيسور في علم النفس
            </DubaiTypography>
            <DubaiTypography
              variant="body2"
              sx={{
                mb: 2,
                lineHeight: 1.6,
                fontSize: "0.9rem"
              }}
            >
              أكاديمي وباحث متخصص في علم النفس، يقدم الاستشارات المتقدمة والعلاج النفسي المتخصص
            </DubaiTypography>
            <Box sx={{ textAlign: "right", fontSize: "0.85rem" }}>
              <DubaiTypography variant="caption" sx={{ fontWeight: "bold", color: "#388e3c" }}>
                المؤهل:
              </DubaiTypography>
              <DubaiTypography variant="caption" sx={{ display: "block", mb: 1 }}>
                دكتوراه في علم النفس + خبرة أكاديمية
              </DubaiTypography>
              <DubaiTypography variant="caption" sx={{ fontWeight: "bold", color: "#388e3c" }}>
                وصف الأدوية:
              </DubaiTypography>
              <DubaiTypography variant="caption" sx={{ display: "block", color: "#d32f2f" }}>
                غير مخول لوصف الأدوية (إلا إذا كان طبيباً)
              </DubaiTypography>
            </Box>
          </Paper>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ "& .MuiTab-root": { fontFamily: "Dubai, sans-serif" } }}
        >
          <Tab label="المستخدمين" value="users" />
          <Tab label="الأطباء" value="doctors" />
        </Tabs>
        
        {activeTab === 'doctors' && currentUser?.role === 'admin' && (
          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ml: 1.5}}/>}
            onClick={() => setAddDoctorDialog(true)}
            sx={{ 
              fontFamily: 'Dubai, sans-serif',
              background: 'linear-gradient(135deg, #4faa84 0%, #3c8a6b 100%)',
              borderRadius: 2,
              px: 2,
              py: 1.5,
              boxShadow: '0 4px 15px rgba(79, 170, 132, 0.3)',
              '&:hover': { 
                background: 'linear-gradient(135deg, #3c8a6b 0%, #2c5530 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(79, 170, 132, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            إضافة مختص
          </Button>
        )}
      </Box>

      {error && (
        <Box sx={{ p: 2, bgcolor: "error.light", borderRadius: 1, mb: 2 }}>
          <DubaiTypography color="error.dark">{error}</DubaiTypography>
        </Box>
      )}

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            {loading ? (
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    {[...Array(7)].map((_, i) => (
                      <DubaiTableCell key={i}>
                        <Skeleton
                          variant="text"
                          sx={{ fontFamily: "Dubai, sans-serif" }}
                        />
                      </DubaiTableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              renderTableContent()
            )}
          </Table>
        </TableContainer>
      </Paper>

      {!loading && data.length === 0 && (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <DubaiTypography variant="h6" color="text.secondary">
            لا توجد بيانات متاحة
          </DubaiTypography>
        </Box>
      )}

      {/* Dialog حذف المستخدم */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={handleCloseDeleteDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#f8fafc' : '#1e293b'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontFamily: "Dubai, sans-serif", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          color: isDark ? '#f8fafc' : '#1e293b'
        }}>
          تأكيد حذف المستخدم
          <IconButton 
            onClick={handleCloseDeleteDialog}
            sx={{ color: isDark ? '#f8fafc' : '#1e293b' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DubaiTypography sx={{ mb: 2, color: isDark ? '#cbd5e1' : '#374151' }}>
            هل أنت متأكد من حذف المستخدم <strong>{deleteDialog.user?.name}</strong>؟
          </DubaiTypography>
          <DubaiTypography variant="body2" color="error" sx={{ mb: 3 }}>
            هذه العملية غير قابلة للتراجع وسيتم حذف جميع بيانات المستخدم.
          </DubaiTypography>
          <TextField
            fullWidth
            type="password"
            label="كلمة مرور الإدارة"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            sx={{ 
              fontFamily: "Dubai, sans-serif",
              '& .MuiOutlinedInput-root': {
                bgcolor: isDark ? '#334155' : '#ffffff',
                color: isDark ? '#f8fafc' : '#1e293b',
                '& fieldset': {
                  borderColor: isDark ? '#475569' : '#d1d5db'
                },
                '&:hover fieldset': {
                  borderColor: isDark ? '#64748b' : '#9ca3af'
                }
              },
              '& .MuiInputLabel-root': {
                color: isDark ? '#cbd5e1' : '#6b7280'
              }
            }}
            helperText="يرجى إدخال كلمة مرور حساب الإدارة للتأكيد"
          />
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#0f172a' : '#f9fafb' }}>
          <Button 
            onClick={handleCloseDeleteDialog} 
            sx={{ 
              fontFamily: "Dubai, sans-serif",
              color: isDark ? '#cbd5e1' : '#6b7280'
            }}
          >
            إلغاء
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleteLoading || !adminPassword.trim()}
            sx={{ fontFamily: "Dubai, sans-serif" }}
          >
            {deleteLoading ? <CircularProgress size={20} /> : "حذف"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog إضافة طبيب */}
      <ThemeProvider theme={customTheme}>
      <Dialog 
        open={addDoctorDialog} 
        onClose={() => setAddDoctorDialog(false)} 
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            height: '100vh',
            borderRadius: 1.5,
            boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.5)' : '0 20px 40px rgba(79, 170, 132, 0.15)',
            overflow: 'hidden',
            bgcolor: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#f8fafc' : '#1e293b'
          }
        }}
      >
        <Box sx={{ 
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: isDark ? '#0f172a' : '#f8fafc',
          borderBottom: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`
        }}>
          <Box>
            <DubaiTypography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#f8fafc' : '#1e293b' }}>
              إضافة مختص جديد
            </DubaiTypography>
            <DubaiTypography variant="body2" sx={{ opacity: 0.9, mt: 0.5, color: isDark ? '#cbd5e1' : '#64748b' }}>
              قم بإدخال جميع بيانات المختص المطلوبة
            </DubaiTypography>
          </Box>
          <IconButton 
            onClick={() => setAddDoctorDialog(false)} 
            sx={{ 
              color: isDark ? '#f8fafc' : '#1e293b',
              bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        <DialogContent sx={{ 
          p: 0, 
          background: isDark 
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #f8fdfc 0%, #e8f5f0 100%)',
          height: 'calc(100% - 140px)',
          overflow: 'auto'
        }}>
          <Box sx={{ p: 2 }}>
            {/* قسم واحد مدمج */}
            <Paper elevation={1} sx={{ 
              p: 3, 
              borderRadius: 3, 
              background: isDark 
                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 253, 252, 0.95) 100%)',
              border: `2px solid ${isDark ? 'rgba(79, 170, 132, 0.3)' : 'rgba(79, 170, 132, 0.1)'}`,
              boxShadow: isDark 
                ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                : '0 8px 32px rgba(79, 170, 132, 0.12)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(90deg, #4faa84, #66bb6a, #81c784)'
              }
            }}>
              {/* البيانات الأساسية */}
              <DubaiTypography variant="h6" sx={{ 
                mb: 2, 
                color: '#4faa84', 
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}>
                البيانات الأساسية
              </DubaiTypography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
                <CustomTextField
                  label="الاسم الكامل"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                  icon={<PersonIcon />}
                  placeholder="أدخل الاسم الكامل"
                  required
                />
                <CustomTextField
                  label="البريد الإلكتروني"
                  type="email"
                  value={doctorForm.email}
                  onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                  icon={<EmailIcon />}
                  placeholder="أدخل البريد الإلكتروني"
                  required
                />
                <CustomTextField
                  label="كلمة المرور"
                  type="password"
                  value={doctorForm.password}
                  onChange={(e) => setDoctorForm({...doctorForm, password: e.target.value})}
                  icon={<LockIcon />}
                  placeholder="أدخل كلمة مرور قوية"
                  required
                />
                <CustomTextField
                  label="رقم الهاتف"
                  value={doctorForm.phone}
                  onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})}
                  icon={<PhoneIcon />}
                  placeholder="أدخل رقم الهاتف"
                />
                <CustomTextField
                  label="الجنس"
                  select
                  value={doctorForm.gender}
                  onChange={(e) => setDoctorForm({...doctorForm, gender: e.target.value})}
                  SelectProps={{ native: true }}
                >
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </CustomTextField>
                <CustomTextField
                  label="تاريخ الميلاد"
                  type="date"
                  value={doctorForm.date_of_birth}
                  onChange={(e) => setDoctorForm({...doctorForm, date_of_birth: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              {/* التخصص والخبرة */}
              <DubaiTypography variant="h6" sx={{ 
                mb: 2, 
                color: '#66bb6a', 
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}>
                التخصص والخبرة
              </DubaiTypography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
                <CustomTextField
                  label="التخصص الرئيسي"
                  select
                  value={doctorForm.specialization}
                  onChange={(e) => {
                    setDoctorForm({...doctorForm, specialization: e.target.value, sub_specialization: ''});
                  }}
                  SelectProps={{ native: true }}
                  required
                >
                  <option value="">اختر التخصص</option>
                  <option value="أخصائي نفسي">أخصائي نفسي</option>
                  <option value="طبيب نفسي">طبيب نفسي</option>
                  <option value="معالج نفسي">معالج نفسي</option>
                  <option value="بروفيسور في علم النفس">بروفيسور في علم النفس</option>
                </CustomTextField>
                {doctorForm.specialization && subSpecializations[doctorForm.specialization] && (
                  <CustomTextField
                    label="التخصص الفرعي"
                    select
                    value={doctorForm.sub_specialization}
                    onChange={(e) => setDoctorForm({...doctorForm, sub_specialization: e.target.value})}
                    SelectProps={{ native: true }}
                  >
                    <option value="">اختر التخصص الفرعي</option>
                    {subSpecializations[doctorForm.specialization].map((subSpec) => (
                      <option key={subSpec} value={subSpec}>{subSpec}</option>
                    ))}
                  </CustomTextField>
                )}
                <CustomTextField
                  label="اللقب العلمي"
                  value={doctorForm.title}
                  onChange={(e) => setDoctorForm({...doctorForm, title: e.target.value})}
                  icon={<WorkIcon />}
                  placeholder="دكتور / بروفيسور"
                />
                <CustomTextField
                  label="سنوات الخبرة"
                  type="number"
                  value={doctorForm.experience_years}
                  onChange={(e) => setDoctorForm({...doctorForm, experience_years: parseInt(e.target.value) || 0})}
                  placeholder="عدد سنوات الخبرة"
                />
                <CustomTextField
                  label="رسوم الاستشارة (ريال)"
                  type="number"
                  value={doctorForm.consultation_fee}
                  onChange={(e) => setDoctorForm({...doctorForm, consultation_fee: parseFloat(e.target.value) || 0})}
                  placeholder="مثال: 200"
                />
                <CustomTextField
                  label="اللغات"
                  value={doctorForm.languages}
                  onChange={(e) => setDoctorForm({...doctorForm, languages: e.target.value})}
                  placeholder="العربية، الإنجليزية"
                />
              </Box>

              {/* الموقع والمعلومات */}
              <DubaiTypography variant="h6" sx={{ 
                mb: 2, 
                color: '#81c784', 
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}>
                الموقع والمعلومات الإضافية
              </DubaiTypography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
                <CustomTextField
                  label="البلد"
                  value={doctorForm.country}
                  onChange={(e) => setDoctorForm({...doctorForm, country: e.target.value})}
                  icon={<LocationIcon />}
                  placeholder="أدخل اسم البلد"
                />
                <CustomTextField
                  label="المدينة"
                  value={doctorForm.city}
                  onChange={(e) => setDoctorForm({...doctorForm, city: e.target.value})}
                  icon={<LocationIcon />}
                  placeholder="أدخل اسم المدينة"
                />
                <CustomTextField
                  label="الشهادة"
                  value={doctorForm.certificate}
                  onChange={(e) => setDoctorForm({...doctorForm, certificate: e.target.value})}
                  placeholder="نوع الشهادة"
                />
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
                <CustomTextField
                  label="العنوان"
                  value={doctorForm.address}
                  onChange={(e) => setDoctorForm({...doctorForm, address: e.target.value})}
                  placeholder="أدخل عنوان العيادة"
                />
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ 
                    fontFamily: "Dubai, sans-serif",
                    height: 56,
                    borderRadius: 2,
                    borderColor: '#4faa84',
                    color: '#4faa84',
                    '&:hover': { borderColor: '#3c8a6b', bgcolor: 'rgba(79, 170, 132, 0.04)' }
                  }}
                >
                  {doctorForm.profile_picture ? `تم اختيار الصورة` : 'اختر صورة شخصية'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (file.size > 10 * 1024 * 1024) {
                          setSnackbar({ open: true, message: 'حجم الملف كبير جداً', severity: 'error' });
                          return;
                        }
                        setDoctorForm({...doctorForm, profile_picture: file});
                      }
                    }}
                  />
                </Button>
              </Box>
              
              <CustomTextField
                label="السيرة الذاتية"
                multiline
                rows={3}
                value={doctorForm.bio}
                onChange={(e) => setDoctorForm({...doctorForm, bio: e.target.value})}
                placeholder="اكتب نبذة مختصرة عن المختص..."
                fullWidth
              />
            </Paper>
          </Box>
        </DialogContent>
        
        <Box sx={{ 
          p: 1, 
          background: isDark 
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #f8fdfc 0%, #e8f5f0 100%)', 
        }}>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            
            <Button 
              onClick={handleAddDoctor}
              variant="contained"
              disabled={addDoctorLoading || !doctorForm.name || !doctorForm.email || !doctorForm.password || !doctorForm.specialization}
              sx={{ 
                fontFamily: "Dubai, sans-serif",
                px: 4,
                py: 1.5,
                background: '#4faa84',
                borderRadius: 2,
                boxShadow: '0 4px 15px rgba(79, 170, 132, 0.3)',
                fontSize: '1rem',
                fontWeight: 'bold',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #3c8a6b 0%, #4caf50 100%)',
                  boxShadow: '0 6px 20px rgba(79, 170, 132, 0.4)',
                  transform: 'translateY(-1px)'
                },
                '&:disabled': {
                  background: '#ccc',
                  transform: 'none'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {addDoctorLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={18} color="inherit" />
                  جاري الإضافة...
                </Box>
              ) : (
                'إضافة المختص'
              )}
            </Button>

            <Button 
              onClick={() => setAddDoctorDialog(false)} 
              variant="outlined"
              sx={{ 
                fontFamily: "Dubai, sans-serif",
                px: 3,
                py: 1.2,
                borderColor: '#81c784',
                color: '#66bb6a',
                '&:hover': { borderColor: '#66bb6a', bgcolor: 'rgba(129, 199, 132, 0.04)' }
              }}
            >
              إلغاء
            </Button>
          </Stack>
        </Box>
      </Dialog>
      </ThemeProvider>

      {/* Dialog عرض تفاصيل المستخدم/المختص */}
      <Dialog 
        open={viewDialog.open} 
        onClose={() => setViewDialog({ open: false, user: null, loading: false })} 
        maxWidth="xl" 
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            borderRadius: 2,
            boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.5)' : '0 20px 40px rgba(79, 170, 132, 0.15)',
            overflow: 'hidden',
            background: isDark ? '#1e293b' : '#F3F2EC'
          }
        }}
      >
        <Box sx={{ 
          background: isDark ? '#0f172a' : '#F3F2EC',
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`
        }}>
          <Box>
            <DubaiTypography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#f8fafc' : '#000' }}>
              {viewDialog.user?.role === 'doctor' ? 'تفاصيل المختص' : 'تفاصيل المستخدم'}
            </DubaiTypography>
            <DubaiTypography variant="body2" sx={{ color: isDark ? '#cbd5e1' : 'rgba(85, 85, 85, 0.9)', mt: 0.5 }}>
              معلومات شاملة عن {viewDialog.user?.role === 'doctor' ? 'المختص' : 'المستخدم'}
            </DubaiTypography>
          </Box>
          <IconButton 
            onClick={() => setViewDialog({ open: false, user: null, loading: false })}
            sx={{ 
              color: isDark ? '#f8fafc' : '#000',
              bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        <DialogContent sx={{ 
          p: 0, 
          background: isDark 
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #f8fdfc 0%, #e8f5f0 100%)', 
          height: 'calc(90vh - 80px)', 
          overflow: 'auto' 
        }}>
          {viewDialog.loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : viewDialog.user ? (
            <Box sx={{ p: 3, direction: 'rtl' }}>
              {/* Main Profile Layout */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' }, gap: 3 }}>
                
                {/* Left Column - Doctor Profile Card */}
                <Paper elevation={0} sx={{
                  borderRadius: 1,
                  overflow: 'hidden',
                  bgcolor: isDark ? '#334155' : '#ffffff',
                  color: isDark ? '#f8fafc' : '#000',
                  position: 'relative',
                  border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`
                }}>
                  <Box sx={{ p: 3, textAlign: 'center', display: 'grid', placeItems: 'center' }}>
                    <Box sx={{ position: 'relative', display: 'flex', mb: 2 , justifyContent:'center'}}>
                      <Avatar
                        src={viewDialog.user.profile_picture ? `http://localhost:5000${viewDialog.user.profile_picture}` : null}
                        sx={{
                          width: 120,
                          height: 120,
                          border: '4px solid white',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                          
                        }}
                      />
                      {viewDialog.user.role === 'doctor' && viewDialog.user.verified && (
                        <Box sx={{
                          position: 'absolute',
                          top: -5,
                          right: -5,
                          bgcolor: '#4caf50',
                          borderRadius: '50%',
                          p: 1,
                          border: '2px solid white'
                        }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
                          </svg>
                        </Box>
                      )}
                    </Box>
                    
                    <DubaiTypography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                      {viewDialog.user.title} {viewDialog.user.name}
                    </DubaiTypography>
                    
                    <DubaiTypography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
                      {viewDialog.user.specialization}
                    </DubaiTypography>
                    
                    {viewDialog.user.sub_specialization && (
                      <DubaiTypography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
                        {viewDialog.user.sub_specialization}
                      </DubaiTypography>
                    )}
                    
                    {viewDialog.user.role === 'doctor' && (
                      <DubaiTypography variant="body2" sx={{ mb: 2, opacity: 0.8, fontWeight: 500 }}>
                        {viewDialog.user.city || 'غير محدد'} - {viewDialog.user.country || 'غير محدد'}
                      </DubaiTypography>
                    )}
                    
                    {viewDialog.user.role === 'doctor' && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < Math.floor(viewDialog.user.rating || 0) ? '#ffd700' : 'rgba(59, 59, 59, 0.58)'}>
                              <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>
                            </svg>
                          ))}
                        </Box>
                        <DubaiTypography variant="body2" sx={{ opacity: 0.9 }}>
                          ({viewDialog.user.reviews_count || 0} تقييم)
                        </DubaiTypography>
                      </Box>
                    )}
                    
                    {viewDialog.user.role === 'doctor' && (
                      <DubaiTypography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                        {viewDialog.user.patients_count || 0} مريض
                      </DubaiTypography>
                    )}
                    
                    {/* Contact Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
                      {viewDialog.user.phone && (
                        <>
                          <IconButton
                            sx={{
                              bgcolor: '#25d366',
                              color: 'white',
                              '&:hover': { bgcolor: '#128c7e', transform: 'scale(1.1)' },
                              transition: 'all 0.3s ease'
                            }}
                            onClick={() => window.open(`https://wa.me/${viewDialog.user.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.386"/>
                            </svg>
                          </IconButton>
                          <IconButton
                            sx={{
                              bgcolor: '#0088cc',
                              color: 'white',
                              '&:hover': { bgcolor: '#006699', transform: 'scale(1.1)' },
                              transition: 'all 0.3s ease'
                            }}
                            onClick={() => window.open(`tg://resolve?domain=${viewDialog.user.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                            </svg>
                          </IconButton>
                        </>
                      )}
                      <IconButton
                        sx={{
                          bgcolor: '#8e24aa',
                          color: 'white',
                          '&:hover': { bgcolor: '#7b1fa2', transform: 'scale(1.1)' },
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => window.open('https://meet.google.com/new', '_blank')}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M15,8V16H5V8H15M16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5V7A1,1 0 0,0 16,6Z"/>
                        </svg>
                      </IconButton>
                    </Box>
                   
                  </Box>
                  
                  {/* Consultation Fee Card */}
                  {viewDialog.user.role === 'doctor' && viewDialog.user.consultation_fee && (
                    <Box sx={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                      p: 2,
                      m: 2,
                      borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center'
                    }}>
                      <DubaiTypography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                        {viewDialog.user.consultation_fee} ريال
                      </DubaiTypography>
                      <DubaiTypography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                        رسوم الاستشارة
                      </DubaiTypography>
                      {viewDialog.user.working_hours && (
                        <DubaiTypography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                          {viewDialog.user.working_hours}
                        </DubaiTypography>
                      )}
                     
                    </Box>
                  )}
                </Paper>
                
                {/* Right Column - Statistics and Information */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  
                  {/* Statistics Cards - للأطباء فقط */}
                  {viewDialog.user.role === 'doctor' && (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
                      <Paper elevation={2} sx={{
                        p: 2,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #4faa84 0%, #3c8a6b 100%)',
                        color: 'white',
                        textAlign: 'center',
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'translateY(-5px)' }
                      }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="white" style={{ marginBottom: 8 }}>
                          <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>
                        </svg>
                        <DubaiTypography variant="h4" fontWeight="bold">
                          {viewDialog.user.rating || 0}
                        </DubaiTypography>
                        <DubaiTypography variant="body2" sx={{ opacity: 0.9 }}>
                          التقييم
                        </DubaiTypography>
                      </Paper>
                      
                      <Paper elevation={2} sx={{
                        p: 2,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)',
                        color: 'white',
                        textAlign: 'center',
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'translateY(-5px)' }
                      }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="white" style={{ marginBottom: 8 }}>
                          <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                        </svg>
                        <DubaiTypography variant="h4" fontWeight="bold">
                          {viewDialog.user.patients_count || 0}
                        </DubaiTypography>
                        <DubaiTypography variant="body2" sx={{ opacity: 0.9 }}>
                          مريض
                        </DubaiTypography>
                      </Paper>
                      
                      <Paper elevation={2} sx={{
                        p: 2,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #81c784 0%, #66bb6a 100%)',
                        color: 'white',
                        textAlign: 'center',
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'translateY(-5px)' }
                      }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="white" style={{ marginBottom: 8 }}>
                          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                        </svg>
                        <DubaiTypography variant="h4" fontWeight="bold">
                          {viewDialog.user.experience_years || 0}
                        </DubaiTypography>
                        <DubaiTypography variant="body2" sx={{ opacity: 0.9 }}>
                          سنة خبرة
                        </DubaiTypography>
                      </Paper>
                      
                      <Paper elevation={2} sx={{
                        p: 2,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
                        color: 'white',
                        textAlign: 'center',
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'translateY(-5px)' }
                      }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="white" style={{ marginBottom: 8 }}>
                          <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M7,7H17V9H7V7M7,11H17V13H7V11M7,15H15V17H7V15Z"/>
                        </svg>
                        <DubaiTypography variant="h4" fontWeight="bold">
                          {viewDialog.user.publications_count || 0}
                        </DubaiTypography>
                        <DubaiTypography variant="body2" sx={{ opacity: 0.9 }}>
                          منشور
                        </DubaiTypography>
                      </Paper>
                    </Box>
                  )}
                  
                  {/* Information Sections */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr' }, gap: 2 }}>
                    
                    {/* Basic Information */}
                    <Paper elevation={2} sx={{
                      p: 2,
                      borderRadius: 3,
                      background: 'white',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'translateY(-2px)' }
                    }}>
                      <DubaiTypography variant="h6" sx={{ color: '#4faa84', fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#4faa84">
                          <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                        </svg>
                        المعلومات الأساسية
                      </DubaiTypography>
                      
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
                            <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
                          </svg>
                          <Box>
                            <DubaiTypography variant="body2" color="text.secondary">
                              الهاتف
                            </DubaiTypography>
                            <DubaiTypography variant="body1" fontWeight="500">
                              {viewDialog.user.phone || 'غير محدد'}
                            </DubaiTypography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
                            <path d="M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4M20,8L12,13L4,8V6L12,11L20,6V8Z"/>
                          </svg>
                          <Box>
                            <DubaiTypography variant="body2" color="text.secondary">
                              البريد الإلكتروني
                            </DubaiTypography>
                            <DubaiTypography variant="body1" fontWeight="500">
                              {viewDialog.user.email}
                            </DubaiTypography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
                            <path d="M9,9C10.29,9 11.5,9.41 12.47,10.11L17.58,5H13V3H21V11H19V6.41L13.89,11.5C14.59,12.5 15,13.7 15,15A6,6 0 0,1 9,21A6,6 0 0,1 3,15A6,6 0 0,1 9,9M9,11A4,4 0 0,0 5,15A4,4 0 0,0 9,19A4,4 0 0,0 13,15A4,4 0 0,0 9,11Z"/>
                          </svg>
                          <Box>
                            <DubaiTypography variant="body2" color="text.secondary">
                              الجنس والعمر
                            </DubaiTypography>
                            <DubaiTypography variant="body1" fontWeight="500">
                              {getGenderText(viewDialog.user.gender)} • {viewDialog.user.age ? `${viewDialog.user.age} سنة` : (calculateAge(viewDialog.user.date_of_birth) ? `${calculateAge(viewDialog.user.date_of_birth)} سنة` : 'غير محدد')}
                            </DubaiTypography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
                            <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V8H19V19M19,6H5V5H19V6Z"/>
                          </svg>
                          <Box>
                            <DubaiTypography variant="body2" color="text.secondary">
                              تاريخ التسجيل
                            </DubaiTypography>
                            <DubaiTypography variant="body1" fontWeight="500">
                              {formatDate(viewDialog.user.registration_date)}
                            </DubaiTypography>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                    
                    
                  </Box>
              
                  
                  {/* Professional Information for Doctors */}
                  {viewDialog.user.role === 'doctor' && (
                    <Paper elevation={2} sx={{
                      p: 3,
                      borderRadius: 3,
                      background: isDark ? '#334155' : 'white',
                      boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'translateY(-2px)' },
                      border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`
                    }}>
                      <DubaiTypography variant="h6" sx={{ color: '#4faa84', fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#4faa84">
                          <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M12,6A3,3 0 0,1 15,9A3,3 0 0,1 12,12A3,3 0 0,1 9,9A3,3 0 0,1 12,6M6,17C6,15 10,13.9 12,13.9C14,13.9 18,15 18,17V18H6V17Z"/>
                        </svg>
                        المعلومات المهنية
                      </DubaiTypography>
                      
                      <Box sx={{ display: 'grid', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
                            <path d="M12,2A3,3 0 0,1 15,5V7A3,3 0 0,1 12,10A3,3 0 0,1 9,7V5A3,3 0 0,1 12,2M12,11C14.67,11 20,12.33 20,15V20H4V15C4,12.33 9.33,11 12,11Z"/>
                          </svg>
                          <Box>
                            <DubaiTypography variant="body2" color="text.secondary">
                              اللقب العلمي والتخصص
                            </DubaiTypography>
                            <DubaiTypography variant="body1" fontWeight="500">
                              {viewDialog.user.title} - {viewDialog.user.specialization}
                            </DubaiTypography>
                            {viewDialog.user.sub_specialization && (
                              <DubaiTypography variant="body2" color="text.secondary">
                                {viewDialog.user.sub_specialization}
                              </DubaiTypography>
                            )}
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#666">
                            <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M7,7H17V9H7V7M7,11H17V13H7V11M7,15H15V17H7V15Z"/>
                          </svg>
                          <Box>
                            <DubaiTypography variant="body2" color="text.secondary">
                              الشهادة
                            </DubaiTypography>
                            <DubaiTypography variant="body1" fontWeight="500">
                              {viewDialog.user.certificate || 'غير محدد'}
                            </DubaiTypography>
                          </Box>
                        </Box>
                        
                        {viewDialog.user.languages && (
                          <Box>
                            <DubaiTypography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              اللغات
                            </DubaiTypography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {viewDialog.user.languages.split(',').map((lang, index) => (
                                <Chip
                                  key={index}
                                  label={lang.trim()}
                                  size="small"
                                  sx={{
                                    bgcolor: '#e3f2fd',
                                    color: '#1976d2',
                                    fontFamily: 'Dubai, sans-serif',
                                    fontSize: '0.75rem'
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Paper>
                  )}
                  
                  {/* Bio Section */}
                  {viewDialog.user.bio && (
                    <Paper elevation={2} sx={{
                      p: 3,
                      borderRadius: 3,
                      background: isDark ? '#334155' : 'white',
                      boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'translateY(-2px)' },
                      border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`
                    }}>
                      <DubaiTypography variant="h6" sx={{ color: '#4faa84', fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#4faa84">
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                        </svg>
                        {viewDialog.user.role === 'doctor' ? 'السيرة الذاتية' : 'نبذة شخصية'}
                      </DubaiTypography>
                      <DubaiTypography variant="body1" sx={{ lineHeight: 1.8, color: '#555' }}>
                        {viewDialog.user.bio}
                      </DubaiTypography>
                    </Paper>
                  )}
                  
                  {/* Additional Information for Doctors */}
                  {viewDialog.user.role === 'doctor' && (viewDialog.user.awards || viewDialog.user.research_interests || viewDialog.user.professional_memberships) && (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                      
                      {/* Awards */}
                      {viewDialog.user.awards && (
                        <Paper elevation={2} sx={{
                          p: 3,
                          borderRadius: 3,
                          background: 'white',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          transition: 'transform 0.3s ease',
                          '&:hover': { transform: 'translateY(-2px)' }
                        }}>
                          <DubaiTypography variant="h6" sx={{ color: '#4faa84', fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#4faa84">
                              <path d="M5,16L3,5H1V3H4L6,14L7,18H20V16H5M19,7V4H17V7H14V9H17V12H19V9H22V7H19Z"/>
                            </svg>
                            الجوائز والتكريمات
                          </DubaiTypography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {viewDialog.user.awards.split(',').map((award, index) => (
                              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: '#e8f5f0', borderRadius: 1 }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#4faa84">
                                  <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>
                                </svg>
                                <DubaiTypography variant="body2">
                                  {award.trim()}
                                </DubaiTypography>
                              </Box>
                            ))}
                          </Box>
                        </Paper>
                      )}
                      
                      {/* Research Interests */}
                      {viewDialog.user.research_interests && (
                        <Paper elevation={2} sx={{
                          p: 3,
                          borderRadius: 3,
                          background: 'white',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          transition: 'transform 0.3s ease',
                          '&:hover': { transform: 'translateY(-2px)' }
                        }}>
                          <DubaiTypography variant="h6" sx={{ color: '#66bb6a', fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#66bb6a">
                              <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                            </svg>
                            الاهتمامات البحثية
                          </DubaiTypography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {viewDialog.user.research_interests.split(',').map((interest, index) => (
                              <Chip
                                key={index}
                                label={interest.trim()}
                                sx={{
                                  bgcolor: '#f3e5f5',
                                  color: '#7b1fa2',
                                  fontFamily: 'Dubai, sans-serif',
                                  fontSize: '0.75rem'
                                }}
                              />
                            ))}
                          </Box>
                        </Paper>
                      )}
                      
                      {/* Professional Memberships */}
                      {viewDialog.user.professional_memberships && (
                        <Paper elevation={2} sx={{
                          p: 3,
                          borderRadius: 3,
                          background: 'white',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          transition: 'transform 0.3s ease',
                          '&:hover': { transform: 'translateY(-2px)' },
                          gridColumn: viewDialog.user.research_interests ? 'span 1' : 'span 2'
                        }}>
                          <DubaiTypography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#4caf50">
                              <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"/>
                            </svg>
                            العضويات المهنية
                          </DubaiTypography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {viewDialog.user.professional_memberships.split(',').map((membership, index) => (
                              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: '#e8f5e8', borderRadius: 1 }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#4caf50">
                                  <path d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                                </svg>
                                <DubaiTypography variant="body2">
                                  {membership.trim()}
                                </DubaiTypography>
                              </Box>
                            ))}
                          </Box>
                        </Paper>
                      )}
                    </Box>
                  )}
                  
                  {/* Website Link */}
                  {viewDialog.user.website && (
                    <Paper elevation={2} sx={{
                      p: 3,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      textAlign: 'center'
                    }}>
                      <DubaiTypography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                          <path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                        </svg>
                        الموقع الإلكتروني
                      </DubaiTypography>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => window.open(viewDialog.user.website, '_blank')}
                        sx={{
                          bgcolor: 'white',
                          color: '#667eea',
                          fontFamily: 'Dubai, sans-serif',
                          fontWeight: 'bold',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                        }}
                        startIcon={
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                          </svg>
                        }
                      >
                        زيارة الموقع
                      </Button>
                    </Paper>
                  )}
                </Box>
              </Box>
            </Box>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Snackbar للإشعارات */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ fontFamily: "Dubai, sans-serif" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
