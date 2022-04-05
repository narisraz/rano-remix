import { prisma } from "~/db.server";

export async function getAddressById(id: string) {
  return prisma.address.findFirst({
    where: { id }
  })
}