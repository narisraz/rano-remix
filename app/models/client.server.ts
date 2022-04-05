import { prisma } from "~/db.server";

export async function getAllClients() {
  return prisma.client.findMany()
}

export async function deleteClient(id: string) {
  return prisma.client.delete({
    where: { id }
  })
}