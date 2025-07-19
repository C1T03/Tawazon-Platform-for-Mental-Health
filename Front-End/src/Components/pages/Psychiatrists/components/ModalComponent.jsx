import React, { useState } from "react";
import {
  Modal,
  Box,
  Divider,
  Typography,
  Button,
  IconButton,
  Avatar,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { Phone, Email, CalendarMonth, Close } from "@mui/icons-material";
import FormTextField from "../../../ui/FormTextField";
import { useSelector } from "react-redux";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3c7168",
    },
    secondary: {
      main: "#3c7168",
    },
  },
  typography: {
    fontFamily: "Dubai-Regular",
    h4: {
      fontWeight: 600,
    },
  },
});

const ConsultantModal = ({ open, onClose, consultant }) => {
  const userData = useSelector((state)=> state.user)

  const [appointment, setAppointment] = useState({
    fullName: userData.name,
    email: userData.email,
    datetime: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("تم حجز الموعد:", appointment);
    onClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: 600 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 2,
            }}
          >
            <Typography variant="h6" fontFamily={"Dubai-Bold"}>
              حجز جلسة استشارية
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>

          {/* Consultant Info */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 3,
            }}
          >
            <Avatar
              src={consultant.image}
              alt={consultant.name}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Typography variant="h6" fontFamily={"Dubai-Bold"}>
              {consultant.name}
            </Typography>
            <Typography color="text.secondary">
              {consultant.specialization}
            </Typography>
          </Box>

          <Divider />

          {/* Contact Info */}
          <Box sx={{ p: 3 }}>
            <Typography
              variant="subtitle1"
              fontFamily={"Dubai-Bold"}
              gutterBottom
            >
              معلومات التواصل:
            </Typography>

            <Button
              fullWidth
              variant="outlined"
              fontFamily={"Dubai-Bold"}
              startIcon={<Phone sx={{ mx: 1 }}/>}
              sx={{ mb: 2, color: "#4faa84", borderColor: "#4faa84" }}
              href={`tel:${consultant.phone}`}
            >
              {consultant.phone || "غير متوفر"}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              fontFamily={"Dubai-Bold"}
              startIcon={<Email sx={{ mx: 1 }}/>}
              sx={{ mb: 2, color: "#4faa84", borderColor: "#4faa84" }}
              href={`mailto:${consultant.email}`}
            >
              {consultant.email || "غير متوفر"}
            </Button>
          </Box>

          <Divider />

          {/* Appointment Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            <Typography
              variant="subtitle1"
              fontFamily={"Dubai-Bold"}
              gutterBottom
            >
              معلومات الحجز:
            </Typography>
            <FormTextField
              fullWidth
              name="email"
              label="البريد الإلكتروني"
              type="email"
              id="email"
              value={appointment.email}
              onChange={handleInputChange}
            />
            <FormTextField
              fullWidth
              name="fullName"
              label="الاسم الكامل"
              type="text"
              id="name"
              value={appointment.fullName}
              onChange={handleInputChange}
            />

            <FormTextField
              fullWidth
              label="تاريخ ووقت الجلسة"
              type="datetime-local"
              name="datetime"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: new Date().toISOString().slice(0, 16) }}
              value={appointment.datetime}
              onChange={handleInputChange}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              startIcon={<CalendarMonth sx={{ color: "#f9f9fa", mx: 1 }} />}
              sx={{
                bgcolor: "#4faa84",
                fontFamily: "Dubai-Regular",
                "&:hover": { bgcolor: "#3e8e6d" },
              }}
            >
              تأكيد الحجز
            </Button>
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default ConsultantModal;
