import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const roleBaseSlice = createApi({
  reducerPath: "roleBaseApi",
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
    createPermission: builder.mutation({
      query: (data) => ({
        url: "Permission",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreatePermissionMutation } = roleBaseSlice;
