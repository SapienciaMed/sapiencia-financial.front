import React, { useContext, useEffect, useState } from "react";
import { ButtonComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { Control, FieldErrors, useWatch, useFormState } from 'react-hook-form';
import { IAdditionsIncome } from "../interfaces/Additions";
import { AppContext } from "../../../common/contexts/app.context";

interface IAppProps {
    controlRegister: Control<IAdditionsIncome, any>,
    titleAdd: string,
    remove: (index?: number | number[]) => void,
    count: number,
    errors: FieldErrors<IAdditionsIncome>,
    fields: any
 }

interface ImportInterface {
    CENTROGESTOR: string;
    FONDO: string;
    NOMBREPROYECTO: string;
    POSICIÓNPRESUPUESTAL: string;
    PROYECTO: string;
    VALORCONTRACRÉDITO: string;
    VALORCRÉDITO: string;
    ÁREAFUNCIONAL: string;
}

function ScreenAddIncome({count, controlRegister, errors, fields, remove, titleAdd }: IAppProps) {

    return (
        <>   
            <div className='card-user mt-14px'>
                <div className="title-area">
                    <label className="text-black biggest"> { count + 1 }. {titleAdd}</label>
                    <ButtonComponent
                        value={"Eliminar"}
                        type="button"
                        action={() => { remove( count) }}
                        className="button-delete biggest bold"         
                    />
                
                </div>
                <div>
                    <section className='grid-form-2-container-reverse mt-5px'>
                        <SelectComponent
                            idInput={`ingreso[${count}].managerCenter`}
                            control={controlRegister}                               
                            label={'Centro gestor'}
                            className="select-basic medium"
                            classNameLabel="text-black big bold text-required"
                            placeholder={'Seleccionar'}
                            data={[ { name: "91500000", value: "91500000" } ]}               
                            filter={true}
                            fieldArray={true}
                            errors={errors}
                        />
                        <SelectComponent
                            idInput={`ingreso[${count}].projectId`} 
                            control={controlRegister}                               
                            label={'Id - Proyecto nombre'}
                            className="select-basic medium"
                            classNameLabel="text-black big bold text-required"    
                            placeholder={'Seleccionar'}        
                            data={[ { name: '9000000 - Transferencias Municipio - Inversión', value: '9000000 - Transferencias Municipio - Inversión'} ]}        
                            filter={true}
                            fieldArray={true}
                            errors={errors}
                        />
                    </section>
                    <section className='grid-form-3-container-area mt-5px'>
                        <SelectComponent
                            idInput={`ingreso[${count}].functionalArea`} 
                            control={controlRegister}                               
                            label={'Área funcional'}
                            className="select-basic medium"
                            classNameLabel="text-black big bold text-required"
                            placeholder={'Seleccionar'}                
                            filter={true}
                            fieldArray={true}
                            data={[ { name: '00000.00000.0001', value: '00000.00000.0001' } ]}
                            errors={errors}
                        />
                        <SelectComponent
                            idInput={`ingreso[${count}].funds`} 
                            control={controlRegister}                               
                            label={'Fondo'}
                            className="select-basic medium"
                            classNameLabel="text-black big bold text-required"    
                            placeholder={'Seleccionar'}               
                            filter={true}
                            fieldArray={true}
                            data={[{ name: '911000123', value: '911000123' }]}
                            errors={errors}
                        />
                        <SelectComponent
                            idInput={`ingreso[${count}].posPre`} 
                            control={controlRegister}                               
                            label={'Pospre'}
                            className="select-basic medium"
                            classNameLabel="text-black big bold text-required"    
                            placeholder={'Seleccionar'}               
                            filter={true}
                            fieldArray={true}
                            data={[ { name: '91102060060602', value: '91102060060602' } ]}
                            errors={errors}
                        />
                        <SelectComponent
                            idInput={`ingreso[${count}].value`} 
                            control={controlRegister}                               
                            label={'Valor'}
                            className="select-basic medium"
                            classNameLabel="text-black big bold text-required"    
                            placeholder={'Seleccionar'}               
                            filter={true}
                            fieldArray={true}
                            data={[ { name: '20.439.790.866', value: '20.439.790.866'} ]}
                            errors={errors}
                        />
                    </section>
                </div>
            </div>
        </>
    );
}

export default React.memo(ScreenAddIncome);