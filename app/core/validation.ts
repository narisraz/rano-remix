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