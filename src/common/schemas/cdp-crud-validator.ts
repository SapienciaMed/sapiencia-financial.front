import * as yup from "yup";

export const cdpCrudValidator = yup.object({})

export const cdpMgaAssoc = yup.object({
    DetailedActivityMGA: yup
        .string()
        .required("Este campo es obligatorio"),
    cpc: yup 
        .string()
        .required("Este campo es obligatorio"),
    percentageAffected: yup 
        .string()
        .required("Este campo es obligatorio")
        .test('is-percent-range', 'El porcentaje debe estar entre 0 y 100', (value) => {
            if (value) {
                const numericValue = parseFloat(value);
                return numericValue >= 0 && numericValue <= 100;
            }
            return true; 
        }),

})