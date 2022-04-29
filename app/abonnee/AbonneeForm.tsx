import {
  Button
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Abonnee, Address, Site } from "@prisma/client";
import React from "react";
import { ValidatedForm, Validator } from "remix-validated-form";
import LabeledTextField from "~/core/components/LabeledTextField";


export interface AbonneeFormProps {
  children?: JSX.Element
  title: string
  abonnee?: Abonnee
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

export function AbonneeForm({ children, title, abonnee, validator, address, action, actionData }: AbonneeFormProps) {

  return (
    <Box>
      <h3>{title}</h3>
      <Divider />
      <ValidatedForm
        method="post"
        action={action}
        validator={validator}
        defaultValues={{
          name: abonnee?.name ?? '',
          firstName: abonnee?.firstName ?? '',
          contractDate: abonnee?.contractDate ?? '',
          telephones: abonnee?.telephones ?? '',
          region: address?.region ?? '',
          commune: address?.commune ?? '',
          lot: address?.lot ?? ''
        }}
      >
        {children}
        <Box sx={{ mb: 2 }}>
          <LabeledTextField label="Nom" name="name" placeholder="name" />
          <LabeledTextField label="Prénom" name="firstName" placeholder="firstName" />
          <LabeledTextField label="Téléphones" name="telephones" placeholder="telephones" />
          <LabeledTextField label="Région" name="region" placeholder="Région" />
          <LabeledTextField label="Commune" name="commune" placeholder="Commune" />
          <LabeledTextField label="Lot" name="lot" placeholder="Lot" />
        </Box>
        <Button variant={"contained"} type={"submit"}>Sauvegarder</Button>
      </ValidatedForm>
    </Box>
  )
}