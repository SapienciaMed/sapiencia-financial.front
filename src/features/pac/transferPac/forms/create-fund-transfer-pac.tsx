import React, { useContext, useEffect, useState } from "react";
import { useFieldArray, useWatch, } from 'react-hook-form';
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
import { AppContext } from "../../../../common/contexts/app.context";

function CreateFundTransferPac({ titleAdd, arrayDataSelect, control, errors, pacTypeState, isdataReset, itemsPerPage, annualDataRoutesOriginal,
    startIndex, disableBtnAdd, originalDestinationValueOfService, addNewObject,
    setOriginalDestinationValueOfService, register, setValue, setIsdataResetState, setAnnualDataRoutesOriginal }:ICreateFundTransferPac ) {

    const { SearchAnnualDataRoutes } = usePacTransfersService()
    const { setMessage } = useContext(AppContext);
    const [ idCardSelect, setIdCarsSelect] = useState('')
    const [ dataSelectElements, setDataSelectElements] = useState({
        fundsSapiencia: false,
        pospreSapiencia: false,
        projectId: false,
        managerCenter: false
    })
    const [ annualDataRoutes, setAnnualDataRoutes ] = useState([{
        annualRouteService: [] as IAnnualRoute[]
    }])

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

    const pacTypeWatch = useWatch({
        name: 'pacType',
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
            id: '',
            pacId: '',
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
            id: '',
            pacId: '',
        }
    }

    const visibleFields = fields.slice(startIndex, startIndex + itemsPerPage);
    
    useEffect(() => {
        if(isdataReset){
            remove()
            setAnnualDataRoutes(
                [{
                    annualRouteService: [] as IAnnualRoute[]
                }]
            )
            setDataSelectElements({
                fundsSapiencia: false,
                pospreSapiencia: false,
                projectId: false,
                managerCenter: false
            })
            setAnnualDataRoutesOriginal(
                [{
                    annualRouteService: [] as IAnnualRoute[]
                }]
            )
        }  
    },[isdataReset])

    useEffect(() => {
        visibleFields.length == 0 && setIsdataResetState(false)
    },[visibleFields])

    useEffect(() => {
        const allElementFull = Object.values(dataSelectElements).every(value => value && value != null && value != undefined)
        allElementFull &&  dataSelectorComplete(idCardSelect)
    },[dataSelectElements])

    const changeValueOfSelect = (valor: {}, typeSelect: string, option: string) => {  
        if(option != null && option != '' && option != undefined) {
            setDataSelectElements((prevState) => Object.assign({}, prevState, valor));
        }

        if (option == null) {
            const existingIndex = annualDataRoutes.findIndex(
                (item) => item.annualRouteService[0]?.cardId === idCardSelect
            );
            if (existingIndex !== -1) {
                // Si el cardId ya existe, borre el elemento que coincida 
                const updatedAnnualDataRoutes = [...annualDataRoutes];
                updatedAnnualDataRoutes.splice(existingIndex, 1);
                setAnnualDataRoutes(updatedAnnualDataRoutes);
                titleAdd == 'destino' && setValue('totalDestinoActual', 0)
                titleAdd == 'origen' && setValue('totalOrigenActual', 0)
            }
        }
    }

    const dataSelectorComplete = (idCard: string) => {   
        const dataRoutes = watchCardId.filter(use => use.cardId == idCard).map(val => {
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

        dataRoutes.length > 0 && SearchAnnualDataRoutes(dataRoutes[0]).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
              const annualDataRoutesResponse = response?.data;
              const annualRouteService = pacTypeWatch != 4 ? annualDataRoutesResponse.annualRoute.filter(us => us.type == validateTypePac(pacTypeWatch)).map(use => {
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
              }) : annualDataRoutesResponse.annualRoute.map(use => {
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

              const annualDataRoutesBothService = annualDataRoutesResponse.annualRoute.map(use => {
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

              addNewObject(annualDataRoutesBothService)

              const existingIndex = annualDataRoutes.findIndex(
                (item) => item.annualRouteService[0]?.cardId === annualRouteService[0]?.cardId
              );
            
              if (existingIndex !== -1) {
                // Si el cardId ya existe, actualiza el elemento existente
                const updatedAnnualDataRoutes = [...annualDataRoutes];
                const existingElement = updatedAnnualDataRoutes[existingIndex];
                // Copia el elemento existente y actualiza solo las propiedades necesarias
                const updatedElement = { ...existingElement };
                updatedElement.annualRouteService[0] = annualRouteService[0];
                updatedAnnualDataRoutes[existingIndex] = updatedElement;
                setAnnualDataRoutes(updatedAnnualDataRoutes);
                setAnnualDataRoutesOriginal(updatedAnnualDataRoutes);
              } else {

                setAnnualDataRoutes([...annualDataRoutes, { annualRouteService }]);
                setAnnualDataRoutesOriginal([...annualDataRoutesOriginal, { annualRouteService }])
              }
          
            }else{
                const annualDataRoutesResponse = response?.data;
                const existingIndex = annualDataRoutes.findIndex( (item) => item.annualRouteService[0]?.cardId === annualDataRoutesResponse.idCardTemplate);
                const updatedAnnualDataRoutesOriginal = annualDataRoutesOriginal.filter(
                    (item) => item.annualRouteService[0]?.cardId !== annualDataRoutesResponse.idCardTemplate
                );
                const updatedOriginalDestinationValueOfService= originalDestinationValueOfService.filter(
                    (item) => item.annualRouteService[0]?.cardId !== annualDataRoutesResponse.idCardTemplate
                );
                
                const handleAction = () => {
                    setMessage({});
                    if (existingIndex !== -1) {
                        const updatedAnnualDataRoutes = [...annualDataRoutes];
                        updatedAnnualDataRoutes.splice(existingIndex, 1);
                        setAnnualDataRoutes(updatedAnnualDataRoutes);
                        setAnnualDataRoutesOriginal(updatedAnnualDataRoutesOriginal);
                        setOriginalDestinationValueOfService(updatedOriginalDestinationValueOfService)
                    }
                };
                setMessage({
                    title: "Validación de datos",
                    description: response.operation.message,
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: handleAction,
                    background: true,
                    onClose: handleAction,
                });
            }
        }).catch(err => console.log(err))
    }

    return(
        <div className="display-flex-direction-column padding paddingBotom gap-1">
            <button 
                className={`btn-rimless biggest ${titleAdd == 'origen' ? 'display-align-flex-end' : width < 1024 ? 'display-align-flex-end' : 'display-justify-flex-end'}  gap-0 pointer`}
                onClick={() => { 
                    setDataSelectElements({
                        fundsSapiencia: false,
                        pospreSapiencia: false,
                        projectId: false,
                        managerCenter: false
                    })
                    append(initialValue) 
                }}
                disabled={disableBtnAdd}
                form="none"
            >
                Añadir {titleAdd} <AiOutlinePlusCircle />
            </button>
            {
                !isdataReset &&
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
                                annualDataRoutes={annualDataRoutes}
                                changeValueOfSelect={changeValueOfSelect}
                                setIdCarsSelect={setIdCarsSelect}
                            />

                        </section>
                    )
                })
            }

        </div>
    )
}

export default React.memo(CreateFundTransferPac);