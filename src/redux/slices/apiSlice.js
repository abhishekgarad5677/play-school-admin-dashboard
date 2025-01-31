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
        postData: builder.mutation({
            query: (data) => ({
                url: "Students/user/getallstudentsinfo", // Replace with actual API endpoint
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useGetUserQuery,
    useGetPostsQuery,
    usePostDataMutation
} = apiSlice;
