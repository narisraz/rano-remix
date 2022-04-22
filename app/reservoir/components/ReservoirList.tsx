import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Checkbox, IconButton, Table, TableBody, TableHead } from "@mui/material";
import { Address, Reservoir } from "@prisma/client";
import { useState } from "react";
import { DeleteConfirmDialog } from "~/core/components/DeleteConfirmDialog";
import { StyledTableCell } from "~/core/components/StyledTableCell";
import { StyledTableRow } from "~/core/components/StyledTableRow";


interface ReservoirListProps {
  baseUrl: string
  reservoirs: Reservoir[]
  addresses: Address[]
  withCheckbox?: boolean
  checkedElements?: string[]
}

export default function ReservoirList({ reservoirs, addresses, withCheckbox, checkedElements, baseUrl }: ReservoirListProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReservoir, setSelectedReservoir] = useState<Reservoir>()

  const closeDialog = () => {
    setOpenDialog(false)
  }

  const findAddress = (reservoir: Reservoir) => {
    return addresses.find(value => value.id == reservoir.addressId)
  }

  return (
    <Table size="small" sx={{ width: "100%" }}>
      <DeleteConfirmDialog title={'Employé'} open={openDialog} close={closeDialog} action={`${baseUrl}/reservoirs/delete`}>
        <input type={"hidden"} name={"id"} value={selectedReservoir?.id} />
      </DeleteConfirmDialog>
      <TableHead>
        <StyledTableRow>
          {withCheckbox &&
            <StyledTableCell></StyledTableCell>
          }
          <StyledTableCell>Libellé</StyledTableCell>
          <StyledTableCell align="right">Volume</StyledTableCell>
          <StyledTableCell align="right">Commune</StyledTableCell>
          <StyledTableCell align="center">Actions</StyledTableCell>
        </StyledTableRow>
      </TableHead>
      <TableBody>
        {reservoirs.map((reservoir) => (
          <StyledTableRow key={reservoir.id}>
            {withCheckbox &&
              <StyledTableCell>
                <Checkbox
                  name={`reservoir-${reservoir.id}`}
                  checked={checkedElements?.indexOf(reservoir.id) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': reservoir.id,
                  }}
                />
              </StyledTableCell>
            }
            <StyledTableCell>{reservoir.label}</StyledTableCell>
            <StyledTableCell align="right">{reservoir.volume} Litres</StyledTableCell>
            <StyledTableCell align="right">{findAddress(reservoir)?.commune ?? '-'}</StyledTableCell>
            <StyledTableCell align="center">
              <IconButton color={"success"} href={`${baseUrl}/reservoirs/${reservoir.id}`}>
                <VisibilityIcon />
              </IconButton>
              <IconButton color={"warning"} href={`${baseUrl}/reservoirs/${reservoir.id}/update`}>
                <ModeEditIcon />
              </IconButton>
              <IconButton color={"error"} onClick={() => {
                setOpenDialog(true)
                setSelectedReservoir(reservoir)
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