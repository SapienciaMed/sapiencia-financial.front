import * as yup from "yup";

export const budgetRecordCrudValidator = yup.object({
    supplierType: yup
        .string()
        .required("El campo es obligatorio"),
    /* supplierId: yup
        .string()
        .required("El campo es obligatorio"),
    contractorDocument: yup
        .string()
        .required("El campo es obligatorio"),
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
    userCreate: yup
        .string()
        .required("El campo es obligatorio"),
    userModify: yup
        .string()
        .required("El campo es obligatorio"),
    dateCreate: yup
        .string()
        .required("El campo es obligatorio"),
    dateModify: yup
        .string()
        .required("El campo es obligatorio") */
});
