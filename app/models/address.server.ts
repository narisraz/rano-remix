import { prisma } from "~/db.server";

export async function getAddressById(id: string) {
  return prisma.address.findFirst({
    where: { id }
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