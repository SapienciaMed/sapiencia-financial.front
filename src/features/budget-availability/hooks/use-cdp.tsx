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


export function useCdpCrud() {
    const resolver = useYupValidationResolver(cdpCrudValidator);
    const { setMessage } = useContext(AppContext);
    const navigate = useNavigate();
    const { getCdpById } = useCdpService()

    const [cdpFoundSt, setCdpFoundSt] = useState<IBudgetAvalaibility>()
    
    const tableComponentRef = useRef(null);

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
                            description: <div style={{width:'100%'}}>
                                <label>Digite el motivo de la anulación</label>
                                <TextAreaComponent
                                    id={'field.name'}
                                    idInput={'field.name'}
                                    //value={`${'field.value'}`}
                                    className="text-area-basic"
                                    register={register}
                                    label="Motivo"
                                    classNameLabel="text-black biggest"
                                    direction={EDirection.column}
                                    errors={errors}
                                    rows={2}
                                //onChange={field.onChange}
                                />
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
        mode: 'onChange',
        resolver,
    });

    useEffect(() => {
        getCdpById('1').then(res => setCdpFoundSt(res.data[0]))
        
    }, [])
    
    useEffect(() => {
        setValueRegister('id',Object(cdpFoundSt).id)
        setValueRegister('exercise','2023')
        setValueRegister('consecutive',Object(cdpFoundSt).consecutive)
        setValueRegister('sapConsecutive',Object(cdpFoundSt).sapConsecutive)
        setValueRegister('date',Object(cdpFoundSt).date)
        setValueRegister('contractObject',Object(cdpFoundSt).contractObject)
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