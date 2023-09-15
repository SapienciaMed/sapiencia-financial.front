import * as yup from "yup";

export const budgetRoutesValidator = yup.object({});

export const budgetRoutesCrudValidator = yup.object({
    idProjectVinculation: yup.string().required("El campo es obligatorio"),
    managementCenter: yup.string().required("El campo es obligatorio"),
    div: yup.string().required("El campo es obligatorio"),
    idBudget: yup.string().required("El campo es obligatorio"),
    idPospreSapiencia: yup.string().required("El campo es obligatorio"),
    idFund: yup.string().required("El campo es obligatorio")
});