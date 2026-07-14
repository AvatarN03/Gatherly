import { z } from "zod";

export const CATEGORIES = [
  "General",
  "Technology",
  "Education",
  "Health",
  "Sports",
  "Arts",
  "Business",
  "Environment",
  "Food",
  "Gaming",
  "Music",
  "Travel",
  "Others",
] as const;


export const communitySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(60, "Name must be under 60 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be under 1000 characters"),

  location: z
    .string()
    .trim()
    .min(2, "Location is required")
    .max(100, "Location must be under 100 characters"),

  category: z.enum(CATEGORIES, {
    message: "Please select a valid category",
  }),
});

export type CommunityInput = z.infer<typeof communitySchema>;

export const updateCommunitySchema = communitySchema.partial();