import React, { useEffect, useState } from "react";
import { ButtonComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { Control, FieldErrors } from 'react-hook-form';
import { IAdditionsIncome } from "../interfaces/Additions";

interface IAppProps {
    control: Control<IAdditionsIncome, any>,
    titleAdd: string,
    remove: (index?: number | number[]) => void,
    count: number,
    errors: FieldErrors<IAdditionsIncome>,
    isPaste: boolean
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

function ScreenAddIncome({count, control, errors, isPaste, remove, titleAdd }: IAppProps) {
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
                            control={control}                               
                            label={'Centro gestor'}
                            className="select-basic medium"
                            classNameLabel="text-black big bold text-required"
                            placeholder={'Seleccionar'}
                            data={[ { name: "91500000", value: "91500000" } ]}               
                            filter={true}
                            fieldArray={true}
                            errors={errors}
                            disabled={isPaste}

                        />
                        <SelectComponent
                            idInput={`ingreso[${count}].projectId`} 
                            control={control}                               
                            label={'Id - Proyecto nombre'}
                            className="select-basic medium"
                            classNameLabel="text-black big bold text-required"    
                            placeholder={'Seleccionar'}        
                            data={[ { name: '9000000 - Transferencias Municipio - Inversión', value: '9000000 - Transferencias Municipio - Inversión'} ]}        
                            filter={true}
                            fieldArray={true}
                            errors={errors}
                            disabled={isPaste}
                        />
                    </section>
                    <section className='grid-form-3-container-area mt-5px'>
                        <SelectComponent
                            idInput={`ingreso[${count}].functionalArea`} 
                            control={control}                               
                            label={'Área funcional'}
                            className="select-basic medium"
                            classNameLabel="text-black big bold text-required"
                            placeholder={'Seleccionar'}                
                            filter={true}
                            fieldArray={true}
                            data={[ { name: '00000.00000.0001', value: '00000.00000.0001' } ]}
                            errors={errors}
                            disabled={isPaste}
                        />
                        <SelectComponent
                            idInput={`ingreso[${count}].funds`} 
                            control={control}                               
                            label={'Fondo'}
                            className="select-basic medium"
                            classNameLabel="text-black big bold text-required"    
                            placeholder={'Seleccionar'}               
                            filter={true}
                            fieldArray={true}
                            data={[{ name: '911000123', value: '911000123' }]}
                            errors={errors}
                            disabled={isPaste}
                        />
                        <SelectComponent
                            idInput={`ingreso[${count}].posPre`} 
                            control={control}                               
                            label={'Pospre'}
                            className="select-basic medium"
                            classNameLabel="text-black big bold text-required"    
                            placeholder={'Seleccionar'}               
                            filter={true}
                            fieldArray={true}
                            data={[ { name: '91102060060602', value: '91102060060602' } ]}
                            errors={errors}
                            disabled={isPaste}
                        />
                        <SelectComponent
                            idInput={`ingreso[${count}].value`} 
                            control={control}                               
                            label={'Valor'}
                            className="select-basic medium"
                            classNameLabel="text-black big bold text-required"    
                            placeholder={'Seleccionar'}               
                            filter={true}
                            fieldArray={true}
                            data={[ { name: '20.439.790.866', value: '20.439.790.866'} ]}
                            errors={errors}
                            disabled={isPaste}
                        />
                    </section>
                </div>
            </div>
        </>
    );
}

export default React.memo(ScreenAddIncome);