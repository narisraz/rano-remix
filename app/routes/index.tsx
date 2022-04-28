import { LoaderFunction, redirect } from "remix";
import { getUserById, ROLE } from "~/models/user.server";
import { getUserId } from "~/session.server";


export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request)

  if (userId) {
    const user = await getUserById(userId)
    if (user) {
      switch (user.role) {
        case ROLE.SUPER_ADMIN:
          return redirect("/admin/clients")
        case ROLE.CAISSIER:
          return redirect("/client/caisse")
        case ROLE.ADMINISTRATOR:
          return redirect("/client/dashboard")
        case ROLE.RELEVEUR:
          return redirect("/client/releve")
        default:
          break;
      }
    }
  }

  return redirect("/login")
}