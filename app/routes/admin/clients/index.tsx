import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, Collapse, IconButton, Paper, Table, TableBody, TableContainer, TableHead, Typography } from "@mui/material";
import { Address, Client, User } from '@prisma/client';
import { useState } from 'react';
import { LoaderFunction, MetaFunction, useLoaderData } from 'remix';
import { DeleteConfirmDialog } from '~/core/components/DeleteConfirmDialog';
import { StyledTableCell } from "~/core/components/StyledTableCell";
import { StyledTableRow } from "~/core/components/StyledTableRow";
import { getAddressById } from '~/models/address.server';
import { getAllClients } from '~/models/client.server';
import { getUsersByClientId, Role, roles } from '~/models/user.server';
import UserList from '~/user/UserList';


interface ClientData extends Client {
  address: Address
  users: User[]
  roles: Role[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const clients = await getAllClients()
  const allClientInfo = await Promise.all(clients.map(async (client) => {
    const users = await getUsersByClientId(client.id)
    const address = client.addressId ? await getAddressById(client.addressId) : {}
    return {
      ...client,
      address,
      users,
      roles
    }
  }))
  return allClientInfo
}

export const meta: MetaFunction = () => {
  return {
    title: 'Liste des clients'
  }
}

export default function ClientList() {
  const clients = useLoaderData() as ClientData[]

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" gutterBottom>
          Liste des clients ({clients.length})
        </Typography>
        <Button href={"/admin/client/new"} startIcon={<AddIcon />} variant={"contained"}>
          Nouveau client
        </Button>
      </Box>
      <Box sx={{ m: 2 }}></Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell>Nom</StyledTableCell>
              <StyledTableCell align="right">Téléphones</StyledTableCell>
              <StyledTableCell align="right">Email</StyledTableCell>
              <StyledTableCell align="right">Commune</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {clients.map(client =>
              <Row key={client.id} client={client} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

function Row(props: { client: ClientData }) {
  const { client } = props
  const [showEmployeeList, setShowEmployeeList] = useState(false)
  const [openDialog, setOpenDialog] = useState(false);

  const closeDialog = () => {
    setOpenDialog(false)
  }

  return <>
    <StyledTableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
      <StyledTableCell>
        <IconButton size="small" onClick={() => setShowEmployeeList(!showEmployeeList)}>
          {showEmployeeList ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </StyledTableCell>
      <StyledTableCell component="th" scope="row">
        {client.name}
      </StyledTableCell>
      <StyledTableCell align="right">{client.telephones}</StyledTableCell>
      <StyledTableCell align="right">{client.email}</StyledTableCell>
      <StyledTableCell align="right">{client.address?.commune}</StyledTableCell>
      <StyledTableCell align="center">
        <IconButton color={"success"} href={`/admin/client/${client.id}`}>
          <VisibilityIcon />
        </IconButton>
        <IconButton color={"warning"} href={`/admin/client/edit/${client.id}`}>
          <ModeEditIcon />
        </IconButton>
        <IconButton color={"error"} onClick={() => {
          setOpenDialog(true)
        }}>
          <DeleteIcon />
        </IconButton>
      </StyledTableCell>
    </StyledTableRow>
    <StyledTableRow>
      <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
        <DeleteConfirmDialog title={'Client'} open={openDialog} close={closeDialog} action={"/admin/clients/delete"} >
          <input type={"hidden"} value={client.id} name={"id"} />
        </DeleteConfirmDialog>
        <Collapse in={showEmployeeList} timeout="auto" unmountOnExit>
          <UserTable client={client} />
        </Collapse>
      </StyledTableCell>
    </StyledTableRow>
  </>;
}

function UserTable(props: { client: ClientData }) {
  const { client } = props
  return <Box sx={{ margin: 1 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography variant="h6" gutterBottom>
        {client.users.length
          ? `Liste des employés de ${client.name} (${client.users.length})`
          : `Pas encore d'employé pour ${client.name}`
        }
      </Typography>
      <Button href={`/admin/client/${client.id}/user/new`} startIcon={<AddIcon />} variant={"text"}>
        Nouvel employé
      </Button>
    </Box>
    {client.users.length > 0 &&
      <UserList clientId={client.id} users={client.users} roles={client.roles} />
    }
  </Box>;
}