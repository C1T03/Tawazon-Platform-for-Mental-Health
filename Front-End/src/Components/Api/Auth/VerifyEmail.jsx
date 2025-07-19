import { Box, Container, TextField, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const [code, setCode] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const navigate = useNavigate()
  const handleChange = (index, value) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      setError("");
      
      // الانتقال التلقائي للحقل التالي
      if (value && index < 3) {
        document.getElementById(`code-input-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.some(digit => digit === "")) {
      setError("الرجاء إدخال الرمز بالكامل");
      return;
    }
    const fullCode = code.join("");
    console.log("الكود المدخل:", fullCode);
  };

  return (
    <Container maxWidth="sm" component="main">
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: 4,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom sx={{ color: "#3c7168", mb: 3 }}>
          التحقق من البريد الإلكتروني
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
          الرجاء إدخال رمز التحقق المكون من 4 أرقام الذي تلقيته على بريدك الإلكتروني
        </Typography>

        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Box sx={{ display: 'flex', mb: 3 }}>
            {code.map((digit, index) => (
              <TextField
                key={index}
                id={`code-input-${index}`}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                margin="normal"
                required
                autoFocus={index === 0}
                sx={{
                  width: '55px',
                  margin: '0 5px',
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#3c7168",
                    },
                    "&:hover fieldset": {
                      borderColor: "#3c7168",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3c7168",
                    },
                  },
                }}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]",
                  maxLength: 1,
                  style: { textAlign: 'center', fontSize: '1.5rem' }
                }}
              />
            ))}
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#3c7168",
              "&:hover": {
                backgroundColor: "#2a524b",
              },
              padding: "10px 30px",
              fontSize: "1rem",
            }}
              onClick={()=>navigate('/data-user')} 
          >
            تأكيد الرمز
          </Button>
        </Box>
      </Box>
    </Container>
  );
}