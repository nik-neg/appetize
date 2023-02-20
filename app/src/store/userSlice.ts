import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IDish } from "../components/Details";
import { ILoginCredentials } from "../components/RegisterLogin";
import { Polygon } from "../helpers";
import ApiClient from "../services/ApiClient";
import apiServiceJWT from "../services/ApiClientJWT";
import { IUser } from "../services/types";
import {
  IDailyTreat,
  IDeleteDish,
  IDishesInRadius,
  IUploadImage,
  IVote,
  State,
} from "./types";

const initialState: State = {
  userData: {},
  dishesInRadius: [],
  searchData: {
    pageNumber: 1,
    radius: 0,
    filter: {
      cooked: true,
      ordered: true,
      own: true,
    },
    geoLocationPolygon: [],
  },
  clearDishTextRequest: 0,
  newDishesRequest: 0,
  allDishesDeletedRequest: false,
  initialProfileRender: true,
  chosenImageDate: "",
  loading: false,
  isAuthenticated: false,
};

export const createUserAndSafeToDB = createAsyncThunk(
  "userData/createUser",
  async (input: IUser) => {
    debugger;
    const response = await apiServiceJWT.register(input);
    return response;
  }
);

export const fetchUserDataFromDB = createAsyncThunk(
  "userData/fetchUserDataFromDB",
  async (input: ILoginCredentials) => {
    const response = await apiServiceJWT.loginUser(input);
    return response;
  }
);

export const updateCity = createAsyncThunk(
  "userData/updateCity",
  async (input: any) => {
    debugger;
    const response = await ApiClient.confirmCity(input);
    return response;
  }
);

export const clearDishesInStoreRequest = createAsyncThunk(
  "newDishesRequest/clearDishesInStoreRequest",
  async () => {
    return 1;
  }
);

export const getDishesInRadius = createAsyncThunk(
  "dishesInRadius/getDishesInRadius",
  async ({
    id,
    radius,
    filter,
    pageNumber,
    geoLocationPolygon,
  }: IDishesInRadius) => {
    const dishesInRadius = await ApiClient.getDishesInRadius(
      id,
      filter,
      pageNumber,
      geoLocationPolygon
    );
    return { dishesInRadius, radius, filter, pageNumber, geoLocationPolygon };
  }
);

export const uploadImageBeforePublish = createAsyncThunk(
  "userData/uploadImageBeforePublish",
  async ({ userId, file, chosenImageDate, imageURL }: IUploadImage) => {
    const userData = await ApiClient.uploadImage(
      userId,
      file,
      chosenImageDate,
      imageURL
    );
    if (userData) {
      return { ...userData, chosenImageDate };
    } else {
      return { chosenImageDate };
    }
  }
);

export const logoutUser = createAsyncThunk("userData/logoutUser", async () => {
  const accessToken = localStorage.getItem("accessToken");
  await apiServiceJWT.logout(accessToken);
  return initialState;
});

export const deleteDish = createAsyncThunk(
  "dishesInRadius/deleteDish",
  async ({ userId, dishId }: IDeleteDish) => {
    await ApiClient.deleteDish(userId, dishId);
    return dishId;
  }
);

export const upDownVote = createAsyncThunk(
  "dishesInRadius/upDownVote",
  async ({ voteID, dishID, voteDecision }: IVote) => {
    const response = await ApiClient.voteDish(voteID, dishID, voteDecision);
    return response;
  }
);

export const clearDishTextRequest = createAsyncThunk(
  "state/clearDishTextRequest",
  async () => {
    return 1;
  }
);

export const allDishesDeletedRequest = createAsyncThunk(
  "state/allDishesDeletedRequest",
  async () => {
    return true;
  }
);

export const backToProfileRequest = createAsyncThunk(
  "state/backToProfileRequest",
  async () => {
    return false;
  }
);
export const updateDailyTreat = createAsyncThunk(
  "state/updateDailyTreat",
  async (dailyTreat: IDailyTreat) => {
    return dailyTreat;
  }
);
export const getGeoLocation = createAsyncThunk(
  "state/getGeoLocation",
  async (geoLocationPolygon: Polygon) => {
    return geoLocationPolygon;
  }
);

