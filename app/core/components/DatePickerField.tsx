import { TextField } from "@mui/material";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from "moment";
import { useState } from "react";
import { useField } from "remix-validated-form";

interface DatePickerFieldProps {
  label: string
  name: string
  initialValue?: string
}

export const DatePickerField = ({ name, label, initialValue }: DatePickerFieldProps) => {
  const { error, getInputProps } = useField(name!);
  const now = moment().format("DD/MM/YYYY")
  const [value, setValue] = useState<Date | null>(
    new Date(initialValue ?? now),
  );

  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} locale={"fr"}>
      <DesktopDatePicker
        label={label}
        value={value}
        onChange={handleChange}
        renderInput={(params) => <TextField name={name} {...params} {...getInputProps} margin="dense" />}
      />
    </LocalizationProvider>
  )
}

export default DatePickerField