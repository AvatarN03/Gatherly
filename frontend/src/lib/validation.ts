import type { ZodType } from "zod";
import type { CreateCommunity, CreateEvent, EventItem } from "../types";
import { communitySchema , eventSchema } from "./schemas";

// Generic helper: runs a Zod schema and returns a field->message map
function getFieldErrors<T>(schema: ZodType, data: unknown): Partial<T> {
  const result = schema.safeParse(data);
  if (result.success) return {};

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as string;
    // keep only the first error per field, matching old single-message-per-field behavior
    if (!errors[field]) errors[field] = issue.message;
  }
  return errors as Partial<T>;
}

export const CommunityvalidateForm = (
  formData: CreateCommunity,
  setErrors: React.Dispatch<React.SetStateAction<Partial<CreateCommunity>>>
): boolean => {
  const newErrors = getFieldErrors<CreateCommunity>(communitySchema, formData);
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export const EventValidateForm = (
  formData: Partial<CreateEvent | EventItem>,
  setErrors: React.Dispatch<React.SetStateAction<Partial<CreateEvent>>>
): boolean => {
  const newErrors = getFieldErrors<CreateEvent>(eventSchema, formData);
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};