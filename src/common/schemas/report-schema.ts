import * as yup from "yup";

export const ReportValidator = yup.object({
  exercise: yup
    .string()
    .min(4, "No es un año valido")
    .max(4, "No es un año valido")
    .required("El campo es obligatorio"),
});
