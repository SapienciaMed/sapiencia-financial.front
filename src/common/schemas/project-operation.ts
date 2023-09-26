import * as yup from "yup";

export const projectOperationCrudValidator = yup.object({
    entityId: yup
        .string()
        .required("El campo es obligatorio"),
    number: yup
        .string()
        .required("El campo es obligatorio"),
    //.required("El campo es obligatorio")
    //.max(30, "Solo se permiten 30 caracteres"),
    name: yup
        .string()
        .required("El campo es obligatorio")
        .max(200, "Solo se permiten 200 caracteres"),
    exercise: yup
        .string()
        //.required("El campo es obligatorio")
        .matches(/^[0-9]+$/, "Solo se permiten numeros")
        .max(4, "Solo se permiten 4 caracteres")
        .min(4, "Ingrese al menos 4 caracteres")
        .test('es-numero', 'El campo es obligatorio', value => {
            if (!value) { return false; }
            return parseInt(value, 10) > 0;
        }),
    isActivated: yup
        .string()
        .required("El campo es obligatorio"),
    dateFrom: yup
        .string()
        .required("El campo es obligatorio")
        .typeError("Fecha invalida"),
    dateTo: yup
        .string()
        .required("El campo es obligatorio")
        .typeError("Fecha invalida"),
        
    /* number: yup
        .string()
        .required("El campo es obligatorio")
        .max(30, "Solo se permiten 30 caracteres"),
    ejercise: yup
        .string()
        .matches(/^[0-9]+$/, "Solo se permiten numeros")
        .max(4, "Solo se permiten 4 caracteres")
        .min(4, "Ingrese al menos 4 caracteres"),
    description: yup
        .string()
        .required("El campo es obligatorio")
        .max(500, "Solo se permiten 500 caracteres"),
    consecutive: yup
        .string()
        .matches(/^[0-9]+$/, "Solo se permiten numeros")
        .max(2, "Solo se permiten 2 caracteres")
        .min(2, "Ingrese al menos 2 caracteres")
        .test('es-numero', 'El campo es obligatorio', value => {
            if (!value) { return false; }
            return parseInt(value, 10) > 0;
        }),
    assignedTo: yup
        .string()
        .required("El campo es obligatorio")
        .max(11, "Solo se permiten 11 caracteres") */
})