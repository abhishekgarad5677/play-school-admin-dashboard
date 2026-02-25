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

// export const feedbackReasons = {
//   phoneNumberAddedButFreeTrialNotClicked: [
//     "Forgot to click the free trial",
//     "Confused by the trial process",
//     "No interest in the trial",
//     "Didn't understand the benefits of the trial",
//     "Other (please specify)",
//   ],
//   freeTrialClickedButNotStarted: [
//     "Forgot to start the trial",
//     "Wasn't ready to use the app yet",
//     "Confused by how to start the trial",
//     "No interest in the trial",
//     "Other (please specify)",
//   ],
//   subscriptionCancelled: [
//     "Did not find the app useful",
//     "Had technical issues",
//     "Was too expensive",
//     "Found a better alternative",
//     "Other (please specify)",
//   ],
// };

export const phoneNumberAddedButFreeTrialNotClicked = [
  "Concerned about auto debit",
  "App crashed",
  "Could not find trial button",
  "Didn’t understand trial terms",
  "Will try later",
  "Just exploring",
  "Stuck on loading screen",
  "Planning to start later",
  "User did not receive the call",
  "Invalid number",
  // "Other (please specify)",
];

export const freeTrialClickedButNotStarted = [
  "Too expensive",
  "Not worth price",
  "Card declined",
  "Payment failed",
  "Didn’t want to add payment method",
  "Unsure what happens after trial",
  "Worried about auto renewal",
  "Stuck on loading screen",
  "App crashed during payment",
  "User did not receive the call",
  "Invalid number",
  // "Other (please specify)",
];
export const subscriptionCancelled = [
  "Too expensive",
  "Not worth price",
  "App performance issues",
  "No reminder/engagement",
  "Child not interested",
  "User did not receive the call",
  "Invalid number",
  // "Other (please specify)"
];
