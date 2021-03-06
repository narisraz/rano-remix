import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Typography } from "@mui/material";
import { Address, Client, Site } from "@prisma/client";
import { LoaderFunction, MetaFunction, redirect, useLoaderData } from "remix";
import { getAddressById } from '~/models/address.server';
import { getSitesByClientId } from '~/models/site.server';
import { getUser } from "~/session.server";
import SiteList from '~/site/components/SiteList';


export const meta: MetaFunction = () => {
  return {
    title: 'SAEP'
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)

  if (!user)
    return redirect("/login")

  const sites = await getSitesByClientId(user.clientId)

  const addresses = await Promise.all(sites.map(async site => {
    return await getAddressById(site.addressId)
  }))

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
            ? `Liste des SAEP (${sites.length})`
            : `Vous n'avez pas encore enregistrĂ© de SAEP`
          }
        </Typography>
        <Button href={`/client/sites/add`} startIcon={<AddIcon />} variant={"contained"}>
          Nouveau SAEP
        </Button>
      </Box>
      <SiteList clientId={clientId} sites={sites} addresses={addresses} baseUrl="/client" />
    </>
  )
}