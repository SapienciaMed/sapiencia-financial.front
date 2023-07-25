import * as yup from "yup";

export const vinculationValidator = yup.object({
    number: yup
    .string()
    .max(15, "Solo se permiten 15 caracteres"),   

});
