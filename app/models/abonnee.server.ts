import { Site } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getAbonneesBySiteId(siteId: Site["id"]) {
  return prisma.abonnee.findMany({
    where: { siteId }
  })
}