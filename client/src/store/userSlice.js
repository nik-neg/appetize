import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiClient from '../services/ApiClient';

const initialState = {
  userData: {},
  loading: false,
};

export const fetchUserDataFromDB = createAsyncThunk(
  'userData/fetchData',
  async (input) => {
    const response =  await ApiClient.loginUser(input);
    return response;
  }
);

export const createUserAndSafeToDB = createAsyncThunk(
  'userData/createUser',
  async (input) => {
    const response =  await ApiClient.registerUser(input);
    return response;
  }
);

export const userSlice = createSlice({
  name: 'userData',
  initialState,
  extraReducers: {
    [fetchUserDataFromDB.fulfilled]: (state, action) => {
      state.userData = action.payload;
      state.loading = false;
    },
    // eslint-disable-next-line no-unused-vars
    [fetchUserDataFromDB.pending]: (state, action) => {
      state.loading = true;
    }
  }
});
