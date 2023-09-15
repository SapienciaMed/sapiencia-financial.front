import React, { useEffect, useState } from "react";
import { ButtonComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { Control, Controller, FieldErrors, UseFormRegister, useFieldArray, useForm } from 'react-hook-form';
import { IAdditionsForm } from "../interfaces/Additions";
import { IArrayDataSelect } from "../../../common/interfaces/global.interface";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";

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
    setValue: any;
    watch: any;
}

function ScreenAddIncome({ count, controlRegister, errors, fields, arrayDataSelect, remove, titleAdd, register, cardId, invalidCardsAdditionSt, setValue, watch}: IAppProps) {
    const { functionalArea, areas, funds, posPre, } = arrayDataSelect

    const [areasByProjectSt, setAreasByProjectSt] = useState<any>()
    const [projectName, setProjectName] = useState('')
    const [projectIdSelectedSt, setProjectIdSelectedSt] = useState()
    const [areaIdSelectedSt, setAreaIdSelectedSt] = useState()
    const [cardIdSt, setcardIdSt] = useState("")

    useEffect(() => {
        if (projectName != "") {
            setValue(`${titleAdd.toLowerCase()}[${count}].cardId`, cardId)
            setValue(`${titleAdd.toLowerCase()}[${count}].projectId`, projectIdSelectedSt)
            setValue(`${titleAdd.toLowerCase()}[${count}].functionalArea`, (areasByProjectSt.filter(e => e.value != null)).id ?? areaIdSelectedSt)
            setValue(`${titleAdd.toLowerCase()}[${count}].projectName`, projectName)
            setcardIdSt(cardId)
        }
    }, [projectIdSelectedSt])


    useEffect(() => {
        let d = watch(`${titleAdd.toLowerCase()}[${count}].projectId`)
        const areaList = functionalArea.filter(e => e.value != null).map(e => {
            Object(e).area[0]['projectId'] = e?.id
            return Object(e).area
        });
        const areaListFlat = areaList.flat()
        let area = areaListFlat.filter(e => e.projectId == d)
        area = area.filter(e => e.value != null)
        setProjectIdSelectedSt(d)
        setAreaIdSelectedSt(area[0]?.id)
        setAreasByProjectSt(area)
    }, [projectName])


    const optionSelected = (option: any) => {
        if (option) {
            setProjectName(functionalArea.find(e => e.value == option)?.description)
            const areaList = functionalArea.filter(e => e.value != null).map(e => {
                Object(e).area[0]['projectId'] = e.id
                return Object(e).area
            });
            const areaListFlat = areaList.flat()
            let area = areaListFlat.filter(e => e.projectId == option)
            area = area.filter(e => e.value != null)
            setProjectIdSelectedSt(option)
            setAreaIdSelectedSt(area[0]?.id)
            setAreasByProjectSt(area)
        }else if(!option){
            setProjectName(undefined)
            //setValue(`${titleAdd.toLowerCase()}[${count}].projectName`, undefined)
        }
    }

    let invalidStyleCard = {
        background: invalidCardsAdditionSt.find(e => e.idCard == watch(`${titleAdd.toLowerCase()}[${count}].cardId`)) ? 'rgba(255, 0, 0, 0.30)' : 'none',
        border: invalidCardsAdditionSt.find(e => e.idCard == watch(`${titleAdd.toLowerCase()}[${count}].cardId`)) ? '1px solid #F00' : ''
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
                            data={[{ id: "91500000", name: "91500000", value: "91500000" }]}
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
                            optionSelected={optionSelected}
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

                        <InputNumberComponent
                            control={controlRegister}
                            idInput={`${titleAdd.toLowerCase()}[${count}].value`}
                            label="valor"
                            className="inputNumber-basic medium"
                            placeholder={'Seleccionar'}
                            classNameLabel="text-black biggest bold text-required"
                            errors={errors}
                            mode="currency"
                            currency="COP"
                            locale="es-CO"
                            fieldArray={true}
                            minFractionDigits={0}
                            maxFractionDigits={0}
                        />

                    </section>
                    <section className='grid-form-1-container-area mt-5px'>
                        <InputComponent
                            idInput={`${titleAdd.toLowerCase()}[${count}].projectName`}
                            label="Nombre proyecto"
                            typeInput="text"
                            className="input-basic large"
                            placeholder={'Seleccionar'}
                            classNameLabel="text-black biggest bold text-required"
                            errors={errors}
                            register={register}
                            fieldArray={true}
                            disabled={true}
                        />
                    </section>
                </div>
            </div>
        </>
    );
}

export default React.memo(ScreenAddIncome);