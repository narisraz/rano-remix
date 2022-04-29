import { withZod } from "@remix-validated-form/with-zod"
import { z } from "zod"

const passwordNotMatchMessage = "Les mots de passe ne correspondent pas"

export const name = z.string()

export const firstName = z.string()

export const telephones = z.string().optional()
export const role = z.string()

export const email = z
  .string()
  .email("Email invalide")
  .transform((str) => str.toLowerCase().trim())

export const nif = z.string()
export const stat = z.string()

export const region = z.string().optional()
export const commune = z.string().optional()
export const fokontany = z.string().optional()
export const lot = z.string().optional()

export const password = z
  .string()
  .min(6, "Le mot de passe doit contenir au moins 6 caractères")
  .max(20, "Le mot de passe doit contenir au plus 20 caractères")
  .transform((str) => str.trim())

export const LoginValidator = withZod(
  z.object({
    email,
    password
  }))

export const ClientValidator = withZod(
  z.object({
    name,
    email,
    telephones,
    nif,
    stat,
    region,
    commune,
    fokontany,
    lot
  })
)

export const SiteValidator = withZod(
  z.object({
    name,
    telephones,
    region,
    commune,
    fokontany,
    lot
  })
)

export const ReservoirValidator = withZod(
  z.object({
    label: z.string(),
    region,
    commune,
    fokontany
  })
)

export const CreateUserValidator = withZod(
  z.object({
    name,
    firstName,
    region,
    commune,
    fokontany,
    lot,
    telephones,
    email,
    password,
    passwordConfirmation: z.string(),
    role
  })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: passwordNotMatchMessage,
      path: ["passwordConfirmation"],
    }))

export const UpdateUserValidator = withZod(
  z.object({
    name,
    firstName,
    telephones,
    region,
    commune,
    fokontany,
    lot,
    role
  }))

export const AbonneeValidator = withZod(
  z.object({
    name,
    firstName,
    telephones,
    region,
    commune,
    fokontany,
    lot,
    dateContract: z.string()
  })
)

export const ResetPasswordValidator = z
  .object({
    password: password,
    passwordConfirmation: password,
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: passwordNotMatchMessage,
    path: ["passwordConfirmation"],
  })

export const ChangePasswordValidator = z.object({
  currentPassword: z.string(),
  newPassword: password,
})