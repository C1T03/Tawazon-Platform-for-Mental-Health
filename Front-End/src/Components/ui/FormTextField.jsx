import TextField from "@mui/material/TextField";

const FormTextField = ({ name, label, type = "text", value, onChange, ...props }) => (
  <TextField
    margin="normal"
    required
    fullWidth
    name={name}
    label={label}
    type={type}
    value={value}
    onChange={onChange}
    sx={{
      "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "#3c7168" },
        "&:hover fieldset": { borderColor: "#3c7168" }
      }
    }}
    {...props}
  />
);

export default FormTextField;