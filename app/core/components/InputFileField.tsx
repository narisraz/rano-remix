import { forwardRef, PropsWithoutRef } from "react"
import { Button } from "@mui/material"
import FileUploadIcon from "@mui/icons-material/FileUpload"

export interface InputFileFieldProps {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  accept?: string
  onChange: (files: FileList | null) => void
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const InputFileField = forwardRef<HTMLInputElement, InputFileFieldProps>(
  ({ name, label, accept, outerProps, onChange }, ref) => {
    return (
      <div {...outerProps}>
        <label htmlFor="upload-photo">
          <input
            id="upload-photo"
            type="file"
            accept={accept}
            name={name}
            style={{ display: "none" }}
            onChange={({ target }) => onChange(target.files)}
          />

          <Button
            color="secondary"
            variant="contained"
            component="span"
            startIcon={<FileUploadIcon />}
          >
            {label}
          </Button>
        </label>
      </div>
    )
  }
)

export default InputFileField
