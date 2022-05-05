import {
  Alert,
  Button
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Address, Client, User } from "@prisma/client";
import React from "react";
import { ValidatedForm, Validator } from "remix-validated-form";
import { LabeledSelectField } from "~/core/components/LabeledSelectField";
import LabeledSwitch from "~/core/components/LabeledSwitch";
import LabeledTextField from "~/core/components/LabeledTextField";
import { StyledFieldset } from "~/core/components/StyledFieldset";
import { Role } from "~/models/user.server";


export interface UserFormProps {
  children?: JSX.Element
  title: string
  client: Client
  user?: User
  address?: Address
  roles: Role[]
  action: string
  validator: Validator<{ [x: string]: any; }>
  actionData?: UserActionData
}

export interface UserActionData {
  errors?: {
    email?: string;
  };
}

export function UserForm({ children, title, client, user, validator, address, roles, action, actionData }: UserFormProps) {

  return (
    <Box>
      <h3>{client.name} - {title}</h3>
      <Divider />
      <ValidatedForm
        method="post"
        action={action}
        validator={validator}
        defaultValues={{
          name: user?.name ?? '',
          firstName: user?.firstName ?? '',
          email: user?.email ?? '',
          role: user?.role ?? 0,
          active: user?.active ?? false,
          region: address?.region ?? '',
          commune: address?.commune ?? '',
          fokontany: address?.fokontany ?? '',
          lot: address?.lot ?? '',
          password: '',
          passwordConfirmation: '',
          telephones: user?.telephones ?? ''
        }}
      >
        {actionData && actionData?.errors && <Box sx={{ my: 2 }}>
          <Alert severity="error">
            {actionData.errors.email}
          </Alert>
        </Box>}
        {children}
        <StyledFieldset>
          <legend>Informations personnels : </legend>
          <LabeledTextField label="Nom" name="name" placeholder="name" />
          <LabeledTextField label="Prénom" name="firstName" placeholder="firstName" />
          <LabeledTextField label="Téléphones" name="telephones" placeholder="telephones" />
        </StyledFieldset>
        <StyledFieldset>
          <legend>Adresse : </legend>
          <LabeledTextField label="Région" name="region" placeholder="region" />
          <LabeledTextField label="Commune" name="commune" placeholder="commune" />
          <LabeledTextField label="Fokontany" name="fokontany" placeholder="fokontany" />
          <LabeledTextField label="Lot" name="lot" placeholder="lot" />
        </StyledFieldset>
        <Box sx={{ mt: '1em' }}>
          <LabeledSelectField label="Rôle" name="role" items={roles.map(role => ({ id: String(role.id), label: role.label }))} initialValue={`${user?.role ?? 0}`} />
        </Box>
        <Box sx={{ mt: '1em' }}>
          <LabeledSwitch label="Active" initialValue={user?.active ?? false} name="active" />
        </Box>
        <Button variant={"contained"} type={"submit"}>Sauvegarder</Button>
      </ValidatedForm>
    </Box>
  )
}