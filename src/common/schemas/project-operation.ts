import * as yup from "yup";

export const projectOperationCrudValidator = yup.object({
    entityId: yup
        .string()
        .required("Completa la información"),
    number: yup
        .string()
        .required("Completa la información"),
    //.required("El campo es obligatorio")
    //.max(30, "Solo se permiten 30 caracteres"),
    name: yup
        .string()
        .required("Completa la información")
        .max(200, "Solo se permiten 200 caracteres"),
    exercise: yup
        .string()
        //.required("El campo es obligatorio")
        .matches(/^[0-9]+$/, "Solo se permiten numeros")
        .max(4, "Solo se permiten 4 caracteres")
        .min(4, "Ingrese al menos 4 caracteres")
        .test('es-numero', 'Completa la información', value => {
            if (!value) { return false; }
            return parseInt(value, 10) > 0;
        }),
    isActivated: yup
        .string()
        .required("Completa la información"),
    dateFrom: yup
        .string()
        .typeError("Fecha invalida")
        .required("Completa la información"),
    dateTo: yup
        .string()
        .typeError("Fecha invalida")
        .required("Completa la información"),
        
    /* number: yup
        .string()
        .required("Completa la información")
        .max(30, "Solo se permiten 30 caracteres"),
    ejercise: yup
        .string()
        .matches(/^[0-9]+$/, "Solo se permiten numeros")
        .max(4, "Solo se permiten 4 caracteres")
        .min(4, "Ingrese al menos 4 caracteres"),
    description: yup
        .string()
        .required("Completa la información")
        .max(500, "Solo se permiten 500 caracteres"),
    consecutive: yup
        .string()
        .matches(/^[0-9]+$/, "Solo se permiten numeros")
        .max(2, "Solo se permiten 2 caracteres")
        .min(2, "Ingrese al menos 2 caracteres")
        .test('es-numero', 'Completa la información', value => {
            if (!value) { return false; }
            return parseInt(value, 10) > 0;
        }),
    assignedTo: yup
        .string()
        .required("El campo es obligatorio")
        .max(11, "Solo se permiten 11 caracteres") */
})