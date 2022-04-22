import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Typography } from "@mui/material";
import { Address, Client, Reservoir } from "@prisma/client";
import { LoaderFunction, MetaFunction, redirect, useLoaderData } from "remix";
import { getAddressById } from '~/models/address.server';
import { getReservoirsByClientId } from "~/models/reservoir.server";
import ReservoirList from '~/reservoir/components/ReservoirList';
import { getUser } from "~/session.server";


export const meta: MetaFunction = () => {
  return {
    title: 'Liste des réservoirs'
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)

  if (!user)
    return redirect("/client/login")

  const reservoirs = await getReservoirsByClientId(user.clientId)

  const addresses = await Promise.all(reservoirs.map(async reservoir => {
    return await getAddressById(reservoir.addressId)
  }))

  return {
    reservoirs,
    clientId: user.clientId,
    addresses
  }
}

interface LoaderData {
  reservoirs: Reservoir[]
  clientId: Client["id"]
  addresses: Address[]
}

export default function SitesPage() {
  const { reservoirs, clientId, addresses } = useLoaderData() as LoaderData

  return (
    <>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        mb: 2
      }}>
        <Typography variant="h6" gutterBottom>
          {reservoirs.length
            ? `Liste des réservoirs (${reservoirs.length})`
            : `Vous n'avez pas encore enregistré de réservoir`
          }
        </Typography>
        <Button href={`/client/reservoirs/add`} startIcon={<AddIcon />} variant={"contained"}>
          Nouveau réservoir
        </Button>
      </Box>
      <ReservoirList addresses={addresses} reservoirs={reservoirs} baseUrl="/client" />
    </>
  )
}