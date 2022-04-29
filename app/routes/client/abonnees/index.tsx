import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Typography } from "@mui/material";
import { Abonnee, Address, Site } from "@prisma/client";
import { createCookie, LoaderFunction, MetaFunction, useLoaderData } from "remix";
import AbonneeList from '~/abonnee/AbonneeList';
import { getAbonneesBySiteId } from '~/models/abonnee.server';
import { getAddressById } from '~/models/address.server';
import { getSiteById } from '~/models/site.server';
import { getUser } from "~/session.server";
import { pageNotFound } from '~/utils';


export const meta: MetaFunction = () => {
  return {
    title: 'Abonnées'
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)

  if (!user)
    throw pageNotFound()

  const cookie = createCookie("saep")
  const cookieHeader = request.headers.get("Cookie")
  const selectedSAEPId = await cookie.parse(cookieHeader)

  const site = await getSiteById(selectedSAEPId)

  if (!site) {
    throw pageNotFound()
  }

  const abonnees = await getAbonneesBySiteId(selectedSAEPId)

  const addresses = await Promise.all(abonnees.map(async abonnee => {
    return await getAddressById(abonnee.addressId)
  }))

  return {
    site,
    abonnees,
    addresses
  }
}

interface LoaderData {
  site: Site
  abonnees: Abonnee[]
  addresses: Address[]
}

export default function AbonneesPage() {
  const { site, abonnees, addresses } = useLoaderData() as LoaderData

  return (
    <>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        mb: 2
      }}>
        <Typography variant="h6" gutterBottom>
          {abonnees.length
            ? `Liste des abonnées (${abonnees.length}) - ${site.name}`
            : `Vous n'avez pas encore enregistré d'abonnée`
          }
        </Typography>
        <Button href={`/client/abonnees/add`} startIcon={<AddIcon />} variant={"contained"}>
          Nouvelle abonnée
        </Button>
      </Box>
      <AbonneeList site={site} abonnees={abonnees} addresses={addresses} baseUrl="/client" />
    </>
  )
}