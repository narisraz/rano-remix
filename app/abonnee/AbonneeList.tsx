import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, TableBody, TableHead } from "@mui/material";
import { Abonnee, Address, Site } from "@prisma/client";
import { useState } from "react";
import { DeleteConfirmDialog } from "~/core/components/DeleteConfirmDialog";
import { PaginatedTable } from "~/core/components/PaginatedTable";
import { StyledTableCell } from "~/core/components/StyledTableCell";
import { StyledTableRow } from "~/core/components/StyledTableRow";


interface AbonneeListProps {
  baseUrl: string
  site: Site
  abonnees: Abonnee[]
  addresses: Address[]
}

export default function AbonneeList({ abonnees, site, addresses, baseUrl }: AbonneeListProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAbonnee, setSelectedAbonnee] = useState<Abonnee>()

  const closeDialog = () => {
    setOpenDialog(false)
  }

  const findAddress = (abonnee: Abonnee) => {
    return addresses.find(value => value.id == abonnee.addressId)
  }

  return (
    <>
      <PaginatedTable count={abonnees.length}>
        <DeleteConfirmDialog title={'Abonnée'} open={openDialog} close={closeDialog} action={`${baseUrl}/abonnees/delete`}>
          <input type={"hidden"} name={"id"} value={selectedAbonnee?.id} />
        </DeleteConfirmDialog>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Nom</StyledTableCell>
            <StyledTableCell>Prénom</StyledTableCell>
            <StyledTableCell align="right">Téléphones</StyledTableCell>
            <StyledTableCell align="right">Commune</StyledTableCell>
            <StyledTableCell align="right">Lot</StyledTableCell>
            <StyledTableCell align="center">Actions</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {abonnees.map((abonnee) => (
            <StyledTableRow key={site.id}>
              <StyledTableCell>{abonnee.name}</StyledTableCell>
              <StyledTableCell>{abonnee.firstName}</StyledTableCell>
              <StyledTableCell align="right">{abonnee.telephones}</StyledTableCell>
              <StyledTableCell align="right">{findAddress(abonnee)?.commune ?? '-'}</StyledTableCell>
              <StyledTableCell align="right">{findAddress(abonnee)?.lot ?? '-'}</StyledTableCell>
              <StyledTableCell align="center">
                <IconButton color={"success"} href={`${baseUrl}/abonnees/${abonnee.id}`}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton color={"warning"} href={`${baseUrl}/abonnees/${abonnee.id}/update`}>
                  <ModeEditIcon />
                </IconButton>
                <IconButton color={"error"} onClick={() => {
                  setOpenDialog(true)
                  setSelectedAbonnee(abonnee)
                }}>
                  <DeleteIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </PaginatedTable>
    </>
  )
}