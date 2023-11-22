import React, { useEffect } from "react";
import { ButtonComponent, ButtonLoadingComponent, DatePickerComponent, FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { useNavigate } from "react-router";
import { useWidth } from "../../../common/hooks/use-width";
import { Controller } from "react-hook-form";
import { EDirection } from "../../../common/constants/input.enum";
import { useParams } from "react-router-dom";
import { useCreditorCrud } from "../hook/creditor-crud";
import TableDataPropComponent from "../../../common/components/tableDataProp.component";
import { useCreditorView } from "../hook/creditor-view";
import { AiOutlinePlusCircle } from "react-icons/ai";

function CreditorViewPage() {
    const { id } = useParams();
    const navigate = useNavigate()
    const { width } = useWidth()

    const {
        errors,
        register,
        control,
        reset,
        setMessage,
        onSubmitCreditor,
        componentsData,
        dependeciesData,
        isAllowSave,
        tableComponentRef,
        tableColumns,
        tableActions,
        creditorsSt,
        setCreditorsSt,
        documentTypeList,
        validateActionAccess
    } = useCreditorView();

    return (
        <div className='main-page'>
            <div className='card-table gap-0'>
                <div className="title-area">
                    <div className="text-black weight-500 extra-large">Consultar acreedor</div>

                    {
                        validateActionAccess('ACREEDOR_CREAR') && (
                            <div className="title-button text-three biggest">
                                <span style={{ marginRight: '0.5em' }} onClick={() => { navigate('./crear') }}> Crear acreedor</span>
                                {<AiOutlinePlusCircle size={20} color="533893" />}
                            </div>
                        )
                    }
                </div>
                <FormComponent
                    action={onSubmitCreditor}
                    id="form-pac"
                    className="form-pac"
                >
                    <div className="card-user">
                        <section className="grid-form-3-container-area mt-5px">
                            <SelectComponent
                                idInput="typeDocument"
                                control={control}
                                label="Tipo de identificación"
                                className="select-basic medium"
                                classNameLabel="text-black big bold"
                                placeholder={"Seleccionar"}
                                data={documentTypeList}
                                filter={true}
                                errors={errors}
                                direction={EDirection.column}
                            />

                            <Controller
                                control={control}
                                name={"document"}
                                render={({ field }) => (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        className="input-basic medium"
                                        typeInput="text"
                                        register={register}
                                        label="Identificación"
                                        classNameLabel="text-black big bold"
                                        direction={EDirection.column}
                                        errors={errors}
                                        onChange={(value) => field.onChange(value)}
                                    />
                                )} />

                            <Controller
                                control={control}
                                name={"taxIdentification"}
                                render={({ field }) => (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        className="input-basic medium"
                                        typeInput="text"
                                        register={register}
                                        label="Identificación fiscal"
                                        classNameLabel="text-black big bold"
                                        direction={EDirection.column}
                                        errors={errors}
                                        onChange={(value) => field.onChange(value)}
                                    />
                                )} />

                            <Controller
                                control={control}
                                name={"name"}
                                render={({ field }) => (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        className="input-basic medium"
                                        typeInput="text"
                                        register={register}
                                        label="Razón social / Nombre"
                                        classNameLabel="text-black big bold"
                                        direction={EDirection.column}
                                        errors={errors}
                                        onChange={(value) => field.onChange(value)}
                                    />
                                )} />

                        </section>

                    </div>
                    <br />
                    <section>
                        <div className="container-button-bot">
                            <span className="bold text-center button" style={{marginRight:'10px'}} onClick={() => {
                                reset()
                                setCreditorsSt([]);
                            }}>
                                Limpiar campos
                            </span>

                            <div className="buttons-bot">
                                <ButtonLoadingComponent
                                    className="button-main huge hover-three"
                                    value="Buscar"
                                    form="form-pac"
                                    type="submit"
                                    disabled={!isAllowSave}
                                />
                            </div>
                        </div>

                        {
                            creditorsSt.length > 0 && (
                                <div className="card-user">
                                    <TableDataPropComponent
                                        ref={tableComponentRef}
                                        dataTable={creditorsSt}
                                        columns={tableColumns}
                                        actions={tableActions}
                                        isShowModal={false}
                                        titleMessageModalNoResult={"No se encontraron registros"}
                                        secondaryTitle="Resultados de búsqueda"
                                    />
                                </div>
                            )
                        }
                    </section>
                </FormComponent>
            </div>
        </div>
    )
}


export default React.memo(CreditorViewPage);