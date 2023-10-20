import { Paginator } from "primereact/paginator";
import { ButtonComponent, FormComponent, InputComponent, SelectComponent } from "../../../../common/components/Form";
import { EDirection } from "../../../../common/constants/input.enum";
import CreateFundTransferPac from "../forms/create-fund-transfer-pac";
import { useTransferPacCrudData } from "../hook/transfer-pac-crud.hook";
import { paginatorFooter } from "../../../managementCenter/components/table-detail.component";
import { calcularTotalOrigenLocation, calculateTotalDestino, calculateTotalDestinoLocation, calculateTotalOrigen } from "../util";
import { ProgressSpinner } from "primereact/progressspinner";

function TransferPacCrud(): React.JSX.Element {

    const { control, arrayDataSelect, errors, pacTypeState, isdataResetState, startIndex, watchAll, itemsPerPage, disableBtnAdd, showSpinner,
        isBtnDisable, arrayDataSelectHead, annualDataRoutesOriginal, currentTotal, originalOriginDestination, register, 
        setValue, onSubmit, onPageChange, getValues, onCancelar, setPacTypeState, setTypeValidityState, 
        setIsdataResetState, setAnnualDataRoutesOriginal } = useTransferPacCrudData()
 
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
                                    optionSelected={(valor) => setPacTypeState(valor)}
                                />
                                <SelectComponent
                                    idInput="validity"
                                    className="select-basic"
                                    errors={errors}
                                    label="Vigencia"
                                    classNameLabel="text-black weight-500 biggest text-required"
                                    direction={EDirection.column}
                                    data={arrayDataSelectHead.validityData}
                                    control={control}
                                    isValidateName={false}
                                    optionSelected={(valueValidity) => setTypeValidityState(valueValidity)}
                                />
                                <SelectComponent
                                    idInput="TypeResource"
                                    className="select-basic"
                                    errors={errors}
                                    label="Tipo de recurso"
                                    classNameLabel="text-black weight-500 biggest text-required"
                                    direction={EDirection.column}
                                    data={arrayDataSelectHead.typeResourceData}
                                    control={control}
                                    isValidateName={false}
                                />
                            </div>
                        </section>

                        <section className="card-user">
                            {
                                showSpinner && (
                                    <ProgressSpinner style={{width: '20px', height: '20px'}}  animationDuration=".5s" />

                                )              
                            }
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
                                        itemsPerPage={itemsPerPage}
                                        startIndex={startIndex}
                                        disableBtnAdd={disableBtnAdd}
                                        setIsdataResetState={setIsdataResetState}
                                        setAnnualDataRoutesOriginal={setAnnualDataRoutesOriginal}
                                        annualDataRoutesOriginal={annualDataRoutesOriginal}
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
                                        itemsPerPage={itemsPerPage}
                                        startIndex={startIndex}
                                        disableBtnAdd={disableBtnAdd}
                                        setIsdataResetState={setIsdataResetState}
                                        setAnnualDataRoutesOriginal={setAnnualDataRoutesOriginal}
                                        annualDataRoutesOriginal={annualDataRoutesOriginal}
                                    />
                                </section>

                            </div>

                            {
                                (getValues('origen')?.length > 2 || getValues('destino')?.length > 2 )&&
                                <div className="spc-common-table">
                                    <Paginator
                                        className="spc-table-paginator"
                                        template={paginatorFooter}
                                        first={startIndex}
                                        rows={itemsPerPage}
                                        totalRecords={getValues('origen')?.length || getValues('destino')?.length}
                                        onPageChange={onPageChange}
                                    />
                                </div>
                            }
                            
                        </section>

                        {
                            annualDataRoutesOriginal.length > 1 && 
                                <section className="card-user gap-1">
                                    <div className="title-area">
                                        <div className="text-black weight-500 large">Totales</div>
                                    </div>
                                    
                                    <div className="funcionality-filters-container">
                                        <InputComponent
                                            idInput="totalOrigenActual"
                                            className="input-basic medium"
                                            typeInput="text"
                                            register={register}
                                            label="Total Origen actual"
                                            classNameLabel="text-black big bold"
                                            direction={EDirection.column}
                                            errors={errors}
                                            value={`$ ${calcularTotalOrigenLocation(originalOriginDestination)?.toLocaleString()}`}
                                            disabled
                                        />
                                        <InputComponent
                                            idInput="totalDestinoActual"
                                            className="input-basic medium"
                                            typeInput="text"
                                            register={register}
                                            label="Total Destino actual"
                                            classNameLabel="text-black big bold"
                                            direction={EDirection.column}
                                            errors={errors}
                                            value={`$ ${calculateTotalDestinoLocation(originalOriginDestination)?.toLocaleString()}`}
                                            disabled
                                        />
                                        <InputComponent
                                            idInput="sumatoriaActual"
                                            className="input-basic medium"
                                            typeInput="text"
                                            register={register}
                                            label="Sumatoria Actual"
                                            classNameLabel="text-black big bold"
                                            direction={EDirection.column}
                                            errors={errors}
                                            value={`$ ${String(currentTotal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`}
                                            disabled
                                        />
                                    </div>

                                    <div className="funcionality-filters-container">
                                        <InputComponent
                                            idInput="totalOrigenNuevo"
                                            className="input-basic medium"
                                            typeInput="text"
                                            register={register}
                                            label="Total Origen Nuevo"
                                            classNameLabel="text-black big bold"
                                            direction={EDirection.column}
                                            errors={errors}
                                            value={`$ ${calculateTotalOrigen(watchAll)?.toLocaleString()}`}
                                            disabled
                                        />
                                        <InputComponent
                                            idInput="totalDestinoNuevo"
                                            className="input-basic medium"
                                            typeInput="text"
                                            register={register}
                                            label="Total Destino Nuevo"
                                            classNameLabel="text-black big bold"
                                            direction={EDirection.column}
                                            errors={errors}
                                            value={`$ ${calculateTotalDestino(watchAll)?.toLocaleString()}`}
                                            disabled
                                        />
                                        <InputComponent
                                            idInput="sumatoriaNuevo"
                                            className="input-basic medium"
                                            typeInput="text"
                                            register={register}
                                            label="Sumatoria Nuevo"
                                            classNameLabel="text-black big bold"
                                            direction={EDirection.column}
                                            errors={errors}
                                            value={`$ ${ (calculateTotalOrigen(watchAll) + calculateTotalDestino(watchAll))?.toLocaleString() } `}
                                            disabled
                                        />
                                    </div>
                                </section>
                                
                        }

                    </FormComponent>
                </div>
            </section>
            <section className="container-button-bot-2">
                <div className='content-label'>
                    
                </div>
                <div className="buttons-bot">
                    <span
                        className="bold text-center button"
                        onClick={onCancelar}
                    >
                        Cancelar
                    </span>
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value="Guardar"
                        type="submit"
                        form="transfer-form"
                        disabled={!isBtnDisable}
                    />
                </div>
            </section>
        </div>
    )
}

export default TransferPacCrud;