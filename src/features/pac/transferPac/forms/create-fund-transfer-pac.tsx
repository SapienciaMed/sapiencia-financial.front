import React, { useEffect, useState } from "react";
import { useFieldArray, useWatch } from 'react-hook-form';
import { AiOutlinePlusCircle } from "react-icons/ai";
import FormTransferPac from "./form-transfer-pac";
import { IAddFundPac } from "../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface";
import { useWidth } from "../../../../common/hooks/use-width";
import { ICreateFundTransferPac } from "../interfaces/TypeTransferPac";

function CreateFundTransferPac({ titleAdd, arrayDataSelect, control, errors, pacTypeState, isdataReset, itemsPerPage, cardIdService,
    startIndex, isActivityAdd, annualDataRoutes, register, setValue, setIsdataResetState }:ICreateFundTransferPac ) {
   
    const [dataCardId, setDataCardId] = useState('')

    const {width} = useWidth()

    const { fields, append, remove } = useFieldArray({
        control,
        name: titleAdd ,
    });

    const watchCardId = useWatch({
        control,
        name: titleAdd,
    })

    const initialValue: IAddFundPac = {
        managerCenter: '',
        projectId: '',
        projectName: '',
        functionalArea: '',
        value: '',
        cardId: '',
        fundsSapiencia: '',
        pospreSapiencia: '',
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
        },
        programmed:  {
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

    const visibleFields = fields.slice(startIndex, startIndex + itemsPerPage);
    
    useEffect(() => {
        isdataReset && remove()
    },[isdataReset])
    
    
    useEffect(() => {
        visibleFields.length == 0 && setIsdataResetState(false)
    },[visibleFields])

    // useEffect(() => { 
    //     console.log("encontro la card: ", visibleFields.filter(us => us.id));
    // },[visibleFields])

    useEffect(() => {
        watchCardId?.every(us => us.cardId == cardIdService ) && setDataCardId(cardIdService)
    },[cardIdService])

    useEffect(() => {
        console.log("🚀 cardIdService:", cardIdService)
    },[cardIdService])

    return(
        <div className="display-flex-direction-column padding paddingBotom gap-1">
            <button 
                className={`btn-rimless biggest ${titleAdd == 'origen' ? 'display-align-flex-end' : width < 1024 ? 'display-align-flex-end' : 'display-justify-flex-end'}  gap-0 pointer`}
                onClick={() => { append(initialValue) }}
                disabled={isActivityAdd}
                form="none"
            >
                Añadir {titleAdd} <AiOutlinePlusCircle />
            </button>

            {
                visibleFields.map((field, index) => {
                    return(
                        <section className="style-form-create" key={field.id}>
                            <div className={` ${ titleAdd == 'origen' ? 'title-form' : 'title-form-2'}`}>
                                <div className="content-title-form text-black weight-500 large" > {titleAdd.charAt(0).toUpperCase() + titleAdd.slice(1)} </div>
                            </div>
                            <FormTransferPac
                                arrayDataSelect={arrayDataSelect}
                                cardId={field.id}
                                control={control}
                                count={startIndex + index} 
                                errors={errors}
                                titleAdd={titleAdd}
                                register={register}
                                setValue={setValue}
                                pacTypeState={pacTypeState}
                                annualDataRoutes={annualDataRoutes}
                            />

                        </section>
                    )
                })
            }

        </div>
    )
}

export default React.memo(CreateFundTransferPac);