import type { ActionFunction, LoaderFunction } from "remix";
import { redirect } from "remix";
import { deleteSite } from "~/models/site.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id") as string
  return deleteSite(id);
};

export const loader: LoaderFunction = async () => {
  return redirect("/client/sites");
};
