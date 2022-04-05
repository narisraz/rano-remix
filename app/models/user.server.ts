import type { Client, Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export enum ROLE {
  ADMIN_ROLE = -1,
  GESTIONNAIRE,
  RELEVEUR,
  CAISSIER
}

export interface Role {
  id: number
  label: string
}

export const roles: Role[] = [
  { id: ROLE.ADMIN_ROLE, label: 'Administrateur' },
  { id: ROLE.GESTIONNAIRE, label: 'Gestionnaire' },
  { id: ROLE.RELEVEUR, label: 'Releveur' },
  { id: ROLE.CAISSIER, label: 'Caissier' }
]

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUsersByClientId(clientId: Client["id"]) {
  return prisma.user.findMany({ where: { clientId } })
}

export async function createUser(email: User["email"], name: User["name"], firstName: User["firstName"], active: User["active"], password: string, clientId: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name,
      firstName,
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      clientId,
      active
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
