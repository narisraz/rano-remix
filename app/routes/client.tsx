import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Box, Divider, IconButton, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React, { useState } from "react";
import { LoaderFunction, Outlet, redirect, useLoaderData, useLocation } from "remix";
import theme from 'src/theme';
import { AppBar } from '~/core/components/AppBar';
import { AppDrawer, DrawerHeader } from '~/core/components/AppDrawer';
import AppToolbar from '~/core/components/AppToolbar';
import { getUserById } from '~/models/user.server';
import { getUserId } from "~/session.server";


interface MenuItem {
  label: string
  url: string
  icon: any
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  return userId != undefined
};

export const ClientLayout = () => {
  const isConnected = useLoaderData()
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
      icon: <DashboardIcon />
    }, {
      url: '/client/users',
      label: 'Utilisateurs',
      icon: <DashboardIcon />
    }, {
      url: '/client/sites',
      label: 'Sites',
      icon: <DashboardIcon />
    }, {
      url: '/client/releve',
      label: 'Relevé',
      icon: <DashboardIcon />
    }, {
      url: '/client/caisse',
      label: 'Encaissement',
      icon: <DashboardIcon />
    }
  ]

  return (
    <>
      {isConnected && (
        <Box sx={{ display: 'flex' }}>
          <AppBar position="fixed" open={open}>
            <AppToolbar drawerOpened={open} handleDrawerOpen={handleDrawerOpen} />
          </AppBar>
          <AppDrawer variant="permanent" open={open}>
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              {menu.map((item, index) =>
                <ListItemButton key={index} component="a" href={item.url} selected={location.pathname.startsWith(item.url)}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              )}
            </List>
            <Divider />
          </AppDrawer>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <Outlet />
          </Box>
        </Box>
      )}
      {!isConnected && <Outlet />}
    </>

  )
}

export default ClientLayout