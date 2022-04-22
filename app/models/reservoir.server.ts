import { Address, Client, Reservoir } from "@prisma/client";
import { prisma } from "~/db.server";
import { addAddress, updateAddress } from "./address.server";


export async function getReservoirById(id: Reservoir["id"]) {
  return prisma.reservoir.findUnique({
    where: { id }
  })
}

export async function getReservoirsByClientId(clientId: Client["id"]) {
  return prisma.reservoir.findMany({
    where: { clientId }
  })
}

export async function deleteReservoirById(id: Reservoir["id"]) {
  return prisma.reservoir.delete({
    where: { id }
  })
}

export async function createReservoir(
  clientId: Client["id"],
  label: Reservoir["label"],
  volume: Reservoir["volume"],
  region: Address["region"],
  commune: Address["commune"],
  fokontany: Address["fokontany"]
): Promise<{
  reservoir?: Reservoir,
  error?: string
}> {

  const address = await addAddress(
    region ?? '',
    commune ?? '',
    fokontany ?? '',
  )

  const reservoir = await prisma.reservoir.create({
    data: {
      label,
      volume,
      addressId: address.id,
      clientId
    }
  })

  return {
    reservoir
  }
}

export async function updateReservoir(
  id: Reservoir["id"],
  clientId: Client["id"],
  label: Reservoir["label"],
  volume: Reservoir["volume"],
  region: Address["region"],
  commune: Address["commune"],
  fokontany: Address["fokontany"]
): Promise<{
  reservoir?: Reservoir,
  error?: string
}> {

  const oldUserValue = await getReservoirById(id)

  let address = undefined
  if (oldUserValue?.addressId) {
    address = await updateAddress(
      oldUserValue?.addressId,
      region,
      commune,
      fokontany
    )
  }

  const reservoir = await prisma.reservoir.update({
    where: { id },
    data: {
      label,
      volume,
      clientId
    }
  })

  return {
    reservoir
  }
}