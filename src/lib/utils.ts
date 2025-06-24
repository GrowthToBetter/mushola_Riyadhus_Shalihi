import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateRange = (dayOne: Date, dayTwo: Date) => {
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  } as const;

  const dayOneFormatted = new Intl.DateTimeFormat("id-ID", options).format(
    new Date(dayOne)
  );
  const dayTwoFormatted = new Intl.DateTimeFormat("id-ID", options).format(
    new Date(dayTwo)
  );

  return `Hari 1: ${dayOneFormatted} | Hari 2: ${dayTwoFormatted}`;
};


  export const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };
