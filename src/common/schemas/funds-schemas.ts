import * as yup from "yup";
import _ from 'lodash'

export const fundsValidator = yup.object({
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