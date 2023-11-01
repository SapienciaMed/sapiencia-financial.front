import React, { useState, useEffect } from 'react';
import { Controller } from "react-hook-form";
import { DatePickerComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { useCdpCrud } from "../hooks/use-cdp";
import { EDirection } from "../../../common/constants/input.enum";
import DatePickerCdp from './date-picker-cdp';
import '../../../styles/from-create-cdp.scss';
interface FormHeadInfo {
    date: string | null;
    exercise: string;
    contractObject: string;
}

interface Props {
    isDisabled: boolean;
    setFormHeadInfo?: (data: FormHeadInfo) => void;
    formSubmitted?: boolean;
}

function CdpheadCreate(prop: Props) {
    const { isDisabled, setFormHeadInfo = () => { }, formSubmitted } = prop;

    const [formHeadInfo, setFormHeadInfoState] = useState<FormHeadInfo>({
        date: null,
        exercise: String(new Date().getFullYear()),
        contractObject: '',
    });
    const [exercise, setExercise] = useState(String(new Date().getFullYear()));
    const [contractObject, setContractObject] = useState('');
    const [date, setDate] = useState("");
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");

    const { control, register, errors } = useCdpCrud();

    const handleInputChange = (name, target) => {
        let value = target.value;
        switch (name) {
            case "exercise":
                setExercise(value);
                break;
            case "contractObject":
                setContractObject(value);
                break;
            default:
                break;
        }

        let objInformationHead = {
            date: date,
            exercise: exercise,
            contractObject: contractObject,
        };

        setFormHeadInfoState(objInformationHead);
        setFormHeadInfo(objInformationHead);
    };

    useEffect(() => {
        let objRpp = {
            date,
            exercise,
            contractObject,
        };
        setFormHeadInfoState(objRpp);
        setFormHeadInfo(objRpp);
    }, [exercise, contractObject,date]);

    const validateField = (field) => {
        if (formSubmitted && !field) {
            return 'campo-obligatorio';
        }
        return '';
    };

    return (
        <>
            <div className='container-head-form-cdp'>
                <section className="grid-form-3-container-area mt-5px" style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                    <div className="date-picker-container">
                        <label className="date-picker-label text-black weight-500 biggest">Fecha Documento: <span>*</span></label>
                        <DatePickerCdp
                            setYear={setYear}
                            setMonth={setMonth}
                            setDate={setDate}
                            selected={date}
                            placeholder="Elige una fecha"
                            disabled={false}
                            id="fecha-elegida"
                        />

                        {formSubmitted && date === "" && <p className="aviso-campo" style={{ color: "red" }}>Este campo es obligatorio</p>}
                    </div>
                    <div className="exercise-container" style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                        <div className="input-container">
                            <Controller
                                control={control}
                                name={"exercise"}
                                defaultValue={String(new Date().getFullYear())}
                                render={({ field }) => (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={year}
                                        className={`input-basic medium inactive-input ${validateField(year)}`}
                                        typeInput="number"
                                        register={register}
                                        label="Vigencia"
                                        classNameLabel="text-black weight-500 biggest"
                                        direction={EDirection.column}
                                        errors={errors}
                                        onChange={(e) => handleInputChange(field.name, e.target)}
                                        disabled={true}
                                    />
                                )}
                            />
                            {formSubmitted && year === "" && <p className="aviso-campo" style={{ color: "red" }}>Este campo es obligatorio</p>}
                        </div>
                        <div className="input-container">
                            <Controller
                                control={control}
                                name={'exercise'}
                                defaultValue={String(new Date().getFullYear())}
                                render={({ field }) => (
                                    <InputComponent
                                        id={"mes"}
                                        idInput={"mes"}
                                        value={month}
                                        className={`input-basic medium inactive-input ${validateField(month)}`}
                                        typeInput="text"
                                        register={register}
                                        label="Mes expedición"
                                        classNameLabel="text-black weight-500 biggest"
                                        direction={EDirection.column}
                                        errors={errors}
                                        disabled={true}
                                    />
                                )}
                            />
                            {formSubmitted && month === "" && <p className="aviso-campo" style={{ color: "red" }}>Este campo es obligatorio</p>}
                        </div>
                    </div>
                </section>


                <TextAreaComponent
                    id={'contractObject'}
                    idInput={'contractObject'}
                    className={`text-area-basic ${validateField(contractObject)}`}
                    register={register}
                    value={contractObject}
                    label="Objeto contractual"
                    classNameLabel="text-black biggest"
                    direction={EDirection.column}
                    errors={errors}
                    rows={2}
                    disabled={isDisabled}
                    onChange={(e) => handleInputChange("contractObject", e.target)}
                />
                {formSubmitted && contractObject == "" && <p className="aviso-campo" style={{ color: "red" }}>Este campo es obligatorio</p>}
            </div>
        </>
    );
}

export default CdpheadCreate;
