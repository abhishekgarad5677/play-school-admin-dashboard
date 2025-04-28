import { useMemo } from "react";

// Custom hook to generate unique id
export const generateUID = () =>
  "uid-" + Date.now() + "-" + Math.floor(Math.random() * 1000000);

// Custom hook to format date
export const useFormattedDate = (isoString) => {
  return useMemo(() => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [isoString]);
};

export const formatPlayTime = (playTimeInMinutes) => {
  if (playTimeInMinutes < 1) {
    const seconds = Math.round(playTimeInMinutes * 60);
    return `${seconds} sec`;
  } else if (playTimeInMinutes < 60) {
    const minutes = Math.floor(playTimeInMinutes);
    return `${minutes} min`;
  } else {
    const hours = Math.floor(playTimeInMinutes / 60);
    const minutes = Math.floor(playTimeInMinutes % 60);
    if (minutes > 0) {
      return `${hours} hr ${minutes} min`;
    } else {
      return `${hours} hr`;
    }
  }
};
