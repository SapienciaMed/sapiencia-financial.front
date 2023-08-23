import * as yup from "yup";
import _ from 'lodash'

export const fundsValidator = yup.object({});

export const fundsCrudValidator = yup.object({
    entity: yup.string().required("El campo es obligatorio"),
    number: yup
        .string()
        .required("El campo es obligatorio")
        .matches(/^[0-9]+$/, "Solo se permiten numeros")
        .max(15, "Solo se permiten 15 caracteres"),
    denomination: yup
        .string()
        .required("El campo es obligatorio")
        .max(250, "Solo se permiten 250 caracteres"),
    description: yup
        .string()
        .required("El campo es obligatorio")
        .max(250, "Solo se permiten 250 caracteres"),
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

export const fundsAdditionalValidation =  yup.object({
    ingreso: yup.array()
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
        }))
        .test('uniqueValues', 'datos duplicados en el sistema', function (value) {
            const nonEmptyValues = value.filter((item) => {
                const hasAllValues = Object.keys(item).every((key) => item[key] !== undefined && item[key] !== '');
                return hasAllValues;
            });
            
            const duplicatesFound = nonEmptyValues.some((item, index) =>
                nonEmptyValues.slice(0, index).some((otherItem) => _.isEqual(item, otherItem))
            );
            
            return !duplicatesFound;
        }),
        gasto: yup.array()
            .of(yup.object().shape({
                managerCenter : yup 
                    .string()
                    .required("Completar información del campo"),
                projectId: yup 
                    .string()
                    .required("Completar información del campo"),
                functionalArea: yup 
                    .string()
                    .required("El campo es obligatorio"),
                funds: yup 
                    .string()
                    .required("Completar información del campo"),
                posPre:  yup 
                    .string()
                    .required("Completar información del campo"),
                value: yup 
                    .string()
                    .required("Completar información del campo"),
            }))
        .test('uniqueValues', 'datos duplicados en el sistema', function (value) {
            const nonEmptyValues = value.filter((item) => {
                const hasAllValues = Object.keys(item).every((key) => item[key] !== undefined && item[key] !== '');
                return hasAllValues;
            });
            
            const duplicatesFound = nonEmptyValues.some((item, index) =>
                nonEmptyValues.slice(0, index).some((otherItem) => _.isEqual(item, otherItem))
            );
            
            return !duplicatesFound;
        }),
        actAdministrativeDistrict: yup
            .string()
            .required("El campo es obligatorio")
            .max(200, "Solo se permiten 200 caracteres"),
        actAdministrativeSapiencia: yup 
            .string()
            .required("El campo es obligatorio")
            .max(100, "Solo se permiten 100 caracteres"),
});