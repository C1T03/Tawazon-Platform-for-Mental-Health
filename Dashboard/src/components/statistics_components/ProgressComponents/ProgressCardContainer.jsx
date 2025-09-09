import React, { useState } from "react";
import { Box, Collapse, IconButton, useTheme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ProgressCard from "./ProgressCard";
import SecondaryProgressCard from "./SecondaryProgressCard";

const ProgressCardContainer = ({ specializationData }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // تحويل بيانات التخصصات إلى تنسيق مناسب
  const processSpecializationData = () => {
    if (!specializationData || specializationData.length === 0) {
      return [];
    }
    
    const totalDoctors = specializationData.reduce((sum, item) => sum + item.count, 0);
    const colors = [theme.palette.success.main, theme.palette.info.main, theme.palette.warning.main, theme.palette.primary.main, theme.palette.secondary.main];
    
    return specializationData.map((item, index) => ({
      title: item.specialization || 'غير محدد',
      percentage: Math.round((item.count / totalDoctors) * 100),
      tasks: item.count,
      color: colors[index % colors.length]
    }));
  };

  const projects = processSpecializationData();
  const totalDoctors = specializationData ? specializationData.reduce((sum, item) => sum + item.count, 0) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Box onClick={toggleExpand}>
        <ProgressCard
          title="الفريق النفسي"
          description={`إجمالي ${totalDoctors} متخصص في الصحة النفسية في منصة توازن`}
          percentage={100}
        />
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              xl: "1fr 1fr 1fr 1fr",
            },
            gap: 5,
            mt: 3,
            px: 5,
          }}
        >
          {projects.map((project, index) => (
            <SecondaryProgressCard
              key={index}
              title={project.title}
              percentage={project.percentage}
              tasks={project.tasks}
              strokeColor={project.color}
            />
          ))}
        </Box>
      </Collapse>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
        <IconButton onClick={toggleExpand}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default ProgressCardContainer;
