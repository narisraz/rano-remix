import type { ActionFunction, LoaderFunction } from "remix";
import { redirect } from "remix";
import { deleteReservoirById } from "~/models/reservoir.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id") as string
  return deleteReservoirById(id);
};

export const loader: LoaderFunction = async () => {
  return redirect("/client/reservoirs");
};