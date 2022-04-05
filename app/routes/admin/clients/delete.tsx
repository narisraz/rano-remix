import type { ActionFunction, LoaderFunction } from "remix";
import { redirect } from "remix";
import { deleteClient } from "~/models/client.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id") as string
  return deleteClient(id);
};

export const loader: LoaderFunction = async () => {
  return redirect("/admin/clients");
};
