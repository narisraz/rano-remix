import {
  Alert,
  Button, FormControlLabel,
  FormGroup, Switch
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Address, Client, User } from "@prisma/client";
import React, { useState } from "react";
import { ValidatedForm, Validator } from "remix-validated-form";
import { LabeledSelectField } from "~/core/components/LabeledSelectField";
import LabeledTextField from "~/core/components/LabeledTextField";
import { StyledFieldset } from "~/core/components/StyledFieldset";
import { Role } from "~/models/user.server";
import { AddUserActionData } from "~/routes/admin/clients/$clientId/users/add";

export interface UserFormProps {
  client: Client
  user?: User
  address?: Address
  roles: Role[]
  action: string
  validator: Validator<{ [x: string]: any; }>
  actionData?: AddUserActionData
}

export function UserForm({ client, user, validator, address, roles, action, actionData }: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Box>
      <h3>{client.name} - Nouvel employé</h3>
      <Divider sx={{ mb: 2 }} />
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
        <Box sx={{ mb: 2 }}>
          <StyledFieldset>
            <legend>Authentification : </legend>
            <LabeledTextField name="email" label="Email" placeholder="Email" />
            <LabeledTextField name="password" label="Mot de passe" placeholder="Mot de passe" type="password" />
            <LabeledTextField name="passwordConfirmation" label="Confirmer le mot de passe" placeholder="Confirmer le mot de passe" type="password" />
          </StyledFieldset>
        </Box>
        <Box sx={{ mb: 2 }}>
          <StyledFieldset>
            <legend>Informations personnels : </legend>
            <LabeledTextField label="Nom" name="name" placeholder="name" />
            <LabeledTextField label="Prénom" name="firstName" placeholder="firstName" />
            <LabeledTextField label="Téléphones" name="telephones" placeholder="telephones" />
          </StyledFieldset>
        </Box>
        <Box sx={{ mb: 2 }}>
          <StyledFieldset>
            <legend>Adresse : </legend>
            <LabeledTextField label="Région" name="region" placeholder="region" />
            <LabeledTextField label="Commune" name="commune" placeholder="commune" />
            <LabeledTextField label="Fokontany" name="fokontany" placeholder="fokontany" />
            <LabeledTextField label="Lot" name="lot" placeholder="lot" />
          </StyledFieldset>
        </Box>
        <Box sx={{ mb: 2 }}>
          <LabeledSelectField label="Rôle" name="role" items={roles.map(role => ({ id: String(role.id), label: role.label }))} initialValue={`${user?.role ?? 0}`} />
        </Box>
        <Box sx={{ mb: 2 }}>
          <FormGroup>
            <FormControlLabel control={<Switch name={"active"} />} label="Active" />
          </FormGroup>
        </Box>
        <Button variant={"contained"} type={"submit"}>Sauvegarder</Button>
      </ValidatedForm>
    </Box>
  )
}