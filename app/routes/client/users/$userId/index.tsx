import AddIcon from "@mui/icons-material/Add"
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material"
import { Address, Client, User } from "@prisma/client"
import { LoaderFunction, MetaFunction, useLoaderData } from "remix"
import { getAddressById } from "~/models/address.server"
import { getClientById } from "~/models/client.server"
import { getUserById, Role, roles } from "~/models/user.server"
import { pageNotFound } from "~/utils"


interface LoaderData {
  client: Client
  user: User
  roles: Role[]
  address?: Address
}

export const loader: LoaderFunction = async ({ params }) => {
  const userId = params.userId

  if (!userId)
    throw pageNotFound()

  const user = await getUserById(userId)

  if (!user) {
    throw pageNotFound()
  }

  let address = undefined
  if (user?.addressId) {
    address = await getAddressById(user.addressId)
  }

  if (!user)
    throw pageNotFound()

  const client = await getClientById(user.clientId)

  return {
    client,
    user,
    address,
    roles
  }
}

export const meta: MetaFunction = () => {
  return {
    title: 'Utilisateur'
  }
}

export function userInfo() {
  const { client, user, address, roles } = useLoaderData() as LoaderData

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" gutterBottom>
          {client?.name}
        </Typography>
        <Button href={`/client/users/${user?.id}/update`} startIcon={<AddIcon />} variant={"contained"}>
          Editer
        </Button>
      </Box>
      <Box sx={{ m: 2 }}></Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Rôle</TableCell>
              <TableCell>{roles.find(e => e.id == user.role)?.label}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nom</TableCell>
              <TableCell>{user?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Prénom</TableCell>
              <TableCell>{user?.firstName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Région</TableCell>
              <TableCell>{address?.region ?? '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Commune</TableCell>
              <TableCell>{address?.commune ?? '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Lot</TableCell>
              <TableCell>{address?.lot} - {address?.fokontany}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Téléphones</TableCell>
              <TableCell>{user?.telephones ?? '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell>{user?.email}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default userInfo