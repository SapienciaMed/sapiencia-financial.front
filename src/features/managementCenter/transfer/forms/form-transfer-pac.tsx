import React, { useEffect, useState } from "react";
import {  InputComponent, SelectComponent } from "../../../../common/components/Form";
import { IFormTransferPac } from "../interfaces/TransferAreaCrudInterface";
import { InputNumberComponent } from "../../../../common/components/Form/input-number.component";
import { useWidth } from "../../../../common/hooks/use-width";
import { useWatch } from "react-hook-form";
import { IDropdownPropsFuctionalArea } from "../../../../common/interfaces/global.interface";

function FormTransferPac({ count, control, titleAdd, errors, arrayDataSelect, register, setValue }: IFormTransferPac) {
    
    const {width} = useWidth()
    const { functionalArea, funds, posPre, } = arrayDataSelect
    const formOrigen = useWatch({ control, name: titleAdd })

    const [projectIdSelectedSt, setProjectIdSelectedSt] = useState<string>('')
    const [areaIdSelectedSt, setAreaIdSelectedSt] = useState<number | string>()
    const [areasByProjectSt, setAreasByProjectSt] = useState<IDropdownPropsFuctionalArea[]>()
    const [projectName, setProjectName] = useState('')

    useEffect(() => {
        if (projectName != "") {
            setValue(`${titleAdd.toLowerCase()}[${count}].functionalArea`, (areasByProjectSt.find(e => e.value != null)).id ?? areaIdSelectedSt)
            setValue(`${titleAdd.toLowerCase()}[${count}].projectName`, projectName)
        }
    }, [projectIdSelectedSt])

    useEffect(() => {
        processFunctionalArea(formOrigen[count].projectId)
    }, [projectName])

    const optionSelected = (option: any) => {
        if (option) {
            setProjectName(functionalArea.find(e => e.value == option)?.description)
           processFunctionalArea(option)
        }
    }

    const processFunctionalArea = (option: any) => {
        const areaList = functionalArea.filter(props => props.value != null).map(propsFunctionalArea => {
            Object(propsFunctionalArea).area[0]['projectId'] = propsFunctionalArea?.id
            return Object(propsFunctionalArea).area
        });
        const area = areaList.flat().filter(propsAreaList => propsAreaList.projectId == option && propsAreaList.value !== null);

        setProjectIdSelectedSt(option)
        setAreaIdSelectedSt(area[0]?.id)
        setAreasByProjectSt(area)
    }


    return(
       <div className='position-relative bottom bottom-1 padding padding-0-1-1 display-flex-direction-column gap-1'>
            <section className={` ${titleAdd == 'origen' ? 'display-justify-flex-end' : width < 1024 ? 'display-justify-flex-end' :'display-justify-flex-start'} `}>
                <label className="text-black weight-500 biggest"> {count + 1} </label>
            </section>

            <section className="display-flex-direction-column gap-1">
                <SelectComponent
                    idInput={`${titleAdd.toLowerCase()}[${count}].managerCenter`}
                    control={control}
                    label={'Centro gestor'}
                    className="select-basic medium"
                    classNameLabel="text-black weight-500 big text-required"
                    placeholder={'Seleccionar'}
                    data={[{ id: "91500000", name: "91500000", value: "91500000" }]}
                    filter={true}
                    fieldArray={true}
                    errors={errors}
                />
                 <SelectComponent
                    idInput={`${titleAdd}[${count}].projectId`}
                    control={control}
                    label='Proyecto'
                    className="select-basic medium"
                    classNameLabel="text-black weight-500 big text-required"
                    placeholder={'Seleccionar'}   
                    data={functionalArea}
                    filter={true}
                    fieldArray={true}
                    errors={errors}
                    optionSelected={optionSelected}
                />

                <SelectComponent
                    idInput={`${titleAdd}[${count}].functionalArea`}
                    control={control}
                    label='Área funcional'
                    className="select-basic medium"
                    classNameLabel="text-black weight-500 big text-required"
                    placeholder={'Seleccionar'}
                    filter={true}
                    fieldArray={true}
                    data={areasByProjectSt}
                    errors={errors}
                />
                <SelectComponent
                    idInput={`${titleAdd}[${count}].funds`}
                    control={control}
                    label='Fondo'
                    className="select-basic medium"
                    classNameLabel="text-black weight-500 big text-required"
                    placeholder={'Seleccionar'}
                    filter={true}
                    fieldArray={true}
                    data={funds}
                    errors={errors}
                />
                <SelectComponent
                    idInput={`${titleAdd}[${count}].posPre`}
                    control={control}
                    label='Pospre'
                    className="select-basic medium"
                    classNameLabel="text-black weight-500 big text-required"
                    placeholder={'Seleccionar'}
                    filter={true}
                    fieldArray={true}
                    data={posPre}
                    errors={errors}
                />

                 <InputComponent
                    idInput={`${titleAdd}[${count}].projectName`}
                    label="Nombre proyecto"
                    typeInput="text"
                    className="input-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big text-required"
                    errors={errors}
                    register={register}
                    fieldArray={true}
                />
            </section>

            <section className="display-flex-direction-column gap-1 mt-3rem">
                <label className="text-black weight-500 biggest text-center"> Recaudado </label>
                <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].result.january`}
                    label='Enero'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    errors={errors}
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
                <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].result.february`}
                    label='Febrero'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    errors={errors}
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
               <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].result.march`}
                    label='Marzo'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    errors={errors}
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
                 <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].result.april`}
                    label='Abril'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    errors={errors}
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
                 <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].result.may`}
                    label='Mayo'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    errors={errors}
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
                 <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].result.june`}
                    label='Junio'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    errors={errors}
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
                 <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].result.july`}
                    label='Julio'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    errors={errors}
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
                 <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].result.august`}
                    label='Agosto'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    errors={errors}
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
                 <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].result.september`}
                    label='Septiembre'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    errors={errors}
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
                 <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].result.october`}
                    label='Octubre'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    errors={errors}
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
                 <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].result.november`}
                    label='Noviembre'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    errors={errors}
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
                 <InputNumberComponent
                    control={control}
                    idInput={`${titleAdd}[${count}].result.december`}
                    label='Diciembre'
                    className="inputNumber-basic medium"
                    placeholder={'Seleccionar'}
                    classNameLabel="text-black weight-500 big"
                    errors={errors}
                    mode="currency"
                    currency="COP"
                    locale="es-CO"
                    fieldArray={true}
                    minFractionDigits={0}
                    maxFractionDigits={0}
                />
            </section>
       </div>
    )
}

export default React.memo(FormTransferPac);