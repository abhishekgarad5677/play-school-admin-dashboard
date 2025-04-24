// apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://api-playschool.tmkocplayschool.com/api/",
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;  // Getting the token directly from getState
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
        getPosts: builder.query({
            query: () => "/posts",
        }),
        getallstudentsinfo: builder.mutation({
            query: (data) => ({
                url: "Students/user/getallstudentsinfo",
                method: "POST",
                body: data,
            }),
        }),
        getallcategories: builder.mutation({
            query: (data) => ({
                url: "Category/admin/getallcategories",
                method: "POST",
                body: data,
            }),
        }),
        getDashboardSummary: builder.mutation({
            query: (data) => ({
                url: "Data/admin/dashboard/summary",
                method: "POST",
                body: data,
            }),
        }),
        getGameSummary: builder.mutation({
            query: (data) => ({
                url: "Data/admin/dashbaord/gamesdata",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useGetUserQuery,
    useGetPostsQuery,
    useGetallstudentsinfoMutation,
    useGetallcategoriesMutation,
    useGetDashboardSummaryMutation,
    useGetGameSummaryMutation
} = apiSlice;
