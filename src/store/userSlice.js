import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const nameSlice = "user";

export const setPages = (data) => (dispatch, getState) => {
  let filter = getState().user.filter;
  if (data.page) {
    filter = {
      ...filter,
      page: data.page,
    };
  }
  if (data.limit) {
    filter = {
      ...filter,
      limit: data.limit,
      page: 1,
    };
  }

  dispatch(updateData({ filter }));
  dispatch(fetchData());
};

export const setFilter = (data) => (dispatch, getState) => {
  let filter = getState().user.filter;

  filter = {
    ...filter,
    column: [...filter.column, data],
  };
  dispatch(updateData({ filter }));
  dispatch(fetchData());
};

export const resetFilter = () => (dispatch, getState) => {
  let filter = getState().user.filter;
  filter = {
    ...filter,
    column: [],
  };

  dispatch(updateData({ filter }));
  dispatch(fetchData());
};

export const sortColumn = (data) => (dispatch, getState) => {
  let filter = getState().user.filter;

  dispatch(
    updateData({
      filter: {
        ...filter,
        ...data,
      },
    })
  );
  dispatch(fetchData());
};

export const fetchData = createAsyncThunk(
  `${nameSlice}/fetchData`,
  async (data, { getState }) => {
    const { filter } = getState().user;
    const endPoint = "https://randomuser.me/api/";

    let filterPage = `?page=${filter.page}&pageSize=10&results=${filter.limit}`;
    let filterOrder = `&sortBy=${filter.sortColumn}&sortOrder=${
      filter.sortDirection === "asc" ? "ascend" : "descend"
    }`;
    let filterColumn = "";

    filter.column.forEach((item) => {
      if (item.value !== "") {
        filterColumn += `&${item.name}=${item.value}`;
      }
    });
    const res = await axios.get(
      `${endPoint}${filterPage}${filterOrder}${filterColumn}`
    );
    return res.data;
  }
);

const initialState = {
  loading: false,
  data: {
    info: {},
    results: [],
  },
  error: null,
  filter: {
    page: 1,
    limit: 10,
    column: [],
    sortColumn: "",
    sortDirection: "",
  },
};

export const userSlice = createSlice({
  name: nameSlice,
  initialState,
  reducers: {
    updateData: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: {
    [fetchData.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchData.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    [fetchData.rejected]: (state, action) => {
      state.error = action.error;
      state.loading = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateData } = userSlice.actions;

export default userSlice.reducer;
