import React from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useWidth } from "../../../common/hooks/use-width";
import { useBudgeRecordCrud } from "../hook/budget-record-crud";
import TableDataPropComponent from "../../../common/components/tableDataProp.component";
import { ButtonComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { Controller } from "react-hook-form";
import { paginatorFooter } from "../../managementCenter/components/table-detail.component";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


function BudgetRecordViewPage() {

    const navigate = useNavigate()
    const { width } = useWidth()

    const {
        errors,
        register,
        control,
        tableComponentRef,
        tableColumns,
        dataAmounts,
        tableActions,
        setContractorDocumentSt
    } = useBudgeRecordCrud();

    return (
        <div className='main-page'>
            <div className='card-table gap-0'>
                <section className="title-area">
                    <div className="text-black weight-500 extra-large">Consultar  PAC</div>

                    <div className={`${width < 800 ? 'display-justify-space-between-pac' : 'display-align-flex-end'} gap-0 gap-05`}>
                        <div
                            className="title-button font-big"
                            onClick={() => { navigate('./crear') }}
                        >
                            Crear RP <AiOutlinePlusCircle />
                        </div>

                    </div>

                </section>

                <div className="card-user">

                    <section className="grid-form-3-container-area mt-5px">
                        <Controller
                            control={control}
                            name={"contractorDocument"}
                            render={({ field }) => (
                                <InputComponent
                                    id={field.name}
                                    idInput={field.name}
                                    className="input-basic medium"
                                    typeInput="text"
                                    register={register}
                                    label="Consecutivo RP SAP"
                                    classNameLabel="text-black big bold text-required"
                                    direction={EDirection.column}
                                    errors={errors}
                                    onBlur={(e) => setContractorDocumentSt(Object(e).target.value)}
                                />
                            )} />
                        <Controller
                            control={control}
                            name={"contractorDocument"}
                            render={({ field }) => (
                                <InputComponent
                                    id={field.name}
                                    idInput={field.name}
                                    className="input-basic medium"
                                    typeInput="text"
                                    register={register}
                                    label="Consecutivo RP Aurora"
                                    classNameLabel="text-black big bold text-required"
                                    direction={EDirection.column}
                                    errors={errors}
                                    onBlur={(e) => setContractorDocumentSt(Object(e).target.value)}
                                />
                            )} />
                        <Controller
                            control={control}
                            name={"contractorDocument"}
                            render={({ field }) => (
                                <InputComponent
                                    id={field.name}
                                    idInput={field.name}
                                    className="input-basic medium"
                                    typeInput="text"
                                    register={register}
                                    label="Acreedor e ID fiscal"
                                    classNameLabel="text-black big bold text-required"
                                    direction={EDirection.column}
                                    errors={errors}
                                    onBlur={(e) => setContractorDocumentSt(Object(e).target.value)}
                                />
                            )} />
                    </section>

                    <section className="grid-form-3-container-area mt-5px">
                        <SelectComponent
                            idInput="supplierType"
                            control={control}
                            label="Tipo"
                            className="select-basic medium"
                            classNameLabel="text-black big bold text-required"
                            placeholder={"Seleccionar"}
                            data={[
                                { id: 1, name: "Contratista", value: "Contratista" },
                                { id: 2, name: "Acreedor", value: "Acreedor" }
                            ]}
                            filter={true}
                            errors={errors}
                            direction={EDirection.column}
                        />

                        <Controller
                            control={control}
                            name={"contractorDocument"}
                            render={({ field }) => (
                                <InputComponent
                                    id={field.name}
                                    idInput={field.name}
                                    className="input-basic medium"
                                    typeInput="text"
                                    register={register}
                                    label="Numero de documento"
                                    classNameLabel="text-black big bold text-required"
                                    direction={EDirection.column}
                                    errors={errors}
                                    onBlur={(e) => setContractorDocumentSt(Object(e).target.value)}
                                />
                            )} />
                        <InputComponent
                            idInput="supplierName"
                            className="input-basic medium"
                            typeInput="text"
                            register={register}
                            label="Nombre"
                            classNameLabel="text-black big bold text-required"
                            direction={EDirection.column}
                            disabled={true}
                            errors={errors}
                        />
                    </section>
                    <div className="funcionality-buttons-container">
                        <span className="bold text-center button" onClick={() => {
                            /* reset();
                            if(showTable)  {
                                tableComponentRef.current.emptyData();
                                setShowTable(false)
                            } */
                        }}>
                            Limpiar campos
                        </span>
                        <ButtonComponent
                            className="button-main huge hover-three"
                            value="Buscar"
                            type="submit"
                        />
                    </div>
                </div>
                <br />
                <div className="card-user">
                    <div className="text-black weight-500 extra-large">Datos basicos</div>
                    <DataTable value={[]} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="" header="No. RP SAP"></Column>
                        <Column field="" header="No. RP Aurora"></Column>
                        <Column field="" header="ID Fiscal"></Column>
                        <Column field="" header="Identificación"></Column>
                        <Column field="" header="Contratista"></Column>
                        <Column field="" header="Dependencia"></Column>
                        <Column field="" header="Acciones"></Column>
                    </DataTable>
                </div>

                <br />
                <div className="card-user">
                    <TableDataPropComponent
                        ref={tableComponentRef}
                        dataTable={dataAmounts}
                        columns={tableColumns}
                        actions={tableActions}
                        isShowModal={false}
                        titleMessageModalNoResult={"No se encontraron registros"}
                        secondaryTitle="Rutas"
                    />
                </div>
            </div>
        </div>
    )



}

export default React.memo(BudgetRecordViewPage);