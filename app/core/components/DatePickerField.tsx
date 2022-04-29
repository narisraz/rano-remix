import { TextField } from "@mui/material";
import { PropsWithoutRef } from "react";
import { useField } from "remix-validated-form";

interface DatePickerFieldProps {
  label: string
  name: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const DatePickerField = ({ outerProps, name, label }: DatePickerFieldProps) => {
  const { error, getInputProps } = useField(name!);

  return (
    <div {...outerProps}>
      <TextField
        label={label}
        type="date"
        sx={{ width: 220 }}
        error={error != undefined}
        helperText={error}
        margin={"dense"}
        InputLabelProps={{
          shrink: true,
        }}
        {...getInputProps({ id: name })}
      />
    </div>
  )
}

export default DatePickerField