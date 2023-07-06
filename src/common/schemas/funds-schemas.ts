import * as yup from "yup";

export const fundsValidator = yup.object({
    dateFrom: yup
        .date(),
    dateTo: yup
        .date()
});