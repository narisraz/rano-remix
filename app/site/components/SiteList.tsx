import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, Table, TableBody, TableHead } from "@mui/material";
import { Address, Site } from "@prisma/client";
import { useState } from "react";
import { DeleteConfirmDialog } from "~/core/components/DeleteConfirmDialog";
import { StyledTableCell } from "~/core/components/StyledTableCell";
import { StyledTableRow } from "~/core/components/StyledTableRow";


interface SiteListProps {
  baseUrl: string
  clientId: string
  sites: Site[]
  addresses: Address[]
}

export default function SiteList({ clientId, sites, addresses, baseUrl }: SiteListProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site>()

  const closeDialog = () => {
    setOpenDialog(false)
  }

  const findAddress = (site: Site) => {
    return addresses.find(value => value.id == site.addressId)
  }

  return (
    <Table size="small" sx={{ width: "100%" }}>
      <DeleteConfirmDialog title={'Employé'} open={openDialog} close={closeDialog} action={`${baseUrl}/users/delete`}>
        <input type={"hidden"} name={"id"} value={selectedSite?.id} />
      </DeleteConfirmDialog>
      <TableHead>
        <StyledTableRow>
          <StyledTableCell>Nom</StyledTableCell>
          <StyledTableCell align="right">Téléphones</StyledTableCell>
          <StyledTableCell align="right">Commune</StyledTableCell>
          <StyledTableCell align="center">Actions</StyledTableCell>
        </StyledTableRow>
      </TableHead>
      <TableBody>
        {sites.map((site) => (
          <StyledTableRow key={site.id}>
            <StyledTableCell>{site.name}</StyledTableCell>
            <StyledTableCell align="right">{site.telephones}</StyledTableCell>
            <StyledTableCell align="right">{findAddress(site)?.commune ?? '-'}</StyledTableCell>
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
    </Table>
  )
}