import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IDailyTreat, IDishesInRadius } from "../types";

// Define a service using a base URL and expected endpoints
export const dishesApi = createApi({
  reducerPath: "dishesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
  endpoints: (builder) => ({
    getDishesInRadius: builder.query<IDailyTreat, IDishesInRadius>({
      query: (data) => `/profile/${data.id}/dashboard`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetDishesInRadiusQuery } = dishesApi;
