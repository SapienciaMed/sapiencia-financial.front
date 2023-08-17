import * as yup from "yup";

export const fundsValidator = yup.object({});

export const fundsCrudValidator = yup.object({
    entity: yup.string().required("El campo es obligatorio"),
    number: yup
        .string()
        .required("El campo es obligatorio")
        .matches(/^[0-9]+$/, "Solo se permiten numeros")
        .max(15, "Solo se permiten 15 caracteres"),
    denomination: yup
        .string()
        .required("El campo es obligatorio")
        .max(250, "Solo se permiten 250 caracteres"),
    description: yup
        .string()
        .required("El campo es obligatorio")
        .max(250, "Solo se permiten 250 caracteres"),
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

export const fundsAdditionalValidation =  yup.object({
    ingreso: yup.array()
        .of(yup.object().shape({
            managerCenter : yup 
                .string()
                .required("El campo es obligatorio"),
            projectId: yup 
                .string()
                .required("El campo es obligatorio"),
            functionalArea: yup 
                .string()
                .required("El campo es obligatorio"),
            funds: yup 
                .string()
                .required("El campo es obligatorio"),
            posPre:  yup 
                .string()
                .required("El campo es obligatorio"),
            value: yup 
                .string()
                .required("El campo es obligatorio"),
        }))
});