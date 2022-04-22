import AddIcon from "@mui/icons-material/Add"
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material"
import { Address, Reservoir } from "@prisma/client"
import { LoaderFunction, MetaFunction, useLoaderData } from "remix"
import { getAddressById } from "~/models/address.server"
import { getReservoirById } from "~/models/reservoir.server"
import { pageNotFound } from "~/utils"


interface LoaderData {
  reservoir: Reservoir
  address?: Address
}

export const loader: LoaderFunction = async ({ params }) => {
  const reservoirId = params.reservoirId

  if (!reservoirId)
    throw pageNotFound()

  const reservoir = await getReservoirById(reservoirId)

  if (!reservoir) {
    throw pageNotFound()
  }

  let address = undefined
  if (reservoir?.addressId) {
    address = await getAddressById(reservoir.addressId)
  }

  return {
    reservoir,
    address
  }
}

export const meta: MetaFunction = () => {
  return {
    title: 'Réservoir'
  }
}

export function userInfo() {
  const { reservoir, address } = useLoaderData() as LoaderData

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" gutterBottom>
          {reservoir?.label}
        </Typography>
        <Button href={`/client/reservoirs/${reservoir?.id}/update`} startIcon={<AddIcon />} variant={"contained"}>
          Editer
        </Button>
      </Box>
      <Box sx={{ m: 2 }}></Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Libellé</TableCell>
              <TableCell>{reservoir?.label}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Volume</TableCell>
              <TableCell>{reservoir?.volume ?? 0} Litres</TableCell>
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
              <TableCell sx={{ fontWeight: "bold" }}>Fokontany</TableCell>
              <TableCell>{address?.fokontany ?? '-'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default userInfo