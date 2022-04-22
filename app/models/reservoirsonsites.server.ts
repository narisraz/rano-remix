import { Reservoir, Site } from "@prisma/client";
import { prisma } from "~/db.server";

export async function addReservoirOnSite(reservoirId: Reservoir["id"], siteId: Site["id"]) {
  return prisma.reservoirsOnSites.create({
    data: {
      reservoirId,
      siteId
    }
  })
}