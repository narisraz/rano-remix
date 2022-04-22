import {
  Button
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Address, Reservoir } from "@prisma/client";
import React from "react";
import { ValidatedForm, Validator } from "remix-validated-form";
import LabeledTextField from "~/core/components/LabeledTextField";
import { StyledFieldset } from "~/core/components/StyledFieldset";


export interface UserFormProps {
  children?: JSX.Element
  title: string
  reservoir?: Reservoir
  address?: Address
  action: string
  validator: Validator<{ [x: string]: any; }>
  actionData?: ReservoirActionData
}

export interface ReservoirActionData {
  errors?: {
    email?: string;
  };
}

export function ReservoirForm({ children, title, reservoir, validator, address, action, actionData }: UserFormProps) {

  return (
    <Box>
      <h3>{title}</h3>
      <Divider />
      <ValidatedForm
        method="post"
        action={action}
        validator={validator}
        defaultValues={{
          label: reservoir?.label ?? '',
          volume: reservoir?.volume ?? '',
          region: address?.region ?? '',
          commune: address?.commune ?? '',
          fokontany: address?.fokontany ?? '',
        }}
      >
        {children}
        <Box sx={{ mb: 2 }}>
          <LabeledTextField label="Libellé" name="label" placeholder="Libellé" />
          <LabeledTextField label="Volume" name="volume" placeholder="Volume" type={"unit"} unitLabel="Litres" />
        </Box>
        <Box sx={{ mb: 2 }}>
          <StyledFieldset>
            <legend>Adresse : </legend>
            <LabeledTextField label="Région" name="region" placeholder="region" />
            <LabeledTextField label="Commune" name="commune" placeholder="commune" />
            <LabeledTextField label="Fokontany" name="fokontany" placeholder="fokontany" />
          </StyledFieldset>
        </Box>
        <Button variant={"contained"} type={"submit"}>Sauvegarder</Button>
      </ValidatedForm>
    </Box>
  )
}