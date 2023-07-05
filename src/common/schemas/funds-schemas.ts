import * as yup from "yup";

export const fundsValidator = yup.object({
    entity: yup
        .number(),
    funds: yup
        .string(),
    dateFrom: yup
        .date(),
    dateTo: yup
        .date()
});