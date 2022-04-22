import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { BaseTextFieldProps, IconButton, InputAdornment, InputBaseProps, TextField } from "@mui/material";
import { PropsWithoutRef, useState } from "react";
import { useField } from "remix-validated-form";

interface LabeledTextFieldProps extends BaseTextFieldProps {
  margin?: InputBaseProps["margin"]
  unitLabel?: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledTextField = ({ margin, unitLabel, outerProps, name, type, fullWidth, variant, label }: LabeledTextFieldProps) => {
  const { error, getInputProps } = useField(name!);
  const [inputType, setInputType] = useState(type)

  return (
    <div {...outerProps}>
      <TextField
        label={label}
        type={inputType}
        error={error != undefined}
        helperText={error}
        variant={variant ?? "standard"}
        fullWidth={fullWidth ?? true}
        margin={margin ?? "dense"}
        InputProps={
          type == "password"
            ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onMouseDown={() => setInputType("text")}
                    onMouseUp={() => setInputType("password")}
                    edge="end"
                  >
                    {inputType == "password" ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }
            : type == "unit" ? { endAdornment: (<InputAdornment position="end">{unitLabel}</InputAdornment>) } : {}
        }
        {...getInputProps({ id: name })}
      />
    </div>
  )
}

export default LabeledTextField
