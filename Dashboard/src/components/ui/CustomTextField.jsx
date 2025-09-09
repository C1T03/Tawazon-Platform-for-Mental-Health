import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

const CustomTextField = ({ 
  label, 
  value, 
  onChange, 
  type = 'text',
  icon,
  endIcon,
  placeholder,
  fullWidth = true,
  margin = 'normal',
  ...props 
}) => {
  return (
    <TextField
      fullWidth={fullWidth}
      margin={margin}
      label={label}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
      variant="standard"
      InputProps={{
        startAdornment: icon && (
          <InputAdornment position="start">
            {React.cloneElement(icon, { 
              sx: { color: value ? '#4faa84' : '#999', transition: 'color 0.3s ease' } 
            })}
          </InputAdornment>
        ),
        endAdornment: endIcon && (
          <InputAdornment position="end">
            {endIcon}
          </InputAdornment>
        ),
      }}
      sx={{
        mb: 2,
        '& .MuiInput-underline:before': {
          borderBottomColor: '#ddd',
          borderBottomWidth: 1
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
          borderBottomColor: '#4faa84',
          borderBottomWidth: 2
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: '#4faa84',
          borderBottomWidth: 2
        },
        '& .MuiInputLabel-root': {
          color: '#999',
          fontFamily: 'Dubai',
          fontSize: '1rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#4faa84'
        },
        '& .MuiInputBase-input': {
          fontFamily: 'Dubai',
          fontSize: '1rem',
          py: 2,
          color: '#333',
          transition: 'all 0.3s ease'
        }
      }}
      {...props}
    />
  );
};

export default CustomTextField;