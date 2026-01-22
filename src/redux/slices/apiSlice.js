// apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api-playschool.tmkocplayschool.com/api/",
    // baseUrl: "http://10.1.1.109:7177/api/",
    // baseUrl: "http://3.111.148.23/api",
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
    getFunnelGoogleSignInData: builder.mutation({
      query: (data) => ({
        url: "Data/admin/dashbaord/googlesigninfunnel",
        method: "POST",
        body: data,
      }),
    }),
    getFunnelSmsOtpFunnel: builder.mutation({
      query: (data) => ({
        url: "Data/admin/dashbaord/smsotpfunnel",
        method: "POST",
        body: data,
      }),
    }),
    getFunnel506Build: builder.mutation({
      query: (data) => ({
        url: "Data/admin/dashbaord/funnel506build",
        method: "POST",
        body: data,
      }),
    }),
    getActiveUserSummary: builder.mutation({
      query: (data) => ({
        url: "Data/admin/active-user-summary",
        method: "POST",
        body: data,
      }),
    }),
    getAllGameCategories: builder.mutation({
      query: (data) => ({
        url: "Category/admin/getallcategories",
        method: "POST",
        body: data,
      }),
    }),
    getAddGames: builder.mutation({
      query: (data) => ({
        url: "Category/admin/addcategory",
        method: "POST",
        body: data,
      }),
    }),
    getGamesByCategory: builder.mutation({
      query: (data) => ({
        url: "Category/getgamesbycategoryId",
        method: "POST",
        body: data,
      }),
    }),
    getAddGameCategory: builder.mutation({
      query: (data) => ({
        url: "Game/admin/addgame",
        method: "POST",
        body: data,
      }),
    }),
    getDeleteGame: builder.mutation({
      query: (data) => ({
        url: "Category/deletegamebyId",
        method: "POST",
        body: data,
      }),
    }),
    getFunnelDataSevenDay: builder.mutation({
      query: (data) => ({
        url: "Data/admin/dashbaord/sevenday-freetrial",
        method: "POST",
        body: data,
      }),
    }),
    getSevenDayTrialUserData: builder.mutation({
      query: (data) => ({
        url: "Data/admin/sevendayfree-trial-data",
        method: "POST",
        body: data,
      }),
    }),
    getDomesticRevenue: builder.mutation({
      query: (data) => ({
        url: "Data/admin/revenuedomestic",
        method: "POST",
        body: data,
      }),
    }),
    getInternationalRevenue: builder.mutation({
      query: (data) => ({
        url: "Data/admin/revenueinternational",
        method: "POST",
        body: data,
      }),
    }),
    getCashFreeTrialData: builder.mutation({
      query: (data) => ({
        url: "Data/admin/cashfree-trial-data",
        method: "POST",
        body: data,
      }),
    }),
    getRazorPayFreeTrialData: builder.mutation({
      query: (data) => ({
        url: "Data/admin/razorpay-trial-data",
        method: "POST",
        body: data,
      }),
    }),
    getAnalyticsEvents: builder.query({
      query: (arg) => {
        // case 1: simple string filter ("today", "7daysAgo", etc.)
        if (typeof arg === "string") {
          return {
            url: "Analytics/analyticsEvents",
            params: { FilterType: arg },
          };
        }

        // case 2: custom range object from AnalyticsEventsChart
        if (arg && arg.FilterType === "custom") {
          const { FilterType, FromDate, ToDate } = arg;

          return {
            url: "Analytics/analyticsEvents",
            params: {
              FilterType,
              FromDate,
              ToDate,
            },
          };
        }

        // fallback (if something weird is passed)
        return {
          url: "Analytics/analyticsEvents",
          params: { FilterType: "today" },
        };
      },
    }),
    getActiveUserMetrics: builder.query({
      query: (params) => ({
        url: `Data/admin/active-user-metrics`,
        method: "GET",
        params,
      }),
    }),
    getSubscriptionStatus: builder.mutation({
      query: (data) => ({
        url: "Data/subscription-status",
        method: "POST",
        body: data,
      }),
    }),
    getStudentDetails: builder.mutation({
      query: (data) => ({
        url: "Data/admin/student-summary",
        method: "POST",
        body: data,
      }),
    }),
    getFreeTrialStartedFunnel: builder.mutation({
      query: (data) => ({
        url: "Data/admin/dashbaord/funnel-metrics",
        method: "POST",
        body: data,
      }),
    }),
    getFreeTrialStartedAnalyticsCountFunnel: builder.mutation({
      query: (data) => ({
        url: "Analytics/analyticscount",
        method: "POST",
        body: data,
      }),
    }),
    getFreeTrialStartedFunnelData: builder.mutation({
      query: (data) => ({
        url: "Data/admin/dashbaord/funnel-metrics-data",
        method: "POST",
        body: data,
      }),
    }),
    getChildDetailsData: builder.mutation({
      query: (data) => ({
        url: "Data/admin/dashbaord/CDAdded-FTNotStarted",
        method: "POST",
        body: data,
      }),
    }),
    getSubscriptionDueFunnel: builder.mutation({
      query: (data) => ({
        url: "Data/admin/dashbaord/funnel-metrics-2",
        method: "POST",
        body: data,
      }),
    }),
    getSubscriptionDueFunnelData: builder.mutation({
      query: (data) => ({
        url: "Data/admin/dashbaord/funnel-metrics-2-data",
        method: "POST",
        body: data,
      }),
    }),
    getSubscriptionDueFunnelData: builder.mutation({
      query: (data) => ({
        url: "Data/admin/dashbaord/funnel-metrics-2-data",
        method: "POST",
        body: data,
      }),
    }),
    getSendNotificationFreeTrialExpiredNOTSubscribed: builder.mutation({
      query: (data) => ({
        url: "Notifications/freetrialpendingandhalt",
        method: "POST",
        body: data,
      }),
    }),
    getSendNotificationFreeTrialCancelled: builder.mutation({
      query: (data) => ({
        url: "Notifications/freetrialcancelled",
        method: "POST",
        body: data,
      }),
    }),
    getFreeTrialExpiredNOTSubscribedData: builder.mutation({
      query: (data) => ({
        url: "Notifications/getnotification",
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
  useGetAllFunnelDataMutation,
  useGetFunnelGoogleSignInDataMutation,
  useGetFunnelSmsOtpFunnelMutation,
  useGetFunnel506BuildMutation,
  useGetActiveUserSummaryMutation,
  useGetAllGameCategoriesMutation,
  useGetAddGamesMutation,
  useGetGamesByCategoryMutation,
  useGetAddGameCategoryMutation,
  useGetDeleteGameMutation,
  useGetFunnelDataSevenDayMutation,
  useGetSevenDayTrialUserDataMutation,
  useGetDomesticRevenueMutation,
  useGetCashFreeTrialDataMutation,
  useGetRazorPayFreeTrialDataMutation,
  useGetAnalyticsEventsQuery,
  useGetActiveUserMetricsQuery,
  useGetSubscriptionStatusMutation,
  useGetStudentDetailsMutation,
  useGetInternationalRevenueMutation,
  useGetFreeTrialStartedFunnelMutation,
  useGetSubscriptionDueFunnelMutation,
  useGetFreeTrialStartedFunnelDataMutation,
  useGetSubscriptionDueFunnelDataMutation,
  useGetFreeTrialStartedAnalyticsCountFunnelMutation,
  useGetChildDetailsDataMutation,
  useGetSendNotificationFreeTrialExpiredNOTSubscribedMutation,
  useGetSendNotificationFreeTrialCancelledMutation,
  useGetFreeTrialExpiredNOTSubscribedDataMutation
} = apiSlice;
