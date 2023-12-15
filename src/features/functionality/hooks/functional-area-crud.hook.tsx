import { useNavigate } from "react-router-dom";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { functionalAreaCrud } from "../../../common/schemas";
import { useForm } from "react-hook-form";
import {
  IFunctionalArea,
  IFunctionalAreaCrud,
} from "../interfaces/Functional-Area";
import { AppContext } from "../../../common/contexts/app.context";
import { useContext, useEffect, useRef, useState } from "react";
import { useFunctionalAreaService } from "./functional-area-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import {
  ITableAction,
  ITableElement,
} from "../../../common/interfaces/table.interfaces";
import { IProjectsVinculation } from "../interfaces/Projects";
import { SwitchComponent } from "../../../common/components/Form";
import { useProjectsLinkService } from "./projects-link-service.hook";
import { IProjectAdditionList } from "../interfaces/AdditionsTransfersInterfaces";

export function useFunctionalAreaCrudData(id: string) {
  const tableComponentRef = useRef(null);
  const { GetFunctionalArea, CreateFunctionalArea, UpdateFunctionalArea } =
    useFunctionalAreaService();
  const { UnLinkVinculation, LinkVinculation, DeleteLinkVinculation } =
    useProjectsLinkService();

  const { validateActionAccess } = useContext(AppContext);
  const resolver = useYupValidationResolver(functionalAreaCrud);
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue: setValueRegister,
    control,
  } = useForm<IFunctionalAreaCrud>({ resolver });
  const navigate = useNavigate();
  const { authorization, setMessage } = useContext(AppContext);
  const [projects, setProjects] = useState<IProjectAdditionList[]>([]);
  const [lastMove, setLastMove] = useState([]);
  const [projectsLink, setProjectsLink] = useState<number[]>([]);
  const [projectsUnLink, setProjectsUnLink] = useState<number[]>([]);

  const tableColumns: ITableElement<IProjectAdditionList>[] = [
    {
      fieldName: "projectId",
      header: "Id proyecto",
    },
    {
      fieldName: "conceptProject",
      header: "Nombre proyecto",
    },
    {
      fieldName: "assignedValue",
      header: "Valor asignado",
    },
    {
      fieldName: "valuePlanning",
      header: "Valor planeado",
    },
    {
      fieldName: "",
      header: "Vincular",
      renderCell: (row) => {
        let checked = row.linked === true;
        if (projectsLink.find((project) => project === row.id)) checked = true;
        if (projectsUnLink.find((project) => project === row.id))
          checked = false;

        return (
          <div>
            <SwitchComponent
              idInput={`checkRow${row.id}`}
              value={checked}
              onChange={(e) => {
                if (e.value === true) {
                  setLastMove([...lastMove, { id: row }]);
                  const projectLink = projectsLink.find(
                    (project) => project == row.id
                  );
                  if (!projectLink) {
                    const array = projectsLink;
                    array.push(row.id);
                    setProjectsLink(array);
                  }
                  const projectUnLink = projectsUnLink.find(
                    (project) => project == row.id
                  );
                  if (projectUnLink) {
                    const array = projectsUnLink.filter(
                      (item) => item != row.id
                    );
                    setProjectsUnLink(array);
                  }
                } else {
                  const auxLast = lastMove;
                  if (
                    auxLast.findIndex((value) => {
                      value.id == row.id;
                    })
                  ) {
                    auxLast.splice(
                      auxLast.findIndex((value) => {
                        value.id == row.id;
                      }),
                      1
                    );
                    setLastMove(auxLast);
                  }
                  const projectUnLink = projectsUnLink.find(
                    (project) => project == row.id
                  );
                  if (!projectUnLink) {
                    const array = projectsUnLink;
                    array.push(row.id);
                    setProjectsUnLink(array);
                  }
                  const activityLink = projectsLink.find(
                    (activity) => activity == row.id
                  );
                  if (activityLink) {
                    const array = projectsLink.filter((item) => item != row.id);
                    setProjectsLink(array);
                  }
                }
              }}
            />
          </div>
        );
      },
    },
  ];

  const tableColumnsView: ITableElement<IProjectsVinculation>[] = [
    {
      fieldName: "projectId",
      header: "Id proyecto",
    },
    {
      fieldName: "conceptProject",
      header: "Nombre proyecto",
    },
    {
      fieldName: "assignedValue",
      header: "Valor asignado",
    },
    {
      fieldName: "valuePlanning",
      header: "Valor planeado",
    },
  ];

  const tableActions: ITableAction<IProjectsVinculation>[] = [
    {
      icon: "Delete",
      hide: !validateActionAccess("AREA_FUNCIONAL_ELIMINAR"),
      onClick: (row) => {
        setMessage({
          title: "Eliminar proyecto",
          description: "¿Seguro que desea eliminar el proyecto?",
          show: true,
          OkTitle: "Si, eliminar",
          cancelTitle: "Cancelar",
          onOk: () => {
            DeleteLinkVinculation(row.id).then((response) => {
              if (response.operation.code === EResponseCodes.OK) {
                setMessage({
                  title: "Eliminar proyecto",
                  description: "Se ha eliminado el proyecto exitosamente",
                  show: true,
                  OkTitle: "Aceptar",
                  onOk: () => {
                    setMessage({});
                    loadTableData({ id: id });
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
          background: true,
        });
      },
    },
  ];

  function loadTableData(searchCriteria?: object, filterTable?: object): void {
    if (tableComponentRef.current) {
      tableComponentRef.current.loadData(searchCriteria, filterTable);
    }
  }

  useEffect(() => {
    if (!id) return;
    GetFunctionalArea(Number(id)).then((response) => {
      if (response.operation.code === EResponseCodes.OK) {
        console.log({ res: response.data });

        setValueRegister("number", response.data.number);
        setValueRegister("denomination", response.data.denomination);
        setValueRegister("description", response.data.description);
      }
    });

    loadTableData({ id: id });
  }, [id]);

  useEffect(() => {
    if (projects) loadTableData({ id: id });
  }, [projects]);

  const onSubmitNewFunctionalArea = handleSubmit(
    async (data: IFunctionalAreaCrud) => {
      const insertData: IFunctionalArea = {
        number: data.number,
        denomination: data.denomination,
        description: data.description,
        userCreate: authorization.user.numberDocument,
      };
      setMessage({
        title: "Guardar",
        description: "¿Estas segur@ de guardar la información en el sistema?",
        show: true,
        OkTitle: "Aceptar",
        cancelTitle: "Cancelar",
        onOk: () => {
          CreateFunctionalArea(insertData).then((response) => {
            if (response.operation.code === EResponseCodes.OK) {
              setMessage({
                title: "Crear área funcional",
                description: "Se ha creado la área funcional exitosamente",
                show: true,
                OkTitle: "Aceptar",
                onOk: () => {
                  onCancelNew();
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
  );

  const onSubmitEditFunctionalArea = handleSubmit(
    async (data: IFunctionalAreaCrud) => {
      const insertData: IFunctionalArea = {
        number: data.number,
        denomination: data.denomination,
        description: data.description,
      };
      setMessage({
        title: "Editar",
        description: "¿Estas segur@ de editar la información en el sistema?",
        show: true,
        OkTitle: "Aceptar",
        cancelTitle: "Cancelar",
        onOk: () => {
          UpdateFunctionalArea(insertData, Number(id)).then((response) => {
            if (response.operation.code === EResponseCodes.OK) {
              if (projectsUnLink.length !== 0)
                UnLinkVinculation(Number(id), projectsUnLink).then((res2) => {
                  if (res2.operation.code !== EResponseCodes.OK)
                    return setMessage({
                      title: "Validacion de datos",
                      description: res2.operation.message,
                      show: true,
                      OkTitle: "Aceptar",
                      onOk: () => {
                        setMessage({});
                        onCancelEdit();
                      },
                      background: true,
                    });
                });
              if (projectsLink.length !== 0)
                LinkVinculation(Number(id), projectsLink).then((res2) => {
                  if (res2.operation.code !== EResponseCodes.OK)
                    return setMessage({
                      title: "Validacion de datos",
                      description: res2.operation.message,
                      show: true,
                      OkTitle: "Aceptar",
                      onOk: () => {
                        setMessage({});
                        onCancelEdit();
                      },
                      background: true,
                    });
                });
              setMessage({
                title: "Editar área funcional",
                description: "Se ha editado la área funcional exitosamente",
                show: true,
                OkTitle: "Aceptar",
                onOk: () => {
                  onCancelEdit();
                  setMessage({});
                },
                background: true,
              });
            } else {
              setMessage({
                title: "Validacion de datos.",
                description: response.operation.message,
                show: true,
                OkTitle: "Aceptar",
                onOk: () => {
                  setMessage({});
                  onCancelEdit();
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
  );

  const onCancelNew = () => {
    navigate("./../");
  };

  const onCancelEdit = () => {
    navigate("./../../");
  };

  const confirmClose = (callback) => {
    setMessage({
      title: "Cancelar área funcional",
      description: "¿Segur@ que desea cancelar la operación?",
      show: true,
      OkTitle: "Aceptar",
      cancelTitle: "Cancelar",
      onOk: () => {
        callback();
        setMessage({});
      },
      background: true,
    });
  };

  return {
    register,
    errors,
    confirmClose,
    onCancelNew,
    onCancelEdit,
    onSubmitNewFunctionalArea,
    onSubmitEditFunctionalArea,
    tableComponentRef,
    control,
    tableColumns,
    tableActions,
    tableColumnsView,
    navigate,
  };
}
