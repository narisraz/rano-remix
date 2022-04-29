import { ActionFunction, json, LoaderFunction, MetaFunction, redirect } from "remix"
import { validationError } from "remix-validated-form"
import { AbonneeForm } from "~/abonnee/AbonneeForm"
import { ClientActionData } from "~/client/components/ClientForm"
import { AbonneeValidator } from "~/core/validation"
import { createSite } from "~/models/site.server"
import { getUser } from "~/session.server"
import { pageNotFound } from "~/utils"


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const fieldValues = await AbonneeValidator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);

  const name = formData.get("name") as string
  const firstName = formData.get("firstName") as string
  const telephones = formData.get("telephones") as string
  const region = formData.get("region") as string
  const commune = formData.get("commune") as string
  const lot = formData.get("lot") as string
  const dateContract = formData.get("dateContract") as string

  const user = await getUser(request)

  if (!user) {
    throw pageNotFound()
  }

  const result = await createSite(user.clientId, name, telephones, region, commune)

  if (result.error) {
    return json<ClientActionData>(
      {
        errors: { email: result.error }
      },
      { status: 400 }
    );
  }
  return redirect(`/client/abonnees`)
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)

  if (!user) {
    throw pageNotFound
  }

  return {}
};

export const meta: MetaFunction = () => {
  return {
    title: 'Abonnée'
  }
}

export function addAbonnee() {
  return (
    <AbonneeForm title="Nouvelle abonnée" action="/client/abonnees/add" validator={AbonneeValidator} />
  )
}

export default addAbonnee