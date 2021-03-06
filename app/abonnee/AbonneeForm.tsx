import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Abonnee, Address } from "@prisma/client";
import React from "react";
import { ValidatedForm, Validator } from "remix-validated-form";
import DatePickerField from "~/core/components/DatePickerField";
import { LabeledSelectField } from "~/core/components/LabeledSelectField";
import LabeledTextField from "~/core/components/LabeledTextField";
import { StyledFieldset } from "~/core/components/StyledFieldset";
import { SubmitButton } from "~/core/components/SubmitButton";
import { AbonneeType } from "~/models/abonnee.server";


export interface AbonneeFormProps {
  children?: JSX.Element
  title: string
  abonnee?: Abonnee
  address?: Address
  action: string
  validator: Validator<{ [x: string]: any; }>
  actionData?: UserActionData
  abonneeTypes: AbonneeType[]
}

export interface UserActionData {
  errors?: {
    email?: string;
  };
}

export function AbonneeForm({ children, title, abonnee, validator, address, action, abonneeTypes, actionData }: AbonneeFormProps) {

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
          fokontany: address?.fokontany ?? '',
          lot: address?.lot ?? '',
          abonneeType: abonnee?.abonneeTypeId ?? 0,
          dateContract: abonnee?.contractDate
        }}
      >
        {children}
        <Box sx={{ mb: 2 }}>
          <StyledFieldset>
            <legend>Informations personnels : </legend>
            <LabeledTextField label="Nom" name="name" placeholder="name" />
            <LabeledTextField label="Prénom" name="firstName" placeholder="firstName" />
            <LabeledTextField label="Téléphones" name="telephones" placeholder="telephones" />
          </StyledFieldset>
          <StyledFieldset>
            <legend>Adresse : </legend>
            <LabeledTextField label="Région" name="region" placeholder="Région" />
            <LabeledTextField label="Commune" name="commune" placeholder="Commune" />
            <LabeledTextField label="Fokontany" name="fokontany" placeholder="Fokontany" />
            <LabeledTextField label="Lot" name="lot" placeholder="Lot" />
          </StyledFieldset>
          <StyledFieldset>
            <legend>Abonnement : </legend>
            <Box sx={{ mb: 2 }}>
              <DatePickerField label="Date d'abonnement" name="dateContract" initialValue={`${abonnee?.contractDate ?? ""}`} />
            </Box>
            <LabeledSelectField name="abonneeType" label="Type de contrat" items={abonneeTypes.map(type => ({ id: type.id, label: type.label }))} initialValue={abonneeTypes[0].id} />
          </StyledFieldset>
        </Box>
        <SubmitButton>Sauvegarder</SubmitButton>
      </ValidatedForm>
    </Box>
  )
}