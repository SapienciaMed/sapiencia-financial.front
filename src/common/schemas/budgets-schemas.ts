import * as yup from "yup";

export const budgetsValidator = yup.object({
    number: yup
        .string()
        .max(30, 'Solo se permiten 30 caracteres')
        .matches(/^[0-9]+$/, "Solo se permiten numeros")
});

export const budgetsCrudValidator = yup.object({
    entity: yup.string().required("El campo es obligatorio"),
    number: yup
        .string()
        .required("El campo es obligatorio")
        .matches(/^[0-9]+$/, "Solo se permiten numeros")
        .max(30, "Solo se permiten 30 caracteres"),
    ejercise: yup
        .string()
        .required("El campo es obligatorio")
        .matches(/^[0-9]+$/, "Solo se permiten numeros")
        .max(4, "Solo se permiten 4 números")
        .min(4, "Solo se permiten 4 números")
        .test('uniqueValues', 'Ingrese año actual', (value) => {
            const date = new Date();
            const year = date.getFullYear();
            if (value && parseInt(value) == year) return true;
            else return false;
        }),
    denomination: yup
        .string()
        .required("El campo es obligatorio")
        .max(100, "Solo se permiten 100 caracteres"),
    description: yup
        .string()
        .required("El campo es obligatorio")
        .max(500, "Solo se permiten 500 caracteres")
        
});