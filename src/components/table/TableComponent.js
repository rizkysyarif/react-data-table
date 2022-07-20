import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import TableComponentHead from "../table/TableComponentHead";
import { Box, CircularProgress, Paper, TableContainer } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import TableToolbarComponent from "./TableToolbarComponent";
import { setPages, sortColumn } from "../../store/userSlice";

function TableComponent(props) {
  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);
  const { filter } = user;
  const { columns, title, data, options, isLoading, count } = props;
  const [selected, setSelected] = useState([]);
  const [page] = useState(0);
  const [rowsPerPage] = useState(10);
  const [order, setOrder] = useState("");
  const [orderBy, setOrderBy] = useState("");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    dispatch(
      sortColumn({
        sortDirection: isAsc ? "desc" : "asc",
        sortColumn: property,
      })
    );
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.login.uuid);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    dispatch(setPages({ page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(setPages({ limit: event.target.value }));
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableToolbarComponent numSelected={selected.length} title={title} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableComponentHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
              columns={columns}
              selection={options.selection}
            />
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                    colSpan={
                      options.selection ? columns.length + 1 : columns.length
                    }
                  >
                    <CircularProgress size="3rem" color="primary" />
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => {
                  const isItemSelected = isSelected(row.login.uuid);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.login.uuid)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                    >
                      {options.selection && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                      )}
                      {columns.map((cell, idx) => {
                        let split = cell.field.split(".");
                        return (
                          <TableCell key={idx}>
                            {cell.render
                              ? cell.render(row)
                              : typeof row[cell.field] === "boolean"
                              ? row[cell.field].toString()
                              : split.length === 2
                              ? row[split[0]][split[1]]
                              : row[cell.field]}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              )}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={count}
          rowsPerPage={filter.limit}
          page={filter.page - 1}
          backIconButtonProps={{
            "aria-label": "Previous Page",
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page",
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

export default TableComponent;
