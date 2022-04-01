import { Button, ButtonProps } from "@mui/material";
import { useFormContext, useIsSubmitting } from "remix-validated-form";


export const SubmitButton = ({ children, fullWidth }: ButtonProps) => {
  const isSubmitting = useIsSubmitting();
  const { isValid } = useFormContext();
  const disabled = isSubmitting || !isValid;

  return (
    <Button
      type={"submit"}
      variant={"contained"}
      disabled={disabled}
      fullWidth={fullWidth ?? true}
    >
      {children}
    </Button>
  )
}