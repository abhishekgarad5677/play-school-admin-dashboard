import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const CustomRangeSelect = ({
  value,
  onChange,
  label,
  size,
  minWidth = 200,
  options,
}) => {
  return (
    <FormControl
      sx={{ minWidth: minWidth || 200 }}
      size={size ? size : "small"}
    >
      <InputLabel id="date-range-select-label">{label}</InputLabel>
      <Select
        labelId="date-range-select-label"
        value={value}
        label={label}
        onChange={onChange}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomRangeSelect;
