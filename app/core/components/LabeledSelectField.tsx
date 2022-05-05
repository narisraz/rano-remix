import { FormControl, InputLabel, MenuItem, SelectProps } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from "react";


export interface LabeledSelectFieldItem {
  id: any
  label: string
}

interface LabeledSelectProps extends SelectProps<string> {
  label: string
  items: LabeledSelectFieldItem[]
  initialValue: any
}

export const LabeledSelectField = ({ label, items, initialValue, ...props }: LabeledSelectProps) => {
  const [value, setValue] = useState(initialValue)

  const handleChange = (event: SelectChangeEvent<string>) => {
    setValue(event.target.value)
  }

  return (
    <FormControl>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={handleChange}
        {...props}
      >
        {items.map(role =>
          <MenuItem key={role.id} value={role.id}>{role.label}</MenuItem>
        )}
      </Select>
    </FormControl>
  )
}