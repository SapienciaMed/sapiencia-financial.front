import * as yup from "yup";

export const budgetsValidator = yup.object({
    number: yup
    .string()
    .max(30, 'Solo se permiten 30 caracteres' )
    .test('is-positive', 'El número no puede ser negativo', function (value) {
        if (!value) {
            return true; 
          }
          const numberValue = parseFloat(value);
          return !isNaN(numberValue) && numberValue >= 0;
    })
});

export const budgetsCrudValidator = yup.object({
    entity: yup.string().required("El campo es obligatorio"),
    number: yup
        .string()
        .required("El campo es obligatorio")
        .matches(/^[0-9]+$/, "Solo se permiten números")
        .max(30, "Solo se permiten 30 caracteres"),   
    ejercise:yup
        .string()
        .required("El campo es obligatorio")
        .matches(/^[0-9]+$/, "Solo se permiten números")
        .max(4, "Solo se permiten 4 caracteres")
        .min(4, "Ingrese al menos 4 caracteres"),
    denomination: yup
        .string()
        .required("El campo es obligatorio")
        .max(100, "Solo se permiten 100 caracteres"),
    description: yup
        .string()
        .required("El campo es obligatorio")
        .max(500, "Solo se permiten 500 caracteres")
});