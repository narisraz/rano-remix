import { Address, Reservoir } from "@prisma/client"
import { ActionFunction, json, LoaderFunction, MetaFunction, redirect, useLoaderData } from "remix"
import { validationError } from "remix-validated-form"
import { ReservoirValidator } from "~/core/validation"
import { getAddressById } from "~/models/address.server"
import { createReservoir, getReservoirById, updateReservoir } from "~/models/reservoir.server"
import { ReservoirActionData, ReservoirForm } from "~/reservoir/components/ReservoirForm"
import { getUser } from "~/session.server"
import { pageNotFound } from "~/utils"


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const fieldValues = await ReservoirValidator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);

  const label = formData.get("label") as string
  const volume = formData.get("volume") as string
  const region = formData.get("region") as string
  const commune = formData.get("commune") as string
  const fokontany = formData.get("fokontany") as string

  const user = await getUser(request)

  if (!user) {
    throw pageNotFound()
  }

  const result = await updateReservoir(user.id, user.clientId, label, volume, region, commune, fokontany)

  if (result.error) {
    return json<ReservoirActionData>(
      {
        errors: { email: result.error }
      },
      { status: 400 }
    );
  }
  return redirect(`/client/reservoirs`)
}

interface LoaderData {
  reservoir: Reservoir,
  address: Address
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const reservoirId = params.reservoirId

  if (!reservoirId) {
    throw pageNotFound()
  }

  const reservoir = await getReservoirById(reservoirId)

  if (!reservoir)
    throw pageNotFound()

  const address = await getAddressById(reservoir.addressId)

  return {
    reservoir,
    address
  }
};

export const meta: MetaFunction = () => {
  return {
    title: 'Modification réservoir'
  }
}

export function editReservoir() {
  const { reservoir, address } = useLoaderData() as LoaderData

  return (
    <ReservoirForm title="Modification réservoir" action="/client/reservoirs/add" validator={ReservoirValidator} reservoir={reservoir} address={address} />
  )
}

export default editReservoir