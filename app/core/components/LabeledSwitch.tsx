import { FormControlLabel, FormGroup, Switch, SwitchProps } from "@mui/material"
import { useState } from "react"


interface LabeledSwitchProps extends SwitchProps {
  label: string
  initialValue: boolean
}

const LabeledSwitch = ({ label, initialValue, name }: LabeledSwitchProps) => {
  const [value, setValue] = useState(initialValue)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.checked)
  }

  return (
    <FormGroup>
      <FormControlLabel control={<Switch name={name} checked={value} onChange={handleChange} />} label={label} />
    </FormGroup>
  )
}

export default LabeledSwitch