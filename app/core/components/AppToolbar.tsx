import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, Divider, IconButton, Menu, MenuItem, SelectChangeEvent, Toolbar, Typography } from "@mui/material";
import { Site } from "@prisma/client";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form } from "remix";
import { LabeledSelectField } from "./LabeledSelectField";


interface AppToolbarProps {
  drawerOpened: boolean
  handleDrawerOpen: () => void,
  userProfileUrl: string,
  sites?: Site[],
  fetcher: any,
  selectedSAEPId?: Site["id"]
}

export default function AppToolbar({ drawerOpened, handleDrawerOpen, userProfileUrl, sites, fetcher, selectedSAEPId }: AppToolbarProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedSAEP, setSelectedSAEP] = useState(selectedSAEPId ?? '')

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleChange(event: SelectChangeEvent<string>) {
    setSelectedSAEP(event.target.value)
    fetcher.submit(
      {
        saep: event.target.value,
        url: location.pathname
      },
      {
        method: "post",
        action: "/client"
      }
    )
  }

  return (
    <>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerOpen}
          sx={{
            marginRight: '36px',
            ...(drawerOpened && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >

          <Typography variant="subtitle2" sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: "center"
          }}>
            BLUETOUCH MG
          </Typography>
          <Box
            sx={{
              display: 'flex'
            }}
          >
            {sites &&
              <fetcher.Form method="post" action="/client">
                <LabeledSelectField value={selectedSAEP} onChange={handleChange} name="saep" label="SAEP" items={sites?.map(site => ({ id: site.id, label: site.name }))} initialValue={selectedSAEP} sx={{ minWidth: "100px" }} color="secondary"></LabeledSelectField>
              </fetcher.Form>
            }
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={Link} to={userProfileUrl} onClick={handleClose}>Mon compte</MenuItem>
            <Divider />
            <MenuItem>
              <Form method="post" action="/logout">
                <Button type="submit">Se déconnecter</Button>
              </Form>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </>
  )
}