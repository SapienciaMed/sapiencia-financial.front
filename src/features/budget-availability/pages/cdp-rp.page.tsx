import React from "react";
import CdpEditFormComponent from "../components/Edit/data-basic-cdp/cdp-head-edit-form-component";
import { useWidth } from "../../../common/hooks/use-width";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { DatePickerComponent, InputComponent } from "../../../common/components/Form";
import { Controller } from 'react-hook-form';
import { TextAreaCountComponent } from "../../../common/components/Form/input-text-area-count.component";
import { useCdpRp } from "../hooks/use-cdp-rp.hook";
import TableComponent from "../../../common/components/table.component";
import TableDataPropComponent from "../../../common/components/tableDataProp.component";

const CdpRp = () => {
    const { width } = useWidth();

    const { control, register, /* tableActions ,*/ tableColumns, tableComponentRef, showTable,dataRoutesCDP} = useCdpRp();

    return (
        <div className="main-page">
            <div className="card-table gap-0">
                <section className="title-area">
                    <div className="text-black weight-500 extra-large">Visualizar RP</div>
                </section>
                <section className="card-user">
                    <section className='grid-form-3-container-area mt-5px'>
                        <DatePickerComponent
                            idInput="date"
                            control={control}
                            label={"Fecha documento"}
                            // errors={errors}
                            classNameLabel="text-black biggest text-required"
                            className="dataPicker-basic"
                            placeholder="DD/MM/YYYY"
                            dateFormat="dd/mm/yy"
                            disabled
                        />
                        <InputComponent
                            idInput="sapConsecutive"
                            className="input-basic"
                            typeInput="text"
                            register={register}
                            label="Consecutivo CDP SAP"
                            classNameLabel="text-black biggest text-required"
                            disabled
                        />
                        <InputComponent
                            idInput="consecutive"
                            className="input-basic"
                            typeInput="text"
                            register={register}
                            label="Consecutivo CDP Aurora"
                            classNameLabel="text-black biggest"
                            disabled
                        />
                    </section>
                    <div className='mt-24px'>
                        <Controller
                            control={control}
                            name={"contractObject"}
                            defaultValue=""
                            render={({ field }) => {
                                return (
                                    <TextAreaCountComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Objeto contractual"
                                        className="text-area-basic"
                                        classNameLabel="text-black biggest"
                                        rows={4}
                                        placeholder="Escribe aquí"
                                        register={register}
                                        onChange={field.onChange}
                                        characters={5000}
                                        disabled
                                    ></TextAreaCountComponent>
                                );
                            }}
                        />
                    </div>
                </section>

                <div className="card-table gap-0 mt-24px">
                 <TableDataPropComponent
                        ref={tableComponentRef}
                        dataTable={Object(dataRoutesCDP).amounts }
                        columns={tableColumns}
                        //actions={tableActions}
                        isShowModal={false}
                        titleMessageModalNoResult={"No se encontraron registros"}
                        secondaryTitle="RP"
                    />  
                </div>

            </div>
        </div>
    );
};

export default CdpRp;
