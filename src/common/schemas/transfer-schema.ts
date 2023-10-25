import * as yup from "yup";
import _ from 'lodash'

export const transferValidator = yup.object({});

export const transferAreaCrudValidator = yup.object({
    actAdminDistrict: yup
        .string()
        .required("Completa este campo")
        .max(200, 'Solo se permiten 200 caracteres'),
    actAdminSapiencia: yup 
        .string()
        .required("Completa este campo")
        .max(100, 'Solo se permiten 100 caracteres'),
    observations: yup 
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

export const validationTransferPac = yup.object({
    pacType: yup
        .string()
        .required("Completa este campo")
        .max(50, 'Solo se permiten 50 caracteres'),
    validity: yup 
        .string()
        .required("Completa este campo")
        .max(10, 'Solo se permiten 10 caracteres'),
    TypeResource: yup 
        .string()
        .required("Completa este campo")
        .max(50, 'Solo se permiten 50 caracteres'),

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
            fundsSapiencia: yup 
                .string()
                .max(9, 'Solo se permiten 9 caracteres')
                .required("Completar información del campo"),
            pospreSapiencia:  yup 
                .string()
                .max(30, 'Solo se permiten 30 caracteres')
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
                .max(20, 'Solo se permiten 20 caracteres')
                .required("Completar información del campo"),
            functionalArea: yup 
                .string()
                .max(16, 'Solo se permiten 16 caracteres')
                .required("Completar información del campo"),
            fundsSapiencia: yup 
                .string()
                .max(9, 'Solo se permiten 9 caracteres')
                .required("Completar información del campo"),
            pospreSapiencia:  yup 
                .string()
                .max(30, 'Solo se permiten 30 caracteres')
                .required("Completar información del campo"),
            projectName: yup
                .string()
                .required("Completar información del campo"),
        })),

})

export const validationAssociatePac = yup.object({
    exercise:  yup
        .string()
        .matches(/^[0-9]+$/, "Solo se permiten numeros")
        .required("Este campo es obligatorio")
        .max(4, "Solo se permiten 4 caracteres")
        .min(4, "Ingrese al menos 4 caracteres")
        .test('uniqueValues', 'Ingrese una vigencia mayor o igual al año actual', function (value) {
            const date = new Date();
            const year = date.getFullYear();
            const id = this.parent.id;
            if (id == null && value && parseInt(value) >= year) {
                return true
            } else if (id != null) {
                return true
            } else {
                return false
            }
        }),
    resourceType: yup 
        .string()
        .required("Este campo es obligatorio"),
    managerCenter : yup 
        .string()
        .required("Este campo es obligatorio"),
    projectId: yup
        .string()
        .required("Este campo es obligatorio"),
    fundsSapiencia: yup
        .string()
        .required("Este campo es obligatorio"),
    pospreSapiencia: yup
        .string()
        .required("Este campo es obligatorio"),
    functionalArea: yup
        .string()
        .required("Este campo es obligatorio"),
    projectName: yup 
        .string()
        .required("Este campo es obligatorio"), 
    sapienciaBudget: yup 
        .string()
        .matches(/^[0-9]+$/, "Solo se permiten numeros")
        .required("Este campo es obligatorio")
        .test('no-all-zeros', 'No se permiten valores en cero', value => {
            const digitsOnly = value ? value.replace(/\./g, '') : null;
            return digitsOnly !== null && digitsOnly !== '0'.repeat(digitsOnly.length);
          }),
    totalProgrammed: yup 
        .string()
        .matches(/^[0-9]+$/, "Solo se permiten numeros")
        .required("Este campo es obligatorio")
        .test('no-all-zeros', 'No se permiten valores en cero', value => {
            const digitsOnly = value ? value.replace(/\./g, '') : null;
            return digitsOnly !== null && digitsOnly !== '0'.repeat(digitsOnly.length);
          }),
})