import { BiPlusCircle } from "react-icons/bi";
import { FormComponent, InputComponent, SelectComponent, ButtonComponent } from "../../../../common/components/Form";
import TableComponent from "../../../../common/components/table.component";
import { EDirection } from "../../../../common/constants/input.enum";
import { useManagementCenterTransfer } from "../hook/management-center-transfer.hook";
import { Controller } from "react-hook-form";

interface IAppProps { }

function ManagementCenterTransferPage(props: IAppProps): React.JSX.Element {
    const { tableActions, tableColumns, tableComponentRef, navigate, onSubmit, showTable, register, errors, reset, typesTransfersData, controlRegister, isBtnDisable,setShowTable } = useManagementCenterTransfer();
    return (
        <div className='main-page'>
            <div className='card-table'>
                <div className="title-area">
                    <div className="text-black extra-large bold">Traslado</div>
                </div>
                <FormComponent action={onSubmit}>
                    <div className="card-form">
                        <div className="title-area">
                            <label className="text-black biggest bold">
                                Consultar Traslado
                            </label>
                            <div style={{ marginTop: '0px' }} className="title-button text-three large" onClick={() => navigate('./create')}> Crear traslado <BiPlusCircle /> </div>
                        </div>

                        <div className="funcionality-filters-container">
                            <Controller
                                control={controlRegister}
                                name={"adminDistrict"}
                                defaultValue=""
                                render={({ field }) => {
                                    return (
                                        <InputComponent
                                            id={field.name}
                                            idInput={field.name}
                                            value={`${field.value}`}
                                            className="input-basic"
                                            typeInput="text"
                                            register={register}
                                            label="Acto administrativo"
                                            classNameLabel="text-black biggest bold text-required"
                                            direction={EDirection.column}
                                            errors={errors}
                                            onChange={field.onChange}
                                        />
                                    )
                                }}
                            />
                            <Controller
                                control={controlRegister}
                                name={"observations"}
                                defaultValue=""
                                render={({ field }) => {
                                    return (
                                        <InputComponent
                                            id={field.name}
                                            idInput={field.name}
                                            value={`${field.value}`}
                                            className="input-basic"
                                            typeInput="text"
                                            register={register}
                                            label="Observaciones"
                                            classNameLabel="text-black biggest bold text-required"
                                            direction={EDirection.column}
                                            errors={errors}
                                            onChange={field.onChange}
                                        />
                                    )
                                }}
                            />

                        </div>
                    </div>
                    <div className="container-button-core mt-24px">
                        <div className="display-justify-space-between">
                            <ButtonComponent
                                form='useQueryForm'
                                value="Limpiar campos"
                                type="button"
                                className="button-clean-fields bold"
                                action={() => {
                                    reset()
                                    if(showTable)  {
                                        tableComponentRef.current.emptyData();
                                        setShowTable(false)
                                    }
                                }}
                            />
                            <ButtonComponent
                                className="button-search"
                                value="Buscar"
                                type="submit"
                                disabled={!isBtnDisable}
                            />
                        </div>
                    </div>
                </FormComponent>

                {
                    showTable && (
                        <div className="card-form">
                            <TableComponent
                                ref={tableComponentRef}
                                url={`${process.env.urlApiFinancial}/api/v1/transfers/get-paginated`}
                                columns={tableColumns}
                                actions={tableActions}
                                isShowModal={false}
                            />
                        </div>
                    )
                }
            </div>
        </div>
    )
}
export default ManagementCenterTransferPage;