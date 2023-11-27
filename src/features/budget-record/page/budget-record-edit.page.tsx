import React, { useEffect, useState } from "react";
import { ButtonComponent, ButtonLoadingComponent, DatePickerComponent, FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { useBudgeRecordView } from "../hook/budget-record-view";
import { useNavigate } from "react-router";
import { useWidth } from "../../../common/hooks/use-width";
import { Controller } from "react-hook-form";
import { EDirection } from "../../../common/constants/input.enum";
import { useParams } from "react-router-dom";
import { useBudgeRecordEdit } from "../hook/budget-record-edit";


function BudgetRecordEditRpPage() {
    const { id } = useParams();
    const navigate = useNavigate()
    const { width } = useWidth()


    const {
        errors,
        register,
        control,
        setMessage,
        onSubmitEditRp,
        componentsData,
        dependeciesData,
        contractorListSt,
        activityObjectContractData
    } = useBudgeRecordEdit(id);

    const [isAllowUpdateBtn, setIsAllowUpdateBtn] = useState(false)

    return (
        <div className='main-page'>
            <div className='card-table gap-0'>
                <section className="title-area">
                    <div className="text-black weight-500 extra-large">Editar datos basicos RP</div>
                </section>
                <FormComponent
                    action={onSubmitEditRp}
                    id="form-pac"
                    className="form-pac"
                >
                    <div className="card-user">
                        <div className="text-black weight-500 extra-large">Tercero</div>

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
                                name={"supplierName"}
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

                            <Controller
                                control={control}
                                name={"consecutiveCdpAurora"}
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
                                data={dependeciesData}
                                filter={true}
                                errors={errors}
                                direction={EDirection.column}
                                optionSelected={()=>setIsAllowUpdateBtn(true)}
                            />
                            <SelectComponent
                                idInput="contractualObject"
                                control={control}
                                label="Actividad del objeto contractual"
                                className="select-basic medium"
                                classNameLabel="text-black big bold text-required"
                                placeholder={"Seleccionar"}
                                data={activityObjectContractData}
                                filter={true}
                                errors={errors}
                                direction={EDirection.column}
                                optionSelected={()=>setIsAllowUpdateBtn(true)}
                            />
                            
                            <SelectComponent
                                idInput="componentId"
                                control={control}
                                label="Componente"
                                className="select-basic medium"
                                classNameLabel="text-black big bold text-required"
                                placeholder={"Seleccionar"}
                                data={componentsData}
                                filter={true}
                                errors={errors}
                                direction={EDirection.column}
                                optionSelected={()=>setIsAllowUpdateBtn(true)}
                            />

                        </section>

                        <section className="grid-form-3-container-area mt-5px">
                            <Controller
                                control={control}
                                name={"consecutiveSap"}
                                render={({ field }) => (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        className="input-basic medium"
                                        typeInput="text"
                                        register={register}
                                        label="Consecutivo RP SAP"
                                        classNameLabel="text-black big bold"
                                        direction={EDirection.column}
                                        errors={errors}
                                        onChange={(value) => {field.onChange(value);setIsAllowUpdateBtn(true)}}
                                    />
                                )} />

                            <SelectComponent
                                idInput="responsibleDocument"
                                control={control}
                                label="Líder del proceso"
                                className="select-basic medium"
                                classNameLabel="text-black big bold"
                                placeholder={"Seleccionar"}
                                data={contractorListSt}
                                filter={true}
                                errors={errors}
                                direction={EDirection.column}
                                optionSelected={()=>setIsAllowUpdateBtn(true)}
                            />

                            <Controller
                                control={control}
                                name={"contractNumber"}
                                render={({ field }) => (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        className="input-basic medium"
                                        typeInput="number"
                                        register={register}
                                        label="No. contrato"
                                        classNameLabel="text-black big bold"
                                        direction={EDirection.column}
                                        errors={errors}
                                        onChange={(value) => {field.onChange(value);setIsAllowUpdateBtn(true)}}
                                    />
                                )} />
                        </section>
                        <section className="grid-form-3-container-area mt-5px">
                            <SelectComponent
                                idInput="supervisorDocument"
                                control={control}
                                label="Supervisor del contrato"
                                className="select-basic medium"
                                classNameLabel="text-black big bold"
                                placeholder={"Seleccionar"}
                                data={contractorListSt}
                                filter={true}
                                errors={errors}
                                direction={EDirection.column}
                                optionSelected={()=>setIsAllowUpdateBtn(true)}
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
                                classNameLabel="text-black biggest bold text-required"
                                className="dataPicker-basic medium"
                                placeholder="DD/MM/YYYY"
                                dateFormat="dd/mm/yy"
                            //minDate={new Date(startDate)}
                            />
                        </section>
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
                                type="submit"
                                disabled={!isAllowUpdateBtn}
                            />
                        </div>
                    </div>
                </FormComponent>
            </div>

        </div>
    )
}


export default React.memo(BudgetRecordEditRpPage);