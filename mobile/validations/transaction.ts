import * as yup from "yup";

export const transactionValidationSchema = yup.object().shape({
  // id: yup.string().optional(),

  description: yup.string().required("Description is required"),

  amount: yup
    .number()
    .typeError("Amount must be a valid number")
    .transform((originalValue) => {
      const parsed = parseFloat(originalValue);
      return Number.isNaN(parsed) ? null : parsed;
    })
    .nullable()
    .required("Amount is required"),

  category: yup.string().required("Category is required"),

  transactionDate: yup.string().required("Date is required"),
});
