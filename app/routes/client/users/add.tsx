import { Box } from "@mui/material";
import { Client } from "@prisma/client";
import { ActionFunction, json, LoaderFunction, redirect, useActionData, useLoaderData } from "remix";
import { validationError } from "remix-validated-form";
import LabeledTextField from "~/core/components/LabeledTextField";
import { StyledFieldset } from "~/core/components/StyledFieldset";
import { CreateUserValidator } from "~/core/validation";
import { getClientById } from "~/models/client.server";
import { createUser, Role, roles } from "~/models/user.server";
import { getUser } from "~/session.server";
import { UserActionData, UserForm } from "~/user/components/UserForm";
import { pageNotFound } from "~/utils";


export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()
  const fieldValues = await CreateUserValidator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);

  const user = await getUser(request)
  if (user) {
    const client = await getClientById(user.clientId)

    if (client) {
      const email = formData.get("email") as string
      const name = formData.get("name") as string
      const firstName = formData.get("firstName") as string
      const active = formData.get("active") as string
      const password = formData.get("password") as string
      const role = Number(formData.get("role") as string)
      const telephones = formData.get("telephones") as string
      const region = formData.get("region") as string
      const commune = formData.get("commune") as string
      const fokontany = formData.get("fokontany") as string
      const lot = formData.get("lot") as string

      const result = await createUser(email, name, firstName, Boolean(active), password, user.clientId, role, telephones, region, commune, fokontany, lot)

      if (result.error) {
        return json<UserActionData>(
          {
            errors: { email: result.error }
          },
          { status: 400 }
        );
      }
      return redirect(`/client/users`)
    }

  }

  throw pageNotFound()

};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await getUser(request)

  if (!user)
    return redirect("/login")

  const client = await getClientById(user.clientId)
  return {
    roles,
    client
  }
};

interface LoaderData {
  roles: Role[],
  client: Client,
  errors?: {
    email?: string;
    password?: string;
  };
}

export function AddUserPage() {
  const actionData = useActionData() as UserActionData;
  const { roles, client } = useLoaderData() as LoaderData

  return (
    <UserForm title="Nouvel utilisateur" roles={roles} client={client} action={`/client/users/add`} validator={CreateUserValidator} actionData={actionData} >
      <Box sx={{ mb: 2 }}>
        <StyledFieldset>
          <legend>Authentification : </legend>
          <LabeledTextField name="email" label="Email" placeholder="Email" />
          <LabeledTextField name="password" label="Mot de passe" placeholder="Mot de passe" type="password" />
          <LabeledTextField name="passwordConfirmation" label="Confirmer le mot de passe" placeholder="Confirmer le mot de passe" type="password" />
        </StyledFieldset>
      </Box>
    </UserForm>
  )
}

export default AddUserPage