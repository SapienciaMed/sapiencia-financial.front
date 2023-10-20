import React from "react";
import { ButtonComponent, FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { useForm } from 'react-hook-form';
import { AiOutlinePlusCircle } from "react-icons/ai";
import { IoWalletOutline } from "react-icons/io5";
import { useWidth } from "../../../common/hooks/use-width";


function PacPages() {

    const onClick = () => {

    }

    const {
        register,
        control,
        formState: { errors },
    } = useForm()

    const {width} = useWidth()
    
    return (
        <div className='main-page'>
            <div className='card-table'>
                <section className="title-area">
                    <div className="text-black weight-500 extra-large">Consultar  PAC</div>

                    <div className={`${width < 800 ? 'display-justify-space-between-pac' : 'display-align-flex-end'} gap-0 gap-05`}>
                        <div
                            className="title-button font-big"
                            onClick={() => {}}
                        >
                            Asociar al PAC <AiOutlinePlusCircle />
                        </div>
                        <div
                            className="title-button font-big"
                            onClick={() => {}}
                        >
                            Traslado <IoWalletOutline />
                        </div>
                        <div
                            className="title-button font-big"
                            onClick={() => {}}
                        >
                            Cargar archivo <AiOutlinePlusCircle />  
                        </div>

                    </div>

                </section>
                
                <section className="card-user">
                    <FormComponent action={onClick}>
                        <div className="funcionality-filters-container">
                            <InputComponent
                                idInput="validity"
                                className="input-basic"
                                typeInput="number"
                                register={register}
                                label="Vigencia"
                                classNameLabel="text-black weight-500 biggest text-required"
                                direction={EDirection.column}
                                errors={errors}
                            />
                            <SelectComponent
                                idInput="pacType"
                                className="select-basic"
                                errors={errors}
                                label="Tipo PAC"
                                classNameLabel="text-black weight-500 biggest text-required"
                                direction={EDirection.column}
                                data={[
                                    { id: '1', name: 'Seleccione', value: null},
                                    { id: "2", name: "Traslado programado", value: "2" },
                                    { id: "3", name: "Traslado recaudado", value: "3" },
                                    { id: "4", name: "Traslado ambos", value: "4" },
                                ]}
                                control={control}
                                isValidateName={false}
                            />
                            <InputComponent
                                idInput="version"
                                className="input-basic"
                                typeInput="number"
                                register={register}
                                label="Versión"
                                classNameLabel="text-black weight-500 biggest text-required"
                                direction={EDirection.column}
                                errors={errors}
                            />
                        </div>
                        <div className="funcionality-filters-container">
                            <SelectComponent
                                idInput='projectId'
                                control={control}
                                className="select-basic"
                                label='Proyecto'
                                classNameLabel="text-black weight-500 big text-required"
                                placeholder={'Seleccionar'}   
                                data={[]}
                                filter={true}
                                fieldArray={true}
                                errors={errors} 
                            />
                            <SelectComponent
                                idInput='fundsSapiencia'
                                control={control}
                                label='Fondo Sapiencia'
                                className="select-basic"
                                classNameLabel="text-black weight-500 big text-required"
                                placeholder={'Seleccionar'}
                                filter={true}
                                fieldArray={true}
                                data={[]}
                                errors={errors}
                            />
                            <SelectComponent
                                idInput='pospreSapiencia'
                                control={control}
                                label='Pospre Sapiencia'
                                className="select-basic"
                                classNameLabel="text-black weight-500 big text-required"
                                placeholder={'Seleccionar'}
                                filter={true}
                                fieldArray={true}
                                data={[]}
                                errors={errors}
                            />
                        </div>
                        <div className="funcionality-buttons-container">
                            <span
                            className="bold text-center button"
                            onClick={() => {}}
                            >
                            Limpiar campos
                            </span>
                            <ButtonComponent
                                className="button-main huge hover-three"
                                value="Buscar"
                                type="submit"
                                // disabled={!isBtnDisable}
                            />
                        </div>

                    </FormComponent>

                </section>
            </div>
        </div>
    );

}

export default React.memo(PacPages);