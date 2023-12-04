import React from "react";
import { useWidth } from "../../../common/hooks/use-width";
import { AiOutlinePlusCircle } from "react-icons/ai";
import {
    ButtonComponent,
    DatePickerComponent,
    FormComponent,
    InputComponent,
    SelectComponent,
    TextAreaComponent,
} from "../../../common/components/Form";
import { Controller } from "react-hook-form";
import { useSearchPays } from "../hooks/useSearchPays";
import { EDirection } from "../../../common/constants/input.enum";
import TableComponent from "../../../common/components/table.component";

const PaysPage = () => {
    const { width } = useWidth();
    const {
        control,
        register,
        onSubmit,
        isBtnDisable,
        errors,
        reset,
        showTable,
        setShowTable,
        tableComponentRef,
        tableColumnsCdp,
        navigate,
        arraySelect,

    } = useSearchPays();
    const dateToday = new Date()
    const actualFullYear = dateToday.getFullYear();
    return (
        <div className="main-page">
            <div className="card-table gap-0">
                <section className="title-area">
                    <div className="text-black weight-500 extra-large">Consultar Pago</div>
                    <div
                        className={`${width < 800
                                ? "display-justify-space-between-pac"
                                : "display-align-flex-end"
                            } gap-0 gap-05`}
                    >
                        <div
                            className="title-button font-big"
                            onClick={() => navigate("./load-pays")}
                        >
                            Cargar pagos
                            <AiOutlinePlusCircle />
                        </div>
                    </div>
                </section>
                <section className="card-user">
                    <FormComponent action={onSubmit}>
                        <div className="title-area">
                            <label className="text-black biggest bold">Consultar Pago</label>
                        </div>
                        <div className="funcionality-filters-container">
                            <Controller
                                control={control}
                                name={"exercise"}
                                //defaultValue={String(new Date().getFullYear())}
                                render={({ field }) => {
                                    return (
                                        <InputComponent
                                            id={field.name}
                                            idInput={field.name}
                                            className="input-basic color-default-value"
                                            defaultValue={actualFullYear.toString()}
                                            typeInput="number"
                                            register={register}
                                            label="Vigencia"
                                            classNameLabel="text-black weight-500 biggest text-required"
                                            direction={EDirection.column}
                                            onChange={field.onChange}
                                            errors={errors}
                                        />
                                    );
                                }}
                            />

                            <SelectComponent
                                idInput="mes"
                                control={control}
                                className="select-basic"
                                label="Mes"
                                classNameLabel="text-black weight-500 biggest text-required"
                                placeholder={"Seleccionar"}
                                data={arraySelect}
                                direction={EDirection.column}
                                filter={true}
                                isValidateName={false}
                                errors={errors}
                            />

                            <Controller
                                control={control}
                                name={"vinculacionRpCode"}
                                //defaultValue={1}
                                render={({ field }) => {
                                    return (
                                        <InputComponent
                                            id={field.name}
                                            idInput={field.name}
                                            className="input-basic color-default-value"
                                            typeInput="number"
                                            register={register}
                                            label="Consecutivo RP SAP"
                                            classNameLabel="text-black weight-500 biggest text-required"
                                            direction={EDirection.column}
                                            onChange={field.onChange}
                                            errors={errors}
                                        />
                                    );
                                }}
                            />

                        </div>



                        <div className="funcionality-buttons-container">
                            <ButtonComponent
                                form="useQueryForm"
                                value="Limpiar campos"
                                type="button"
                                className="button-clean-fields bold"
                                action={() => {
                                    reset();
                                    if (showTable) {
                                        tableComponentRef.current.emptyData();
                                        setShowTable(false);
                                    }
                                }}
                            />
                            <ButtonComponent
                                className="button-main huge hover-three"
                                value="Buscar"
                                type="submit"
                                disabled={!isBtnDisable}
                            />
                        </div>
                    </FormComponent>
                </section>
                {showTable && (
                    <div className="card-user mt-2rem">
                        <TableComponent
                            ref={tableComponentRef}
                            url={`${process.env.urlApiFinancial}/api/v1/pag-pagos/get-paginated`}
                            columns={tableColumnsCdp}
                            isShowModal={true}
                            titleMessageModalNoResult="No hay resultados"
                            secondaryTitle="Pagos"
                            title="Resultados de busqueda"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaysPage;
