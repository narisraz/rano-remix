import { Address, Client, Site } from "@prisma/client";
import { prisma } from "~/db.server";
import { addAddress, updateAddress } from "./address.server";

export async function getSiteById(id: Site["id"]) {
  return prisma.site.findUnique({ where: { id } });
}

export async function getSitesByClientId(clientId: Client["id"]) {
  return prisma.site.findMany({
    where: { clientId }
  })
}

export async function createSite(
  clientId: Client["id"],
  name: Site["name"],
  telephones: Site["telephones"],
  region: Address["region"],
  commune: Address["commune"]
): Promise<{
  site?: Site,
  error?: string
}> {

  const address = await addAddress(
    region ?? '',
    commune ?? '',
  )

  const site = await prisma.site.create({
    data: {
      clientId,
      name,
      telephones,
      addressId: address.id,
    }
  })

  return {
    site
  }
}

export async function updateSite(
  id: Site["id"],
  clientId: Client["id"],
  name: Site["name"],
  telephones: Site["telephones"],
  region: Address["region"],
  commune: Address["commune"]
): Promise<{
  site?: Site,
  error?: string
}> {

  const oldSiteValue = await getSiteById(id)

  let address = undefined
  if (oldSiteValue?.addressId) {
    address = await updateAddress(
      oldSiteValue.addressId,
      region,
      commune
    )
  }

  const site = await prisma.site.update({
    where: { id },
    data: {
      clientId,
      name,
      telephones,
      addressId: address?.id,
    }
  })

  return {
    site
  }
}