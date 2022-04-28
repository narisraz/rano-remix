import { Address, Reservoir } from "@prisma/client"
import { ActionFunction, json, LoaderFunction, MetaFunction, redirect } from "remix"
import { validationError } from "remix-validated-form"
import { ClientActionData } from "~/client/components/ClientForm"
import { SiteValidator } from "~/core/validation"
import { createSite } from "~/models/site.server"
import { getUser } from "~/session.server"
import { SiteForm } from "~/site/components/SiteForm"
import { pageNotFound } from "~/utils"


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const fieldValues = await SiteValidator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);

  const name = formData.get("name") as string
  const telephones = formData.get("telephones") as string
  const region = formData.get("region") as string
  const commune = formData.get("commune") as string

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
  return redirect(`/client/sites`)
}

interface LoaderData {
  reservoirs: Reservoir[]
  reservoirsAddresses: Address[]
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
    title: 'Ajout site'
  }
}

export function addClient() {
  return (
    <SiteForm title="Nouveau SAEP" action="/client/sites/add" validator={SiteValidator} />
  )
}

export default addClient