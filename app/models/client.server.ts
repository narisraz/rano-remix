import { Address, Client, Prisma } from "@prisma/client";
import { prisma } from "~/db.server";
import { addAddress, updateAddress } from "./address.server";

export async function getAllClients() {
  return prisma.client.findMany()
}

export async function getClientById(id: string) {
  return prisma.client.findFirst({
    where: { id }
  })
}

export async function deleteClient(id: string) {
  return prisma.client.delete({
    where: { id }
  })
}

export async function createClient(
  name: Client["name"],
  email: Client["email"],
  telephones: Client["telephones"],
  nif: Client["nif"],
  stat: Client["stat"],
  region: Address["region"],
  commune: Address["commune"],
  fokontany: Address["fokontany"],
  lot: Address["lot"]
): Promise<{
  user?: Client,
  error?: string
}> {

  const address = await addAddress(
    region ?? '',
    commune ?? '',
    fokontany ?? '',
    lot ?? '',
  )

  try {
    const user = await prisma.client.create({
      data: {
        name,
        email,
        telephones,
        nif,
        stat,
        addressId: address?.id
      },
    });
    return { user }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(e.code)
    }
    throw e
  }
}

export async function updateClient(
  id: Client["id"],
  name: Client["name"],
  email: Client["email"],
  telephones: Client["telephones"],
  nif: Client["nif"],
  stat: Client["stat"],
  region: Address["region"],
  commune: Address["commune"],
  fokontany: Address["fokontany"],
  lot: Address["lot"]
): Promise<{
  user?: Client,
  error?: string
}> {

  const client = await getClientById(id)

  let address = undefined
  if (client?.addressId) {
    address = await updateAddress(
      client?.addressId,
      region,
      commune,
      fokontany,
      lot,
    )
  }

  try {
    const user = await prisma.client.update({
      where: { id },
      data: {
        name,
        email,
        telephones,
        nif,
        stat,
        addressId: address?.id
      },
    });
    return { user }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(e.code)
    }
    throw e
  }
}