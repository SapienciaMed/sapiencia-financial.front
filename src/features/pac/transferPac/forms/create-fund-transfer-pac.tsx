import React, { useState } from "react";
import { useFieldArray, Control } from 'react-hook-form';
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useCreateFundTransferPac } from "../hook/create-fund-transfer-pac.hook";
import FormTransferPac from "../../../managementCenter/transfer/forms/form-transfer-pac";
import { IAddFundPac } from "../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface";
import { useWidth } from "../../../../common/hooks/use-width";

interface IProp {
    titleAdd: 'origen' | 'destino',
}

function CreateFundTransferPac({ titleAdd }:IProp ) {

    const {width} = useWidth()
    const { control, arrayDataSelect, errors, register, setValue } = useCreateFundTransferPac()

    const { fields, append } = useFieldArray({
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
        result: {
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
                            />

                        </section>
                    )
                })
            }


        </div>
    )
}

export default React.memo(CreateFundTransferPac);