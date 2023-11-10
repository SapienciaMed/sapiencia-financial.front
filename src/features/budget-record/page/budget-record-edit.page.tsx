import React from "react";
import { ButtonComponent, ButtonLoadingComponent, DatePickerComponent, FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { useBudgeRecordView } from "../hook/budget-record-view";
import { useNavigate } from "react-router";
import { useWidth } from "../../../common/hooks/use-width";
import { Controller } from "react-hook-form";
import { EDirection } from "../../../common/constants/input.enum";


function BudgetRecordEditRpPage() {

    const navigate = useNavigate()
    const { width } = useWidth()

    const {
        errors,
        register,
        control,
        setMessage,
        tableComponentRef,
        tableColumns,
        onSubmitFiltersRp,
        /* dataAmounts, */
        tableActions,
        /* setContractorDocumentSt, */
        dataFindRpSt,
        dataRouteBudgetsSt,
        reset,
        setDataFindRpSt,
        setDataRouteBudgetsSt
    } = useBudgeRecordView();

    return (
        <div className='main-page'>
            <div className='card-table gap-0'>
                <section className="title-area">
                    <div className="text-black weight-500 extra-large">Editar datos basicos RP</div>
                </section>
                <FormComponent
                    action={onSubmitFiltersRp}
                    id="form-pac"
                    className="form-pac"
                >
                    <div className="card-user">
                        <div className="text-black weight-500 extra-large">Tercero</div>

                        <section className="grid-form-3-container-area mt-5px">
                            <Controller
                                control={control}
                                name={"consecutivoRpSap"}
                                render={({ field }) => (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        className="input-basic medium"
                                        typeInput="text"
                                        register={register}
                                        label="Identificación"
                                        classNameLabel="text-black big bold text-required"
                                        direction={EDirection.column}
                                        errors={errors}
                                        onChange={(value) => field.onChange(value)}
                                        disabled={true}
                                    />
                                )} />
                            <Controller
                                control={control}
                                name={"consecutiveRpAurora"}
                                render={({ field }) => (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        className="input-basic medium"
                                        typeInput="text"
                                        register={register}
                                        label="Consecutivo RP Aurora"
                                        classNameLabel="text-black big bold text-required"
                                        direction={EDirection.column}
                                        errors={errors}
                                        onChange={(value) => field.onChange(value)}
                                        disabled={true}
                                    />
                                )} />
                            <Controller
                                control={control}
                                name={"consecutiveRpAurora"}
                                render={({ field }) => (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        className="input-basic medium"
                                        typeInput="text"
                                        register={register}
                                        label="Contratista"
                                        classNameLabel="text-black big bold text-required"
                                        direction={EDirection.column}
                                        errors={errors}
                                        onChange={(value) => field.onChange(value)}
                                        disabled={true}
                                    />
                                )} />

                        </section>
                        <div className="text-black weight-500 extra-large">Dependencia</div>
                        <section className="grid-form-3-container-area mt-5px">
                            <SelectComponent
                                idInput="dependencyId"
                                control={control}
                                label="Dependencia"
                                className="select-basic medium"
                                classNameLabel="text-black big bold text-required"
                                placeholder={"Seleccionar"}
                                //data={dependeciesData}
                                filter={true}
                                errors={errors}
                                direction={EDirection.column}
                            />
                            <InputComponent
                                idInput="contractualObject"
                                className={'input-basic medium'}
                                typeInput="text"
                                register={register}
                                label="Actividad del objeto contractual"
                                classNameLabel="text-black big bold text-required"
                                direction={EDirection.column}
                                errors={errors}
                            //onBlur={(e) => setContractualObjectSt(Object(e).target.value)}
                            />

                            <SelectComponent
                                idInput="componentId"
                                control={control}
                                label="Componente"
                                className="select-basic medium"
                                classNameLabel="text-black big bold text-required"
                                placeholder={"Seleccionar"}
                                //data={componentsData}
                                filter={true}
                                errors={errors}
                                direction={EDirection.column}
                            />

                        </section>

                        <section className="grid-form-3-container-area mt-5px">
                            <Controller
                                control={control}
                                name={"contractorDocument"}
                                render={({ field }) => (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        className="input-basic medium"
                                        typeInput="text"
                                        register={register}
                                        label="Consecutivo RP SAP"
                                        classNameLabel="text-black big bold text-required"
                                        direction={EDirection.column}
                                        errors={errors}
                                        onChange={(value) => field.onChange(value)}
                                    />
                                )} />

                            <SelectComponent
                                idInput="supplierType"
                                control={control}
                                label="Líder del proceso"
                                className="select-basic medium"
                                classNameLabel="text-black big bold text-required"
                                placeholder={"Seleccionar"}
                                data={[
                                    { id: 1, name: "Lider1", value: "Lider1" },
                                    { id: 2, name: "Lider2", value: "Lider2" }
                                ]}
                                filter={true}
                                errors={errors}
                                direction={EDirection.column}
                            />


                            <InputComponent
                                idInput="supplierName"
                                className="input-basic medium"
                                typeInput="text"
                                register={register}
                                label="No. contrato"
                                classNameLabel="text-black big bold text-required"
                                direction={EDirection.column}
                                disabled={true}
                                errors={errors}
                            />
                        </section>
                        <section className="grid-form-3-container-area mt-5px">
                            <SelectComponent
                                idInput="supplierType"
                                control={control}
                                label="Supervisor del contrato"
                                className="select-basic medium"
                                classNameLabel="text-black big bold text-required"
                                placeholder={"Seleccionar"}
                                data={[
                                    { id: 1, name: "Lider1", value: "Lider1" },
                                    { id: 2, name: "Lider2", value: "Lider2" }
                                ]}
                                filter={true}
                                errors={errors}
                                direction={EDirection.column}
                            />

                            <DatePickerComponent
                                idInput="documentDate"
                                control={control}
                                label={"Fecha documento"}
                                errors={errors}
                                classNameLabel="text-black biggest bold text-required"
                                className="dataPicker-basic medium"
                                placeholder="DD/MM/YYYY"
                                dateFormat="dd/mm/yy"
                            />
                            <DatePickerComponent
                                idInput="dateValidity"
                                control={control}
                                label={"Fecha vencimiento"}
                                errors={errors}
                                classNameLabel="text-black biggest bold"
                                className="dataPicker-basic medium"
                                placeholder="DD/MM/YYYY"
                                dateFormat="dd/mm/yy"
                            //minDate={new Date(startDate)}
                            />
                        </section>
                    </div>
                </FormComponent>
            </div>
            <div className="container-button-bot">
                <ButtonComponent
                    form="useQueryForm"
                    value="Cancelar"
                    type="button"
                    className="button-clean-fields bold"
                    action={() => {
                        setMessage({
                            title: "Cancelar",
                            show: true,
                            cancelTitle: "Cancelar",
                            OkTitle: "Aceptar",
                            description: (
                                <div style={{ width: "100%" }}>
                                    <label>¿Estas segur@ de cancelar?</label>
                                </div>
                            ),
                            background: true,
                            onOk: () => {
                                navigate("/gestion-financiera/rp");
                                setMessage({});
                            },
                            onCancel: () => {
                                setMessage({});
                            },
                        });
                    }}
                />

                <div className="buttons-bot">
                    <ButtonLoadingComponent
                        className="button-main huge hover-three"
                        value="Guardar"
                        form="form-pac"
                        type="button"
                        action={() => {
                            //btnUploadFileRef.current.click();
                            /* setIsUploadFileSt(false) */
                        }}
                    //isLoading={isLoading}
                    //disabled={!isAllowSave}
                    />
                </div>
            </div>
        </div>
    )
}


export default React.memo(BudgetRecordEditRpPage);