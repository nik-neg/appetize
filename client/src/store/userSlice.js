import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiClient from '../services/ApiClient';
import apiServiceJWT from '../services/ApiClientJWT';

const initialState = {
  userData: {},
  dishesInRadius: [],
  searchData: {
    pageNumber: 1,
    radius: 0,
    cookedOrdered: {
      cooked: true,
      ordered: true
    },
  },
  clearDishTextRequest: 0,
  newDishesRequest: 0,
  allDishesDeletedRequest: false,
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

export const clearDishesInStoreRequest = createAsyncThunk(
  'newDishesRequest/clearDishesInStoreRequest',
  async () => {
    return 1;
  }
);

export const getDishesInRadius = createAsyncThunk(
  'dishesInRadius/getDishesInRadius',
  async ({ id, radius, cookedOrdered, pageNumber}) => {
    const dishesInRadius =  await ApiClient.getDishesInRadius(id, radius, cookedOrdered, pageNumber);
    return { dishesInRadius, radius, cookedOrdered, pageNumber };
  }
);

export const uploadImageBeforePublish = createAsyncThunk(
  'userData/uploadImageBeforePublish',
  async ({ userId, file, chosenImageDate, imageURL}) => {
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
    const accessToken = localStorage.getItem('accessToken');
    await apiServiceJWT.logout(accessToken);
    return initialState;
  }
);

export const deleteDish = createAsyncThunk(
  'dishesInRadius/deleteDish',
  async ({ userId, dishId }) => {
    await ApiClient.deleteDish(userId, dishId);
    return dishId;
  }
);

export const upDownVote = createAsyncThunk(
  'dishesInRadius/upDownVote',
  async ({ voteID, dishID, vote }) => {
    const response =  await ApiClient.voteDish(voteID, dishID, vote);
    return response;
  }
);

export const clearDishTextRequest = createAsyncThunk(
  'state/clearDishTextRequest',
  async () => {
    return 1;
  }
);

export const allDishesDeletedRequest = createAsyncThunk(
  'state/allDishesDeletedRequest',
  async () => {
    return true;
  }
);

export const userSlice = createSlice({ // TODO: refactor to more slices?
  name: 'userData',
  initialState,
  extraReducers: {
    [createUserAndSafeToDB.fulfilled]: (state, action) => {
      const { user, accessToken, error, message } = action.payload;
      localStorage.setItem('accessToken', accessToken);
      if (user) {
        state.userData = user;
      } else {
        state.userData = {error, message};
      }
      state.isAuthenticated = true;
      state.loading = false;
    },
    // eslint-disable-next-line no-unused-vars
    [createUserAndSafeToDB.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchUserDataFromDB.fulfilled]: (state, action) => {
      const { user, accessToken, error, message } = action.payload;
      localStorage.setItem('accessToken', accessToken);
      if (user) {
        state.userData = user;
      } else {
        state.userData = {error, message};
      }
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
      const { dishesInRadius, radius, cookedOrdered, pageNumber } = action.payload;
      const newSearchData = { radius, cookedOrdered, pageNumber };
      if (dishesInRadius.length > 0) {
        state.dishesInRadius = dishesInRadius.sort((a,b) =>  b.votes - a.votes);
        state.searchData = newSearchData;
      } else {
        state.searchData = newSearchData;
        state.searchData.pageNumber -= 1;
      }
      const filteredUserDishes = [...dishesInRadius.filter((dish) => dish.userID == state.userData._id)];
      state.userData.dailyFood = filteredUserDishes.map((filteredDish) => filteredDish._id);
      state.allDishesDeletedRequest = false;
      state.loading = false;
    },
    // eslint-disable-next-line no-unused-vars
    [getDishesInRadius.pending]: (state, action) => {
      state.loading = true;
    },
    // eslint-disable-next-line no-unused-vars
    [clearDishesInStoreRequest.fulfilled]: (state, action) => {
      state.newDishesRequest += 1;
      state.loading = false;
    },
    // eslint-disable-next-line no-unused-vars
    [clearDishesInStoreRequest.pending]: (state, action) => {
      state.loading = true;
    },
    // eslint-disable-next-line no-unused-vars
    [allDishesDeletedRequest.fulfilled]: (state, action) => {
      state.allDishesDeletedRequest = action.payload;
      state.loading = false;
    },
    // eslint-disable-next-line no-unused-vars
    [allDishesDeletedRequest.pending]: (state, action) => {
      state.loading = true;
    },
    // eslint-disable-next-line no-unused-vars
    [clearDishTextRequest.fulfilled]: (state, action) => {
      state.clearDishTextRequest += 1;
      state.loading = false;
    },
    // eslint-disable-next-line no-unused-vars
    [clearDishTextRequest.pending]: (state, action) => {
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
    // eslint-disable-next-line no-unused-vars
    [logoutUser.fulfilled]: (state, action) => {
      localStorage.removeItem('accessToken');
      state.userData = action.payload.userData;
      state.dishesInRadius = action.payload.dishesInRadius;
      state.searchData = action.payload.searchData;
      state.clearDishTextRequest = action.payload.clearDishTextRequest; // TODO: refactor to request obj.
      state.newDishesRequest = action.payload.newDishesRequest;
      state.allDishesDeletedRequest = action.payload.allDishesDeletedRequest;
      state.chosenImageDate = '';
      state.isAuthenticated = false;
      state.loading = false;
    },
    // eslint-disable-next-line no-unused-vars
    [logoutUser.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteDish.fulfilled]: (state, action) => { // TODO: if dishesInRadius is empty request images from pageNumber -
      state.dishesInRadius = state.dishesInRadius
        .filter((dailyTreat) => dailyTreat._id !== action.payload)
        .sort((a,b) =>  b.votes - a.votes);
      state.loading = false;
    },
    // eslint-disable-next-line no-unused-vars
    [deleteDish.pending]: (state, action) => {
      state.loading = true;
    },
    [upDownVote.fulfilled]: (state, action) => {
      const { user, dailyTreat } = action.payload;
      const { _id } = dailyTreat;
      state.userData = user;
      const index = state.dishesInRadius.findIndex((dish) => dish._id === _id);
      state.dishesInRadius[index] = dailyTreat;
      state.dishesInRadius.sort((a,b) =>  b.votes - a.votes);
      state.loading = false;
    },
    // eslint-disable-next-line no-unused-vars
    [upDownVote.pending]: (state, action) => {
      state.loading = true;
    },
  }
});
