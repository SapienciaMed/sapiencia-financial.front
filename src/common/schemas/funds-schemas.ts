import * as yup from "yup";

export const fundsValidator = yup.object({});

export const fundsCrudValidator = yup.object({
    entity: yup.string().required("El campo es obligatorio"),
    number: yup
        .string()
        .required("El campo es obligatorio")
        .matches(/^[0-9]+$/, "Solo se permiten numeros")
        .max(30, "Solo se permiten 30 caracteres"),
    denomination: yup
        .string()
        .required("El campo es obligatorio")
        .max(100, "Solo se permiten 250 caracteres"),
    description: yup
        .string()
        .required("El campo es obligatorio")
        .max(500, "Solo se permiten 500 caracteres"),
    dateFrom: yup
        .date()
        .required("El campo es obligatorio")
        .typeError("Fecha invalida"),
    dateTo: yup
        .date()
        .required("El campo es obligatorio")
        .typeError("Fecha invalida"),
});

export const fundsAdditional = yup.object({
    actAdministrativeDistrict: yup
        .string(),
    actAdministrativeSapiencia: yup 
        .string()
})