// src/components/Sidebar.js
import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  Typography,
  IconButton,
  Switch,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight"; // تغيير الأيقونة
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const menuItems = [
  { id: "statistics", title: "الإحصائيات" },
  { id: "dashboard", title: "لوحة التحكم" },
  { id: "reports", title: "التقارير" },
  { id: "settings", title: "الإعدادات" },
  { id: "profile", title: "الملف الشخصي" },
];

export default function Sidebar({
  selectedMenuItem,
  setSelectedMenuItem,
  isSidebarOpen,
  setIsSidebarOpen,
  darkMode,
  toggleDarkMode,
}) {
  const drawerContent = (
    <Box
      sx={{
        height: "100vh",
        background: "#3c7168",
        color: "white",
        display: "flex",
        flexDirection: "column",
        pr: 3,
        py: 5,
        m: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          لوحة التحكم
        </Typography>
        <IconButton
          onClick={() => setIsSidebarOpen(false)}
          sx={{ color: "white", display: { md: "none" } }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.id}
            disablePadding
            sx={{
              borderRadius: '10px',
              backgroundColor:
                selectedMenuItem === item.id ? "#fff" : "transparent",
            }}
          >
            <ListItemButton
              selected={selectedMenuItem === item.id}
              onClick={() => setSelectedMenuItem(item.id)}
              sx={{
                borderRadius: 2,
                mb: 1,
                textAlign: "right",
                justifyContent: "flex-end",
                backgroundColor:
                  selectedMenuItem === item.id ? "#fff" : "transparent",
                color: selectedMenuItem === item.id ? "#000" : "white",
                "&.Mui-focusVisible": {
                  backgroundColor: "transparent",
                },
                "&.Mui-selected": {
                  backgroundColor: "#fff",
                  "&:hover": {
                    backgroundColor: "#fff",
                  },
                },
                "&:hover": {
                  bgcolor:
                    selectedMenuItem === item.id
                      ? "white"
                      : "rgba(255,255,255,0.1)",
                },
              }}
            >
              <ListItemText
                primary={item.title}
                sx={{
                  textAlign: "right",
                  "& .MuiTypography-root": {
                    fontWeight:
                      selectedMenuItem === item.id ? "bold" : "normal",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 2 }} />

      <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
        <Avatar sx={{ bgcolor: "rgba(255,255,255,0.3)", color: "white" }}>
          م
        </Avatar>
        <Box sx={{ mr: 2, flex: 1 }}>
          <Typography variant="body1" fontWeight="medium">
            محمد أحمد
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
            مدير النظام
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mt: 2,
          p: 1,
          bgcolor: "rgba(255,255,255,0.1)",
          borderRadius: 2,
        }}
      >
        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        <Switch checked={darkMode} onChange={toggleDarkMode} color="default" />
        <Typography variant="body2" sx={{ mr: 1 }}>
          {darkMode ? "الوضع المظلم" : "الوضع الفاتح"}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
            position: "absolute",
            right: 0,
            zIndex: 1200,
          },
        }}
        anchor="right"
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
            position: "relative",
            border: "none",
            right: 0,
          },
        }}
        anchor="right"
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
