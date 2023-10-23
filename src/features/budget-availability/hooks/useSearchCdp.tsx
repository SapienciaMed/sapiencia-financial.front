import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { budgetAvailabilityValidator } from "../../../common/schemas/budget-availability-schemas";
import { IBudgetsAvailabilityFilters } from "../interfaces/budgetAvailabilityInterfaces";
import { tableColumnsCdp, tableActionsCdp } from "../constants";
import { useNavigate } from "react-router-dom";

const clearRequestFilters = (data: any) => {
  //limpiar objeto con datos undefined o vacios
  Object.keys(data).forEach((key) => {
    if (!data[key] || data[key].length === 0) delete data[key];
  });
};

export const useSearchCdp = () => {
  const resolver = useYupValidationResolver(budgetAvailabilityValidator);
  const tableComponentRef = useRef(null);
  const navigate = useNavigate();
  
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    reset,
    watch,
    control,
  } = useForm<IBudgetsAvailabilityFilters>({
    resolver,
    mode: "all",
  });
  const inputValue = watch(["dateOfCdp"]);

  const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);

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

  const onSubmit = handleSubmit(async (data: any) => {
    clearRequestFilters(data);
    console.log({ dataOnSubmit: data });
    loadTableData(data);
    setShowTable(true);
  });

  useEffect(() => {
    return () => {
      loadTableData();
    };
  }, []);

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
    navigate
  };
};
