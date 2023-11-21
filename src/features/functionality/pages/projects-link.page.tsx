import { useParams } from "react-router-dom";
import {
  ButtonComponent,
  FormComponent,
  InputComponent,
} from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import TableComponent from "../../../common/components/table.component";
import { useProjectsLinkData } from "../hooks/projects-link.hook";

interface IAppProps {
  action: "new" | "edit";
}

function ProjectsLinkPage({ action }: IAppProps): React.JSX.Element {
  const { id } = useParams();
  const {
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
  } = useProjectsLinkData(id);
  return (
    <div className="crud-page full-height">
      <div className="main-page">
        <div className="card-table">
          <div className="title-area">
            <div className="text-black extra-large bold">Agregar proyecto</div>
          </div>

          <FormComponent action={onSubmit}>
            <div className="card-form">
              <div className="title-area">
                <label className="text-black biggest bold">
                  Consultar proyecto
                </label>
              </div>
              <div className="funcionality-filters-container">
                <InputComponent
                  idInput="id"
                  className="input-basic"
                  typeInput="text"
                  register={register}
                  label="Nombre / codigo del proyecto"
                  classNameLabel="text-black biggest bold"
                  direction={EDirection.column}
                  errors={errors}
                />
              </div>
            </div>
            <div className="funcionality-buttons-container">
              <span
                className="bold text-center button"
                onClick={() => {
                  reset();
                }}
              >
                Limpiar campos
              </span>
              <ButtonComponent
                className="button-main huge hover-three"
                value="Buscar"
                type="submit"
              />
            </div>
          </FormComponent>
          <div className="card-form">
            <TableComponent
              ref={tableComponentRef}
              url={`${process.env.urlApiFinancial}/api/v1/projects/get-unrelated-projects`}
              columns={tableColumns}
              isShowModal={false}
            />
          </div>

          <div className="mobile-actions mobile">
            <span
              className="bold text-center button"
              onClick={() => {
                confirmClose(action === "new" ? onCancelNew : onCancelEdit);
              }}
            >
              Cancelar
            </span>
            <ButtonComponent
              value="Guardar"
              type="submit"
              className="button-main huge"
              action={() => {
                vinculateProjects(action);
              }}
            />
          </div>
        </div>
      </div>

      <div className="container-button-bot">
        <div className="buttons-bot">
          <span
            className="bold text-center button"
            onClick={() => {
              confirmClose(action === "new" ? onCancelNew : onCancelEdit);
            }}
          >
            Cancelar
          </span>
          <ButtonComponent
            className="button-main huge hover-three"
            value="Guardar"
            type="button"
            action={() => {
              vinculateProjects(action);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ProjectsLinkPage;
