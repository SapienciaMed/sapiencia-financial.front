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

export const validationFieldsCreatefunds = yup.object({
    origen: yup.array()
        .of(yup.object().shape({
            managerCenter : yup 
                .string()
                .required("Completar información del campo"),
            projectId: yup 
                .string()
                .max(20, 'Solo se permiten 20 caracteres')
                .required("Completar información del campo"),
            functionalArea: yup 
                .string()
                .max(16, 'Solo se permiten 16 caracteres')
                .required("Completar información del campo"),
            funds: yup 
                .string()
                .max(9, 'Solo se permiten 9 caracteres')
                .required("Completar información del campo"),
            posPre:  yup 
                .string()
                .max(30, 'Solo se permiten 30 caracteres')
                .required("Completar información del campo"),
            value: yup 
                .string()
                .required("Completar información del campo"),
            projectName: yup
                .string()
                .required("Completar información del campo"),
        })),
    destino: yup.array()
        .of(yup.object().shape({
            managerCenter : yup 
                .string()
                .required("Completar información del campo"),
            projectId: yup 
                .string()
                .required("Completar información del campo"),
            functionalArea: yup 
                .string()
                .required("Completar información del campo"),
            funds: yup 
                .string()
                .required("Completar información del campo"),
            posPre:  yup 
                .string()
                .required("Completar información del campo"),
            value: yup 
                .string()
                .required("Completar información del campo"),
            projectName: yup
                .string()
                .required("Completar información del campo"),
        })),
        

})
