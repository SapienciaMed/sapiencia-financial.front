import { ButtonComponent, FormComponent, SelectComponent } from "../../../../common/components/Form";
import { EDirection } from "../../../../common/constants/input.enum";
import CreateFundTransferPac from "../forms/create-fund-transfer-pac";
import { useTransferPacCrudData } from "../hook/transfer-pac-crud.hook";

function TransferPacCrud(): React.JSX.Element {

    const { control, arrayDataSelect, errors, pacTypeState, isdataResetState,  register, setValue, onSubmit } = useTransferPacCrudData()
 
    return(
        <div className="crud-page full-height">
            <section className="main-page full-height">
                <div className="card-table">
                    <FormComponent action={onSubmit} id="transfer-form" className="display-flex-direction-column gap-1">
                        
                            <section className="title-area">
                                <div className="text-black weight-500 extra-large">Traslados</div>
                            </section>

                            <section className="card-user">
                                <div className="funcionality-filters-container">
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
                                    <SelectComponent
                                        idInput="validity"
                                        className="select-basic"
                                        errors={errors}
                                        label="Vigencia"
                                        classNameLabel="text-black weight-500 biggest text-required"
                                        direction={EDirection.column}
                                        data={[
                                            { id: '1', name: 'Seleccione', value: null},
                                            { id: "2", name: "2022", value: "2022" },
                                            { id: "3", name: "2023", value: "2023" },
                                            { id: "4", name: "2024", value: "2024" },
                                        ]}
                                        control={control}
                                        isValidateName={false}
                                    />
                                    <SelectComponent
                                        idInput="TypeResource"
                                        className="select-basic"
                                        errors={errors}
                                        label="Tipo de recurso"
                                        classNameLabel="text-black weight-500 biggest text-required"
                                        direction={EDirection.column}
                                        data={[
                                            { id: '1', name: 'Seleccione', value: null},
                                            { id: "2", name: "Ejemplo1", value: "2" },
                                            { id: "3", name: "Ejemplo2", value: "3" },
                                            { id: "4", name: "Ejemplo3", value: "4" },
                                        ]}
                                        control={control}
                                        isValidateName={false}
                                    />
                                </div>
                            </section>

                            <section className="card-user">
                                <div className="display-justify-space-between-pac gap-1">

                                    <section className="width-50">
                                        <CreateFundTransferPac 
                                            titleAdd="origen" 
                                            arrayDataSelect={arrayDataSelect}
                                            control={control}
                                            errors={errors}
                                            register={register}
                                            setValue={setValue}
                                            pacTypeState={pacTypeState}
                                            isdataReset={isdataResetState}
                                        />
                                    </section>

                                    <section className="width-50">
                                        <CreateFundTransferPac 
                                            titleAdd="destino"
                                            arrayDataSelect={arrayDataSelect}
                                            control={control}
                                            errors={errors}
                                            register={register}
                                            setValue={setValue}
                                            pacTypeState={pacTypeState}
                                            isdataReset={isdataResetState}
                                        />
                                    </section>

                                </div>
                                
                            </section>
                        
                    </FormComponent>
                </div>
            </section>
            <section className="container-button-bot-2">
                <div className='content-label'>
                    
                </div>
                <div className="buttons-bot">
                    <span
                        className="bold text-center button"
                        
                    >
                        Cancelar
                    </span>
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value="Guardar"
                        type="submit"
                        form="transfer-form"
                    />
                </div>
            </section>
        </div>
    )
}

export default TransferPacCrud;