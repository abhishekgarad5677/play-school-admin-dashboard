export const attendanceMessages = {
  high: [
    {
      id: 1,
      title: "TMKOC Playschool",
      description: "Great job! You’re here every day!",
    },
    {
      id: 2,
      title: "TMKOC Playschool",
      description: "Daily learning makes you a star!",
    },
    {
      id: 3,
      title: "TMKOC Playschool",
      description: "You're setting the gold standard for attendance!",
    },
    {
      id: 4,
      title: "TMKOC Playschool",
      description: "You’ve been super consistent — we see your effort!",
    },
    {
      id: 5,
      title: "TMKOC Playschool",
      description: "Showing up daily is your superpower!",
    },
  ],
  medium: [
    {
      id: 1,
      title: "TMKOC Playschool",
      description: "Great going! Just a few more days for a streak!",
    },
    {
      id: 2,
      title: "TMKOC Playschool",
      description: "Almost there! Play a bit more to shine!",
    },
    {
      id: 3,
      title: "TMKOC Playschool",
      description: "Good job! Let’s make it a habit!",
    },
    {
      id: 4,
      title: "TMKOC Playschool",
      description: "You're halfway to a great routine!",
    },
    {
      id: 5,
      title: "TMKOC Playschool",
      description: "Keep showing up — you're doing great!",
    },
    {
      id: 6,
      title: "TMKOC Playschool",
      description: "One step closer to daily fun!",
    },
  ],
  low: [
    {
      id: 1,
      title: "TMKOC Playschool",
      description: "We miss you! Come back and play!",
    },
    {
      id: 2,
      title: "TMKOC Playschool",
      description: "Let’s play daily for more fun!",
    },
    {
      id: 3,
      title: "TMKOC Playschool",
      description: "More playtime = More learning!",
    },
    {
      id: 4,
      title: "TMKOC Playschool",
      description: "Don’t miss out! Join the fun!",
    },
    {
      id: 5,
      title: "TMKOC Playschool",
      description: "Keep the streak going! Let’s play!",
    },
  ],
};

export const dateFilterOptions = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 days", value: "7days" },
  { label: "Last 15 days", value: "15days" },
  { label: "Last 1 month", value: "1month" },
  { label: "Last 6 months", value: "6months" },
  { label: "Lifetime", value: "lifetime" },
  { label: "Custom", value: "custom" },
];

export const appFilterOptions = [
  { label: "All", value: 4 },
  { label: "Android", value: 1 },
  { label: "Ios", value: 2 },
  { label: "Website", value: 3 },
  { label: "Other", value: 0 },
];

export const subPlans = [
  { label: "All", value: 0 },
  { label: "Early Access Plan", value: 1 },
  { label: "Basic Plan", value: 2 },
  { label: "Pro Plan", value: 3 },
];

export const userTypeOptions = [
  { label: "Subscribed Users", value: 1 },
  { label: "All Users", value: 0 },
];

// export const phoneNumberAddedButFreeTrialNotClicked = [
//   "Converted - Paid",
//   "Concerned about auto debit",
//   "No answer",
//   "App crashed",
//   "Could not find trial button",
//   "Didn’t understand trial terms",
//   "Will try later",
//   "Just exploring",
//   "Stuck on loading screen",
//   "Planning to start later",
//   "App crashed during payment",
//   "User did not receive the call",
//   "Invalid/Wrong number",
//   "Callback Scheduled",
//   "Other (please specify)",
// ];

// export const freeTrialClickedButNotStarted = [
//   "Converted - Paid",
//   "Not worth price",
//   "No answer",
//   "Too expensive",
//   "Card declined",
//   "Didn’t want to add payment method",
//   "Unsure what happens after trial",
//   "Worried about auto renewal",
//   "Stuck on loading screen",
//   "App crashed during payment",
//   "User did not receive the call",
//   "Invalid/Wrong number",
//   "Callback Scheduled",
//   "Other (please specify)",
// ];

