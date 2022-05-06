import type { ActionFunction, LoaderFunction } from "remix";
import { redirect } from "remix";
import { deleteUser } from "~/models/user.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id") as string
  return deleteUser(id);
};

export const loader: LoaderFunction = async () => {
  return redirect("/client/users");
};
