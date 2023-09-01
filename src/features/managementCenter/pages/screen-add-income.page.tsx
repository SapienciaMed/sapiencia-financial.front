import React, { useEffect, useMemo, useState } from "react";
import { ButtonComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { Control, FieldErrors, UseFormRegister, useFieldArray, useForm } from 'react-hook-form';
import { IAdditionsForm } from "../interfaces/Additions";
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
    cardId: string;
    invalidCardsAdditionSt: any;
    setValue:any;
}

function ScreenAddIncome({ count, controlRegister, errors, fields, arrayDataSelect, remove, titleAdd, register, cardId, invalidCardsAdditionSt, setValue }: IAppProps) {
    const { functionalArea, areas, funds, posPre,} = arrayDataSelect
    
    //const [cardIdSt, setCardIdSt] = useState(cardId)
    const [areasByProjectSt, setAreasByProjectSt] = useState<any>()
    const [projectName, setProjectName] = useState()
    const [valueMoneySt, setValueMoneySt] = useState('')

    

    /* const [idOptionSelectedProject, setIdOptionSelectedProject] = useState(0)
    const optionSelected = (value: number) => {
        const functionalAreaFilter = functionalArea.filter(e => e.value != null)
        const areaProject = functionalAreaFilter.find(project => project.value == value)
        if(value!=idOptionSelectedProject){
            setIdOptionSelectedProject(value)
        }
        setProjectName(Object(areaProject).name)
        setAreasByProjectSt(Object(areaProject).area)
        //setCardIdSt(cardId)
    } */

    useEffect(() => {
        let d = areas.filter(e=>e[0].cardId==cardId);
        setValue(`${titleAdd.toLowerCase()}[${count}].cardId`,cardId)
        setAreasByProjectSt(d[0])
    })

    let invalidStyleCard = {
        background: invalidCardsAdditionSt.idCard == cardId ? 'rgba(255, 0, 0, 0.30)' : 'none',
        border: invalidCardsAdditionSt.idCard == cardId ? '1px solid #F00' : ''
    }

    return (
        <>
            <div className='card-user mt-14px' style={invalidStyleCard}>
                <div className="title-area">
                    <label className="text-black biggest"> {count + 1}. {titleAdd.charAt(0).toUpperCase() + titleAdd.slice(1)}</label>
                    <ButtonComponent
                        value={"Eliminar"}
                        type="button"
                        action={() => { remove(count) }}
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
                            data={[{ name: "91500000", value: "91500000" }]}
                            filter={true}
                            fieldArray={true}
                            errors={errors}
                        />
                        <SelectComponent
                            idInput={`${titleAdd.toLowerCase()}[${count}].projectId`}
                            control={controlRegister}
                            label={'Proyecto'}
                            className="select-basic medium"
                            classNameLabel="text-black big bold text-required"
                            placeholder={'Seleccionar'}
                            //data={projectIdName}        
                            data={functionalArea}
                            filter={true}
                            fieldArray={true}
                            errors={errors}
                            /* optionSelected={optionSelected} */
                         />
                        <SelectComponent
                            idInput={`${titleAdd.toLowerCase()}[${count}].functionalArea`}
                            control={controlRegister}
                            label={'Área funcional'}
                            className="select-basic medium"
                            classNameLabel="text-black big bold text-required"
                            placeholder={'Seleccionar'}
                            filter={true}
                            fieldArray={true}
                            data={areasByProjectSt}
                            errors={errors}
                        />
                    </section>
                    <section className='grid-form-3-container-area mt-5px'>

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
                            /* idInput="actAdministrativeSapiencia" */
                            label="valor"
                            typeInput="text"
                            className="input-basic"
                            placeholder={'Seleccionar'}
                            classNameLabel="text-black biggest bold text-required"
                            errors={errors}
                            register={register}
                        />
                    </section>
                    <section className='grid-form-1-container-area mt-5px'>
                        <InputComponent
                            idInput={`${titleAdd.toLowerCase()}[${count}].projectName`}
                            //value={projectName}
                            label="Nombre proyecto"
                            typeInput="text"
                            className="input-basic large"
                            placeholder={'Seleccionar'}
                            classNameLabel="text-black biggest bold text-required"
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