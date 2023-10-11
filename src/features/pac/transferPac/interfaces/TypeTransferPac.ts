import { ICreateTransferPacForm } from "../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface"
import { UseFormSetValue, UseFormRegister, FieldErrors, Control } from 'react-hook-form';
import { IArrayDataSelect } from '../../../../common/interfaces/global.interface';

export interface ICreateFundTransferPac {
    titleAdd: 'origen' | 'destino',
    control: Control<ICreateTransferPacForm, any>
    arrayDataSelect: IArrayDataSelect, 
    errors: FieldErrors<ICreateTransferPacForm>, 
    register: UseFormRegister<ICreateTransferPacForm>, 
    setValue: UseFormSetValue<ICreateTransferPacForm>,
    isdataReset: boolean,
    pacTypeState: number,
    itemsPerPage: number,
    startIndex: number,
    isActivityAdd: boolean,
    cardIdService: string
}