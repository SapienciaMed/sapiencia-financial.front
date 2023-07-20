import * as yup from "yup";

export const pospreSapienciaValidator = yup.object({});

export const pospreSapienciaCrudValidator = yup.object({
    number: yup
        .string()
        .required("El campo es obligatorio"),
    ejercise: yup
        .string()
        .matches(/^[0-9]+$/, "Solo se permiten numeros")
        .max(10, "Solo se permiten 10 caracteres"),
    description: yup
        .string()
        .required("El campo es obligatorio")
        .max(250, "Solo se permiten 250 caracteres"),
    consecutive: yup
        .string()
        .matches(/^[0-9]+$/, "Solo se permiten numeros")
        .max(10, "Solo se permiten 10 caracteres"),
    assignedTo: yup
        .string()
        .required("El campo es obligatorio")
})