// export const subscriptionCancelled = [
//   "Converted - Paid",
//   "Not worth price",
//   "No answer",
//   "Too expensive",
//   "App performance issues",
//   "No reminder/engagement",
//   "Child not interested",
//   "App crashed during payment",
//   "User did not receive the call",
//   "Invalid/Wrong number",
//   "Callback Scheduled",
//   "Other (please specify)",
// ];

// export const phoneNumberAddedButFreeTrialNotClicked = [
//   { label: "Converted - Paid", value: 1 },
//   { label: "Payment link sent", value: 16 },
//   { label: "Concerned about auto debit", value: 30 },
//   { label: "No answer", value: 2 },
//   { label: "App crashed", value: 37 },
//   { label: "Could not find trial button", value: 31 },
//   { label: "Didn’t understand trial terms", value: 32 },
//   { label: "Will try later", value: 33 },
//   { label: "Just exploring", value: 34 },
//   { label: "Stuck on loading screen", value: 35 },
//   { label: "Planning to start later", value: 36 },
//   { label: "App crashed during payment", value: 15 },
//   { label: "Invalid/Wrong number", value: 3 },
//   { label: "Callback Scheduled", value: 4 },
//   { label: "Other (please specify)", value: 5 },
// ];

// export const freeTrialClickedButNotStarted = [
//   { label: "Converted - Paid", value: 1 },
//   { label: "Payment link sent", value: 16 },
//   { label: "Not worth price", value: 10 },
//   { label: "No answer", value: 2 },
//   { label: "Too expensive", value: 11 },
//   { label: "Card declined", value: 50 },
//   { label: "Didn’t want to add payment method", value: 51 },
//   { label: "Unsure what happens after trial", value: 52 },
//   { label: "Worried about auto renewal", value: 53 },
//   { label: "Stuck on loading screen", value: 35 },
//   { label: "App crashed during payment", value: 15 },
//   { label: "Invalid/Wrong number", value: 3 },
//   { label: "Callback Scheduled", value: 4 },
//   { label: "Other (please specify)", value: 5 },
// ];

// export const subscriptionCancelled = [
//   { label: "Converted - Paid", value: 1 },
//   { label: "Payment link sent", value: 16 },
//   { label: "Not worth price", value: 10 },
//   { label: "No answer", value: 2 },
//   { label: "Too expensive", value: 11 },
//   { label: "App performance issues", value: 12 },
//   { label: "No reminder/engagement", value: 13 },
//   { label: "Child not interested", value: 14 },
//   { label: "App crashed during payment", value: 15 },
//   { label: "Invalid/Wrong number", value: 3 },
//   { label: "Callback Scheduled", value: 4 },
//   { label: "Other (please specify)", value: 5 },
// ];

export const subscriptionCancelled = [
  {
    label: "Converted - Paid",
    value: 1,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "Payment link sent",
    value: 16,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "Not Interested",
    value: 17,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "Not Aware",
    value: 18,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "Not worth price",
    value: 10,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "No answer",
    value: 2,
    scheduleDateRequired: true,
    commentRequired: false,
  },
  {
    label: "Too expensive",
    value: 11,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "App performance issues",
    value: 12,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "No reminder/engagement",
    value: 13,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "Child not interested",
    value: 14,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "App crashed during payment",
    value: 15,
    scheduleDateRequired: true,
    commentRequired: true,
  },
  {
    label: "Invalid/Wrong number",
    value: 3,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "Callback Scheduled",
    value: 4,
    scheduleDateRequired: true,
    commentRequired: true,
  },
  {
    label: "Other (please specify)",
    value: 5,
    scheduleDateRequired: false,
    commentRequired: true,
  },
];

