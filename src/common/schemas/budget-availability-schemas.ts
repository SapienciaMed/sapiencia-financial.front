import * as yup from "yup";

export const budgetAvailabilityValidator = yup.object({
  dateOfCdp: yup
    .string()
    .min(4, "No es un año valido")
    .max(4, "No es un año valido")
    .required("El campo es obligatorio"),
  contractObject: yup.string().max(5000, " "),
});
