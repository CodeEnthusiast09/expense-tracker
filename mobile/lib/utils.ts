const parseInputDate = (input: string): Date => {
  const [datePart] = input.split(" ");
  const [day, month, year] = datePart?.split("-") || [];

  // Ensure the date string is in the "yyyy-mm-dd" format
  const formattedDateString = `${year}-${month}-${day}`;

  return new Date(formattedDateString);
};

export const formatDate = (date: string | undefined) => {
  if (!date || date.toString() === "") return "-";

  // check if date.split is a function
  if (typeof date.split !== "function") return date;

  const inputDate =
    date?.split("-")[0]?.length === 4 ? new Date(date) : parseInputDate(date);

  return inputDate.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
