import React, { useState, useEffect } from "react";
import { useTable, useSortBy, usePagination, useFilters } from "react-table";
import { format, parseISO } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
  },
  searchInput: {
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(4),
    marginTop: theme.spacing(2),
    minWidth: 300,
  },
  tableContainer: {
    maxWidth: "80%",
    margin: "auto",
  },
  tableHeaderCell: {
    backgroundColor: theme.palette.primary.main, // Change to your desired header color
    color: theme.palette.common.white, // Change to your desired text color
    fontWeight: "bold",
  },
  tableCell: {
    color: theme.palette.common.black, // Change to your desired text color
    fontWeight: "semibold",
    transition: "background-color 0.3s", // Add a smooth transition effect
    "&:hover": {
      backgroundColor: theme.palette.primary.light, // Change to your desired hover color
      color: theme.palette.common.white, // Change to your desired text color
    },
  },
  pagination: {
    marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
  },
}));

function Customers() {
  const classes = useStyles();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchCutomers = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/customers/?" +
          "filterName=" +
          filterName +
          "&filterLocation=" +
          filterLocation,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      data.forEach((customer) => {
        const dateTime = parseISO(customer.created_at);
        customer.date = format(dateTime, "yyyy-MM-dd");
        customer.time = format(dateTime, "HH:mm:ss");
      });
      setCustomers(data);
      setLoading(false); // Data fetching completed
    } catch (error) {
      console.error("Error:", error);
      setError(error);
      setLoading(false); // Data fetching failed
    }
  };

  useEffect(() => {
    fetchCutomers();
  }, [filterName, filterLocation]);

  const data = React.useMemo(() => customers, [customers]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "customer_name",
      },
      {
        Header: "Age",
        accessor: "age",
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
      {
        Header: "Location",
        accessor: "location",
      },
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Time",
        accessor: "time",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
    setFilter,
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 20 } },
    useFilters,
    useSortBy,
    usePagination
  );

  const handleFilterNameChange = (e) => {
    const value = e.target.value;
    setFilterName(value);
  };

  const handleFilterLocationChange = (e) => {
    const value = e.target.value;
    setFilterLocation(value);
  };

  return (
    <div className={classes.root}>
      {loading && (
        <center>
          <CircularProgress></CircularProgress>
        </center>
      )}
      {error && <p>Error: {error.message}</p>}
      <div>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <span>
            <TextField
              className={classes.searchInput}
              value={filterName}
              onChange={handleFilterNameChange}
              variant="outlined"
              placeholder={"Search by name"}
              label="Search by name"
            />
          </span>
          <span>
            <TextField
              className={classes.searchInput}
              value={filterLocation}
              onChange={handleFilterLocationChange}
              variant="outlined"
              placeholder={"Search by location"}
              label="Search by location"
            />
          </span>
          <Table {...getTableProps()}>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <TableCell
                      className={classes.tableHeaderCell}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <TableCell
                          className={classes.tableCell}
                          {...cell.getCellProps()}
                        >
                          {cell.render("Cell")}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <div className={classes.pagination}>
          <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </Button>{" "}
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </Button>{" "}
          <Button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </Button>{" "}
          <Button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </Button>{" "}
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Customers;
