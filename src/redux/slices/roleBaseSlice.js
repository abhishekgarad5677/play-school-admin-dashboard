import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const roleBaseSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token; // Getting the token directly from getState
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "/user",
    }),
  }),
});

export const { useGetUserQuery } = roleBaseSlice;
