import * as yup from "yup";

export const functionalArea = yup.object({});

export const functionalAreaCrud = yup.object({
    number: yup
        .string()
        .matches(/^[0-9]+$/, "Solo se permiten numeros")
        .required("El campo es obligatorio")
        .max(15, "Solo se permiten 15 caracteres"),
    denomination: yup
        .string()
        .required("El campo es obligatorio")
        .max(250, "Solo se permiten 250 caracteres"),
    description: yup
        .string()
        .required("El campo es obligatorio")
        .max(500, "Solo se permiten 500 caracteres"),
});