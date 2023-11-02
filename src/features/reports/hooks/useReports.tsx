import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AppContext } from "../../../common/contexts/app.context";
import { useNavigate } from "react-router-dom";
import { useReportService } from "./report.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { ReportValidator } from "../../../common/schemas/report-schema";

const useReports = () => {
  // Servicios
  const { generateExcelReport } = useReportService();
  const resolver = useYupValidationResolver(ReportValidator);

  // Inicialización de React Hook Form
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    watch,
    control,
  } = useForm<any>({
    resolver,
    mode: "onChange",
  });

  // Contexto de la aplicación
  const { setMessage } = useContext(AppContext);

  // Navegación
  const navigate = useNavigate();

  // Estados
  const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<string>("");

  // Observar cambios en los datos del formulario
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      setSelectedReport(name);
      setIsBtnDisable(true);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const showMesageSuccessful = () => {
    setMessage({
      title: "Descarga",
      show: true,
      OkTitle: "Aceptar",
      description: (
        <div style={{ width: "100%" }}>
          <label>¡Se descargó exitosamente!</label>
        </div>
      ),
      background: true,
      onOk: () => {
        navigate("/gestion-financiera/reports");
        setMessage({});
      },
    });
  };

  // Método para manejar la presentación del formulario
  const onSubmit = handleSubmit(async (data: any) => {
    const { exercise } = data;

    const res = await generateExcelReport(selectedReport, +exercise);
    if (res.operation.code == EResponseCodes.OK) {
      // Convertir la matriz de búfer a Uint8Array
      const buffer = new Uint8Array(res.data.data);
      const blob = new Blob([buffer]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedReport}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      showMesageSuccessful();
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
