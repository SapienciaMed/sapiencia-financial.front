import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AppContext } from "../../../common/contexts/app.context";
import { useNavigate } from "react-router-dom";
import { inputsValues } from "../constants";
import { useReportService } from "./report.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";

const useReports = () => {
  // Services
  const { generateExcelReport } = useReportService();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    watch,
    control,
  } = useForm<any>({
    // resolver,
    mode: "onChange",
  });
  const inputValue = watch(inputsValues);
  const { setMessage } = useContext(AppContext);
  const navigate = useNavigate();

  // States
  const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<string>("");

  useEffect(() => {
    setIsBtnDisable(
      inputValue.some((value) => value != "" && value != undefined)
    );
  }, [inputValue]);


  // Metodo que solicita el reporte
  const onSubmit = handleSubmit(async (data: any) => {
    const res = await generateExcelReport('pac', 2023)


    if(res.operation.code == EResponseCodes.OK) {

      const buffer = new Uint8Array(res.data.data); // Convierte el Array del búfer en Uint8Array
      const blob = new Blob([buffer]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = 'report.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

    }



  });

  return {
    onSubmit,
    control,
    register,
    errors,
    isBtnDisable,
    setMessage,
    navigate,
    isValid,
    selectedReport,
    setSelectedReport,
  };
};

export default useReports;
