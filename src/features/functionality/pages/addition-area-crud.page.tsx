
import React from 'react'
import { ButtonComponent, FormComponent, InputComponent, SelectComponent } from '../../../common/components/Form';
import { EDirection } from '../../../common/constants/input.enum';
import { useForm } from 'react-hook-form';
import { FaRegCopy } from 'react-icons/fa';
import { BiPlusCircle } from 'react-icons/bi';

interface IAppProps {
    action: "new" | "edit";
  }

function AdditionAreaCrud({action}: IAppProps) {
    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue,
        setError,
      } = useForm();

      const onSubmitSignIn = handleSubmit(async (data: { numberDocument:string, password: string }) => {
        
      })

  return (
    <div className="crud-page full-height">
        <div className="main-page full-height">
            <p className="text-black extra-large"> { action === "new" ? "Crear adición" : "Editar adición" } </p>
            <div className="card-table">
                <FormComponent action={onSubmitSignIn} >
                    <div className="card-form">
                        <div className="funcionality-filters-container">
                            {/* <InputComponent
                                idInput="prueba1"
                                className="input-basic"
                                typeInput="number"
                                register={register}
                                label="Posición presupuestaria"
                                classNameLabel="text-black biggest bold"                          
                            />
                                <InputComponent
                                idInput="prueba2"
                                className="input-basic"
                                typeInput="string"
                                register={register}
                                label="Denominación"
                                classNameLabel="text-black biggest bold"
                                
                            /> */}
                        </div>
                    </div>
                    <div className="card-table">
                        <div className="title-area"> 
                            <label className="text-black biggest"> Lista de ingreso </label>
                            <div className='display-justify-flex-center p-rating'>
                                <div className="title-button text-three large"> Pegar <FaRegCopy/> </div>
                                <div className="title-button text-three large"> Añadir ingreso <BiPlusCircle/> </div>
                            </div>
                        </div>
                    </div>
                </FormComponent>
            </div>
        </div>
    </div>
  )
}

export default React.memo(AdditionAreaCrud);