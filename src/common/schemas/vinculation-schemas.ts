import * as yup from "yup";

export const vinculationValidator = yup.object({
    id: yup
    .string()
    .required("El campo es obligatorio")
    .matches(/^[0-9]+$/, "Solo se permiten numeros")
    .max(15, "Solo se permiten 15 caracteres"),   

});
