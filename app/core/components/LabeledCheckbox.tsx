import { Checkbox, CheckboxProps, FormControlLabel } from '@mui/material';


interface LabeledCheckboxProps extends CheckboxProps {
  label: string
}

export const LabeledCheckbox = ({ label, name }: LabeledCheckboxProps) => {
  return (
    <FormControlLabel
      label={label}
      control={
        <Checkbox name={name} />
      }
    />
  )
}