import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";
import { Form } from "remix";

interface DeleteConfirmDialogProps {
  title: string
  open: boolean,
  action: string,
  close: () => void,
  children: React.ReactNode
}

export function DeleteConfirmDialog({ title, open, close, action, children }: DeleteConfirmDialogProps) {

  return (
    <Dialog
      open={open}
      onClose={() => close()}
    >
      <Form action={action}>
        <DialogTitle>
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Souhaitez-vous vraiment supprimer cet élément
            {children}
          </DialogContentText>
        </DialogContent>
        <Button onClick={() => close()}>Annuler</Button>
        <Button type="submit">
          Oui
        </Button>
      </Form>
    </Dialog>
  )
}