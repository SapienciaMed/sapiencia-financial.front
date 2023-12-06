import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { projectOperationCrudValidator } from "../../../common/schemas";
import { AppContext } from "../../../common/contexts/app.context";
import { IMessage } from "../../../common/interfaces/global.interface";
import { useNavigate } from "react-router-dom";
import { IProjectOperation } from "../interface/ProjectOperation";
import { useProjectOperationService } from "./project-operation-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";

export function useProjectOperationCrud(
  projectOperationalId: string,
  exerciseSt: number,
  action: string
) {
  const dateToday = new Date();
  const resolver = useYupValidationResolver(projectOperationCrudValidator);
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
    setValue: setValueRegister,
    watch,
    getValues,
  } = useForm<IProjectOperation>({
    resolver,
    mode: "all",
  });
  const inputValueName = watch(["name"]);
  const inputValueIsActivated = watch(["isActivated"]);
  const inputValueDateFrom = watch(["dateFrom"]);
  const inputValueDateTo = watch(["dateTo"]);
  const inputValue = watch(["name", "isActivated", "dateFrom", "dateTo"]);
  const { setMessage } = useContext(AppContext);

  const {
    createProjectOperation,
    GetProjectOperation,
    UpdateProjectOperation,
  } = useProjectOperationService();

  const navigate = useNavigate();

  const actualFullYear = dateToday.getFullYear();

  let dateFromDefault = `${exerciseSt ?? actualFullYear}-01-01`;
  let dateToDefault = `${exerciseSt ?? actualFullYear}-12-31`;

  const [dateFromDefaultSt, setDateFromDefaultSt] = useState(dateFromDefault);
  const [dateToDefaultSt, setDateToDefaultSt] = useState(dateToDefault);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [projectOperationSt, setProjectOperationSt] = useState<any>({});
  const [newExercise, setNewExercise] = useState(0);

  useEffect(() => {
    setValueRegister("dateFrom", "");
    setValueRegister("dateTo", "");
    if (Object(exerciseSt).length == 0) {
      setDateFromDefaultSt(`${exerciseSt}-01-01`);
      setDateToDefaultSt(`${exerciseSt}-12-31`);
      setValueRegister("dateFrom", `${exerciseSt}-01-01`);
      setValueRegister("dateTo", `${exerciseSt}-12-31`);
    } else {
      if (!exerciseSt && Object(exerciseSt).length != 0) {
        setDateFromDefaultSt(`${actualFullYear}-01-01`);
        setDateToDefaultSt(`${actualFullYear}-12-31`);
        setValueRegister("dateFrom", dateFromDefaultSt);
        setValueRegister("dateTo", dateToDefaultSt);
      } else if (Object(exerciseSt).length == 4) {
        setDateFromDefaultSt(`${exerciseSt}-01-01`);
        setDateToDefaultSt(`${exerciseSt}-12-31`);
        setValueRegister("dateFrom", `${exerciseSt}-01-01`);
        setValueRegister("dateTo", `${exerciseSt}-12-31`);
        setNewExercise(+exerciseSt);
      } else {
        setValueRegister("dateFrom", `${exerciseSt}-01-01`);
        setValueRegister("dateTo", `${exerciseSt}-12-31`);
        setValueRegister("dateFrom", "");
        setValueRegister("dateTo", "");
      }
    }
  }, [exerciseSt]);

  // Effect que activa el watch que detecta los cambios en todo el form
  const [isAllowSave, setIsAllowSave] = useState(false);

  React.useEffect(() => {
    const subscription = watch(() => {});
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmitTab = handleSubmit(async (data: IProjectOperation) => {
    if (action === "new") {
      data.userCreate = "Usuario";
      data.exercise = newExercise;
    }
    data.number = "9000000";

    showModal({
      title: "Guardar",
      description: "¿Está segur@ de guardar el proyecto?",
      show: true,
      OkTitle: "Aceptar",
      cancelTitle: "Cancelar",
      onOk: () => {
        setMessage({});
        messageConfirmSave(data);
      },
      onCancel: () => {
        setMessage({});
        onCancelNew();
      },
      onClose: () => {
        setMessage({});
        onCancelNew();
      },
      background: true,
    });
  });

  const messageConfirmSave = async (data: any) => {
    const response = !data.id
      ? await createProjectOperation(data)
      : await UpdateProjectOperation(data.id, data);

    if (response.operation.code == "OK" && !Object(response).data.data?.errno) {
      showModal({
        title: "Guardado",
        description: response.operation.message,
        show: true,
        OkTitle: "Aceptar",
        onOk: () => {
          setMessage({});
          !data.id ? onCancelNew() : onCancelEdit();
        },
      });
    } else if (
      response.operation.code == "OK" &&
      Object(response).data.data.errno == 1062
    ) {
      showModal({
        title: "Validación de datos",
        description: "El proyecto ya existe",
        show: true,
        OkTitle: "Aceptar",
        onOk: () => {
          setMessage({});
          onCancelNew();
        },
      });
    } else {
      showModal({
        title: "Error en la conexión",
        description: "Error en la consulta de datos",
        show: true,
        OkTitle: "Aceptar",
        onOk: () => {
          setMessage({});
          onCancelNew();
        },
      });
    }
  };

  const onCancelNew = () => {
    navigate("./../");
  };
  const onCancelEdit = () => {
    navigate("./../../");
  };

  const showModal = (values: IMessage) => {
    setMessage({
      title: values.title,
      description: values.description,
      show: true,
      OkTitle: values.OkTitle,
      onOk: values.onOk || (() => setMessage({})),
      cancelTitle: values.cancelTitle,
    });
  };

  useEffect(() => {
    GetProjectOperation(parseInt(projectOperationalId)).then((response) => {
      if (response.operation.code === EResponseCodes.OK) {
        setProjectOperationSt(response.data);
      }
    });
  }, [projectOperationalId]);

  useEffect(() => {
    if (!projectOperationSt) return;

    if (action === "new") {
      setValueRegister("name", "Funcionamiento");
      setValueRegister("exercise", !exerciseSt ? actualFullYear : exerciseSt);
      setValueRegister("dateFrom", dateFromDefaultSt);
      setValueRegister("dateTo", dateToDefaultSt);
      setValueRegister("entityId", 1);
      setValueRegister("isActivated", `1`);
      setValueRegister("number", "1");
    } else {
      setValueRegister("id", Object(projectOperationSt).id);
      setValueRegister("name", Object(projectOperationSt).name);
      setValueRegister("exercise", Object(projectOperationSt).exercise);
      setValueRegister(
        "isActivated",
        `${Object(projectOperationSt).isActivated}`
      );
      setValueRegister("dateFrom", projectOperationSt.dateFrom);
      setValueRegister("dateTo", projectOperationSt.dateTo);
      setValueRegister("entityId", 1);
      setValueRegister("number", "1");
    }
  }, [projectOperationSt]);

  useEffect(() => {
    setIsBtnDisabled(() => {
      if (action === "new") {
        return inputValue.some((value) => value != "" && value != undefined);
      } else {
        if (
          inputValueName.some((value) => value != projectOperationSt.name) ||
          inputValueIsActivated.some(
            (value) => value != projectOperationSt.isActivated
          ) ||
          inputValueDateFrom.some(
            (value) => value != projectOperationSt.dateFrom
          ) ||
          inputValueDateTo.some((value) => value != projectOperationSt.dateTo)
        ) {
          return true;
        }
      }
    });
  }, [inputValue]);

  return {
    control,
    errors,
    register,
    watch,
    onSubmitTab,
    showModal,
    setMessage,
    getValues,
    isAllowSave,
    dateFromDefaultSt,
    dateToDefaultSt,
    actualFullYear,
    isBtnDisabled,
    setIsBtnDisabled,
    isValid,
  };
}
