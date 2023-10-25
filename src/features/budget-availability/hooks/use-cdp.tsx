import { useContext, useEffect, useRef, useState } from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { AppContext } from "../../../common/contexts/app.context";
import { useForm } from "react-hook-form";
import { cdpCrudValidator } from "../../../common/schemas/cdp-crud-validator";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useCdpService } from "./cdp-service";
import { IBudgetAvalaibility } from "../interfaces/budgetAvailabilityInterfaces";
import { useNavigate } from "react-router-dom";
import { Checkbox } from 'primereact/checkbox';
import { TextAreaComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { InputTextarea } from "primereact/inputtextarea";
interface Props {
    cdpId?: any
}

export function useCdpCrud(cdpId?: string) {
    const resolver = useYupValidationResolver(cdpCrudValidator);
    const { setMessage } = useContext(AppContext);
    const navigate = useNavigate();
    const { getCdpById, cancelAmount } = useCdpService()

    const [cdpFoundSt, setCdpFoundSt] = useState<IBudgetAvalaibility>()
    const [reasonCancelSt, setReasonCancelSt] = useState('')
    const tableComponentRef = useRef(null);


    const reasonCancelFn  = (e)=>{
        setReasonCancelSt(e.target.value)
    }

    const tableColumns: ITableElement<any>[] = [
        {
            fieldName: "cdpPosition",
            header: "Posición"
        },
        {
            fieldName: "budgetRoute.projectVinculation.",
            header: "Proyecto",
        },
        {
            fieldName: "budgetRoute.fund.number",
            header: "Fondo",
        },
        {
            fieldName: "budgetRoute.pospreSapiencia.number",
            header: "Pospre",
        },
        {
            fieldName: "amount",
            header: "Valor final",
        },
        {
            fieldName: "",
            header: "Anular posición",
            renderCell: (row) => {
                return (
                    <div className="flex align-items-center">
                        <Checkbox checked={false} onChange={() => setMessage({
                            title: "Observación anulado",
                            show: true,
                            OkTitle: "Guardar",
                            onOk: () => {
                                cancelAmount({
                                    id: row.id,
                                    reasonCancellation: 'Esta es la cancelación'
                                })
                                getCdpById(cdpId).then(res => {
                                    setCdpFoundSt(res.data[0])
                                })
                                setReasonCancelSt('')
                                setMessage({})
                            },
                            onClose() {
                                setReasonCancelSt('')
                                setMessage({})
                            },
                            description: <div style={{ width: '100%' }}>
                                <label>Digite el motivo de la anulación</label>
                                <div className="card" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'start' }}>
                                    <label>Motivo</label>
                                    <InputTextarea onChange={(e)=>reasonCancelFn(e)} rows={3} maxLength={500} />
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <div className="title-button font-big">
                                        Max. 500 caracteres
                                    </div>
                                </div>
                                {/* <TextAreaComponent
                                    id={'reasonCancel'}
                                    idInput={'reasonCancel'}
                                    className="text-area-basic"
                                    register={register}
                                    label="Motivo"
                                    classNameLabel="text-black biggest"
                                    direction={EDirection.column}
                                    errors={errors}
                                    //onChange={(e)=>setReasonCancelSt(e.target.value)}
                                    rows={2}
                                /> */}
                            </div>,
                            background: true
                        })} />
                    </div>)
            }
        },

    ];

    const tableActions: ITableAction<any>[] = [
        {
            icon: "Detail",
            onClick: (row) => {
                /* const rows = [
                    {
                        title: "Entidad CP",
                        value: `${row.entity.name}`
                    },
                    {
                        title: "Fondo",
                        value: `${row.number}`
                    },
                    {
                        title: "Validez de",
                        value: `${''}`
                    },
                    {
                        title: "Validez a",
                        value: `${''}`
                    },
                    {
                        title: "Denominación",
                        value: `${row.denomination}`
                    },
                    {
                        title: "Descripción",
                        value: `${row.description}`
                    }
                ] */
                /* setMessage({
                    title: "titulo",
                    show: true,
                    OkTitle: "Aceptar",
                    description: <>Hola</>,
                    background: true
                }) */
            },
        },
        {
            icon: "Edit",
            onClick: (row) => {
                navigate(`./edit/${row.id}`);
            },
        }
    ];


    const {
        handleSubmit,
        register,
        formState: { errors, isValid },
        setValue: setValueRegister,
        reset,
        control,
        watch,
        getValues
    } = useForm<IBudgetAvalaibility>({
        /* defaultValues:{
            exercise:Object(cdpFoundSt).exercise,
            consecutive:Object(cdpFoundSt).consecutive,
        }, */
        mode: 'onChange',
        resolver,
    });

    useEffect(() => {
        cdpId && getCdpById(cdpId).then(res => {
            setCdpFoundSt(res.data[0])
        })

    }, [])

    useEffect(() => {
        if (!cdpFoundSt) return;
        //setValueRegister('id', Object(cdpFoundSt).id)
        console.log({ cdpFoundSt })
        setValueRegister('exercise', Object(cdpFoundSt).exercise)
        setValueRegister('consecutive', 1)
        setValueRegister('sapConsecutive', Object(cdpFoundSt).sapConsecutive)
        setValueRegister('date', Object(cdpFoundSt).date)
        setValueRegister('contractObject', Object(cdpFoundSt).contractObject)

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