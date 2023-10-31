import * as yup from "yup";

export const budgetAvailabilityValidator = yup.object({
  dateOfCdp: yup
    .string()
    .min(4, "No es un año valido")
    .max(4, "No es un año valido")
    .required("El campo es obligatorio"),
  contractObject: yup.string().max(5000, " "),
});

export const budgetAvailabilityEditValidator = yup.object({
  date: yup
    .date()
    .min(new Date(1900, 0, 1))
    .required("El campo es obligatorio"),
  contractObject: yup
    .string()
    .min(1, "El campo no puede estar vacio")
    .max(5000, " ")
    .required("El campo es obligatorio"),
});
