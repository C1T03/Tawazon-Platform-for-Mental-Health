import React from "react";
import { Button } from "@mui/material";

const CustomButton = ({ label, onClick = () => null, bgcolor = "#4faa85", color='#fff', disabled = false , fullWidth= false}) => {
  return (
    <Button
    fullWidth = {fullWidth}
    disabled = {disabled}
    variant="contained"
          sx={{
            backgroundColor: bgcolor,
            color: color,
            padding: "8px 18px",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "5px",
            marginTop: "15px",
            fontFamily: "Dubai-Regular",
            "&:hover": {
              backgroundColor: "#3c8568",
              color: '#fff'
            },
          }}
      onClick={onClick}
    >
        {label}
    </Button>
  );
};

export default CustomButton;