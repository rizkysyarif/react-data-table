import "./App.css";
import TableComponent from "./components/table/TableComponent";
import {
  Alert,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { fetchData, resetFilter, setFilter } from "./store/userSlice";

function App() {
  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);
  const { data, loading, error } = user;
  const [gender, setGender] = useState("");
  const [keyword, setKeyword] = useState("");
  const columns = [
    {
      title: "Username",
      field: "login.username",
      sorting: true,
    },
    {
      title: "Name",
      field: "name.first",
      render: (rowData) => `${rowData.name.first} ${rowData.name.last}`,
      sorting: true,
    },
    {
      title: "Email",
      field: "email",
      sorting: true,
    },
    {
      title: "Gender",
      field: "gender",
      sorting: true,
    },
    {
      title: "Registered Date",
      field: "registered.date",
      render: (rowData) =>
        moment(rowData.registered.date).format("YYYY-MM-DD HH:mm"),
      sorting: true,
    },
  ];

  const handleChange = (event) => {
    dispatch(setFilter({ name: "gender", value: event.target.value }));
    setGender(event.target.value);
  };

  useEffect(() => {
    dispatch(fetchData());
  }, []);

  if (error) {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
  return (
    <Container>
      <Box className="p-12" mt={5}>
        {error && <Alert severity="error">{error.message}</Alert>}
        <Grid container spacing={1}>
          <Grid item xs={4} sm={3}>
            <TextField
              fullWidth
              id="keyword"
              label="Search"
              variant="outlined"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton
                    disabled={keyword === "" ? true : false}
                    onClick={() =>
                      dispatch(setFilter({ name: "keyword", value: keyword }))
                    }
                  >
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={4} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                label="Gender"
                value={gender}
                defaultValue=""
                onChange={handleChange}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={4}
            sm={3}
            sx={{
              alignSelf: "center",
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                setKeyword("");
                setGender("");
                dispatch(resetFilter());
              }}
            >
              Reset Filter
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box className="p-12">
        <TableComponent
          title="Data"
          columns={columns}
          data={data.results}
          count={20}
          isLoading={loading}
          options={{
            paging: true,
            selection: true,
          }}
          order="asc"
          orderBy="email"
        />
      </Box>
    </Container>
  );
}

export default App;