export const userSlice: any = createSlice({
  // TODO: refactor to more slices?
  name: "userData",
  initialState,
  reducers: undefined,
  extraReducers: {
    [createUserAndSafeToDB.fulfilled.toString()]: (state, action) => {
      const { user, accessToken, error, message } = action.payload;
      localStorage.setItem("accessToken", accessToken);
      if (user) {
        state.userData = user;
      } else {
        state.userData = { error, message };
      }
      state.isAuthenticated = true;
      state.loading = false;
    },
    [createUserAndSafeToDB.pending.toString()]: (state) => {
      state.loading = true;
    },
    [fetchUserDataFromDB.fulfilled.toString()]: (state, action) => {
      const { user, accessToken, error, message } = action.payload;
      localStorage.setItem("accessToken", accessToken);
      if (user) {
        state.userData = user;
      } else {
        state.userData = { error, message };
      }
      state.isAuthenticated = true;
      state.loading = false;
    },
    [fetchUserDataFromDB.pending.toString()]: (state) => {
      state.loading = true;
    },
    [updateCity.fulfilled.toString()]: (state, action) => {
      state.userData = action.payload;
      state.loading = false;
    },
    [updateCity.pending.toString()]: (state) => {
      state.loading = true;
    },
    [getDishesInRadius.fulfilled.toString()]: (state, action) => {
      const { dishesInRadius, radius, filter, pageNumber, geoLocationPolygon } =
        action.payload;
      const newSearchData = { radius, filter, pageNumber, geoLocationPolygon };
      if (dishesInRadius.length > 0) {
        state.dishesInRadius = dishesInRadius.sort((a, b) => b.votes - a.votes);
        state.searchData = newSearchData;
      } else {
        state.searchData = newSearchData;
        state.searchData.pageNumber -= 1;
      }
      const filteredUserDishes = [
        ...dishesInRadius.filter(
          (dish: IDish) => dish.userID == state.userData._id
        ),
      ];
      state.userData.dailyFood = filteredUserDishes.map(
        (filteredDish) => filteredDish._id
      );
      state.allDishesDeletedRequest = false;
      state.loading = false;
    },
    [getDishesInRadius.pending.toString()]: (state) => {
      state.loading = true;
    },
    [clearDishesInStoreRequest.fulfilled.toString()]: (state, action) => {
      state.newDishesRequest += action.payload;
      state.loading = false;
    },
    [clearDishesInStoreRequest.pending.toString()]: (state) => {
      state.loading = true;
    },
    [allDishesDeletedRequest.fulfilled.toString()]: (state, action) => {
      state.allDishesDeletedRequest = action.payload;
      state.loading = false;
    },
    [allDishesDeletedRequest.pending.toString()]: (state) => {
      state.loading = true;
    },
    [clearDishTextRequest.fulfilled.toString()]: (state) => {
      state.clearDishTextRequest += 1;
      state.loading = false;
    },
    [clearDishTextRequest.pending.toString()]: (state) => {
      state.loading = true;
    },
    [uploadImageBeforePublish.fulfilled.toString()]: (state, action) => {
      const { userData, chosenImageDate } = action.payload;
      if (userData) state.userData = userData;
      if (chosenImageDate) state.chosenImageDate = chosenImageDate;
      state.loading = false;
    },
    [uploadImageBeforePublish.pending.toString()]: (state) => {
      state.loading = true;
    },
    [logoutUser.fulfilled.toString()]: (state, action) => {
      localStorage.removeItem("accessToken");
      state.userData = action.payload.userData;
      state.dishesInRadius = action.payload.dishesInRadius;
      state.searchData = action.payload.searchData;
      state.clearDishTextRequest = action.payload.clearDishTextRequest; // TODO: refactor to request obj.
      state.newDishesRequest = action.payload.newDishesRequest;
      state.allDishesDeletedRequest = action.payload.allDishesDeletedRequest;
      state.chosenImageDate = "";
      state.isAuthenticated = false;
      state.loading = false;
    },
    [logoutUser.pending.toString()]: (state) => {
      state.loading = true;
    },
    [deleteDish.fulfilled.toString()]: (state, action) => {
      // TODO: if dishesInRadius is empty request images from pageNumber -
      state.dishesInRadius = state.dishesInRadius
        .filter((dailyTreat) => dailyTreat._id !== action.payload)
        .sort((a, b) => b.votes - a.votes);
      state.loading = false;
    },
    [deleteDish.pending.toString()]: (state) => {
      state.loading = true;
    },
    [upDownVote.fulfilled.toString()]: (state, action) => {
      const { user, dailyTreat } = action.payload;
      const { _id } = dailyTreat;
      state.userData = user;
      const index = state.dishesInRadius.findIndex((dish) => dish._id === _id);
      state.dishesInRadius[index] = dailyTreat;
      state.dishesInRadius.sort((a, b) => b.votes - a.votes);
      state.loading = false;
    },
    [upDownVote.pending.toString()]: (state) => {
      state.loading = true;
    },
    [backToProfileRequest.fulfilled.toString()]: (state, action) => {
      state.initialProfileRender = action.payload;
      state.loading = false;
    },
    [backToProfileRequest.pending.toString()]: (state) => {
      state.loading = true;
    },
    [updateDailyTreat.fulfilled.toString()]: (state, action) => {
      const dailyTreat = action.payload;
      const { _id } = dailyTreat;
      const index = state.dishesInRadius.findIndex((dish) => dish._id === _id);
      const dish = state.dishesInRadius[index];
      state.dishesInRadius[index] = { ...dish, ...dailyTreat };
      state.dishesInRadius.sort((a, b) => b.votes - a.votes);
      state.loading = false;
    },
    [updateDailyTreat.pending.toString()]: (state) => {
      state.loading = true;
    },
    [getGeoLocation.fulfilled.toString()]: (state, action) => {
      state.searchData.geoLocationPolygon = action.payload;
      state.loading = false;
    },
    [getGeoLocation.pending.toString()]: (state) => {
      state.loading = true;
    },
  },
});
