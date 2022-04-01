import { useActionData, useSearchParams } from '@remix-run/react';
import { ActionFunction, json, LoaderFunction, MetaFunction, redirect } from "remix";
import { validationError } from 'remix-validated-form';
import LoginForm from '~/auth/components/LoginForm';
import { LoginValidator } from '~/auth/validation';
import { verifyLogin } from '~/models/user.server';
import { createUserSession, getUserId } from '~/session.server';


export interface LoginActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const fieldValues = await LoginValidator.validate(formData);
  console.log(fieldValues)
  if (fieldValues.error) return validationError(fieldValues.error);

  const { email, password } = fieldValues.data
  const user = await verifyLogin(email, password);

  if (!user) {
    return json<LoginActionData>(
      { errors: { email: "Email ou mot de passe incorrect" } },
      { status: 400 }
    );
  }

  const remember = formData.get("remember")
  const redirectTo = formData.get("redirectTo")
  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/client/dashboard",
  });
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const meta: MetaFunction = () => {
  return {
    title: "Se connecter",
  };
};

export default function Login() {
  const actionData = useActionData() as LoginActionData;
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin/dashboard";

  return (
    <LoginForm actionData={actionData} redirectTo={redirectTo} />
  )
}