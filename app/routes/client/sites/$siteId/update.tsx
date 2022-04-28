import { Address, Client, Site } from "@prisma/client";
import { ActionFunction, json, LoaderFunction, redirect, useActionData, useLoaderData } from "remix";
import { validationError } from "remix-validated-form";
import { SiteValidator } from "~/core/validation";
import { getAddressById } from "~/models/address.server";
import { getClientById } from "~/models/client.server";
import { getSiteById, updateSite } from "~/models/site.server";
import { SiteForm } from "~/site/components/SiteForm";
import { UserActionData } from "~/user/components/UserForm";
import { pageNotFound } from "~/utils";


export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()
  const fieldValues = await SiteValidator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);

  const siteId = params.siteId
  if (siteId) {
    const site = await getSiteById(siteId)

    if (site) {
      const client = await getClientById(site?.clientId)

      if (client) {
        const name = formData.get("name") as string
        const telephones = formData.get("telephones") as string
        const region = formData.get("region") as string
        const commune = formData.get("commune") as string

        const result = await updateSite(siteId, client.id, name, telephones, region, commune)

        if (result.error) {
          return json<UserActionData>(
            {
              errors: { email: result.error }
            },
            { status: 400 }
          );
        }
        return redirect(`/client/sites`)
      }
    }

  }

  throw pageNotFound()

};

export const loader: LoaderFunction = async ({ request, params }) => {
  const siteId = params.siteId

  if (!siteId)
    throw pageNotFound()

  const site = await getSiteById(siteId)

  if (!site)
    throw pageNotFound()

  const client = await getClientById(site.clientId)

  let address = undefined
  if (site.addressId)
    address = await getAddressById(site.addressId)
  return {
    client,
    site,
    address
  }
};

interface LoaderData {
  client: Client,
  site: Site,
  address: Address,
  errors?: {
    email?: string;
    password?: string;
  };
}

export function UpdateSitePage() {
  const actionData = useActionData() as UserActionData;
  const { client, site, address } = useLoaderData() as LoaderData

  return (
    <SiteForm title="Modification SAEP" action={`/client/sites/${site.id}/update`} validator={SiteValidator} actionData={actionData} address={address} site={site} />
  )
}

export default UpdateSitePage