import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Typography } from "@mui/material";
import { Client, User } from "@prisma/client";
import { LoaderFunction, redirect, useLoaderData } from "remix";
import { getUsersByClientId, Role, roles } from "~/models/user.server";
import { getUser } from "~/session.server";
import UserList from "~/user/components/UserList";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)

  if (!user)
    return redirect("/client/login")

  const users = await getUsersByClientId(user.clientId)

  return {
    users,
    clientId: user.clientId,
    roles
  }
}

interface LoaderData {
  users: User[]
  clientId: Client["id"]
  roles: Role[]
}

export default function UsersPage() {
  const { users, clientId, roles } = useLoaderData() as LoaderData

  return (
    <>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        mb: 2
      }}>
        <Typography variant="h6" gutterBottom>
          {users.length
            ? `Liste des employés (${users.length})`
            : `Vous n'avez pas encore enregistré d'employé`
          }
        </Typography>
        <Button href={`/client/users/add`} startIcon={<AddIcon />} variant={"contained"}>
          Nouvel employé
        </Button>
      </Box>
      <UserList clientId={clientId} roles={roles} users={users} />
    </>
  )
}