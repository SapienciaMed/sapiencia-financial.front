import * as yup from "yup";

export const pacCrudValidator = yup.object({
    exercise: yup
        .string()
        .matches(/^[0-9]+$/, "Solo se permiten numeros")
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
     typePac: yup
        .string()
        .required("Completa la información"),
    typeSource: yup
        .string()
        .required("Completa la información"),
    /* file: yup
        .string()
        .required("Completa la información"), */
})