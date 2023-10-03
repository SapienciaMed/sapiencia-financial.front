import * as yup from "yup";

export const projectOperationCrudValidator = yup.object({
    entityId: yup
        .string()
        .required("Completa la información"),
    number: yup
        .string()
        .required("El campo es obligatorio"),
    name: yup
        .string()
        .required("Completa la información")
        .max(200, "Solo se permiten 200 caracteres"),
    exercise: yup
        .string()
        .matches(/^[0-9]+$/, "Solo se permiten numeros")
        .max(4, "Solo se permiten 4 caracteres")
        .min(4, "Ingrese al menos 4 caracteres")
        .test('uniqueValues', 'Ingrese una vigencia mayor o igual al año actual', function(value){
            const date = new Date();
            const year = date.getFullYear();
            const id = this.parent.id;
            console.log({id})
            if (id==null && value && parseInt(value) >= year ) {
                return true
            }else if(id!=null && value && parseInt(value) >= year ){
                return true
            }else{
                return false

            } 
        }),
    isActivated: yup
        .string()
        .required("Completa la información"),
    dateFrom: yup
        .string()
        .typeError("Fecha invalida")
        .test('uniqueValues', 'Ingrese una fecha mayor o igual al año actual', (value) => {
            const date = new Date();
            const year = date.getFullYear();
            if (value && parseInt(value) >= year-1) return true;
            else return false;
        })
        .required("Completa la información")
        .test('isDateFromBeforeOrEqualDateTo', 'La fecha inicial debe ser menor o igual a la fecha final', function (dateFrom) {
            const dateTo = this.parent.dateTo;
            if (!dateFrom || !dateTo) return true; // Permite que pase si alguno de los campos está vacío
            return new Date(dateFrom) <= new Date(dateTo);
          })
          .test('isValidDate', 'Ingresa una fecha válida en formato dd/mm/yyyy', (value) => {
            if (!value) return true; // Permite que pase si el campo está vacío
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            return dateRegex.test(value);
          }),
    dateTo: yup
        .string()
        .typeError("Fecha invalida")
        .required("Completa la información")
        /* .test('uniqueValues', 'Ingrese una fecha mayor o igual al año actual', (value) => {
            const date = new Date();
            const year = date.getFullYear();
            const valueDate = new Date(value)
            const yearValue = valueDate.getFullYear()
            console.log({yearValue, year})
            if (yearValue >= year) return true;
            else return false;
        }) */
        .test('isValidDate', 'Ingresa una fecha válida en formato dd/mm/yyyy', (value) => {
            if (!value) return true; // Permite que pase si el campo está vacío
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            return dateRegex.test(value);
          }),
        /* .test('isValidYear', 'Coloca una fecha válida (año de 4 dígitos)', (value) => {
            //if (!value) return true; // Permite que pase si el campo está vacío
            // Verifica que el valor tenga exactamente 4 dígitos
            const valueDate = new Date(value)
            const yearValue = valueDate.getFullYear()
            return /^[0-9]{4}$/.test(yearValue.toString());
          }), */
})