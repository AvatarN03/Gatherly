export const formatDate = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
) => {
  return new Date(date).toLocaleDateString(
    "en-IN",
    options ?? {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
};