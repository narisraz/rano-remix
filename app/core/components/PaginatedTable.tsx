import { Table, TableContainer, TablePagination, TableProps } from "@mui/material"
import { useState } from "react";


interface PaginatedTableProps extends TableProps {
  count: number
}

export const PaginatedTable = ({ children, count }: PaginatedTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <TableContainer>
      <Table size="small" sx={{ width: "100%" }}>
        {children}
      </Table>
      {count > 10 &&
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage="Ligne par page"
          labelDisplayedRows={(from) => (`${from.from}-${from.to === -1 ? from.count : from.to} sur ${from.count}`)}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      }
    </TableContainer>
  )
}