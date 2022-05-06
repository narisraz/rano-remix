import { Abonnee, Address, Site } from "@prisma/client";
import { prisma } from "~/db.server";
import { addAddress, updateAddress } from "./address.server";


export enum ABONNEE_TYPE {
  PARTICULIER
}

export interface AbonneeType {
  id: number,
  label: string
}

export const abonneeTypes: AbonneeType[] = [
  { id: ABONNEE_TYPE.PARTICULIER, label: "Particulier" }
]

export async function getAbonneesBySiteId(siteId: Site["id"]) {
  return prisma.abonnee.findMany({
    where: { siteId }
  })
}

export async function createAbonnee(
  name: Abonnee["name"],
  firstName: Abonnee["firstName"],
  telephones: Abonnee["telephones"],
  contractDate: Abonnee["contractDate"],
  siteId: Site["id"],
  region: Address["region"],
  commune: Address["commune"],
  fokontany: Address["fokontany"],
  lot: Address["lot"],
  abonneeTypeId: AbonneeType["id"]
): Promise<{
  abonnee?: Abonnee,
  error?: string
}> {

  const address = await addAddress(
    region ?? '',
    commune ?? '',
    fokontany ?? '',
    lot ?? '',
  )

  const abonnee = await prisma.abonnee.create({
    data: {
      name,
      firstName,
      telephones,
      contractDate,
      siteId,
      addressId: address.id,
      abonneeTypeId
    }
  })

  return {
    abonnee
  }
}

export async function updateAbonnee(
  id: Abonnee["id"],
  name: Abonnee["name"],
  firstName: Abonnee["firstName"],
  telephones: Abonnee["telephones"],
  contractDate: Abonnee["contractDate"],
  siteId: Site["id"],
  region: Address["region"],
  commune: Address["commune"],
  fokontany: Address["fokontany"],
  lot: Address["lot"],
  abonneeTypeId: AbonneeType["id"]
): Promise<{
  abonnee?: Abonnee,
  error?: string
}> {

  const oldAbonneeValue = await getAbonneeById(id)

  let address = undefined
  if (oldAbonneeValue?.addressId) {
    address = await updateAddress(
      oldAbonneeValue.addressId,
      region,
      commune,
      fokontany,
      lot
    )
  }

  const abonnee = await prisma.abonnee.update({
    where: { id },
    data: {
      name,
      firstName,
      telephones,
      contractDate,
      siteId,
      addressId: address?.id,
      abonneeTypeId
    }
  })

  return {
    abonnee
  }
}

export const deleteAbonnee = async (id: Abonnee["id"]) => {
  return prisma.abonnee.delete({
    where: { id }
  })
}

export const getAbonneeById = async (id: Abonnee["id"]) => {
  return prisma.abonnee.findFirst({
    where: { id }
  })
}