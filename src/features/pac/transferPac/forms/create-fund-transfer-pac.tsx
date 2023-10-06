import React, { useEffect, useState } from "react";
import { useFieldArray, Control, FieldErrors, UseFormRegister, UseFormSetValue  } from 'react-hook-form';
import { AiOutlinePlusCircle } from "react-icons/ai";
import FormTransferPac from "./form-transfer-pac";
import { IAddFundPac, ICreateTransferPacForm } from "../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface";
import { useWidth } from "../../../../common/hooks/use-width";
import { IArrayDataSelect } from "../../../../common/interfaces/global.interface";

interface IProp {
    titleAdd: 'origen' | 'destino',
    control: Control<ICreateTransferPacForm, any>
    arrayDataSelect: IArrayDataSelect, 
    errors: FieldErrors<ICreateTransferPacForm>, 
    register: UseFormRegister<ICreateTransferPacForm>, 
    setValue: UseFormSetValue<ICreateTransferPacForm>,
    isdataReset: boolean,
    pacTypeState: number
}

function CreateFundTransferPac({ titleAdd, arrayDataSelect,control, errors, pacTypeState, isdataReset, register, setValue }:IProp ) {

    const {width} = useWidth()

    const { fields, append, remove } = useFieldArray({
        control,
        name: titleAdd  
    });

    const initialValue: IAddFundPac = {
        managerCenter: '',
        projectId: '',
        projectName: '',
        functionalArea: '',
        funds: '',
        posPre: '',
        value: '',
        cardId: '',
        collected: {
            january: '',
            february: '',
            march: '',
            april: '',
            may: '',
            june: '',
            july: '',
            august: '',
            september: '',
            october: '',
            november: '',
            december: '',
        }
    }

    //TODO: este paginado toca sacarlo, al componente superior
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const visibleFields = fields.slice(startIndex, startIndex + itemsPerPage);

    // useEffect(() => {
    //     isdataReset && remove()
    // },[isdataReset])
    
    return(
        <div className="display-flex-direction-column gap-1">
            <div 
                className={`title-button text-main biggest ${titleAdd == 'origen' ? 'display-align-flex-end' : width < 1024 ? 'display-align-flex-end' : 'display-justify-flex-end '}  gap-0 ml-1rem small pointer`}
                onClick={() => {
                    append(initialValue)
                }} 
            >
                Añadir {titleAdd} <AiOutlinePlusCircle />
            </div>

            {
                visibleFields.map((field, index) => {
                    return(
                        <section className="style-form-create" key={field.id}>
                            <div className={` ${ titleAdd == 'origen' ? 'title-form' : 'title-form-2'}`}>
                                <div className="content-title-form text-black weight-500 large" > {titleAdd.charAt(0).toUpperCase() + titleAdd.slice(1)} </div>
                            </div>
                            <FormTransferPac
                                arrayDataSelect={arrayDataSelect}
                                cardId=""
                                control={control}
                                count={startIndex + index} 
                                errors={errors}
                                titleAdd={titleAdd}
                                register={register}
                                setValue={setValue}
                                pacTypeState={pacTypeState}
                            />

                        </section>
                    )
                })
            }


        </div>
    )
}

export default React.memo(CreateFundTransferPac);