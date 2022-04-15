import { Address, Client } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getAddressById(id: string) {
  return prisma.address.findFirst({
    where: { id }
  })
}

export async function getAddressesByClient(clientId: Client["id"]) {
  return prisma.address.findMany({
    where: {  }
  })
}

export async function updateAddress(
  id: Address["id"],
  region: Address["region"],
  commune: Address["commune"],
  fokontany: Address["fokontany"],
  lot: Address["lot"]
) {
  return prisma.address.update({
    where: { id },
    data: {
      region,
      commune,
      fokontany,
      lot
    }
  })
}

export async function addAddress(
  region: string,
  commune: string,
  fokontany: string,
  lot: string
) {
  return prisma.address.create({
    data: {
      region,
      commune,
      fokontany,
      lot
    }
  })
}