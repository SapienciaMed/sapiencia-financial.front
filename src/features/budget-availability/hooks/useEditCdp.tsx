import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { budgetAvailabilityEditValidator } from "../../../common/schemas/budget-availability-schemas";
import { useCdpService } from "./cdp-service";
import { useNavigate, useParams } from "react-router-dom";
import { initialDataEdit, monthNames } from "../constants";
import { useCdpServices } from "./useCdpServices";
import { AppContext } from "../../../common/contexts/app.context";
import {
  IBudgetAvalaibilityDataBasicEdit,
  IBudgetAvalaibilityDataBasicModifiedDataEdit,
  IBudgetAvalaibilityDataBasicOriginalDataEdit,
} from "../interfaces/budgetAvailabilityInterfaces";

const useEditCdp = () => {
  const navigate = useNavigate();
  const { updateDataBasicCdp } = useCdpServices();
  const { setMessage } = useContext(AppContext);
  const resolver = useYupValidationResolver(budgetAvailabilityEditValidator);
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    setValue: setValueRegister,
    watch,
    control,
  } = useForm<IBudgetAvalaibilityDataBasicEdit>({
    resolver,
    mode: "all",
  });
  const { getCdpById } = useCdpService();
  const { id } = useParams();
  const [dataEdit, setDataEdit] =
    useState<IBudgetAvalaibilityDataBasicOriginalDataEdit>(initialDataEdit);
  const [isBtnDisable, setIsBtnDisable] = useState<boolean>(true);
  const inputValue = watch(["date", "contractObject", "sapConsecutive"]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (
      control._formValues.date !== undefined &&
      control._formValues.contractObject !== undefined &&
      control._formValues.sapConsecutive !== undefined
    ) {
      const date = new Date(dataEdit.date);
      date.setDate(date.getDate() + 1);

      const hasChanged: boolean =
        control._formValues.date !== date.toString() ||
        control._formValues.contractObject != dataEdit.contractObject ||
        control._formValues.sapConsecutive != dataEdit.sapConsecutive;
      if (inputValue[0]) {
        setValueRegister(
          "exercise",
          new Date(control._formValues.date).getFullYear().toString()
        );
        setValueRegister(
          "monthExercise",
          monthNames[new Date(control._formValues.date).getMonth()]
        );
      }

      setIsBtnDisable(!hasChanged);
    }
  }, [dataEdit, control._formValues, inputValue]);

  useEffect(() => {
    getCdpById(id).then((res) => {
      setDataEdit(res.data[0]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const getDataCdp = async () => {
      const date = new Date(dataEdit.date);
      date.setDate(date.getDate() + 1);
      setValueRegister("id", dataEdit.id);
      setValueRegister("exercise", dataEdit.exercise);
      setValueRegister("consecutive", dataEdit.consecutive);
      setValueRegister("sapConsecutive", dataEdit.sapConsecutive);
      setValueRegister("date", date.toString());
      setValueRegister("contractObject", dataEdit.contractObject);
      setValueRegister(
        "monthExercise",
        monthNames[new Date(dataEdit.date).getMonth()]
      );
    };
    getDataCdp();
  }, [dataEdit]);

  const showMesageSuccessful = () => {
    setMessage({
      title: "Guardado",
      show: true,
      OkTitle: "Cerrar",
      description: (
        <div style={{ width: "100%" }}>
          <label>¡Guardado exitosamente!</label>
        </div>
      ),
      background: true,
      onOk: () => {
        navigate("/gestion-financiera/cdp");
        setMessage({});
      },
    });
  };

  const showMessageConfirm = (data) => {
    setMessage({
      title: "Guardar",
      show: true,
      cancelTitle: "Cancelar",
      OkTitle: "Guardar",
      description: (
        <div style={{ width: "100%" }}>
          <label>¿Estás segur@ de guardar la informacion ?</label>
        </div>
      ),
      background: true,
      onOk: async () => {
        await updateDataBasicCdp(data, id)
          .then((response) => {
            if (response && response.operation.code === "OK") {
              showMesageSuccessful();
            }
          })
          .catch((error) => {
            console.log({ updateDataBasicCdp: error });
          });
      },
      onCancel: () => {
        setMessage({});
      },
    });
  };

  const onSubmit = handleSubmit(async (data: any) => {
    const newDataEdit: IBudgetAvalaibilityDataBasicOriginalDataEdit = {
      ...dataEdit,
    };

    const changedFields: IBudgetAvalaibilityDataBasicModifiedDataEdit = {};

    const originalDateISO = new Date(newDataEdit.date).toISOString();
    const modifiedDateISO = new Date(data.date).toISOString();

    if (originalDateISO !== modifiedDateISO) {
      changedFields.date = modifiedDateISO;
    }

    if (newDataEdit.contractObject !== data.contractObject) {
      changedFields.contractObject = data.contractObject;
    }

    if (
      newDataEdit.sapConsecutive !== data.sapConsecutive &&
      typeof newDataEdit.sapConsecutive !== typeof data.sapConsecutive
    ) {
      changedFields.sapConsecutive =
        +data.sapConsecutive === 0 ? null : +data.sapConsecutive;
    }

    showMessageConfirm(changedFields);
  });

  return {
    control,
    register,
    errors,
    isValid,
    onSubmit,
    isBtnDisable,
    setIsBtnDisable,
    dataEdit,
    setMessage,
    navigate,
    loading,
  };
};

export default useEditCdp;
