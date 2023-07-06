import { useContext, useRef, useState } from "react";
import { AppContext } from "../../../common/contexts/app.context";
import { useNavigate } from "react-router-dom";
import { IFilterFounds, IFounds } from "../interfaces/Funds";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import DetailsComponent from "../../../common/components/details.component";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { fundsValidator } from "../../../common/schemas";

export function useFoundData() {
    const tableComponentRef = useRef(null);
    const { setMessage } = useContext(AppContext);
    const navigate = useNavigate();
    const resolver = useYupValidationResolver(fundsValidator);
    const [entitySelected, setEntitySelected] = useState(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue: setValueRegister,
    reset
  } = useForm<IFilterFounds>({ resolver });
    const tableColumns: ITableElement<IFounds>[] = [
        {
            fieldName: "entity",
            header: "Entidad CP",
        },
        {
            fieldName: "number",
            header: "Fondo"
        },
        {
            fieldName: "dateFrom",
            header: "Validez de"
        },
        {
            fieldName: "dateTo",
            header: "Validez a"
        },
    ];
    const tableActions: ITableAction<IFounds>[] = [
        {
            icon: "Detail",
            onClick: (row) => {
                const rows = [
                    {
                        title: "Entidad CP",
                        value: `${row.entity}`
                    },
                    {
                        title: "Fondo",
                        value: `${row.number}`
                    },
                    {
                        title: "Validez de",
                        value: `${row.dateFrom}`
                    },
                    {
                        title: "Validez a",
                        value: `${row.dateTo}`
                    }
                ]
                setMessage({
                    title: "Detalles",
                    show: true,
                    OkTitle: "Aceptar",
                    description: <DetailsComponent rows={rows} />,
                    background: true
                })
            },
        },
        {
            icon: "Edit",
            onClick: (row) => {
                navigate(`./edit/${row.id}`);
            },
        }
    ];
    const onSubmit = handleSubmit(async (data: IFilterFounds) => {
        console.log(data)
    });

    return {
        tableComponentRef,
        tableColumns,
        tableActions,
        onSubmit,
        register,
        errors,
        setValueRegister,
        reset,
        entitySelected,
        setEntitySelected
    }
} 