import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { budgetAvailabilityValidator } from "../../../common/schemas/budget-availability-schemas";
import { IBudgetsAvailabilityFilters } from "../interfaces/budgetAvailabilityInterfaces";
import { useCdpServices } from "./useCdpServices";
import { clearRequestFilters, filterDataSelect } from "../utils/filtersSearch";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../common/contexts/app.context";

export const useSearchCdp = () => {
  const { GetRoutesByValidity } = useCdpServices();
  const resolver = useYupValidationResolver(budgetAvailabilityValidator);
  const tableComponentRef = useRef(null);
  const { validateActionAccess } = useContext(AppContext)
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    setValue: setValueRegister,
    reset,
    watch,
    control,
  } = useForm<IBudgetsAvailabilityFilters>({
    resolver,
    mode: "all",
  });
  const inputValue = watch(["dateOfCdp"]);
  let [initialDate, endDate] = watch(["initialDate", "endDate"]);

  const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [arraySelect, setArraySelect] = useState<any>([]);

  const tableColumnsCdp: any[] = [
    {
      fieldName: "consecutive",
      header: "No. CDP Aurora",
    },
    {
      fieldName: "sapConsecutive",
      header: "No. CDP SAP",
    },
    {
      fieldName: "date",
      header: "Fecha documento",
    },
    {
      fieldName: "countRpp",
      header: "No. de rutas del CDP",
      renderCell: (row) => {
        const activeAmounts = row.amounts.filter((amount) => {
          return amount.isActive === 1;
        });

        return <>{activeAmounts.length}</>;
      },
    },
    {
      fieldName: "partnersRp",
      header: "RP asociados",
      renderCell: (row) => {
        const containRp = row.amounts.filter((amount) => {
          return amount.linkRpcdps.filter(e=>e.isActive===1);
        });

        return <>{containRp.length >0 ? 'Si' : 'No'}</>;
      },
    },
    {
      fieldName: "contractObject",
      header: "Objeto contractual",
    },
  ];

  const tableActionsCdp: any[] = [
    {
      icon: "Detail",
      hide:!validateActionAccess('CDP_VISUALIZAR'),
      onClick: (row) => {
        navigate(`./view/${row.id}`);
      },
    },
    {
      icon: "Edit",
      hide:!validateActionAccess('DATOS_BASICOS_CDP_EDITAR'),
      onClick: (row) => {
        const id = row.id;
        navigate(`/gestion-financiera/cdp/edit/${id}`);
      },
    },
    {
      icon: "Add",
      hide:!validateActionAccess('CDP_RUTAS_VINCULAR'),
      onClick: (row) => {
        navigate(`./assoc-amounts/${row.id}`);
      },
    },
    {
      icon: "Rp",
      hide:!validateActionAccess('CDP_VISUALIZAR_RP'),
      onClick: (row) => {
        navigate(`/gestion-financiera/cdp/rp/${row.id}`);
      },
    },
  ];

  useEffect(() => {
    setIsBtnDisable(
      inputValue.some((value) => value != "" && value != undefined)
    );
  }, [inputValue]);

  function loadTableData(searchCriteria?: object): void {
    if (tableComponentRef.current) {
      tableComponentRef.current.loadData(searchCriteria);
    }
  }

  const onSubmit = handleSubmit(async (data: { dateOfCdp: string }) => {
    clearRequestFilters(data);
    if (data.dateOfCdp) {
      setShowTable(true);
      loadTableData(data);
    }
  });

  useEffect(() => {
    const queryGetDataFilters = async () => {
      if (inputValue !== undefined && control._formValues.dateOfCdp) {
        const dataFilters = {
          dateOfCdp: control._formValues.dateOfCdp,
          page: 1,
          perPage: 10000,
        };
        try {
          const response = await GetRoutesByValidity(dataFilters);
          const responseFilterDataSelects = filterDataSelect(
            response.data.array
          );
          setArraySelect(responseFilterDataSelects);
        } catch (error) {
          console.log({ queryGetDataFilters: error });
        }
      } else {
        setArraySelect([]);
      }
    };
    queryGetDataFilters();
  }, [control._formValues.dateOfCdp]);

  useEffect(() => {
    if (initialDate && endDate === undefined) {
      setValueRegister("endDate", initialDate);
    }
    if (endDate && initialDate === undefined) {
      setValueRegister("initialDate", endDate);
    }
  }, [initialDate, endDate]);

  return {
    control,
    register,
    errors,
    isValid,
    onSubmit,
    isBtnDisable,
    reset,
    showTable,
    setShowTable,
    tableComponentRef,
    tableColumnsCdp,
    tableActionsCdp,
    navigate,
    arraySelect,
    initialDate,
    endDate,
    validateActionAccess
  };
};
