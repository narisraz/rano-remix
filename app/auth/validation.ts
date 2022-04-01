import { withZod } from "@remix-validated-form/with-zod"
import { z } from "zod"

const passwordNotMatchMessage = "Les mots de passe ne correspondent pas"

export const name = z.string()

export const firstName = z.string()

export const address = z.string()

export const specialities = z.string()

export const tel = z.string()

export const email = z
  .string()
  .email("Email invalide")
  .transform((str) => str.toLowerCase().trim())

export const password = z
  .string()
  .min(6, "Le mot de passe doit contenir au moins 6 caractères")
  .max(20, "Le mot de passe doit contenir au plus 20 caractères")
  .transform((str) => str.trim())

export const passwordConfirmation = z.string()

export const SignupVisitorValidator = withZod(
  z.object({
    name,
    firstName,
    email,
    password,
    passwordConfirmation,
  })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: passwordNotMatchMessage,
      path: ["passwordConfirmation"], // set the path of the error
    }))

export const SignupDoctorValidator = withZod(
  z.object({
    name,
    firstName,
    address,
    specialities,
    homeTel: tel,
    professionalTel: tel,
    officeTel: tel,
    email,
    password,
    passwordConfirmation,
  })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: passwordNotMatchMessage,
      path: ["passwordConfirmation"], // set the path of the error
    }))

export const SignupPharmacyValidator = withZod(
  z.object({
    name,
    address,
    tel: tel,
    email,
    password,
    passwordConfirmation,
  })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: passwordNotMatchMessage,
      path: ["passwordConfirmation"], // set the path of the error
    }))

export const SignupLaboratoryValidator = withZod(
  z.object({
    name,
    address,
    tel: tel,
    email,
    password,
    passwordConfirmation,
  })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: passwordNotMatchMessage,
      path: ["passwordConfirmation"], // set the path of the error
    }))

export const LoginValidator = withZod(
  z.object({
    email,
    password
  }))

export const ForgotPasswordValidator = z.object({
  email,
})

export const ResetPasswordValidator = z
  .object({
    password: password,
    passwordConfirmation: password,
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: passwordNotMatchMessage,
    path: ["passwordConfirmation"], // set the path of the error
  })

export const ChangePasswordValidator = z.object({
  currentPassword: z.string(),
  newPassword: password,
})
