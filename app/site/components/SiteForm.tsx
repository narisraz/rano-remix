import {
  Button
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Address, Site } from "@prisma/client";
import React from "react";
import { ValidatedForm, Validator } from "remix-validated-form";
import LabeledTextField from "~/core/components/LabeledTextField";


export interface UserFormProps {
  children?: JSX.Element
  title: string
  site?: Site
  address?: Address
  action: string
  validator: Validator<{ [x: string]: any; }>
  actionData?: UserActionData
}

export interface UserActionData {
  errors?: {
    email?: string;
  };
}

export function SiteForm({ children, title, site, validator, address, action, actionData }: UserFormProps) {

  return (
    <Box>
      <h3>{title}</h3>
      <Divider />
      <ValidatedForm
        method="post"
        action={action}
        validator={validator}
        defaultValues={{
          name: site?.name ?? '',
          telephones: site?.telephones ?? '',
          region: address?.region ?? '',
          commune: address?.commune ?? ''
        }}
      >
        {children}
        <Box sx={{ mb: 2 }}>
          <LabeledTextField label="Nom" name="name" placeholder="name" />
          <LabeledTextField label="Téléphones" name="telephones" placeholder="telephones" />
          <LabeledTextField label="Région" name="region" placeholder="Région" />
          <LabeledTextField label="Commune" name="commune" placeholder="Commune" />
        </Box>
        <Button variant={"contained"} type={"submit"}>Sauvegarder</Button>
      </ValidatedForm>
    </Box>
  )
}