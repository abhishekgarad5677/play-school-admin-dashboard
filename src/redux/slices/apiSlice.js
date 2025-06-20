// apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
    //    baseUrl: "https://api-playschool.tmkocplayschool.com/api/",
         baseUrl: "http://10.1.1.184:7177/api/",
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
        // get subscribed users
        getallstudentsinfo: builder.mutation({
            query: (data) => ({
                url: "Data/admin/subscribeduser",
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
        getCountryStateCity: builder.mutation({
            query: (data) => ({
                url: "Data/admin/dashboard/countrycitystate",
                method: "POST",
                body: data,
            }),
        }),
        getAgeGroupCount: builder.mutation({
            query: (data) => ({
                url: "Data/admin/dashboard/agegroupcount",
                method: "POST",
                body: data,
            }),
        }),
        getAttendanceSummary: builder.mutation({
            query: (data) => ({
                url: "Data/attendancesummary",
                method: "POST",
                body: data,
            }),
        }),
        getUnsubscribedUsers: builder.mutation({
            query: (data) => ({
                url: "Data/admin/nonsubscribeduser",
                method: "POST",
                body: data,
            }),
        }),
        getTopCities: builder.mutation({
            query: (data) => ({
                url: "Data/admin/dashboard/topcitieswithaveragetime",
                method: "POST",
                body: data,
            }),
        }),
        getABTestingFunnel: builder.mutation({
            query: (data) => ({
                url: "Data/admin/dashbaord/ABTestingFunnel",
                method: "POST",
                body: data,
            }),
        }),
        getAllFunnelData: builder.mutation({
            query: (data) => ({
                url: "Data/admin/dashbaord/funnel",
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
    usePostNotSubscribedMutation,
    useGetCountryStateCityMutation,
    useGetAgeGroupCountMutation,
    useGetAttendanceSummaryMutation,
    useGetUnsubscribedUsersMutation,
    useGetTopCitiesMutation,
    useGetABTestingFunnelMutation,
    useGetAllFunnelDataMutation
} = apiSlice;
