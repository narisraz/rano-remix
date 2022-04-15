import { Client } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getReservoirsByClientId(clientId: Client["id"]) {
  return prisma.reservoir.findMany({
    where: { clientId }
  })
}