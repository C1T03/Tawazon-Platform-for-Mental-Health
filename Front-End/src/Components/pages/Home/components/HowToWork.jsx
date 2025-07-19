import React from "react";
import { Grid, Typography } from "@mui/material";
import { ArrowDownward } from "@mui/icons-material";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function HowToWork({ title, des, img }) {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: true,
       
    });
  }, []);

  return (
    <>
      <Grid
        item
        sm={5}
        xs={12}
        display={{ display: "flex", justifyContent: "center" }}
      >
        <img
          src={img}
          alt=""
          style={{ width: "350px", height: "310px" }}
          data-aos="fade-down"
        />
      </Grid>
      <Grid
        item
        sm={7}
        xs={12}
        sx={{ display: "flex", alignItems: "center" }}
      >
        <div style={{ padding: "20px" }} data-aos="fade-down">
          <Typography
            variant="h4"
            fontFamily={"Dubai-Regular"}
            marginRight={0}
            marginBottom={2}
          >
            {title}
          </Typography>
          <p>{des}</p>
        </div>
      </Grid>
      <Grid
        xs={12}
        item
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#3c7168",
        }}
      >
        <ArrowDownward sx={{fontSize: '50px'}} />
      </Grid>
    </>
  );
}
