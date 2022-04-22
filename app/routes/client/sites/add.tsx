import { Address, Reservoir } from "@prisma/client"
import { ActionFunction, LoaderFunction, MetaFunction, redirect, useLoaderData } from "remix"
import { validationError } from "remix-validated-form"
import { SiteValidator } from "~/core/validation"
import { getAddressById } from "~/models/address.server"
import { getReservoirsByClientId } from "~/models/reservoir.server"
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
  const fokontany = formData.get("fokontany") as string
  const lot = formData.get("lot") as string

  let reservoirs: string[] = []
  console.log(`>>>>>> ${JSON.stringify(formData)}`)
  for (const key in formData.keys()) {
    console.log(`>>>>>> ${key}`)
    if (key.startsWith("reservoir-")) {
      reservoirs.push(formData.get(key) as string)
    }
  }

  const user = await getUser(request)

  if (!user) {
    throw pageNotFound()
  }

  /*
  const result = await createSite(user.clientId, name, telephones, reservoirs, region, commune, fokontany, lot)

  if (result.error) {
    return json<ClientActionData>(
      {
        errors: { email: result.error }
      },
      { status: 400 }
    );
  }
  return redirect(`/client/sites`)
  */
  return {}
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

  const reservoirs = await getReservoirsByClientId(user.clientId)

  const reservoirsAddresses = await Promise.all(reservoirs.map(async reservoir => {
    return await getAddressById(reservoir.addressId)
  }))
  return {
    reservoirs,
    reservoirsAddresses
  }
};

export const meta: MetaFunction = () => {
  return {
    title: 'Ajout site'
  }
}

export function addClient() {
  const { reservoirs, reservoirsAddresses } = useLoaderData() as LoaderData

  return (
    <SiteForm title="Nouveau site" allReservoirs={reservoirs} selectedReservoirsIds={[]} action="/client/sites/add" validator={SiteValidator} reservoirsAddresses={reservoirsAddresses} />
  )
}

export default addClient