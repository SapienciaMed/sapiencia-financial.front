import * as yup from "yup";

export const budgetRecordEditCrudValidator = yup.object({
    documentDate: yup
        .string()
        .required("El campo es obligatorio"),
    dateValidity: yup
        .string()
        .required("El campo es obligatorio")
        .test('date-validity', 'Fecha validación no puede ser menor que fecha documento', function(value) {
            const { documentDate } = this.parent; // Obtener el valor de documentDate
            if (documentDate && value) {
                return new Date(value) >= new Date(documentDate);
            }
            return true; // Si documentDate o dateValidity no están presentes, la validación pasa
        }),
    dependencyId: yup
        .string()
        .required("El campo es obligatorio"),
    contractualObject: yup
        .string()
        .required("El campo es obligatorio"),
    componentId: yup
        .string()
        .required("El campo es obligatorio"),
});
