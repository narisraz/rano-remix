import { Abonnee, Address } from "@prisma/client";
import { ActionFunction, LoaderFunction, MetaFunction, redirect, useActionData, useLoaderData } from "remix";
import { validationError } from "remix-validated-form";
import { AbonneeForm } from "~/abonnee/AbonneeForm";
import { AbonneeValidator } from "~/core/validation";
import { AbonneeType, abonneeTypes, getAbonneeById, updateAbonnee } from "~/models/abonnee.server";
import { getAddressById } from "~/models/address.server";
import { getSiteIdFromRequest } from "~/models/site.server";
import { getUser } from "~/session.server";
import { UserActionData } from "~/user/components/UserForm";
import { pageNotFound } from "~/utils";


export const meta: MetaFunction = () => {
  return {
    title: "Modification abonnée"
  }
}

export const action: ActionFunction = async ({ request, params }) => {
  const abonneeId = params.abonneeId

  if (!abonneeId)
    throw pageNotFound()

  const formData = await request.formData()
  const fieldValues = await AbonneeValidator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);

  const name = formData.get("name") as string
  const firstName = formData.get("firstName") as string
  const telephones = formData.get("telephones") as string
  const region = formData.get("region") as string
  const commune = formData.get("commune") as string
  const fokontany = formData.get("fokontany") as string
  const lot = formData.get("lot") as string
  const abonneeType = Number(formData.get("abonneeType") as string)
  const dateContract = formData.get("dateContract") as string

  const user = await getUser(request)

  if (!user) {
    throw pageNotFound()
  }

  const selectedSAEPId = await getSiteIdFromRequest(request)

  await updateAbonnee(abonneeId, name, firstName, telephones, new Date(dateContract), selectedSAEPId, region, commune, fokontany, lot, abonneeType)

  return redirect(`/client/abonnees`)

};

export const loader: LoaderFunction = async ({ request, params }) => {
  const abonneeId = params.abonneeId

  if (!abonneeId)
    throw pageNotFound()

  const abonnee = await getAbonneeById(abonneeId)

  let address = undefined
  if (abonnee?.addressId)
    address = await getAddressById(abonnee.addressId)

  return {
    abonnee,
    abonneeTypes,
    address
  }
};

interface LoaderData {
  abonnee: Abonnee,
  address: Address,
  abonneeTypes: AbonneeType[],
  errors?: {
    email?: string,
    password?: string
  };
}

export function UpdateAbonnee() {
  const actionData = useActionData() as UserActionData;
  const { abonnee, address, abonneeTypes } = useLoaderData() as LoaderData

  return (
    <AbonneeForm title="Modification abonnée" abonnee={abonnee} abonneeTypes={abonneeTypes} action={`/client/abonnees/${abonnee.id}/update`} validator={AbonneeValidator} actionData={actionData} address={address} />
  )
}

export default UpdateAbonnee