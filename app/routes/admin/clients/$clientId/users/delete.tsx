import type { ActionFunction, LoaderFunction } from "remix";
import { redirect } from "remix";
import { deleteUserByEmail } from "~/models/user.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string
  return deleteUserByEmail(email);
};

export const loader: LoaderFunction = async () => {
  return redirect("/admin/clients");
};
