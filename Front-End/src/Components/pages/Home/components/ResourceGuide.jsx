import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import CustomButton from "../../../ui/CustomButton";
import { useNavigate } from "react-router-dom";

const resourcesData = [
  {
    image: "/Images/SVG/GirlWatchingYoga.svg",
    title: "رحلة اليوغا 30 يوم",
    description:
      "حتى في زحام الحياة.. يمكنك أن تجد مساحتك! يوغا عملية لسكان المدن المشغولين",
    buttonPath: `/resources/${0}`,
  },
  {
    image: "/Images/SVG/BoyListningMusic.svg",
    title: "هارمونيا",
    description:
      "أغمض عينيك.. واستمع إلى الموسيقى التي تُحيي النجوم في داخلك!",
    buttonPath: `/resources/${1}`,
  },
 
];

const ResourceCard = ({ resource }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        maxWidth: 345,
        boxShadow: 3,
        borderRadius: 2,
        m: 2,
        mt: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <CardMedia
        component="img"
        height="160"
        image={resource.image}
        alt={resource.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" fontFamily={'Dubai-Bold'}>
          {resource.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontFamily={'Dubai-Regular'}>
          {resource.description}
        </Typography>
      </CardContent>
      <Box sx={{ pb: 4, alignSelf: "center" }}>
        <CustomButton
          label="ابدأ"
          onClick={() => navigate(resource.buttonPath)}
        />
      </Box>
    </Card>
  );
};

export default function ResourceGuide() {
  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 10
      }}
    >
     
      <Grid container justifyContent="center" maxWidth={'xl'}>
        {resourcesData.map((resource, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3} py={2}>
            <ResourceCard resource={resource} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
