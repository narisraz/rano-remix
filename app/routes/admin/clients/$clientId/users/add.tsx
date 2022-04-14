import { Client } from "@prisma/client";
import { ActionFunction, json, LoaderFunction, redirect, useActionData, useLoaderData } from "remix";
import { validationError } from "remix-validated-form";
import { CreateUserValidator } from "~/core/validation";
import { getClientById } from "~/models/client.server";
import { createUser, Role, roles } from "~/models/user.server";
import { UserForm } from "~/user/components/UserForm";
import { pageNotFound } from "~/utils";


export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()
  const fieldValues = await CreateUserValidator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);

  const clientId = params.clientId
  if (clientId) {
    const client = await getClientById(clientId)

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

      const result = await createUser(email, name, firstName, Boolean(active), password, clientId, role, telephones, region, commune, fokontany, lot)

      if (result.error) {
        return json<AddUserActionData>(
          {
            errors: { email: result.error }
          },
          { status: 400 }
        );
      }
      return redirect(`/admin/clients`)
    }

  }

  throw pageNotFound()

};

export const loader: LoaderFunction = async ({ request, params }) => {
  const clientId = params.clientId

  if (!clientId)
    throw pageNotFound()

  const client = await getClientById(clientId)
  return {
    roles,
    client
  }
};

export interface AddUserActionData {
  errors?: {
    email?: string;
  };
}

interface LoaderData {
  roles: Role[],
  client: Client,
  errors?: {
    email?: string;
    password?: string;
  };
}

export function AddUserPage() {
  const actionData = useActionData() as AddUserActionData;
  const { roles, client } = useLoaderData() as LoaderData

  return (
    <UserForm roles={roles} client={client} action={`/admin/clients/${client.id}/users/add`} validator={CreateUserValidator} actionData={actionData} />
  )
}

export default AddUserPage