export const freeTrialClickedButNotStarted = [
  {
    label: "Converted - Paid",
    value: 1,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "Payment link sent",
    value: 16,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "Not Interested",
    value: 17,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "Not Aware",
    value: 18,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "Not worth price",
    value: 10,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "No answer",
    value: 2,
    scheduleDateRequired: true,
    commentRequired: false,
  },
  {
    label: "Too expensive",
    value: 11,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "App crashed during payment",
    value: 15,
    scheduleDateRequired: true,
    commentRequired: true,
  },
  {
    label: "Invalid/Wrong number",
    value: 3,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "Callback Scheduled",
    value: 4,
    scheduleDateRequired: true,
    commentRequired: true,
  },
  {
    label: "Other (please specify)",
    value: 5,
    scheduleDateRequired: false,
    commentRequired: true,
  },
  {
    label: "Card declined",
    value: 50,
    scheduleDateRequired: true,
    commentRequired: true,
  },
  {
    label: "Didn't want to add payment method",
    value: 51,
    scheduleDateRequired: true,
    commentRequired: true,
  },
  {
    label: "Unsure what happens after trial",
    value: 52,
    scheduleDateRequired: true,
    commentRequired: true,
  },
  {
    label: "Worried about auto renewal",
    value: 53,
    scheduleDateRequired: false,
    commentRequired: true,
  },
  {
    label: "Stuck on loading screen",
    value: 35,
    scheduleDateRequired: true,
    commentRequired: true,
  },
];

export const phoneNumberAddedButFreeTrialNotClicked = [
  {
    label: "Converted - Paid",
    value: 1,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "Payment link sent",
    value: 16,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "Not Interested",
    value: 17,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "Not Aware",
    value: 18,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "No answer",
    value: 2,
    scheduleDateRequired: true,
    commentRequired: false,
  },
  {
    label: "App crashed during payment",
    value: 15,
    scheduleDateRequired: true,
    commentRequired: true,
  },
  {
    label: "Invalid/Wrong number",
    value: 3,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "Callback Scheduled",
    value: 4,
    scheduleDateRequired: true,
    commentRequired: true,
  },
  {
    label: "Other (please specify)",
    value: 5,
    scheduleDateRequired: false,
    commentRequired: true,
  },
  {
    label: "Stuck on loading screen",
    value: 35,
    scheduleDateRequired: true,
    commentRequired: true,
  },
  {
    label: "Concerned about auto debit",
    value: 30,
    scheduleDateRequired: true,
    commentRequired: true,
  },
  {
    label: "App crashed",
    value: 37,
    scheduleDateRequired: true,
    commentRequired: true,
  },
  {
    label: "Could not find trial button",
    value: 31,
    scheduleDateRequired: true,
    commentRequired: true,
  },
  {
    label: "Didn't understand trial terms",
    value: 32,
    scheduleDateRequired: true,
    commentRequired: true,
  },
  {
    label: "Will try later",
    value: 33,
    scheduleDateRequired: true,
    commentRequired: true,
  },
  {
    label: "Just exploring",
    value: 34,
    scheduleDateRequired: false,
    commentRequired: false,
  },
  {
    label: "Planning to start later",
    value: 36,
    scheduleDateRequired: false,
    commentRequired: true,
  },
];

export const getLeadReasonValue = (label, options) => {
  const found = options?.find((o) => o.label === label);
  return found ? found.value : null;
};

export const getLeadReasonLabel = (value, options) => {
  if (!value || value === 0) return "Select Status"; // 0 => Select Status
  const found = options?.find((o) => Number(o.value) === Number(value));
  return found?.label ?? "Select Status";
};

export const bucketCategory = [
  { label: "Subscription Cancelled", value: "Subscription Cancelled" },
  {
    label: "Trial Clicked – Not Started",
    value: "Trial Clicked – Not Started",
  },
  {
    label: "Phone Added – Trial Not Clicked",
    value: "Phone Added – Trial Not Clicked",
  },
];

export const getLeadOutcomeValue = (status) => {
  if (status === "All") return 0;
  else if (status === "Pending") return 1;
  else if (status === "Called") return 2;
  else if (status === "Scheduled") return 3;
  else if (status === "Converted") return 4;
  else if (status === "Link Sent") return 5;

  return 0; // fallback
};

export const getLeadTypeValue = (bucket) => {
  if (bucket === "Phone Added – Trial Not Clicked") return 2;
  else if (bucket === "Trial Clicked – Not Started") return 1;
  else if (bucket === "Subscription Cancelled") return 0;

  return 0; // fallback
};
