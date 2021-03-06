import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, TableBody, TableHead } from "@mui/material";
import { User } from "@prisma/client";
import { useState } from "react";
import { DeleteConfirmDialog } from "~/core/components/DeleteConfirmDialog";
import { PaginatedTable } from "~/core/components/PaginatedTable";
import { StyledTableCell } from "~/core/components/StyledTableCell";
import { StyledTableRow } from "~/core/components/StyledTableRow";
import { Role } from "~/models/user.server";

interface UserListProps {
  baseUrl: string
  clientId: string
  users: User[]
  roles: Role[]
}

export default function UserList({ clientId, users, roles, baseUrl }: UserListProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>()

  const closeDialog = () => {
    setOpenDialog(false)
  }

  return (
    <PaginatedTable count={users.length}>
      <DeleteConfirmDialog title={'Employé'} open={openDialog} close={closeDialog} action={`${baseUrl}/users/delete`}>
        <input type={"hidden"} name={"id"} value={selectedUser?.id} />
      </DeleteConfirmDialog>
      <TableHead>
        <StyledTableRow>
          <StyledTableCell>Rôle</StyledTableCell>
          <StyledTableCell>Nom</StyledTableCell>
          <StyledTableCell>Prénom</StyledTableCell>
          <StyledTableCell>Email</StyledTableCell>
          <StyledTableCell>Activé</StyledTableCell>
          <StyledTableCell align="center">Actions</StyledTableCell>
        </StyledTableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <StyledTableRow key={user.email}>
            <StyledTableCell component="th" scope="row">
              {roles.find(e => e.id == user.role)?.label}
            </StyledTableCell>
            <StyledTableCell>{user.name}</StyledTableCell>
            <StyledTableCell>{user.firstName}</StyledTableCell>
            <StyledTableCell>{user.email}</StyledTableCell>
            <StyledTableCell>{user.active ? <CheckIcon color={"success"} /> : <CloseIcon color={"error"} />}</StyledTableCell>
            <StyledTableCell align="center">
              <IconButton color={"success"} href={`${baseUrl}/users/${user.id}`}>
                <VisibilityIcon />
              </IconButton>
              <IconButton color={"warning"} href={`${baseUrl}/users/${user.id}/update`}>
                <ModeEditIcon />
              </IconButton>
              <IconButton color={"error"} onClick={() => {
                setOpenDialog(true)
                setSelectedUser(user)
              }}>
                <DeleteIcon />
              </IconButton>
            </StyledTableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </PaginatedTable>
  )
}