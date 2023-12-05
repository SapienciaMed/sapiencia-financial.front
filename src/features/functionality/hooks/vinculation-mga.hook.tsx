import { useForm } from "react-hook-form";
import { vinculationValidator } from "../../../common/schemas";
import DetailsComponent from "../../../common/components/details.component";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { AppContext } from "../../../common/contexts/app.context";
import { useContext, useEffect, useRef, useState } from "react";
import {
  ITableAction,
  ITableElement,
} from "../../../common/interfaces/table.interfaces";
import {
  IApiPlanningDetailedActivitiesSpecify,
  ILastMoveEdit,
} from "../interfaces/VinculationMGAInterfaces";
import { SwitchComponent } from "../../../common/components/Form";
import { useVinculationService } from "../hooks/vinculation-mga-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IBudgetViewPage } from "../interfaces/Budgets";

interface IVinculationMGAFilters {
  inputCodigoMGA: string;
}

export function useVinculationMGAData(
  budgetsId: string,
  values?: IBudgetViewPage
) {
  const [lastMove, setLastMove] = useState([]);
  const [lastMoveEdit, setLastMoveEdit] = useState<ILastMoveEdit[]>([]);

  const tableComponentRef = useRef(null);
  const { CreateVinculation } = useVinculationService();
  const resolver = useYupValidationResolver(vinculationValidator);
  const { setMessage, setIsValue, authorization } = useContext(AppContext);
  const [showTable, setShowTable] = useState(false);
  const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm<IVinculationMGAFilters>({ resolver });

  const inputValue = watch(["inputCodigoMGA"]);

  const tableColumns: ITableElement<IApiPlanningDetailedActivitiesSpecify>[] = [
    {
      fieldName: "consecutiveActivityDetailed",
      header: "Codigo",
    },
    {
      fieldName: "measurementActivityDetailedName",
      header: "Unidad de medida",
    },
    {
      fieldName: "amountActivityDetailed",
      header: "Cantidad",
    },
    {
      fieldName: "totalCostActivityDetailed",
      header: "Costo total",
    },
    {
      fieldName: "id",
      header: "Vincular",
      renderCell: (row) => {
        return (
          <SwitchComponent
            idInput={String(row.activityDetailedId)}
            value={false}
            onChange={(value) => {
              if (!value.value) {
                const deleteLast = lastMove.filter((elemento) => {
                  return (
                    elemento.id.activityDetailedId !== row.activityDetailedId
                  );
                });
                setLastMove(deleteLast);
              } else {
                setLastMove([...lastMove, { id: row }]);
              }
            }}
          />
        );
      },
    },
  ];

  const tableColumnsEdit: ITableElement<IApiPlanningDetailedActivitiesSpecify>[] =
    [
      {
        fieldName: "consecutiveActivityDetailed",
        header: "Código",
      },
      {
        fieldName: "measurementActivityDetailedName",
        header: "Unidad de medida",
      },
      {
        fieldName: "amountActivityDetailed",
        header: "Cantidad",
      },
      {
        fieldName: "totalCostActivityDetailed",
        header: "Costo",
      },
      {
        fieldName: "id",
        header: "Estado",
        renderCell: (row) => {
          return (
            <SwitchComponent
              idInput={String(row.activityDetailedId)}
              value={Object.keys(row).length > 0}
              onChange={(value) => {
                if (!value.value) {
                  // Cuando se vaya a eliminar una vinculacion agregue en un estado, los objetos que se quieren desvincular
                  setLastMoveEdit([...lastMoveEdit, { id: row }]);
                } else {
                  //Cuando se vuelve a colocar el switch en encendido haga lo siguiente:
                  const deleteLast = lastMoveEdit.filter((elemento) => {
                    return (
                      elemento.id.activityDetailedId !== row.activityDetailedId
                    );
                  });
                  setLastMoveEdit(deleteLast);
                }
              }}
            />
          );
        },
      },
    ];

  useEffect(() => {
    setIsValue(lastMoveEdit.length > 0);
    if (lastMoveEdit.length > 0) {
      const rowsData = lastMoveEdit.map((objeto) => ({
        id: objeto.id.id,
        activityId: objeto.id.activityId,
        consecutiveActivityDetailed: objeto.id.consecutiveActivityDetailed,
        detailedActivityId: objeto.id.activityDetailedId,
      }));
      values.upDateVinculationData(rowsData);
    } else {
      values?.upDateVinculationData && values.upDateVinculationData([]);
    }
  }, [lastMoveEdit]);

  const tableColumnsView: ITableElement<IApiPlanningDetailedActivitiesSpecify>[] =
    [
      {
        fieldName: "consecutiveActivityDetailed",
        header: "Codigo",
      },
      {
        fieldName: "measurementActivityDetailedName",
        header: "Unidad de medida",
      },
      {
        fieldName: "amountActivityDetailed",
        header: "Cantidad",
      },
      {
        fieldName: "totalCostActivityDetailed",
        header: "Costo",
        renderCell(row) {
          return (
            <span>
              {" "}
              ${" "}
              {row.totalCostActivityDetailed
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            </span>
          );
        },
      },
    ];

  const tableActionsView: ITableAction<IApiPlanningDetailedActivitiesSpecify>[] =
    [
      {
        icon: "Detail",
        onClick: (row) => {
          const rows = [
            {
              title: "Código proyecto",
              value: `${row.idProject}`
            },
            {
              title: "Código",
              value: `${row.consecutiveActivityDetailed}`,
            },
            {
              title: "Unidad de medida",
              value: `${row?.measurementActivityDetailedName || ""}`,
            },
            {
              title: "Cantidad",
              value: `${row.amountActivityDetailed}`,
            },
            {
              title: "Costo unitario",
              value: `$ ${row.unitCostActivityDetailed
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
            },
            {
              title: "Costo Total",
              value: `$ ${row.totalCostActivityDetailed
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
            },
            {
              title: "Producto MGA",
              value: `${row.codeConsecutiveProductMga}`,
            },
            {
              title: "Actividad MGA",
              value: `${row.codeMga}`,
            },
            {
              title: "Actividades detalladas",
              value: `${row.detailActivityDetailed}`,
            },
          ];
          setMessage({
            title: "Detalle Vinculación MGA ",
            show: true,
            OkTitle: "Aceptar",
            description: <DetailsComponent rows={rows} />,
            background: true,
          });
        },
      },
    ];

  function loadTableData(searchCriteria?: object): void {
    if (tableComponentRef.current) {
      tableComponentRef.current.loadData(searchCriteria);
    }
  }

  useEffect(() => {
    values &&
      values.actions == "view" &&
      loadTableData({ budgetId: Number(budgetsId) });
    values && values.actions == "edit" && loadTableData({ budgetId: Number(budgetsId) });
  }, []);

  async function vinculateActivities(message?: boolean): Promise<void> {
    const dataVinculate = () => {
      const data = lastMove.map((obje) => ({
        budgetId: Number(budgetsId),
        activityId: obje.id.activityId,
        consecutiveActivityDetailed: obje.id.consecutiveActivityDetailed,
        detailedActivityId: obje.id.activityDetailedId,
        userCreate: authorization.user.numberDocument,
      }));

      return {
        elementsDetail: data,
      };
    };

    setMessage({
      title: "Vinculación MGA",
      description: "¿Estás segur@ de Vinculaciar MGA",
      show: true,
      OkTitle: "Aceptar",
      cancelTitle: "Cancelar",
      onOk: () => {
        CreateVinculation(dataVinculate()).then((response) => {
          if (response.operation.code === EResponseCodes.OK) {
            setMessage({
              title: "Editar Pospre",
              description: "Se ha editado el Pospre exitosamente",
              show: true,
              OkTitle: "Aceptar",
              onOk: () => {
                setMessage({});
              },
              background: true,
            });
          } else {
            setMessage({
              title: "Validacion de datos",
              description: response.operation.message,
              show: true,
              OkTitle: "Aceptar",
              onOk: () => {
                setMessage({});
              },
              background: true,
            });
          }
        });
      },
      onCancel: () => {
        setMessage({});
      },
      background: true,
    });
  }

  const onSubmit = handleSubmit(async (data: IVinculationMGAFilters) => {
    setShowTable(true);
    loadTableData({ detail: data.inputCodigoMGA });
  });

  useEffect(() => {
    setIsBtnDisable(
      inputValue.some((value) => value != "" && value != undefined) ||
        lastMove.length > 0
    );
  }, [inputValue]);

  return {
    register,
    reset,
    errors,
    tableComponentRef,
    tableColumns,
    showTable,
    control,
    onSubmit,
    isBtnDisable,
    tableActionsView,
    tableColumnsEdit,
    tableColumnsView,
    setShowTable,
    vinculateActivities,
    loadTableData,
  };
}
