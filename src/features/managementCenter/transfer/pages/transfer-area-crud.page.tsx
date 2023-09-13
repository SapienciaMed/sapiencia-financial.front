import React from 'react'
import { ButtonComponent, FormComponent, InputComponent, TextAreaComponent } from '../../../../common/components/Form';
import { BiPlusCircle } from 'react-icons/bi';
import { useTransferAreaCrudPage } from '../hook/transfer-area-crud.hook';
import { Controller } from 'react-hook-form';
import { EDirection } from '../../../../common/constants/input.enum';
import TableComponent from '../../../../common/components/table.component';
import TableDetailComponent from '../../components/table-detail.component';

interface IAppProps {
    actionForm: "new" | "edit";
  }

function TransferAreaCrudPage({ actionForm }: IAppProps) {
    const {control, errors, navigate, onSubmit, register, tableColumns, tableActions, isBtnDisable, tableComponentRef, mockData} = useTransferAreaCrudPage()

    return (
        <div className="crud-page full-height">

            <section className="main-page full-height">
                <div className="card-table">
                    <p className="text-black extra-large">
                        {actionForm === "new" ? "Crear Traslado" : "Editar Traslado"}
                    </p>

                    <section className="card-user">
                        <FormComponent action={onSubmit} id="transfer-form" className="funds-form">
                            <div className="title-area"> 
                                <label className="text-black biggest bold">
                                    Datos básicos
                                </label>
                                <div className="title-button text-three large" onClick={() => navigate('./anadir-fondos')}> Añadir valores <BiPlusCircle/> </div>
                            </div>
                            <div className="funcionality-filters-container">
                                <Controller
                                    control={control}
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
                                                label="Acto administrativo distrito"
                                                classNameLabel="text-black biggest bold text-required"
                                                direction={EDirection.column}
                                                errors={errors}
                                                onChange={field.onChange}
                                            /> 
                                        )
                                    }}
                                />
                                <Controller
                                    control={control}
                                    name={"adminSapiencia"}
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
                                                label="Acto administrativo sapiencia"
                                                classNameLabel="text-black biggest bold text-required"
                                                direction={EDirection.column}
                                                errors={errors}
                                                onChange={field.onChange}
                                            /> 
                                        )
                                    }}
                                />
                            </div>
                            <Controller
                                control={control}
                                name={"remarks"}
                                defaultValue=""
                                render={({ field }) => {
                                    return (
                                        <TextAreaComponent
                                            id={field.name}
                                            idInput={field.name}
                                            value={`${field.value}`}
                                            className="text-area-basic"
                                            register={register}
                                            label="Observacion"
                                            classNameLabel="text-black biggest bold text-required"
                                            direction={EDirection.column}
                                            errors={errors}
                                            onChange={field.onChange}
                                        /> 
                                    )
                                }}
                            />
                        </FormComponent>
                    </section>

                    <section className="card-user mt-24px">
                        <TableDetailComponent
                            ref={tableComponentRef}
                            columns={tableColumns}
                            actions={tableActions}
                            isShowModal={true}
                            titleMessageModalNoResult={"Fondos"}
                            ownData={mockData}
                            secondaryTitle='Detalles de la ruta'
                        />
                    </section>

                </div>
            </section>

            <section className="container-button-bot-2">
                <div className='content-label'>
                    <label className="text-black biggest"> Total Traslado:</label>
                    <label className="text-black biggest" style={{color: '#533893'}}> $  </label>
                </div>
                <div className="buttons-bot">
                    <span
                        className="bold text-center button"
                        onClick={() => {}}
                    >
                        Cancelar
                    </span>
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value="Trasladar"
                        type="submit"
                        form="transfer-form"
                        disabled={!isBtnDisable}
                    />
                </div>
            </section>
            
        </div>
    )
}

export default React.memo(TransferAreaCrudPage);
