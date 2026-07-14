import { z } from "zod";

export const EVENT_CATEGORIES = [
  "General", "Technology", "Education", "Health", "Sports", "Arts",
  "Business", "Environment", "Food", "Gaming", "Music", "Travel", "Others",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const EVENT_SUBCATEGORIES: Record<EventCategory, readonly string[]> = {
  General: ["Meetup", "Networking", "Workshop", "Others"],
  Technology: ["Hackathon", "Conference", "Webinar", "CodeSprint", "Others"],
  Education: ["Seminar", "Bootcamp", "Tutoring", "Quiz", "Others"],
  Health: ["Yoga", "MentalHealth", "Nutrition", "Wellness", "Others"],
  Sports: ["Tournament", "Training", "Marathon", "FriendlyMatch", "Others"],
  Arts: ["Exhibition", "Performance", "Workshop", "FilmScreening", "Others"],
  Business: ["Pitch", "Panel", "Networking", "TradeShow", "Others"],
  Environment: ["Cleanup", "Plantation", "Awareness", "Recycling", "Others"],
  Food: ["FoodFestival", "CookingClass", "Tasting", "Bakeoff", "Others"],
  Gaming: ["LAN", "Esports", "BoardGames", "GameJam", "Others"],
  Music: ["Concert", "OpenMic", "JamSession", "MusicWorkshop", "Others"],
  Travel: ["GroupTrip", "Hiking", "CityTour", "Camping", "Others"],
  Others: ["Social", "Charity", "Others"],
};

export const eventSchema = z
  .object({
    communityId: z.string().trim().min(1, "Please select a community"),

    title: z
      .string()
      .trim()
      .min(1, "Event title is required")
      .max(80, "Title must be under 80 characters"),

    date: z
      .string()
      .trim()
      .min(1, "Date is required")
      .refine(
        (val) => {
          const selectedDate = new Date(val);
          selectedDate.setHours(0, 0, 0, 0);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return selectedDate >= today;
        },
        { message: "Event date cannot be in the past" }
      ),

    time: z.string().trim().min(1, "Time is required"),

    location: z.string().trim().min(1, "Location is required"),

    description: z
      .string()
      .trim()
      .min(1, "Description is required")
      .min(10, "Description must be at least 10 characters"),

    category: z.enum(EVENT_CATEGORIES, {
      message: "Please select a valid category",
    }),

    subCategory: z.string().trim().min(1, "Sub-category is required"),
  })
  .superRefine((data, ctx) => {
    const validSubCategories = EVENT_SUBCATEGORIES[data.category];

    if (!validSubCategories.includes(data.subCategory)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["subCategory"],
        message: `Invalid sub-category for ${data.category}`,
      });
    }
  });