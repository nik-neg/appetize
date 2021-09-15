import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiClient from '../services/ApiClient';
import apiServiceJWT from '../services/ApiClientJWT';

const initialState = {
  userData: {},
  dishesInRadius: [],
  pageNumber: 1,
  chosenImageDate: '',
  loading: false,
  isAuthenticated: false,
};

export const fetchUserDataFromDB = createAsyncThunk(
  'userData/fetchUserDataFromDB',
  async (input) => {
    const response =  await apiServiceJWT.loginUser(input);
    return response;
  }
);

export const createUserAndSafeToDB = createAsyncThunk(
  'userData/createUser',
  async (input) => {
    const response  = await apiServiceJWT.register(input);
    return response;
  }
);

export const updateUserZipCode = createAsyncThunk(
  'userData/updateUserZipCode',
  async ({id, zipCode}) => {
    const response =  await ApiClient.confirmZipCode(id, { zipCode });
    return response;
  }
);

export const clearDishesInStore = createAsyncThunk(
  'userData/clearDishesInStore',
  async () => {
    return [];
  }
);

export const getDishesInRadius = createAsyncThunk(
  'userData/getDishesInRadius',
  async ({ id, radius, cookedOrdered }) => {
    const response =  await ApiClient.getDishesInRadius(id, radius, cookedOrdered);
    return response;
  }
);

export const uploadImageBeforePublish = createAsyncThunk(
  'userData/uploadImageBeforePublish',
  async ({ userId, file, chosenImageDate, imageURL}) => { // save newCreatedImageDate to created (buffered) image array of user
    const userData = await ApiClient.uploadImage(userId, file, chosenImageDate, imageURL);
    if (userData) {
      return { ...userData, chosenImageDate };
    } else {
      return { chosenImageDate };
    }
  }
);

export const logoutUser =  createAsyncThunk(
  'userData/logoutUser',
  async () => {
    await apiServiceJWT.logout();
    return initialState;
  }
);

export const deleteDish = createAsyncThunk(
  'userDate/deleteDish',
  async ({ userId, dishId }) => {
    await ApiClient.deleteDish(userId, dishId);
    return dishId;
  }
)

export const userSlice = createSlice({ // TODO: refactor to more slices?
  name: 'userData',
  initialState,
  extraReducers: {
    [createUserAndSafeToDB.fulfilled]: (state, action) => {
      const { user, accessToken } = action.payload;
      localStorage.setItem('accessToken', accessToken);
      state.userData = user;
      state.isAuthenticated = true;
      state.loading = false;
    },
    // eslint-disable-next-line no-unused-vars
    [createUserAndSafeToDB.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchUserDataFromDB.fulfilled]: (state, action) => {
      const { user, accessToken } = action.payload;
      localStorage.setItem('accessToken', accessToken);
      state.userData = user;
      state.isAuthenticated = true;
      state.loading = false;
    },
    // eslint-disable-next-line no-unused-vars
    [fetchUserDataFromDB.pending]: (state, action) => {
      state.loading = true;
    },
    [updateUserZipCode.fulfilled]: (state, action) => {
      state.userData = action.payload;
      state.loading = false;
    },
    // eslint-disable-next-line no-unused-vars
    [updateUserZipCode.pending]: (state, action) => {
      state.loading = true;
    },
    [getDishesInRadius.fulfilled]: (state, action) => {
      state.dishesInRadius = action.payload;
      const filteredUserDishes = [...action.payload.filter((dish) => dish.userID == state.userData._id)]
      state.userData.dailyFood = filteredUserDishes.map((filteredDish) => filteredDish._id)
      state.loading = false;
    },
    // eslint-disable-next-line no-unused-vars
    [getDishesInRadius.pending]: (state, action) => {
      state.loading = true;
    },
    [clearDishesInStore.fulfilled]: (state, action) => {
      state.dishesInRadius = action.payload;
      state.loading = false;
    },
    // eslint-disable-next-line no-unused-vars
    [clearDishesInStore.pending]: (state, action) => {
      state.loading = true;
    },
    [uploadImageBeforePublish.fulfilled]: (state, action) => {
      const { userData, chosenImageDate } = action.payload;
      if (userData) state.userData = userData;
      if (chosenImageDate) state.chosenImageDate = chosenImageDate;
      state.loading = false;
    },
    // eslint-disable-next-line no-unused-vars
    [uploadImageBeforePublish.pending]: (state, action) => {
      state.loading = true;
    },
    [logoutUser.fulfilled]: (state, action) => { // TODO: refactor?
      state.isAuthenticated = false;
      state.userData = action.payload.userData;
      state.dishesInRadius = [];
      state.chosenImageDate = '';
      state.loading = false;
    },
    // eslint-disable-next-line no-unused-vars
    [logoutUser.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteDish.fulfilled]: (state, action) => {
      state.dishesInRadius = state.dishesInRadius.filter((dailyTreat) => dailyTreat._id !== action.payload);
      state.loading = false;
    },
    // eslint-disable-next-line no-unused-vars
    [deleteDish.pending]: (state, action) => {
      state.loading = true;
    },
  }
});
