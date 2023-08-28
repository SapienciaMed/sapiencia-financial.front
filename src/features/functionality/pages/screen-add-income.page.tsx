import React from "react";
import { ButtonComponent,  InputComponent,  SelectComponent } from "../../../common/components/Form";
import { Control, FieldErrors, UseFormRegister} from 'react-hook-form';
import { IAdditionsForm } from "../../managementCenter/interfaces/Additions";
import { IArrayDataSelect } from "../../../common/interfaces/global.interface";
import { EDirection } from "../../../common/constants/input.enum";
import { projectIdName } from "../../../common/constants/nameProject";

interface IAppProps {
    controlRegister: Control<IAdditionsForm, any>,
    titleAdd: string,
    arrayDataSelect: IArrayDataSelect,
    count: number,
    errors: FieldErrors<IAdditionsForm>,
    fields: any,
    remove: (index?: number | number[]) => void,
    register: UseFormRegister<IAdditionsForm>,
 }

function ScreenAddIncome({count, controlRegister, errors, fields, arrayDataSelect, remove, titleAdd, register }: IAppProps) {
    const { functionalArea, funds, posPre } = arrayDataSelect
    return (
        <>   
            <div className='card-user mt-14px'>
                <div className="title-area">
                    <label className="text-black biggest"> { count + 1 }. {titleAdd.charAt(0).toUpperCase() + titleAdd.slice(1)}</label>
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
                            idInput={`${titleAdd.toLowerCase()}[${count}].managerCenter`}
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
                            idInput={`${titleAdd.toLowerCase()}[${count}].projectId`} 
                            control={controlRegister}                               
                            label={'Id - Nombre proyecto'}
                            className="select-basic medium"
                            classNameLabel="text-black big bold text-required"    
                            placeholder={'Seleccionar'}        
                            data={projectIdName}        
                            filter={true}
                            fieldArray={true}
                            errors={errors}
                        />
                    </section>
                    <section className='grid-form-3-container-area mt-5px'>
                        <SelectComponent
                            idInput={`${titleAdd.toLowerCase()}[${count}].functionalArea`} 
                            control={controlRegister}                               
                            label={'Área funcional'}
                            className="select-basic medium"
                            classNameLabel="text-black big bold text-required"
                            placeholder={'Seleccionar'}                
                            filter={true}
                            fieldArray={true}
                            data={functionalArea}
                            errors={errors}
                        />
                        <SelectComponent
                            idInput={`${titleAdd.toLowerCase()}[${count}].funds`} 
                            control={controlRegister}                               
                            label={'Fondo'}
                            className="select-basic medium"
                            classNameLabel="text-black big bold text-required"    
                            placeholder={'Seleccionar'}               
                            filter={true}
                            fieldArray={true}
                            data={funds}
                            errors={errors}
                        />
                        <SelectComponent
                            idInput={`${titleAdd.toLowerCase()}[${count}].posPre`} 
                            control={controlRegister}                               
                            label={'Pospre'}
                            className="select-basic medium"
                            classNameLabel="text-black big bold text-required"    
                            placeholder={'Seleccionar'}               
                            filter={true}
                            fieldArray={true}
                            data={posPre}
                            errors={errors}
                        />
                        <InputComponent
                            idInput={`${titleAdd.toLowerCase()}[${count}].value`}                            
                            label="valor"
                            typeInput="text"
                            className="input-basic"
                            placeholder={'Seleccionar'}               
                            classNameLabel="text-black biggest bold text-required"
                            direction={EDirection.row}
                            errors={errors}
                            register={register}
                        />
                    </section>
                </div>
            </div>
        </>
    );
}

export default React.memo(ScreenAddIncome);