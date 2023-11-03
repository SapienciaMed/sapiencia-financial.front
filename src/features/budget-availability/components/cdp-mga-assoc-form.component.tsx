import React from "react";
import { Controller, useForm } from 'react-hook-form';
import { ButtonComponent, FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { useCdpCrud } from "../hooks/use-cdp";
import { EDirection } from "../../../common/constants/input.enum";
import { useCdpMgaAssoc } from "../hooks/cdp-mga-assoc.hook";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import * as Icons from "react-icons/fa";
import { useWidth } from "../../../common/hooks/use-width";
import { DataView } from "primereact/dataview";

interface Props {
    isDisabled: boolean;
    cdpId?: string;
}

function CdpMgaAssocFormComponent(props: Props) {
    const { isDisabled, cdpId } = props;
    
    const {control, errors, arrayDataSelect, disableAddButton, arrayMgaAssoc, register, onSubmit, deleteElement } = useCdpMgaAssoc(cdpId)
    const { width } = useWidth();

    const actionBodyTemplate = (row) => {
        return (
            <div className="spc-table-action-button">
                <div
                onClick={() => deleteElement(row.id)}
                >
                   <Icons.FaTrashAlt className="button grid-button button-delete" />
                </div>
            </div>
        );
    };

    const mobilTemplate = (item) => {
        return (
          <div className="card-grid-item">
            <div className="card-header">
              {arrayMgaAssoc.map((column,index) => {
                
                return (
                  <div key={item} className="item-value-container">
                    
                  </div>
                );
              })}
            </div>
            <div className="card-footer">
              <section className="position-absolute top text-black bold text-center">
                {" "}
                Acciones{" "}
              </section>
                { actionBodyTemplate(item) }
            </div>
          </div>
        );
      };

    return (
        <>
            <section  className='card-table gap-0 mt-16px'>
                <section className='grid-form-3-container-area mt-5px'>
                    <InputComponent
                        idInput="projectId"
                        className="input-basic medium"
                        typeInput="text"
                        register={register}
                        label='Proyecto'
                        classNameLabel="text-black weight-500 biggest bold"
                        direction={EDirection.column}
                        disabled={true}
                    />

                    <InputComponent
                        idInput="fundsSapiencia"
                        className="input-basic medium"
                        typeInput="text"
                        register={register}
                        label='Fondo Sapiencia'
                        classNameLabel="text-black weight-500 biggest bold"
                        direction={EDirection.column}
                        disabled={true}
                    />

                    <InputComponent
                        idInput="pospreSapiencia"
                        className="input-basic medium"
                        typeInput="text"
                        register={register}
                        label='Pospre Sapiensia'
                        classNameLabel="text-black weight-500 biggest bold"
                        direction={EDirection.column}
                        disabled={true}
                    />
                </section>
                <section className='grid-form-3-container-area mt-5px'>
                    <InputComponent
                        idInput="finalValue"
                        className="input-basic medium"
                        typeInput="text"
                        register={register}
                        label='Valor final'
                        classNameLabel="text-black weight-500 biggest bold"
                        direction={EDirection.column}
                        disabled={true}
                    />  
                </section>

            </section>

            <section  className='card-table gap-0 mt-16px'>
                <FormComponent action={onSubmit}  id="form-cdp-assoc-mga">
                    <div className="funcionality-filters-container">

                        <SelectComponent
                            idInput='DetailedActivityMGA'
                            control={control}
                            label='Actividad detallada MGA'
                            className="select-basic big"
                            classNameLabel="text-black weight-500 biggest text-required"
                            placeholder={'Seleccionar'}
                            data={arrayDataSelect.listDetailedActivityMGA}
                            errors={errors}
                        /> 

                        <SelectComponent
                            idInput='cpc'
                            control={control}
                            label='CPC'
                            className="select-basic big"
                            classNameLabel="text-black weight-500 biggest text-required"
                            placeholder={'Seleccionar'}
                            data={[
                                { id: '1', name: 'Seleccione', value: null},
                                { id: "2", name: "CPC 1", value: "CPC 1" },
                                { id: "3", name: "CPC 2", value: "CPC 2" },
                                { id: "4", name: "CPC 3", value: "CPC 3" },
                            ]}
                            errors={errors}
                        />

                        <Controller
                            control={control}
                            name={"percentageAffected"} 
                            render={({ field }) => {
                                return (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        className="input-basic big"  
                                        typeInput="number"
                                        register={register}
                                        label="Porcentaje de afectación"
                                        classNameLabel="text-black weight-500 biggest text-required"
                                        direction={EDirection.column}
                                        errors={errors}
                                    />
                                );
                            }}
                        /> 


                    </div>
                    <section className="container-button-bot-2" style={{border:'none'}}>
                        <div></div>
                        <div className="buttons-bot">
                            <div></div>
                            <ButtonComponent
                                className="button-main huge hover-three"
                                value="Agregar"
                                type="submit"
                                form="form-cdp-assoc-mga" 
                                disabled={disableAddButton}               
                            />
                        </div>
                    </section>
                </FormComponent>
            </section>

            {
                arrayMgaAssoc.length > 0 && (
                    <div  className='card-table gap-0 mt-16px'>
                        <section className="title-area">
                            <div className="text-black weight-500 extra-large">MGA asociadas</div>
                        </section>

                        <section className="spc-common-table-assoc">
                        { 
                            width > 830 ? (
                                <DataTable
                                    className={`spc-table full-height`}
                                    value={arrayMgaAssoc}
                                    scrollable={true}
                                >            
                                    <Column field="mgaProduct" header="Producto MGA"></Column>
                                    <Column field="mgaActivity" header="Actividad MGA"></Column>
                                    <Column field="detailedMgaActivity" header="Actividad detallada MGA"></Column>
                                    <Column field="cpc" header="CPC"></Column>
                                    <Column field="percentage" header="Porcentaje"></Column>
                                    <Column 
                                        className="spc-table-actions" 
                                        header={
                                            <div>
                                                <div className="spc-header-title">Acciones</div>
                                            </div>
                                        }
                                        body={actionBodyTemplate}
                                    />

                                </DataTable>
                            ) : (
                                <DataView
                                  value={arrayMgaAssoc}
                                  itemTemplate={mobilTemplate}
                                  rows={5}
                                />
                              )
                            }
                        </section>
                    </div>
                )
            }
        
        </>
    )
}

export default React.memo(CdpMgaAssocFormComponent);