import AddIcon from "@mui/icons-material/Add"
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material"
import { Address, Client, Site } from "@prisma/client"
import { LoaderFunction, MetaFunction, useLoaderData } from "remix"
import { getAddressById } from "~/models/address.server"
import { getClientById } from "~/models/client.server"
import { getSiteById } from "~/models/site.server"
import { pageNotFound } from "~/utils"


interface LoaderData {
  client: Client
  site: Site
  address?: Address
}

export const loader: LoaderFunction = async ({ params }) => {
  const siteId = params.siteId

  if (!siteId)
    throw pageNotFound()

  const site = await getSiteById(siteId)

  if (!site)
    throw pageNotFound()

  const client = await getClientById(site.clientId)

  let address = undefined
  if (site?.addressId) {
    address = await getAddressById(site.addressId)
  }

  return {
    client,
    site,
    address
  }
}

export const meta: MetaFunction = () => {
  return {
    title: 'SAEP'
  }
}

export function SaepInfo() {
  const { client, site, address } = useLoaderData() as LoaderData

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" gutterBottom>
          {client?.name}
        </Typography>
        <Button href={`/client/sites/${site?.id}/update`} startIcon={<AddIcon />} variant={"contained"}>
          Editer
        </Button>
      </Box>
      <Box sx={{ m: 2 }}></Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nom</TableCell>
              <TableCell>{site?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Téléphones</TableCell>
              <TableCell>{site?.telephones ?? '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Région</TableCell>
              <TableCell>{address?.region ?? '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Commune</TableCell>
              <TableCell>{address?.commune ?? '-'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default SaepInfo