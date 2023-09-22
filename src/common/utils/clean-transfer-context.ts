import { SetStateAction } from "react";
import { IPagingData } from "./api-response";
import { IobjectAddTransfer } from "../interfaces/global.interface";

interface ICleanContext {
    setAddTransferData: (value: SetStateAction<IPagingData<IobjectAddTransfer>>) => void,
    setDetailTransferData: (value: SetStateAction<IPagingData<IobjectAddTransfer>>) => void
}

export function cleanTransferContext({ setAddTransferData, setDetailTransferData } : ICleanContext) {

    setAddTransferData({
        array: [],
        meta: { total: 1 }
    });

    setDetailTransferData({
        array: [],
        meta: { total: 1 }
    })
}