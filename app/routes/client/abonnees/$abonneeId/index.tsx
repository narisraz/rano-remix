import AddIcon from "@mui/icons-material/Add"
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material"
import { Abonnee, Address } from "@prisma/client"
import moment from "moment"
import { LoaderFunction, MetaFunction, useLoaderData } from "remix"
import { AbonneeType, abonneeTypes, getAbonneeById } from "~/models/abonnee.server"
import { getAddressById } from "~/models/address.server"
import { pageNotFound } from "~/utils"


interface LoaderData {
  abonnee: Abonnee
  address?: Address
  abonneeTypes: AbonneeType[]
  contractDate: string
}

export const loader: LoaderFunction = async ({ params }) => {
  const abonneeId = params.abonneeId

  if (!abonneeId)
    throw pageNotFound()

  const abonnee = await getAbonneeById(abonneeId)

  let address = undefined
  if (abonnee?.addressId) {
    address = await getAddressById(abonnee.addressId)
  }

  return {
    abonnee,
    contractDate: moment(abonnee?.contractDate).locale("fr").format("L"),
    address,
    abonneeTypes
  }
}

export const meta: MetaFunction = () => {
  return {
    title: 'Abonnée'
  }
}

export function AbonneeInfo() {
  const { abonnee, contractDate, address, abonneeTypes } = useLoaderData() as LoaderData

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" gutterBottom>
          {`${abonnee?.name} ${abonnee.firstName}`}
        </Typography>
        <Button href={`/client/abonnees/${abonnee?.id}/update`} startIcon={<AddIcon />} variant={"contained"}>
          Editer
        </Button>
      </Box>
      <Box sx={{ m: 2 }}></Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nom</TableCell>
              <TableCell>{abonnee?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Prénom</TableCell>
              <TableCell>{abonnee?.firstName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Téléphones</TableCell>
              <TableCell>{abonnee?.telephones ?? '-'}</TableCell>
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
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Lot</TableCell>
              <TableCell>{address?.lot ?? '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Date d'abonnement</TableCell>
              <TableCell>{contractDate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Type de contrat</TableCell>
              <TableCell>{abonneeTypes.find(type => abonnee.abonneeTypeId == type.id)?.label}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default AbonneeInfo