import * as yup from "yup";

export const functionalArea = yup.object({
    inputCodigoFuncional: yup
        .string()
});

export const functionalAreaCrud = yup.object({
    number: yup
        .string()
        .matches(/^(?:\d{5}\.\d{5}\.\d{4}|\d{8}\.\d{4}\.\d{2})$/, "Validar estructura")
        .required("El campo es obligatorio")
        .max(16, "Solo se permiten 16 caracteres")
        .test('no-all-zeros', 'No se permiten valores completamente en cero', value => {
            const digitsOnly = value.replace(/\./g, '');
            return digitsOnly !== '0'.repeat(digitsOnly.length);
          }),
    denomination: yup
        .string()
        .required("El campo es obligatorio")
        .max(100, "Solo se permiten 100 caracteres"),
    description: yup
        .string()
        .required("El campo es obligatorio")
        .max(500, "Solo se permiten 500 caracteres"),
});