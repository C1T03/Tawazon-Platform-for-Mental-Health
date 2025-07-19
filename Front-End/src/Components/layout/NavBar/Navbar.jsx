import * as React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Login } from "@mui/icons-material";
import { setLogIn } from "../../../features/auth/AuthLogIn";

function Navbar({ user }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const dispatch = useDispatch();
  const handleLogout = () => {
    handleCloseUserMenu();

    dispatch(setLogIn());
  };

  const settings = [
    { name: "الملف الشخصي", action: () => navigate("/profile") },
    { name: "الحساب", action: () => navigate("/account") },
    { name: "تسجيل الخروج", action: handleLogout },
  ];

  const LogInTo = useSelector((state) => state.AuthLogIn.LogIn);
  const Admin = useSelector((state) => state.user.role);
  if (Admin === "admin") {
    settings.unshift({
      name: "لوحة التحكم",
      action: () => navigate("/dashboard"),
    });
  }
  console.log(Admin);
  const handleSingIn = () => {
    navigate("/login");
  };

  return (
    <AppBar
      sx={{
        direction: "rtl",
        backgroundColor: "#fff",
        color: "#000000",
        position: "fixed",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              ml: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <img
              src="/Images/SVG/Logo.svg"
              style={{
                width: "80px",
                height: "50px",
                margin: "-12px 0 0 0",
              }}
              alt="Logo"
            />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <NavLink
                  to={"/"}
                  activeClassName="active"
                  exact
                  style={{ textDecoration: "none", color: "#000000" }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontWeight: 800,
                      fontFamily: "Dubai-Regular",
                      fontSize: ".9rem",
                    }}
                  >
                    الرئيسية
                  </Typography>
                </NavLink>
              </MenuItem>

              <MenuItem onClick={handleCloseNavMenu}>
                <NavLink
                  to={"/tests"}
                  activeClassName="active"
                  exact
                  style={{ textDecoration: "none", color: "#000000" }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontWeight: 800,
                      fontFamily: "Dubai-Regular",
                      fontSize: ".9rem",
                    }}
                  >
                    الاختبارات
                  </Typography>
                </NavLink>
              </MenuItem>

              <MenuItem onClick={handleCloseNavMenu}>
                <NavLink
                  to={"/psychiatrists"}
                  activeClassName="active"
                  exact
                  style={{ textDecoration: "none", color: "#000000" }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontWeight: 800,
                      fontFamily: "Dubai-Regular",
                      fontSize: ".9rem",
                    }}
                  >
                    المعالجون
                  </Typography>
                </NavLink>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                {LogInTo ? (
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{
                      my: 2,
                      display: "block",
                      fontFamily: "Dubai-Regular !important",
                      fontSize: "1rem",
                    }}
                  >
                    <NavLink
                      to="/community"
                      activeClassName="active"
                      style={{ textDecoration: "none", color: "#000000" }}
                    >
                      المجتمع
                    </NavLink>
                  </Button>
                ) : (
                  <Button
                    onClick={handleSingIn}
                    sx={{
                      my: 2,
                      display: "block",
                      fontFamily: "Dubai-Regular !important",
                      fontSize: "1rem",
                      color: "#000",
                    }}
                  >
                    المجتمع
                  </Button>
                )}
              </MenuItem>
            </Menu>
          </Box>

          <Box
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              ml: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              fontFamily: "inherit",
              fontSize: "1rem",
            }}
          >
            <img
              src="/Images/SVG/Logo.svg"
              style={{
                width: "100px",
                height: "80px",
                margin: "0 20px",
              }}
              alt="Logo"
            />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              onClick={handleCloseNavMenu}
              sx={{
                my: 2,
                color: "#000000",
                display: "block",
                fontFamily: "Dubai-Regular !important",
                fontSize: "1rem",
              }}
            >
              <NavLink
                to={"/"}
                activeClassName="active"
                exact
                style={{ textDecoration: "none", color: "#000000" }}
              >
                الرئيسية
              </NavLink>
            </Button>

            <Button
              onClick={handleCloseNavMenu}
              sx={{
                my: 2,
                color: "#000000",
                display: "block",
                fontFamily: "Dubai-Regular !important",
                fontSize: "1rem",
              }}
            >
              <NavLink
                to={"/tests"}
                style={{ textDecoration: "none", color: "#000000" }}
              >
                الاختبارات
              </NavLink>
            </Button>

            <Button
              onClick={handleCloseNavMenu}
              sx={{
                my: 2,
                color: "#000000",
                display: "block",
                fontFamily: "Dubai-Regular !important",
                fontSize: "1rem",
              }}
            >
              <NavLink
                to={"/psychiatrists"}
                style={{ textDecoration: "none", color: "#000000" }}
              >
                المعالجون
              </NavLink>
            </Button>

            {LogInTo ? (
              <Button
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  display: "block",
                  fontFamily: "Dubai-Regular !important",
                  fontSize: "1rem",
                }}
              >
                <NavLink
                  to="/community"
                  activeClassName="active"
                  style={{ textDecoration: "none", color: "#000000" }}
                >
                  المجتمع
                </NavLink>
              </Button>
            ) : (
              <Button
                onClick={handleSingIn}
                sx={{
                  my: 2,
                  display: "block",
                  fontFamily: "Dubai-Regular !important",
                  fontSize: "1rem",
                  color: "#000",
                }}
              >
                المجتمع
              </Button>
            )}
          </Box>

          <Button
            sx={{
              fontSize: "1.1rem",
              color: "#000",
              fontFamily: "Dubai-Regular",
              display: LogInTo ? "none" : "inline-flex", // لضمان عرض العناصر بشكل جانبي
              alignItems: "center", // محاذاة العناصر عموديًا
              gap: "8px", // مسافة بين النص والأيقونة
              direction: "rtl", // ضمان اتجاه RTL للغة العربية
            }}
            onClick={handleSingIn}
            endIcon={<Login />}
          >
            تسجيل الدخول
          </Button>
          <Box sx={{ flexGrow: 0, display: LogInTo ? "block" : "none" }}>
            <Tooltip
              title={user ? `مرحباً ${user.firstName}` : "خيارات المستخدم"}
            >
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={""}
                  src="/static/images/avatar/2.jpg"
                  sx={{ bgcolor: "#3c7168" }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.name} onClick={setting.action}>
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "#000000",
                      fontFamily: "Dubai-Regular",
                      fontSize: "1rem",
                    }}
                  >
                    {setting.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
