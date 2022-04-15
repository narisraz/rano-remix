import {
  Button
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Address, Reservoir, Site } from "@prisma/client";
import React from "react";
import { ValidatedForm, Validator } from "remix-validated-form";
import LabeledTextField from "~/core/components/LabeledTextField";
import TransferList from "~/core/components/TransfertList";


export interface UserFormProps {
  children?: JSX.Element
  title: string
  leftReservoirs: Reservoir[]
  rightReservoirs: Reservoir[]
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

export function SiteForm({ children, title, site, leftReservoirs, rightReservoirs, validator, address, action, actionData }: UserFormProps) {
  const revervoirToTransfertListItem = (value: Reservoir) => {
    return {
      id: value.id,
      label: `${value.volume} litres`
    }
  }

  const leftItems = leftReservoirs.map(revervoirToTransfertListItem)
  const rightItems = rightReservoirs.map(revervoirToTransfertListItem)

  return (
    <Box>
      <h3>{title}</h3>
      <Divider sx={{ mb: 2 }} />
      <ValidatedForm
        method="post"
        action={action}
        validator={validator}
        defaultValues={{
          name: site?.name ?? '',
          telephones: site?.telephones ?? ''
        }}
      >
        {children}
        <Box sx={{ mb: 2 }}>
          <LabeledTextField label="Nom" name="name" placeholder="name" />
          <LabeledTextField label="Téléphones" name="telephones" placeholder="telephones" />
          <TransferList leftItems={leftItems} rightItems={rightItems} />
        </Box>
        <Button variant={"contained"} type={"submit"}>Sauvegarder</Button>
      </ValidatedForm>
    </Box>
  )
}