import { RootStateOrAny } from "react-redux";

export const selectDishes = (state: RootStateOrAny) =>
  state?.user?.dishesInRadius;

export const numberOfDishes = (state: RootStateOrAny) =>
  state?.user?.dishesInRadius.length;

export const selectSearchData = (state: RootStateOrAny) =>
  state.user.searchData;

export const selectNewDishesRequest = (state: RootStateOrAny) =>
  state.user.newDishesRequest;

export const selectAllDishesDeletedRequest = (state: RootStateOrAny) =>
  state.user.allDishesDeletedRequest;
