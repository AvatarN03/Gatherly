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

export const formatLabel = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
};