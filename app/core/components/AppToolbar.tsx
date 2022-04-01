import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { Button, IconButton, Menu, MenuItem, Toolbar } from "@mui/material";
import React from "react";
import { Form, useLoaderData } from "remix";


interface AppToolbarProps {
  drawerOpened: boolean
  handleDrawerOpen: () => void
}

export default function AppToolbar({ drawerOpened, handleDrawerOpen }: AppToolbarProps) {
  const currentUrl = useLoaderData()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        <div>
          <IconButton
            size="large"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
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
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem>
              <Form method="post" action="/logout">
                <Button type="submit">Se déconnecter</Button>
              </Form>
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </>
  )
}