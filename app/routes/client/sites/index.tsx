import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Typography } from "@mui/material";
import { Address, Client, Site } from "@prisma/client";
import { LoaderFunction, redirect, useLoaderData } from "remix";
import { getAddressById } from '~/models/address.server';
import { getSitesByClientId } from '~/models/site.server';
import { getUser } from "~/session.server";
import SiteList from '~/site/components/SiteList';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)

  if (!user)
    return redirect("/client/login")

  const sites = await getSitesByClientId(user.clientId)

  const addresses = sites.map(site => {
    return getAddressById(site.addressId)
  })

  return {
    sites,
    clientId: user.clientId,
    addresses
  }
}

interface LoaderData {
  sites: Site[]
  clientId: Client["id"]
  addresses: Address[]
}

export default function SitesPage() {
  const { sites, clientId, addresses } = useLoaderData() as LoaderData

  return (
    <>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        mb: 2
      }}>
        <Typography variant="h6" gutterBottom>
          {sites.length
            ? `Liste des sites (${sites.length})`
            : `Vous n'avez pas encore enregistré de site`
          }
        </Typography>
        <Button href={`/client/sites/add`} startIcon={<AddIcon />} variant={"contained"}>
          Nouveau site
        </Button>
      </Box>
      <SiteList clientId={clientId} sites={sites} addresses={addresses} baseUrl="/client" />
    </>
  )
}