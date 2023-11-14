import * as yup from "yup";

export const budgetRecordEditCrudValidator = yup.object({
    documentDate: yup
        .string()
        .required("El campo es obligatorio"),
    dateValidity: yup
        .string()
        .required("El campo es obligatorio"),
    dependencyId: yup
        .string()
        .required("El campo es obligatorio"),
    contractualObject: yup
        .string()
        .required("El campo es obligatorio"),
    componentId: yup
        .string()
        .required("El campo es obligatorio"),
});
