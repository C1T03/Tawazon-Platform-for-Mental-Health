import React from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip,
  Stack,
  IconButton,
  Grid,
  Container,
  Fade,
  CardHeader,
} from "@mui/material";
import {
  Email,
  Cake,
  Language,
  Work,
  Edit,
  Phone,
  ArrowForwardIos,
  Male,
  Female,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const userRole = () => {
    switch (user.role) {
      case "doctor":
        return "طبيب";
      case "admin":
        return "مدير الموقع";
      default:
        return "مستخدم";
    }
  };

  const handleEdit = (field) => {
    console.log(`Editing field: ${field}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5, my: 5 }}>
      <Fade in timeout={600}>
        <Card
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            bgcolor: "background.paper",
            transition: "transform 0.3s ease-in-out",
            "&:hover": { transform: "scale(1.02)" },
          }}
        >
          {/* Back Button */}
          <Box sx={{ px: 3, pt: 2 }}>
            <IconButton color="primary" onClick={() => navigate(-1)}>
              <ArrowForwardIos />
            </IconButton>
          </Box>

          {/* Header */}
          <CardHeader
            avatar={
              <Avatar
                sx={{
                  width: 110,
                  height: 110,
                  fontSize: "2.2rem",
                  bgcolor: "#3c7168",
                  boxShadow: 3,
                  mb: { xs: 2, sm: 0 },
                  ml: 2,
                  fontFamily: "Dubai-Bold",
                }}
              >
                {getInitials(user.name)}
              </Avatar>
            }
            title={
              <Typography variant="h4" fontFamily="Dubai-Bold">
                {user.name || "المستخدم"}
              </Typography>
            }
            subheader={
              <>
                <Typography
                  variant="body2"
                  fontFamily="Dubai-Regular"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {user.bio || "لا يوجد وصف متاح."}
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    mt: 2,
                    gap: 2,
                    alignItems: { xs: "center", sm: "flex-start" },
                  }}
                >
                  <Chip
                    label={userRole()}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      color:"#fff",
                      bgcolor:"#3c7168",
                      fontFamily: "Dubai-Regular",
                      p: 1,
                    }}
                  />
                  {user.gender && (
                    <Chip
                      icon={user.gender === "male" ? <Male /> : <Female />}
                      label={user.gender === "male" ? "ذكر" : "أنثى"}
                      variant="outlined"
                      size="small"
                      color="#3c7168"
                      sx={{ fontFamily: "Dubai-Regular", p: 1 }}
                    />
                  )}
                </Stack>
              </>
            }
          />

          <Divider />

          {/* Basic Info */}
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              color="#3c7168"
              fontFamily="Dubai-Bold"
            >
              المعلومات الأساسية
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InfoItem
                  icon={<Phone fontSize="small" />}
                  label="الهاتف"
                  value={user.phone}
                  onEdit={() => handleEdit("phone")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoItem
                  icon={<Email fontSize="small" />}
                  label="البريد الإلكتروني"
                  value={user.email}
                  onEdit={() => handleEdit("email")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoItem
                  icon={<Cake fontSize="small" />}
                  label="العمر"
                  value={user.age ? `${user.age} سنة` : null}
                  onEdit={() => handleEdit("age")}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="h6"
              gutterBottom
              color="#3c7168"
              fontFamily="Dubai-Bold"
            >
              معلومات إضافية
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InfoItem
                  icon={<Language fontSize="small" />}
                  label="البلد"
                  value={user.country}
                  onEdit={() => handleEdit("country")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoItem
                  icon={<Work fontSize="small" />}
                  label="الدور"
                  value={user.role === "doctor" ? "طبيب" : "مستخدم"}
                  onEdit={() => handleEdit("role")}
                />
              </Grid>
            </Grid>

            {/* Doctor Section */}
            {user.role === "doctor" && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography
                  variant="h6"
                  gutterBottom
                  color="primary"
                  fontFamily="Dubai-Bold"
                >
                  معلومات الطبيب
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontFamily="Dubai-Regular"
                >
                  سيتم عرض معلومات إضافية للأطباء هنا.
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      </Fade>
    </Container>
  );
};

// Component Info Item
const InfoItem = ({ icon, label, value, onEdit }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      gap: 2,
      alignItems: "center",
      p: 2,
      borderRadius: 3,
      bgcolor: "action.hover",
      mb: 1.5,
      transition: "background-color 0.3s",
      "&:hover": { bgcolor: "action.selected" },
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        sx={{
          mr: 2,
          color: "primary.contrastText",
          backgroundColor: "#3c7168",
          borderRadius: "50%",
          width: 40,
          height: 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          fontFamily="Dubai-Regular"
        >
          {label}
        </Typography>
        <Typography variant="body1" fontFamily="Dubai-Bold">
          {value || "غير محدد"}
        </Typography>
      </Box>
    </Box>
    <IconButton size="small" onClick={onEdit} color="#3c7168">
      <Edit fontSize="small" />
    </IconButton>
  </Box>
);

export default Profile;
