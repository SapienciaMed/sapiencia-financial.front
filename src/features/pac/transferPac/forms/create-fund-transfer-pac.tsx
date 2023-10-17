import React, { useEffect, useState } from "react";
import { useFieldArray, useWatch } from 'react-hook-form';
import { AiOutlinePlusCircle } from "react-icons/ai";
import FormTransferPac from "./form-transfer-pac";
import { IAddFundPac } from "../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface";
import { useWidth } from "../../../../common/hooks/use-width";
import { ICreateFundTransferPac } from "../interfaces/TypeTransferPac";
import { usePacTransfersService } from "../hook/pac-transfers-service.hook";
import { EResponseCodes } from "../../../../common/constants/api.enum";
import { validateTypePac } from "../util/validate-type-pac";
import { validateTypeResourceServices } from "../util";
import { IAnnualRoute } from "../../interface/Pac";

function CreateFundTransferPac({ titleAdd, arrayDataSelect, control, errors, pacTypeState, isdataReset, itemsPerPage,
    startIndex, isActivityAdd, register, setValue, setIsdataResetState }:ICreateFundTransferPac ) {

    const { SearchAnnualDataRoutes } = usePacTransfersService()
    const [ annualDataRoutes, setAnnualDataRoutes ] = useState({
        annualRoute: [] as IAnnualRoute[]
      })

    const {width} = useWidth()

    const { fields, append, remove } = useFieldArray({
        control,
        name: titleAdd ,
    });

    const watchCardId = useWatch({
        control,
        name: titleAdd,
    })

    const vigencia = useWatch({
        name: 'validity',
        control
    })
    const tipoRecurso = useWatch({
        name: 'TypeResource',
        control
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
    
    useEffect(() => {
        if (watchCardId?.length > 0) {
            const dataSelectElement = watchCardId?.map(obj => {
                const {collected, programmed, value, typeTransfer, ...rest} = obj
                return {
                    isDataSelectComplete: Object.values(rest).every((value) => value !== "" ),
                    id: rest.cardId
                }
            })
            if (dataSelectElement?.every(value => value.isDataSelectComplete) && annualDataRoutes.annualRoute.length == 0){  
                dataSelectorComplete()
            }  

        }
     
    },[watchCardId])

    const changeValueOfSelect = (valor: any, idCard: string) => {
        console.log("🚀 idCard:", idCard)
        if (annualDataRoutes.annualRoute.length > 0) {
            dataSelectorComplete(idCard)
        }
    }

    const dataSelectorComplete = (idCard?: string) => {   
        
        let dataRoutes

        if (idCard != '') {
            dataRoutes = watchCardId?.filter(use => use.cardId == idCard).map(val => {
                return {
                    page: 1,
                    perPage: 1000000,
                    pacType: validateTypePac(pacTypeState),
                    exercise: vigencia,
                    resourceType: validateTypeResourceServices(String(tipoRecurso)),
                    managementCenter: val.managerCenter,
                    idProjectVinculation:  arrayDataSelect?.functionalArea.find(value => String(value.id) == val.functionalArea)?.id,
                    idBudget:  arrayDataSelect?.pospreSapiencia?.find(value => val.pospreSapiencia == value.id)?.idPosPreOrig,
                    idPospreSapiencia: val.pospreSapiencia,
                    idFund: val.fundsSapiencia,
                    idCardTemplate: val.cardId
                  }
            })
        } else {
            dataRoutes = watchCardId?.map(use => {
                return {
                  page: 1,
                  perPage: 1000000,
                  pacType: validateTypePac(pacTypeState),
                  exercise: vigencia,
                  resourceType: validateTypeResourceServices(String(tipoRecurso)),
                  managementCenter: use.managerCenter,
                  idProjectVinculation:  arrayDataSelect?.functionalArea.find(value => String(value.id) == use.functionalArea)?.id,
                  idBudget:  arrayDataSelect?.pospreSapiencia?.find(value => use.pospreSapiencia == value.id)?.idPosPreOrig,
                  idPospreSapiencia: use.pospreSapiencia,
                  idFund: use.fundsSapiencia,
                  idCardTemplate: use.cardId
                }
              })
        }

        console.log("🚀  dataRoutes:", dataRoutes)

        SearchAnnualDataRoutes(dataRoutes[0]).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
              const annualDataRoutesResponse = response?.data;
              const annualRouteService = annualDataRoutesResponse.annualRoute.map(use => {
                return {
                    id: use.id,
                    pacId: use.pacId,
                    type: use.type,
                    jan: use.jan,
                    feb: use.feb,
                    mar: use.mar,
                    abr: use.abr,
                    may: use.may,
                    jun: use.jun,
                    jul: use.jul,
                    ago: use.ago,
                    sep: use.sep,
                    oct: use.oct,
                    nov: use.nov,
                    dec: use.dec,
                    cardId: annualDataRoutesResponse.headerResult.idCardTemplate
                }
              })
              setAnnualDataRoutes({
                annualRoute: annualRouteService
              })
            } 
        }).catch(err => console.log(err))
      }

    return(
        <div className="display-flex-direction-column padding paddingBotom gap-1">
            <button 
                className={`btn-rimless biggest ${titleAdd == 'origen' ? 'display-align-flex-end' : width < 1024 ? 'display-align-flex-end' : 'display-justify-flex-end'}  gap-0 pointer`}
                onClick={() => { 
                    annualDataRoutes.annualRoute.length > 0 && setAnnualDataRoutes({annualRoute: []})
                    append(initialValue) 
                }}
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
                                changeValueOfSelect={changeValueOfSelect}
                            />

                        </section>
                    )
                })
            }

        </div>
    )
}

export default React.memo(CreateFundTransferPac);