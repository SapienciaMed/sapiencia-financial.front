import React, { useEffect, useState } from "react";
import {  InputComponent, SelectComponent } from "../../../../common/components/Form";
import { IFormTransferPac } from "../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface";
import { useWidth } from "../../../../common/hooks/use-width";
import { useWatch } from "react-hook-form";
import { IDropdownPropsFuctionalArea } from "../../../../common/interfaces/global.interface";
import FormPacmonths  from './form-months-pac'

function FormTransferPac({ count, control, titleAdd, errors, arrayDataSelect, pacTypeState, register, setValue }: IFormTransferPac) {

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

    const renderElement = () =>  {
        if(pacTypeState == 2){
            return (
                <FormPacmonths
                        control={control}
                        count={count}
                        pacTypeMonth="programmed"
                        titleAdd={titleAdd}
                        titleActive='Programado'
                    />
            )
        }

        if(pacTypeState == 3){
            return (
                <FormPacmonths
                        control={control}
                        count={count}
                        pacTypeMonth="collected"
                        titleAdd={titleAdd}
                        titleActive='Recaudado'
                    />
            )
        }

        if(pacTypeState == 4){
            return (
                <>
                    <FormPacmonths
                        control={control}
                        count={count}
                        pacTypeMonth="programmed"
                        titleAdd={titleAdd}
                        titleActive='Programado'
                    />

                    <FormPacmonths
                        control={control}
                        count={count}
                        pacTypeMonth="collected"
                        titleAdd={titleAdd}
                        titleActive='Recaudado'
                    />  
                </>
            )
        }


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
                    idInput={`${titleAdd}[${count}].fundsSapiencia`}
                    control={control}
                    label='Fondo Sapiencia'
                    className="select-basic medium"
                    classNameLabel="text-black weight-500 big text-required"
                    placeholder={'Seleccionar'}
                    filter={true}
                    fieldArray={true}
                    data={funds}
                    errors={errors}
                />
                <SelectComponent
                    idInput={`${titleAdd}[${count}].pospreSapiencia`}
                    control={control}
                    label='Fondo Sapiencia'
                    className="select-basic medium"
                    classNameLabel="text-black weight-500 big text-required"
                    placeholder={'Seleccionar'}
                    filter={true}
                    fieldArray={true}
                    data={posPre}
                    errors={errors}
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

            {  renderElement() }
            
       </div>
    )
}

export default React.memo(FormTransferPac);