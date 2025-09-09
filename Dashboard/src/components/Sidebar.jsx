// src/components/Sidebar.js
import React, { useState, useEffect } from "react";
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
  Tooltip,
  useMediaQuery,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  ChevronRight,
  ChevronLeft,
  Brightness4,
  Brightness7,
  Dashboard,
  People,
  Settings,
  Person,
  Equalizer,
} from "@mui/icons-material";
import Logo from "/Images/Logo.svg";
const menuItems = [
  { id: "statistics", title: "الإحصائيات", icon: <Equalizer /> },
  { id: "users", title: "المستخدمون", icon: <People /> },
  { id: "profile", title: "الملف الشخصي", icon: <Person /> },
];

const Sidebar = ({
  selectedMenuItem,
  setSelectedMenuItem,
  darkMode,
  toggleDarkMode,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)");

  useEffect(() => {
    // إذا كان على الهاتف، اجعله منبثقًا افتراضيًا
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const drawerContent = (
    <Box
      sx={{
        height: "90vh",
        background: darkMode ? "#1e293b" : "#f8fafc",
        color: darkMode ? "#f8fafc" : "#1e293b",
        display: "flex",
        flexDirection: "column",
        py: 2,
        my: 5,
        borderRadius: 5,
        overflowX: "hidden",
        transition: "width 0.3s ease",
        width: collapsed ? "80px" : "280px",
        position: "relative",
        boxShadow: darkMode
          ? "0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -1px rgba(0,0,0,0.2)"
          : "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
        border: darkMode ? "1px solid #334155" : "1px solid #f1f5f9",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          px: 2,
          minHeight: "64px",
        }}
      >
        {!collapsed && (
          <Box>
            <Box
              component={"img"}
              src={Logo}
              alt="logo"
              width={80}
              height={75}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            ></Box>
          </Box>
        )}

        <IconButton
          onClick={toggleSidebar}
          sx={{
            color: darkMode ? "#fff" : "#333",
            mr: "auto",
            border: darkMode
              ? "1px solid rgba(255,255,255,0.2)"
              : "1px solid rgba(0,0,0,0.1)",
            bgcolor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
          }}
        >
          {collapsed ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      <List sx={{ flex: 1, px: 1 }}>
        {menuItems.map((item) => (
          <Tooltip
            title={collapsed ? item.title : ""}
            placement="right"
            key={item.id}
          >
            <ListItem
              disablePadding
              sx={{
                borderRadius: "10px",
                mb: 1,
                transition: "all 0.1s ease-in-out",
                backgroundColor:
                  selectedMenuItem === item.id
                    ? darkMode
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(95, 95, 95, 0.05)"
                    : "transparent",
                borderRight:
                  selectedMenuItem === item.id ? "5px solid #4faa84" : "none",
              }}
            >
              <ListItemButton
                selected={selectedMenuItem === item.id}
                onClick={() => setSelectedMenuItem(item.id)}
                sx={{
                  borderRadius: 2,
                  textAlign: "right",

                  justifyContent: collapsed ? "center" : "flex-end",
                  minHeight: 48,
                  px: collapsed ? 2.5 : 3,
                  backgroundColor:
                    selectedMenuItem === item.id
                      ? darkMode
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(0,0,0,0.05)"
                      : "transparent",
                  // إصلاح مشكلة اللون هنا:
                  color: darkMode ? "#f7f7f7" : "#333",
                  "&:hover": {
                    bgcolor:
                      selectedMenuItem === item.id
                        ? darkMode
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(0,0,0,0.08)"
                        : darkMode
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.03)",
                  },
                  "&.Mui-selected": {
                    bgcolor: darkMode
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(0,0,0,0.05)",
                    "&:hover": {
                      bgcolor: darkMode
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.08)",
                    },
                  },
                }}
              >
                {collapsed ? (
                  <Box
                    sx={{
                      color:
                        selectedMenuItem === item.id
                          ? darkMode
                            ? "#fff"
                            : "#4faa84"
                          : "inherit",
                    }}
                  >
                    {item.icon}
                  </Box>
                ) : (
                  <>
                    <Box
                      sx={{
                        ml: 1,
                        color:
                          selectedMenuItem === item.id
                            ? darkMode
                              ? "#fff"
                              : "#4faa84"
                            : "inherit",
                      }}
                    >
                      {item.icon}
                    </Box>
                    <ListItemText
                      primary={item.title}
                      sx={{
                        color:
                          selectedMenuItem !== item.id
                            ? darkMode
                              ? "#fff"
                              : "gray"
                            : "inherit",
                        textAlign: "right",
                        fontFamily: "'Dubai', sans-serif", // إضافة خط Dubai هنا
                        "& .MuiTypography-root": {
                          fontWeight:
                            selectedMenuItem === item.id ? "bold" : "normal",
                          color: "inherit",
                          fontFamily: "inherit", // سيورث الخط من العنصر الأب
                        },
                      }}
                    />
                  </>
                )}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>

      <Divider
        sx={{
          borderColor: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
          mx: 2,
        }}
      />

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 2,
            p: 1,
            bgcolor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            borderRadius: 2,
            justifyContent: collapsed ? "center" : "space-between",
          }}
        >
          {!collapsed && (
            <Typography variant="body2" sx={{ mr: 1 }}>
              {darkMode ? "الوضع المظلم" : "الوضع الفاتح"}
            </Typography>
          )}

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {darkMode ? (
              <Brightness7 sx={{ color: "#ffeb3b" }} />
            ) : (
              <Brightness4 sx={{ color: "#333" }} />
            )}
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              color="default"
              size={collapsed ? "small" : "medium"}
              sx={{
                "& .MuiSwitch-track": {
                  backgroundColor: darkMode ? "#666" : "#ccc",
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={!collapsed}
          onClose={toggleSidebar}
          sx={{
            "& .MuiDrawer-paper": {
              width: 280,
              boxSizing: "border-box",
              position: "absolute",
              right: 0,
              zIndex: 1200,
              bgcolor: darkMode ? "#121212" : "#f7f7f7",
            },
          }}
          anchor="right"
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Box
          sx={{
            width: collapsed ? 80 : 280,
            flexShrink: 0,
            transition: "width 0.3s ease",
            position: "relative",
            height: "100vh",
          }}
        >
          {drawerContent}
        </Box>
      )}
    </>
  );
};

export default Sidebar;
