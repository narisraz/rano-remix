import { Address, Client } from "@prisma/client"
import { ActionFunction, json, LoaderFunction, MetaFunction, redirect, useLoaderData } from "remix"
import { validationError } from "remix-validated-form"
import ClientForm, { ClientActionData } from "~/client/components/ClientForm"
import { ClientValidator } from "~/core/validation"
import { getAddressById } from "~/models/address.server"
import { getClientById, updateClient } from "~/models/client.server"
import { pageNotFound } from "~/utils"


export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()
  const fieldValues = await ClientValidator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);

  const clientId = params.clientId
  if (clientId) {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const telephones = formData.get("telephones") as string
    const nif = formData.get("nif") as string
    const stat = formData.get("stat") as string
    const region = formData.get("region") as string
    const commune = formData.get("commune") as string
    const fokontany = formData.get("fokontany") as string
    const lot = formData.get("lot") as string

    const result = await updateClient(clientId, name, email, telephones, nif, stat, region, commune, fokontany, lot)

    if (result.error) {
      return json<ClientActionData>(
        {
          errors: { email: result.error }
        },
        { status: 400 }
      );
    }
    return redirect(`/admin/clients`)

  }

  throw pageNotFound()
}

interface LoaderData {
  client: Client,
  address?: Address
}

export const loader: LoaderFunction = async ({ params }) => {
  const clientId = params.clientId

  if (!clientId)
    throw pageNotFound()

  const client = await getClientById(clientId)

  let address = undefined
  if (client?.addressId)
    address = await getAddressById(client.addressId)

  return {
    client,
    address
  }
}

export const meta: MetaFunction = () => {
  return {
    title: 'Modification client'
  }
}

export function UpdateClient() {
  const { client, address } = useLoaderData() as LoaderData

  return (
    <ClientForm title="Modification client" action={`/admin/clients/${client.id}/update`} validator={ClientValidator} client={client} address={address} />
  )
}

export default UpdateClient