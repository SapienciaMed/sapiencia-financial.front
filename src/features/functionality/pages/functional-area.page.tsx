import React from "react";
import { ButtonComponent, FormComponent, InputComponent } from "../../../common/components/Form";
import TableComponent from "../../../common/components/table.component";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useFunctionalAreaData } from "../hooks/functional-area.hook";
import { EDirection } from "../../../common/constants/input.enum";
import { Controller } from 'react-hook-form';

interface IAppProps { }

function FunctionalAreaPage(props: IAppProps): React.JSX.Element {
    const { tableActions, tableColumns, tableComponentRef, showTable, isBtnDisable, control, setShowTable, setIsBtnDisable,
        navigate, register, errors, reset, onSubmit } = useFunctionalAreaData();
    return (
        <div>
            <FormComponent action={onSubmit}>
                <div className="card-form">
                    <div className="title-area">
                        <label className="text-black biggest bold">
                            Consultar Área funcional
                        </label>

                        <div className="title-button text-main biggest" onClick={() => { navigate('./create') }}>
                            Crear área funcional <AiOutlinePlusCircle />
                        </div>
                    </div>
                    <div className="one-filter-container">
                        <Controller
                            control={control}
                            name={"number"}
                            defaultValue=""
                            render={({ field }) => {
                                return (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        className="input-basic"
                                        typeInput="text"
                                        register={register}
                                        label="Código"
                                        classNameLabel="text-black biggest bold"
                                        direction={EDirection.column}
                                        errors={errors}
                                        onChange={field.onChange}
                                    /> 
                                )
                            }}
                        />
                    </div>
                </div>
                <div className="funcionality-buttons-container">
                    <span className="bold text-center button" onClick={() => {
                        reset();
                        if(showTable)  {
                            tableComponentRef.current.emptyData();
                            setShowTable(false)
                        }
                    }}>
                        Limpiar campos
                    </span>
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value="Buscar"
                        type="submit"
                        disabled={!isBtnDisable}
                    />
                </div>
            </FormComponent>
            {
                showTable && 
                    <div className="card-form">
                        <TableComponent
                            ref={tableComponentRef}
                            url={`${process.env.urlApiFinancial}/api/v1/functional-area/get-paginated`}
                            columns={tableColumns}
                            actions={tableActions}
                            isShowModal={true}
                            titleMessageModalNoResult='Área funcional'
                        />
                    </div>
            }
        </div>
    )
}

export default React.memo(FunctionalAreaPage);

