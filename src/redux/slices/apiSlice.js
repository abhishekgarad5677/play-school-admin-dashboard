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
        getAttendanceDataSummary: builder.mutation({
            query: (data) => ({
                url: "Data/attendance-range-summary",
                method: "POST",
                body: data,
            }),
        }),
        getQuery: builder.mutation({
            query: (data) => ({
                url: "CustomerSupport/admin/queries",
                method: "POST",
                body: data,
            }),
        }),
        getGames: builder.mutation({
            query: (data) => ({
                url: "Data/admin/dashbaord/allgamesdata",
                method: "POST",
                body: data, 
            }),
        }),
        postWeakAttendance: builder.mutation({
            query: (data) => ({
                url: "Notifications/send/sendnotificationByPercentage",
                method: "POST",
                body: data,
            }),
        }),
        postNotSubscribed: builder.mutation({
            query: (data) => ({
                url: "Notifications/send/sendtoUnsubsctibedUser",
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
    useGetGameSummaryMutation,
    useGetQueryMutation,
    useGetAttendanceDataSummaryMutation,
    useGetGamesMutation,
    usePostWeakAttendanceMutation,
    usePostNotSubscribedMutation
} = apiSlice;
