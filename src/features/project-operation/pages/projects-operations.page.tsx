import { AiOutlinePlusCircle } from "react-icons/ai";
import { FormComponent, InputComponent, DatePickerComponent, SelectComponent, ButtonComponent } from "../../../common/components/Form";
import TableComponent from "../../../common/components/table.component";
import { EDirection } from "../../../common/constants/input.enum";
//import { useFundsData } from "../hooks/funds.hook";
import React from "react";
import { Controller } from "react-hook-form";
import { useFundsData } from "../../functionality/hooks/funds.hook";
import { useDataProjectOperation } from "../hook/data-project-operation.hook";
import { BiPlusCircle } from "react-icons/bi";

interface IAppProps { }

function ProjectsOperationsPage(props: IAppProps): React.JSX.Element {
  const {
    tableActions,
    tableColumns,
    tableComponentRef,
    onSubmit,
    navigate,
    register,
    errors,
    reset,
    controlRegister,
    entitiesData,
    isVisibleTable,
    setIsVisibleTable,
    isBtnDisable
  } = useDataProjectOperation();

  return (
    <div className='main-page'>
      <div className='card-table'>
        <div className="title-area">
          <div className="text-black extra-large bold">Consultar proyecto</div>
          <div style={{ marginTop: '30px' }} className="title-button text-three large" onClick={() => navigate('./create')}> Crear proyecto <BiPlusCircle /> </div>
        </div>

        <div
          className={
            !isVisibleTable ? "card-user isVisible" : "card-user isNotVisible"
          }
        >
          <TableComponent
            ref={tableComponentRef}
            url={`${process.env.urlApiFinancial}/api/v1/projectOperation/get-paginated`}
            columns={tableColumns}
            actions={tableActions}
            isShowModal={true}
            titleMessageModalNoResult={"No se encontraron registros"}
            secondaryTitle="Detalles del proyecto"
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProjectsOperationsPage);