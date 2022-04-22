import { Address, Client, Reservoir, Site } from "@prisma/client";
import { prisma } from "~/db.server";
import { addAddress } from "./address.server";
import { addReservoirOnSite } from "./reservoirsonsites.server";

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
  reservoirsIds: Reservoir["id"][],
  region: Address["region"],
  commune: Address["commune"],
  fokontany: Address["fokontany"],
  lot: Address["lot"],
): Promise<{
  site?: Site,
  error?: string
}> {

  const address = await addAddress(
    region ?? '',
    commune ?? '',
    fokontany ?? '',
    lot ?? '',
  )

  const site = await prisma.site.create({
    data: {
      clientId,
      name,
      telephones,
      addressId: address.id,
    }
  })

  reservoirsIds.forEach(async reservoirId => {
    await addReservoirOnSite(reservoirId, site.id)
  })

  return {
    site
  }
}