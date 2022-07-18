import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import PeopleIcon from '@mui/icons-material/People';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import WaterIcon from '@mui/icons-material/Water';
import { Box, Collapse, Divider, IconButton, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Site, User } from '@prisma/client';
import { useEffect, useState } from "react";
import { ActionFunction, createCookie, LoaderFunction, Outlet, redirect, useFetcher, useLoaderData, useLocation } from "remix";
import theme from 'src/theme';
import { AppBar } from '~/core/components/AppBar';
import { AppDrawer, DrawerHeader } from '~/core/components/AppDrawer';
import AppToolbar from '~/core/components/AppToolbar';
import { getSitesByClientId } from '~/models/site.server';
import { getUser } from "~/session.server";
import { pageNotFound } from '~/utils';


interface MenuItem {
  label: string
  url?: string
  icon: any
  children?: MenuItem[]
  level: number
}

interface LoaderData {
  user: User
  sites: Site[]
  selectedSAEPId: Site["id"]
}

export const action: ActionFunction = async ({ request }) => {
  const cookie = createCookie("saep")
  const user = await getUser(request)

  if (!user)
    throw pageNotFound()

  const formData = await request.formData()
  const url = formData.get("url") as string
  const saep = formData.get("saep") as string

  return redirect(url, {
    headers: {
      "Set-Cookie": await cookie.serialize(saep)
    }
  })
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = createCookie("saep")
  const user = await getUser(request)

  if (user) {
    const cookieHeader = request.headers.get("Cookie")
    const selectedSAEPId = await cookie.parse(cookieHeader)

    const sites = await getSitesByClientId(user.clientId)

    return {
      user,
      sites,
      selectedSAEPId
    }
  }

  return {
    user
  }
};

export const ClientLayout = () => {
  const fetcher = useFetcher()
  const { user, sites, selectedSAEPId } = useLoaderData() as LoaderData
  const location = useLocation()
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const menu: MenuItem[] = [
    {
      url: '/client/dashboard',
      label: 'Tableau de bord',
      icon: <DashboardIcon />,
      level: 0
    }, {
      label: 'Administration',
      icon: <AdminPanelSettingsIcon />,
      level: 0,
      children: [
        {
          url: '/client/users',
          label: 'Utilisateurs',
          icon: <PeopleIcon />,
          level: 1
        }, {
          url: '/client/sites',
          label: 'SAEP',
          icon: <WaterIcon />,
          level: 1
        }, {
          label: 'Facturation',
          icon: <AccountBalanceIcon />,
          level: 1,
          children: [
            {
              url: '/client/tranches',
              label: 'Par tranches',
              icon: <FormatListNumberedIcon />,
              level: 2
            }
          ]
        }, {
          url: '/client/abonnees',
          label: 'Abonnées',
          icon: <ManageAccountsIcon />,
          level: 1
        }
      ]
    }, {
      url: '/client/releve',
      label: 'Relevé',
      icon: <NoteAltIcon />,
      level: 0
    }, {
      url: '/client/caisse',
      label: 'Encaissement',
      icon: <PointOfSaleIcon />,
      level: 0
    }
  ]

  const RenderMenuItem = (item: MenuItem, index: number) => {
    const [open, setOpen] = useState(false)
    const addExpandIcon = () => {
      if (item.children) {
        return open ? <ExpandLess /> : <ExpandMore />
      }
    }
    const isItemSelected = (url: string) => location.pathname.startsWith(url)

    useEffect(() => {
      if (item.children) {
        const selected = item.children.find(value => isItemSelected(value?.url ?? '$'))
        setOpen(selected != undefined)
      }
    }, [])

    return (
      <>
        <ListItemButton key={item?.url ?? ''} sx={[(item.level > 0) && { pl: item.level * 4 }]} component="a" href={item.url} selected={isItemSelected(item?.url ?? '$')} onClick={() => setOpen(!open)}>
          <ListItemIcon>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.label} />
          {addExpandIcon()}
        </ListItemButton>
        {item.children &&
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(RenderMenuItem)}
            </List>
          </Collapse>
        }
      </>
    )
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <AppToolbar drawerOpened={open} handleDrawerOpen={handleDrawerOpen} userProfileUrl={`/client/users/${user.id}`} sites={sites} fetcher={fetcher} selectedSAEPId={selectedSAEPId} />
      </AppBar>
      <AppDrawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menu.map(RenderMenuItem)}
        </List>
        <Divider />
      </AppDrawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  )
}

export default ClientLayout