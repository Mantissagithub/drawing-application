import React from "react";
import { MenuItem, FormControl, Select, InputLabel } from "@mui/material";
// import {setCurrentShape} from "./Hooks";

const ShapeSelector = ({ currentShape, setCurrentShape }) => {
  const handleShapeChange = (event) => {
    setCurrentShape(event.target.value);
  };

  return (
    <FormControl>
      <InputLabel id="shape-select-label">Drawing Shape</InputLabel>
      <Select
        labelId="shape-select-label"
        id="shape-select"
        value={currentShape || ''} // Ensure a default value of an empty string
        label="Drawing Shape"
        onChange={handleShapeChange}
      >
        <MenuItem value="line">Line</MenuItem>
        <MenuItem value="rectangle">Rectangle</MenuItem>
        {/* Add more shapes as needed */}
      </Select>
    </FormControl>
  );
};

export default ShapeSelector;
