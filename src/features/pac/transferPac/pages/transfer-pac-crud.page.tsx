import { SelectComponent } from "../../../../common/components/Form";
import { EDirection } from "../../../../common/constants/input.enum";
import { useTransferPacCrudData } from "../hook/transfer-pac-crud.hook";

function TransferPacPage(): React.JSX.Element {

    const { control, errors } = useTransferPacCrudData()
    

    return(
        <div className="main-page">
            <div className="card-table">
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
                                { id: "2", name: "Traslado programado", value: "Traslado programado" },
                                { id: "3", name: "Traslado recaudado", value: "Traslado recaudado" },
                                { id: "4", name: "Traslado ambos", value: "Traslado ambos" },
                            ]}
                            control={control}
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
                                { id: "2", name: "Ejemplo1", value: "ejemplo1" },
                                { id: "3", name: "Ejemplo2", value: "ejemplo2" },
                                { id: "4", name: "Ejemplo3", value: "ejemplo3" },
                            ]}
                            control={control}
                        />
                    </div>
                </section>
            </div>
        </div>
    )
}

export default TransferPacPage;