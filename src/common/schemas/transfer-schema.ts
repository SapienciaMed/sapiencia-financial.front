import * as yup from "yup";
import _ from 'lodash'

export const transferValidator = yup.object({});

export const transferAreaCrudValidator = yup.object({
    adminDistrict: yup
        .string()
        .required("Completa este campo")
        .max(200, 'Solo se permiten 200 caracteres'),
    adminSapiencia: yup 
        .string()
        .required("Completa este campo")
        .max(100, 'Solo se permiten 100 caracteres'),
    remarks: yup 
        .string()
        .required("Completa este campo")
        .max(200, 'Solo se permiten 200 caracteres'),
})
