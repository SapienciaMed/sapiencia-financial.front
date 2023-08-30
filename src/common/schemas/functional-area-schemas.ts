import * as yup from "yup";

export const functionalArea = yup.object({
    inputCodigoFuncional: yup
        .string()
});

export const functionalAreaCrud = yup.object({
    number: yup
        .string()
        .matches(/^(?:\d{8}\.\d{4}\.\d{2})$/, "Solo se permiten numeros")
        .required("El campo es obligatorio")
        .max(16, "Solo se permiten 16 caracteres"),
    denomination: yup
        .string()
        .required("El campo es obligatorio")
        .max(100, "Solo se permiten 100 caracteres"),
    description: yup
        .string()
        .required("El campo es obligatorio")
        .max(500, "Solo se permiten 500 caracteres"),
});