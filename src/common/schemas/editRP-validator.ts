import * as yup from "yup";

export const useYupValidator = yup.object({})

export const editRpValidator = yup.object({  
    creditAmount: yup 
        .string()
        .required("Este campo es obligatorio"),
        againtsAmount: yup 
        .string()
        .required("Este campo es obligatorio"),
        fixedCompleted: yup 
        .string()
        .required("Este campo es obligatorio"),
    
})