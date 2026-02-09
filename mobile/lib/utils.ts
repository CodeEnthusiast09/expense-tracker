import { ClerkError } from "@/interface/clerk";

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

export // Helper function to extract error message with type safety
  const getErrorMessage = (err: unknown): string => {
    // Type guard: Check if it's a Clerk error object
    if (err && typeof err === "object" && "errors" in err) {
      const clerkError = err as ClerkError;

      if (clerkError.errors && clerkError.errors.length > 0) {
        const firstError = clerkError.errors[0];

        // Handle specific error codes with custom messages
        switch (firstError.code) {
          case "form_password_incorrect":
            return "Incorrect password. Please try again.";

          case "form_identifier_not_found":
            return "No account found with this email.";

          case "form_password_pwned":
            return "This password has been compromised in a data breach. Please choose a different password.";

          case "form_password_length_too_short":
            return "Password must be at least 8 characters long.";

          case "form_password_length_too_long":
            return "Password is too long. Please use fewer characters.";

          case "form_param_format_invalid":
            return "Invalid email format. Please check and try again.";

          case "form_identifier_exists":
            return "An account with this email already exists.";

          case "form_code_incorrect":
            return "Incorrect verification code. Please check and try again.";

          case "verification_expired":
            return "Verification code has expired. Please request a new one.";

          case "not_allowed_access":
            return "You don't have permission to access this.";

          // If we have a code but don't recognize it, use Clerk's message
          // but fall back to our custom message if Clerk's is weird
          default:
            // Use longMessage if available, otherwise message
            const clerkMessage = firstError.longMessage || firstError.message;

            // Clean up Clerk's messages that mention "another method"
            // when we only have email/password
            const cleanedMessage = clerkMessage
              .replace(/try another method/gi, "try again")
              .replace(/or use another method/gi, "");

            return cleanedMessage;
        }
      }
    }

    // If it has a message property (but not the Clerk error structure)
    if (err && typeof err === "object" && "message" in err) {
      return (err as { message: string }).message;
    }

    // Fallback for completely unknown errors
    return "An unexpected error occurred. Please try again.";
  };
