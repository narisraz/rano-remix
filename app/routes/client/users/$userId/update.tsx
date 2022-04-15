import { Box } from "@mui/material";
import { Address, Client, User } from "@prisma/client";
import { ActionFunction, json, LoaderFunction, redirect, useActionData, useLoaderData } from "remix";
import { validationError } from "remix-validated-form";
import { StyledFieldset } from "~/core/components/StyledFieldset";
import { UpdateUserValidator } from "~/core/validation";
import { getAddressById } from "~/models/address.server";
import { getClientById } from "~/models/client.server";
import { getUserById, Role, roles, updateUser } from "~/models/user.server";
import { UserActionData, UserForm } from "~/user/components/UserForm";
import { pageNotFound } from "~/utils";


export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()
  const fieldValues = await UpdateUserValidator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);

  const userId = params.userId
  if (userId) {
    const user = await getUserById(userId)

    if (user) {
      const client = await getClientById(user?.clientId)

      if (client) {
        const name = formData.get("name") as string
        const firstName = formData.get("firstName") as string
        const active = formData.get("active") as string
        const role = Number(formData.get("role") as string)
        const telephones = formData.get("telephones") as string
        const region = formData.get("region") as string
        const commune = formData.get("commune") as string
        const fokontany = formData.get("fokontany") as string
        const lot = formData.get("lot") as string

        const result = await updateUser(userId, name, firstName, Boolean(active), role, telephones, region, commune, fokontany, lot)

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

  }

  throw pageNotFound()

};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = params.userId

  if (!userId)
    throw pageNotFound()

  const user = await getUserById(userId)

  if (!user)
    throw pageNotFound()

  const client = await getClientById(user.clientId)

  let address = undefined
  if (user.addressId)
    address = await getAddressById(user.addressId)
  return {
    roles,
    client,
    user,
    address
  }
};

interface LoaderData {
  roles: Role[],
  client: Client,
  user: User,
  address: Address,
  errors?: {
    email?: string;
    password?: string;
  };
}

export function UpdateUserPage() {
  const actionData = useActionData() as UserActionData;
  const { roles, client, user, address } = useLoaderData() as LoaderData

  return (
    <UserForm title="Modification employé" roles={roles} client={client} action={`/client/users/${user.id}/update`} validator={UpdateUserValidator} actionData={actionData} user={user} address={address} >
      <Box sx={{ mb: 2 }}>
        <StyledFieldset>
          <legend>Authentification : </legend>
          <label>Email : </label>{user.email}
        </StyledFieldset>
      </Box>
    </UserForm>
  )
}

export default UpdateUserPage