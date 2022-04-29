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
  const [selectedSite, setSelectedSite] = useState<Site>()

  const closeDialog = () => {
    setOpenDialog(false)
  }

  const findAddress = (abonnee: Abonnee) => {
    return addresses.find(value => value.id == abonnee.addressId)
  }

  return (
    <>
      <PaginatedTable count={abonnees.length}>
        <DeleteConfirmDialog title={'SAEP'} open={openDialog} close={closeDialog} action={`${baseUrl}/site/delete`}>
          <input type={"hidden"} name={"id"} value={selectedSite?.id} />
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
                <IconButton color={"success"} href={`${baseUrl}/sites/${site.id}`}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton color={"warning"} href={`${baseUrl}/sites/${site.id}/update`}>
                  <ModeEditIcon />
                </IconButton>
                <IconButton color={"error"} onClick={() => {
                  setOpenDialog(true)
                  setSelectedSite(site)
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