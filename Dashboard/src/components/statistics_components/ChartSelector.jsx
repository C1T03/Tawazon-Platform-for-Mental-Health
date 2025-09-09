import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import {
  People as PeopleIcon,
  Work as SpecialistsIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon
} from "@mui/icons-material";
import ThreeBoxLayout from "./ThreeBoxLayout";
import ProgressCardContainer from "./ProgressComponents/ProgressCardContainer";
import SyrianPopulationChart from "./CityChart/SyrianPopulationChart";

import useStatistics from "../../hooks/useStatistics";

export default function ChartSelector({ statistics }) {
  const [selectedBox, setSelectedBox] = useState(1);
  const { doctorStatistics } = useStatistics();
  
  const menuItems = [
    {
      id: 1,
      title: "الأعمار",
      icon: <PeopleIcon fontSize="small" />,
      content: <ThreeBoxLayout ageData={statistics?.ageDistribution} />
    },
    {
      id: 2,
      title: "الأخصائيين",
      icon: <SpecialistsIcon fontSize="small" />,
      content: <ProgressCardContainer specializationData={doctorStatistics?.specializationDistribution} />
    },
    {
      id: 3,
      title: "أكثر المناطق وصولاً",
      icon: <LocationIcon fontSize="small" />,
      content: <SyrianPopulationChart cityData={statistics?.cityDistribution} />
    },

  ];

  return (
    <Container
      maxWidth="xl"
      disableGutters
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        my: 2,
        py: 2,
        backgroundColor: 'background.paper',
        px: 2,
        borderRadius: 3,
      }}
    >
      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ 
          mb: 5,
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 1
        }}
      >
        {menuItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => setSelectedBox(item.id)}
            variant="text"
            sx={{
              minWidth: 100,
              px: 2,
              py: 2,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              color: selectedBox === item.id ? '#4faa84' : 'text.secondary',
              backgroundColor: selectedBox === item.id ? 'rgba(79, 170, 132, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(79, 170, 132, 0.05)',
                transform: 'none',
              },
            }}
          >
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              {item.icon}
              <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'Dubai' }}>
                {item.title}
              </Typography>
            </Box>
            {selectedBox === item.id && (
              <Box sx={{
                height: 2,
                width: '60%',
                backgroundColor: '#4faa84',
                borderRadius: 2
              }} />
            )}
          </Button>
        ))}
      </Stack>

      <Box sx={{ 
        flex: 1,
        transition: 'all 0.3s ease',
        minHeight: 400
      }}>
        {menuItems.find(item => item.id === selectedBox)?.content}
      </Box>
    </Container>
  );
}