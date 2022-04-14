import AddIcon from "@mui/icons-material/Add"
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material"
import { Address, Client } from "@prisma/client"
import { LoaderFunction, MetaFunction, useLoaderData } from "remix"
import { getAddressById } from "~/models/address.server"
import { getClientById } from "~/models/client.server"
import { pageNotFound } from "~/utils"


interface LoaderData {
  client: Client,
  address?: Address
}

export const loader: LoaderFunction = async ({ params }) => {
  const clientId = params.clientId

  if (!clientId)
    throw pageNotFound()

  const client = await getClientById(clientId)

  if (!client)
    throw pageNotFound()

  let address = undefined
  if (client.addressId)
    address = await getAddressById(client.addressId)

  return {
    client,
    address
  }
}

export const meta: MetaFunction = () => {
  return {
    title: 'Client'
  }
}

export function clientInfo() {
  const { client, address } = useLoaderData() as LoaderData

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" gutterBottom>
          {client?.name}
        </Typography>
        <Button href={`/admin/client/edit/${client?.id}`} startIcon={<AddIcon />} variant={"contained"}>
          Editer
        </Button>
      </Box>
      <Box sx={{ m: 2 }}></Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableBody>
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
              <TableCell>{client?.telephones ?? '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell>{client?.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>NIF</TableCell>
              <TableCell>{client?.nif}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Stat</TableCell>
              <TableCell>{client?.stat}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default clientInfo