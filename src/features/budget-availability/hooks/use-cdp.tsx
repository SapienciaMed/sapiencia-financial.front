import { useContext, useEffect, useRef, useState } from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { AppContext } from "../../../common/contexts/app.context";
import { Controller, useForm } from "react-hook-form";
import { cdpCrudValidator } from "../../../common/schemas/cdp-crud-validator";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useCdpService } from "./cdp-service";
import { IBudgetAvalaibility } from "../interfaces/budgetAvailabilityInterfaces";
import { useNavigate } from "react-router-dom";
import { Checkbox } from 'primereact/checkbox';
import { TextAreaComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";

export function useCdpCrud(cdpId?: string) {
    const resolver = useYupValidationResolver(cdpCrudValidator);
    const { setMessage, validateActionAccess } = useContext(AppContext);
    const navigate = useNavigate();
    const { getCdpById, cancelAmount } = useCdpService()

    const [cdpFoundSt, setCdpFoundSt] = useState<IBudgetAvalaibility>()
    const tableComponentRef = useRef(null);

    const {
        register,
        formState: { errors, isValid },
        setValue: setValueRegister,
        control,
        watch,
        getValues
    } = useForm<IBudgetAvalaibility>({
        defaultValues: {
            exercise: Object(cdpFoundSt).exercise,
            consecutive: Object(cdpFoundSt).consecutive,
            rpAssoc: '',
            //rpAssoc:(Object(cdpFoundSt).amounts?.map(e=>e.linkRpcdps))?.length>0 ? 'Si' : 'No',
            amounts: [{
                id: null,
                reasonCancellation: ''
            }],
            contractObject: ''
        },
        mode: 'onChange',
        resolver,
    });


    const amountWatch = watch()

    const showModalCancelAmount = (id: number) => {
        setMessage({
            title: "Observación anulado",
            show: true,
            OkTitle: "Guardar",
            onOk: () => {
                amountWatch.amounts[0].reasonCancellation != ""
                    ? (cancelAmount({
                        id,
                        reasonCancellation: amountWatch.amounts[0].reasonCancellation
                    }).then(res => {
                        getCdpById(cdpId).then(res => {
                            setCdpFoundSt(res.data[0])
                        })
                        setMessage({})
                        setValueRegister('amounts.0.reasonCancellation', '')
                    }))
                    : ''

            },
            onClose() {
                setMessage({})
            },
            description: <div style={{ width: '100%' }}>
                <label>Digite el motivo de la anulación</label>
                <div>
                    <Controller
                        control={control}
                        name={"amounts.0.reasonCancellation"}
                        render={({ field }) => {
                            return (
                                <TextAreaComponent
                                    id={field.name}
                                    idInput={field.name}
                                    value={`${field.value}`}
                                    className="text-area-basic"
                                    register={register}
                                    label="Motivo"
                                    classNameLabel="text-black biggest bold text-required"
                                    direction={EDirection.column}
                                    errors={errors}
                                    onChange={field.onChange}
                                />
                            );
                        }}
                    />

                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div className="title-button font-big">
                        Max. 500 caracteres
                    </div>
                </div>

            </div>,
            background: true
        })

    }

    const tableColumns: ITableElement<any>[] = [
        {
            fieldName: "cdpPosition",
            header: "Posición"
        },
        {
            fieldName: "projectName",
            header: "Proyecto",
        },
        {
            fieldName: "fundCode",
            header: "Fondo",
        },
        {
            fieldName: "pospreSapienciaCode",
            header: "Pospre",
        },
        {
            fieldName: "idcFinalValue",
            header: "Valor final",
        },
        {
            fieldName: "",
            header: "Anular posición",
            renderCell: (row) => {
                return (
                    <div className="flex align-items-center">
                        {
                            validateActionAccess('CDP_ANULAR_MONTO') && (
                                <Checkbox checked={false} onChange={() => showModalCancelAmount(row.id)} disabled={amountWatch.sapConsecutive > 0 ? true : false} />
                            )
                        }

                    </div>)
            }
        },

    ];

   /*  const tableActions: ITableAction<any>[] = [
        {
            icon: "Edit",
            onClick: (row) => {
                navigate(`./edit/${row.id}`);
            },
        },
        {
            icon: "LinkMga",
            hide: !validateActionAccess('CDP_MGA_VINCULAR'),
            onClick: (row) => {
                navigate(`./mga-assoc/${row.id}`);
            },
        },
    ]; */

    function getTableActions(): ITableAction<any>[] {
        const actions: ITableAction<any>[] = [
            {
                icon: "Edit",
                onClick: (row) => {
                    navigate(`./edit/${row.id}`);
                },
            }
        ];
    
        if (validateActionAccess('CDP_MGA_VINCULAR') || amountWatch.sapConsecutive !== null) {
            actions.push({
                icon: "LinkMga",
                onClick: (row) => {
                    navigate(`./mga-assoc/${row.id}`);
                },
            });
        }
    
        return actions;
    }
    
    const tableActions = getTableActions();

  



    useEffect(() => {
        cdpId && getCdpById(cdpId).then(res => {
            setCdpFoundSt(res.data[0])
        })
    }, [])

    useEffect(() => {
        if (!cdpFoundSt) return;
        setValueRegister('exercise', Object(cdpFoundSt).exercise)
        setValueRegister('consecutive', Object(cdpFoundSt).consecutive)
        setValueRegister('sapConsecutive', Object(cdpFoundSt).sapConsecutive)
        setValueRegister('date', Object(cdpFoundSt).date)
        setValueRegister('contractObject', Object(cdpFoundSt).contractObject)
        setValueRegister('rpAssoc', (Object(cdpFoundSt).amounts.map(e => e.linkRpcdps)).length > 0 ? 'Si' : 'No')
    }, [cdpFoundSt])

    return {
        control,
        errors,
        register,
        watch,
        setMessage,
        getValues,
        tableComponentRef,
        tableColumns,
        tableActions,
        cdpFoundSt

    };


}