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
    getPermissions: builder.query({
      query: () => ({
        url: "Permission",
        method: "GET",
      }),
    }),
    createPermission: builder.mutation({
      query: (data) => ({
        url: "Permission",
        method: "POST",
        body: data,
      }),
    }),
    createAdmin: builder.mutation({
      query: (data) => ({
        url: "Admin/create-admin",
        method: "POST",
        body: data,
      }),
    }),
    getAdminList: builder.query({
      query: () => ({
        url: "Admin/get-admins",
        method: "GET",
      }),
    }),
    updateAdminPermission: builder.mutation({
      query: (data) => ({
        url: "Admin/update-admin-permission",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetPermissionsQuery,
  useCreatePermissionMutation,
  useCreateAdminMutation,
  useGetAdminListQuery,
  useUpdateAdminPermissionMutation
} = roleBaseSlice;
