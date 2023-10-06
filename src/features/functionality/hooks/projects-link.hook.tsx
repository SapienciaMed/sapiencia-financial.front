import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { projects } from "../../../common/schemas";
import { AppContext } from "../../../common/contexts/app.context";
import { useForm } from "react-hook-form";
import { ITableElement } from "../../../common/interfaces/table.interfaces";
import { IProject, IProjectFilters } from "../interfaces/Projects";
import { SwitchComponent } from "../../../common/components/Form";
import { useProjectsLinkService } from "./projects-link-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";

export function useProjectsLinkData(functionalArea: string) {
  const tableComponentRef = useRef(null);
  const navigate = useNavigate();
  const resolver = useYupValidationResolver(projects);
  const { setMessage } = useContext(AppContext);
  const { CreateVinculation } = useProjectsLinkService();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<IProjectFilters>({ resolver });
  const [lastMove, setLastMove] = useState([]);
  const [projectsLink, setProjectsLink] = useState<IProject[]>([]);
  const [projectsUnLink, setProjectsUnLink] = useState<IProject[]>([]);
  const [filterTable, setFilterTable] = useState(null);

  const tableColumns: ITableElement<IProject>[] = [
    {
      fieldName: "projectCode",
      header: "Id proyecto",
    },
    {
      fieldName: "name",
      header: "Nombre proyecto",
    },
    {
      fieldName: "assignmentValue",
      header: "Valor asignado",
    },
    {
      fieldName: "plannedValue",
      header: "Valor planeado",
    },
    {
      fieldName: "id",
      header: "Vincular",
      renderCell: (row) => {
        let checked = false;
        if (projectsLink.find((project) => project.id === row.id && project.type == row.type)) checked = true;
        if (projectsUnLink.find((project) => project.id === row.id && project.type == row.type))
          checked = false;
        return (
          <SwitchComponent
            idInput={`checkRow${row.id}`}
            value={checked}
            onChange={(e) => {
              if (e.value === true) {
                setLastMove([...lastMove, { id: row }]);
                const projectLink = projectsLink.find(
                  (project) => project.id == row.id && project.type == row.type
                );
                if (!projectLink) {
                  const array = projectsLink;
                  array.push(row);
                  setProjectsLink(array);
                }
                const projectUnLink = projectsUnLink.find(
                  (project) => project.id == row.id && project.type == row.type
                );
                if (projectUnLink) {
                  const array = projectsUnLink.filter((item) => item.id != row.id && item.type == row.type);
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
                  (project) => project.id == row.id && project.type == row.type
                );
                if (!projectUnLink) {
                  const array = projectsUnLink;
                  array.push(row);
                  setProjectsUnLink(array);
                }
                const activityLink = projectsLink.find(
                  (activity) => activity.id == row.id && activity.type == row.type
                );
                if (activityLink) {
                  const array = projectsLink.filter((item) => item.id != row.id  && item.type == row.type);
                  setProjectsLink(array);
                }
              }
            }}
          />
        );
      },
    },
  ];

  function loadTableData(
    searchCriteria?: object,
    sameData?: object,
    excludeData?: object
  ): void {
    if (tableComponentRef.current) {
      tableComponentRef.current.loadData(searchCriteria, sameData, excludeData);
    }
  }

  useEffect(() => {
    if (filterTable) loadTableData();
  }, [filterTable]);

  const onSubmit = handleSubmit(async (data: IProjectFilters) => {
    loadTableData(data);
  });

  async function vinculateProjects(action: "new" | "edit"): Promise<void> {
    if (projectsLink) {
      const res = await CreateVinculation(Number(functionalArea), projectsLink);
      if (res.operation.code != EResponseCodes.OK) {
        setMessage({
          title: "Validación de datos",
          description: res.operation.message,
          show: true,
          OkTitle: "Aceptar",
          onOk: () => {
            setMessage({});
          },
          background: true,
        });
      } else {
        setMessage({
          title: "Agregar proyectos",
          description: "Se agregaron correctamente los proyectos",
          show: true,
          OkTitle: "Aceptar",
          onOk: () => {
            reset();
            if (action === "new") {
              onCancelNew();
            } else if (action === "edit") {
              onCancelEdit();
            }
            setMessage({});
          },
          background: true,
        });
      }
    }
  }

  const onCancelNew = () => {
    navigate("./../../");
  };

  const onCancelEdit = () => {
    navigate("./../");
  };

  const confirmClose = (callback) => {
    setMessage({
      title: "Cancelar proyecto",
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
    tableColumns,
    tableComponentRef,
    register,
    errors,
    reset,
    onSubmit,
    onCancelNew,
    onCancelEdit,
    confirmClose,
    vinculateProjects,
  };
}
