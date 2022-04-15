import { ActionFunction, json, LoaderFunction, MetaFunction, redirect } from "remix"
import { validationError } from "remix-validated-form"
import ClientForm, { ClientActionData } from "~/client/components/ClientForm"
import { ClientValidator } from "~/core/validation"
import { createClient } from "~/models/client.server"


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const fieldValues = await ClientValidator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const telephones = formData.get("telephones") as string
  const nif = formData.get("nif") as string
  const stat = formData.get("stat") as string
  const region = formData.get("region") as string
  const commune = formData.get("commune") as string
  const fokontany = formData.get("fokontany") as string
  const lot = formData.get("lot") as string

  const result = await createClient(name, email, telephones, nif, stat, region, commune, fokontany, lot)

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

export const loader: LoaderFunction = async () => {
  return {}
};

export const meta: MetaFunction = () => {
  return {
    title: 'Ajout client'
  }
}

export function addClient() {
  return (
    <ClientForm title="Noueau client" action="/admin/clients/add" validator={ClientValidator} />
  )
}

export default addClient