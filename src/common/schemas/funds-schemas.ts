import * as yup from "yup";

export const fundsValidator = yup.object({
    number: yup
    .string()
    .max(30, 'Solo se permiten 30 caracteres' )
});

export const fundsCrudValidator = yup.object({
    entity: yup.string().required("El campo es obligatorio"),
    number: yup
        .string()
        .required("El campo es obligatorio")
        .test('len', 'Solo se permiten 30 caracteres', (val) => { if (val && val.toString().length > 30) return val.toString().length < 30; else return true}),
    denomination: yup
        .string()
        .required("El campo es obligatorio")
        .max(100, )
        .test('len', "Solo se permiten 100 caracteres", (val) => { if (val && val.toString().length > 100) return val.toString().length < 100; else return true}),
    description: yup
        .string()
        .required("El campo es obligatorio")
        .test('len', "Solo se permiten 500 caracteres", (val) => { if (val && val.toString().length > 500) return val.toString().length < 500; else return true}),
    dateFrom: yup
        .date()
        .required("El campo es obligatorio")
        .typeError("Fecha invalida"),
    dateTo: yup
        .date()
        .required("El campo es obligatorio")
        .typeError("Fecha invalida"),
});

export const fundsAdditional = yup.object({
    actAdministrativeDistrict: yup
        .string(),
    actAdministrativeSapiencia: yup 
        .string()
})