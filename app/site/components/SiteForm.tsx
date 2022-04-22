import {
  Button
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Address, Reservoir, Site } from "@prisma/client";
import React from "react";
import { ValidatedForm, Validator } from "remix-validated-form";
import LabeledTextField from "~/core/components/LabeledTextField";
import ReservoirList from "~/reservoir/components/ReservoirList";


export interface UserFormProps {
  children?: JSX.Element
  title: string
  allReservoirs: Reservoir[]
  selectedReservoirsIds: string[]
  site?: Site
  address?: Address
  reservoirsAddresses: Address[]
  action: string
  validator: Validator<{ [x: string]: any; }>
  actionData?: UserActionData
}

export interface UserActionData {
  errors?: {
    email?: string;
  };
}

export function SiteForm({ children, title, site, allReservoirs, selectedReservoirsIds, validator, address, reservoirsAddresses, action, actionData }: UserFormProps) {

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
          telephones: site?.telephones ?? ''
        }}
      >
        {children}
        <Box sx={{ mb: 2 }}>
          <LabeledTextField label="Nom" name="name" placeholder="name" />
          <LabeledTextField label="Téléphones" name="telephones" placeholder="telephones" />
          <LabeledTextField label="Région" name="region" placeholder="Région" />
          <LabeledTextField label="Commune" name="commune" placeholder="Commune" />
          <LabeledTextField label="Fokontany" name="fokontany" placeholder="Fokontany" />
          <LabeledTextField label="Lot" name="lot" placeholder="Lot" />
          <Box sx={{ mt: 2 }} >
            Liste des réservoirs
            <ReservoirList withCheckbox={true} reservoirs={allReservoirs} checkedElements={selectedReservoirsIds} addresses={reservoirsAddresses} baseUrl="/client" />
          </Box>
        </Box>
        <Button variant={"contained"} type={"submit"}>Sauvegarder</Button>
      </ValidatedForm>
    </Box>
  )
}