import { Reservoir, Site } from "@prisma/client"
import { ActionFunction, json, LoaderFunction, MetaFunction, redirect, useLoaderData } from "remix"
import { validationError } from "remix-validated-form"
import { ClientActionData } from "~/client/components/ClientForm"
import { ClientValidator, SiteValidator } from "~/core/validation"
import { getReservoirsByClientId } from "~/models/reservoir.server"
import { createSite } from "~/models/site.server"
import { getUser } from "~/session.server"
import { SiteForm } from "~/site/components/SiteForm"
import { pageNotFound } from "~/utils"


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const fieldValues = await ClientValidator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);

  const name = formData.get("name") as string
  const telephones = formData.get("telephones") as string
  const region = formData.get("region") as string
  const commune = formData.get("commune") as string
  const fokontany = formData.get("fokontany") as string
  const lot = formData.get("lot") as string

  const user = await getUser(request)

  if (!user) {
    throw pageNotFound()
  }

  const result = await createSite(user.clientId, name, telephones, region, commune, fokontany, lot)

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

interface LoaderData {
  site: Site,
  reservoirs: Reservoir[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)

  if (!user) {
    throw pageNotFound
  }

  const reservoirs = await getReservoirsByClientId(user.clientId)
  return {
    reservoirs
  }
};

export const meta: MetaFunction = () => {
  return {
    title: 'Ajout site'
  }
}

export function addClient() {
  const { reservoirs, site } = useLoaderData() as LoaderData

  return (
    <SiteForm title="Noueau site" rightReservoirs={reservoirs} leftReservoirs={[]} action="/admin/clients/add" validator={SiteValidator} />
  )
}

export default addClient