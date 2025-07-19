import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
} from "@mui/material";
import ThreeBoxLayout from "./ThreeBoxLayout";

export default function ChartSelector() {
  const [selectedBox, setSelectedBox] = useState(1);
  const renderBox = () => {
    switch (selectedBox) {
      case 1:
        return (
          <Box>
            <ThreeBoxLayout />
          </Box>
        );
      case 2:
        return <Paper>Box 2</Paper>;
      case 3:
        return <Paper>Box 3</Paper>;
      case 4:
        return <Paper>Box 4</Paper>;
      default:
        return null;
    }
  };

  return (
    <Container
      maxWidth="xl"
      disableGutters // أضف هذا
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        my: 2,
        py: 2,
        bgcolor: "background.default",
        px: 0, // أضف هذا
      }}
    >
      <Box sx={{ display: "flex", gab: 2, mb: 5 }}>
        {[1, 2, 3, 4].map((num) => (
          <Button
            key={num}
            onClick={() => setSelectedBox(num)}
            color={selectedBox === num ? "primary" : undefined}
            sx={{
              m: 2,
              backgroundColor:
                selectedBox === num ? '#4faa84' : "action.selected",
              color:
                selectedBox === num ? "primary.contrastText" : '#4faa84',
              "&:hover": {
                backgroundColor:
                  selectedBox === num ? '#4faa84' : "action.hover",
              },
            }}
          >
            عرض مربع {num}
          </Button>
        ))}
      </Box>

      {renderBox()}
    </Container>
  );
}
