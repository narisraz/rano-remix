import type { ActionFunction, LoaderFunction } from "remix";
import { redirect } from "remix";
import { deleteAbonnee } from "~/models/abonnee.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id") as string
  return deleteAbonnee(id);
};

export const loader: LoaderFunction = async () => {
  return redirect("/client/abonnees");
};
