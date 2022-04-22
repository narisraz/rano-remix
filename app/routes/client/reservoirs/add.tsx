import { ActionFunction, json, LoaderFunction, MetaFunction, redirect } from "remix"
import { validationError } from "remix-validated-form"
import { ReservoirValidator } from "~/core/validation"
import { createReservoir } from "~/models/reservoir.server"
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

  const result = await createReservoir(user.clientId, label, volume, region, commune, fokontany)

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

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)

  if (!user) {
    throw pageNotFound
  }

  return {}
};

export const meta: MetaFunction = () => {
  return {
    title: 'Ajout réservoir'
  }
}

export function addReservoir() {
  return (
    <ReservoirForm title="Nouveau réservoir" action="/client/reservoirs/add" validator={ReservoirValidator} />
  )
}

export default addReservoir