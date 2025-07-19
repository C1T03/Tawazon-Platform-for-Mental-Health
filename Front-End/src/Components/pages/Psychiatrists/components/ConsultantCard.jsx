import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  IconButton,
  Collapse,
  Box,
  Avatar,
  Button,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  School,
  Psychology,
  Visibility,
} from "@mui/icons-material";
import CustomButton from "../../../ui/CustomButton";
import ConsultantModal from "./ModalComponent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ConsultantCard = ({ consultant }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate(`/psychiatrists/${consultant.id}`);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const LogInTo = useSelector((state) => state.AuthLogIn.LogIn);

  return (
    <>
      <Card
        sx={{
          maxWidth: 450,
          m: 2,
          boxShadow: 4,
          borderRadius: 3,
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: 10,
          },
          backgroundColor: "#f9fdfb",
          border: "1px solid #e0f2f1",
        }}
      >
        <CardContent>
          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Avatar
                alt={consultant.name}
                src={consultant.image || "/default-avatar.png"}
                sx={{
                  width: 60,
                  height: 60,
                  border: "3px solid #4caf9d",
                  boxShadow: 2,
                }}
              />
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="700"
                  fontFamily="'Tajawal', sans-serif"
                  color="#1a5f57"
                >
                  {consultant.name}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  fontFamily="'Cairo', sans-serif"
                >
                  {consultant.title || "أخصائي نفسي"}
                </Typography>
              </Box>
            </Box>

            <IconButton
              onClick={handleExpandClick}
              sx={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
                color: "#3c7168",
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>

          {/* Specialization Chips */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mb: 2,
            }}
          >
            {consultant.specialization.split(",").map((spec, index) => (
              <Chip
                key={index}
                label={spec.trim()}
                size="small"
                icon={<Psychology fontSize="small" />}
                sx={{
                  backgroundColor: "#e0f2f1",
                  color: "#00695c",
                  fontWeight: 600,
                  fontFamily: "'Cairo', sans-serif",
                  "& .MuiChip-icon": {
                    color: "#00796b",
                  },
                }}
              />
            ))}
          </Box>

          {/* Information Items */}
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "#f0fdfa",
                borderRadius: 2,
                mb: 2,
              }}
            >
              <InfoItem
                icon={<School />}
                label="الشهادة:"
                value={consultant.certificate}
              />
              <InfoItem
                icon={<Psychology />}
                label="الاختصاص:"
                value={consultant.specialization}
              />
            </Paper>
          </Collapse>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<Visibility />}
              onClick={handleProfile}
              fullWidth
              sx={{
                color: "#00796b",
                borderColor: "#00796b",
                fontWeight: 600,
                fontFamily: "'Cairo', sans-serif",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#e0f2f1",
                  borderColor: "#00796b",
                },
              }}
            >
              المزيد عن الطبيب
            </Button>

            {LogInTo ? (
              <CustomButton
                label="تواصل"
                bgcolor="#00796b"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalOpen(true);
                }}
                fullWidth
              />
            ) : (
              <Tooltip
                title="سجل الدخول لتتمكن من التواصل مع الاخصائيين"
                arrow
                placement="top"
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "#ffffff",
                      color: "#000",
                      boxShadow: 3,
                      fontSize: 12,
                      fontFamily: "'Cairo', sans-serif",
                      fontWeight: 600,
                      "& .MuiTooltip-arrow": {
                        color: "#fff",
                      },
                    },
                  },
                }}
              >
                <span>
                  <CustomButton
                    disabled
                    label="تواصل"
                    bgcolor="#00796b"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalOpen(true);
                    }}
                    fullWidth
                  />
                </span>
              </Tooltip>
            )}
          </Box>
        </CardContent>
      </Card>

      <ConsultantModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        consultant={consultant}
      />
    </>
  );
};

// Info Item Component
const InfoItem = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
    {React.cloneElement(icon, {
      sx: { color: "#00796b", mr: 1, fontSize: "small" },
    })}
    <Typography variant="body2" fontFamily="'Cairo', sans-serif">
      <strong>{label}</strong> {value}
    </Typography>
  </Box>
);

export default ConsultantCard;