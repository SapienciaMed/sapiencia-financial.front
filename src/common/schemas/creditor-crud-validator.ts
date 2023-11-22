
import * as yup from "yup";

export const creditorCrudValidator = yup.object({
    typeDocument:yup
    .string()
    .required("El campo es obligatorio")
    .max(4, "Solo se permiten 4 caracteres"),
    document:yup
    .string()
    .required("El campo es obligatorio")
    .max(20, "Solo se permiten 20 caracteres"),
    taxIdentification:yup
    .string()
    .required("El campo es obligatorio")
    .max(20, "Solo se permiten 20 caracteres"),
    name:yup
    .string()
    .required("El campo es obligatorio")
    .max(200, "Solo se permiten 200 caracteres"),
    city:yup
    .string()
    .required("El campo es obligatorio")
    .max(50, "Solo se permiten 50 caracteres"),
    address:yup
    .string()
    .required("El campo es obligatorio")
    .max(50, "Solo se permiten 50 caracteres"),
    phone:yup
    .string()
    .required("El campo es obligatorio"),
    email:yup
    .string()
    .required("El campo es obligatorio")
    .max(50, "Solo se permiten 50 caracteres")
    .email("Debe ser un correo electrónico válido"),
});
