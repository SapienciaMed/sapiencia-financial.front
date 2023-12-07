import { useState, useEffect } from 'react';
import { Controller } from "react-hook-form";
import { InputComponent, TextAreaComponent } from "../../../common/components/Form";
import { useCdpCrud } from "../hooks/use-cdp";
import { EDirection } from "../../../common/constants/input.enum";
import DatePickerCdp from './date-picker-cdp';
import '../../../styles/from-create-cdp.scss';
import { Grid } from '@mui/material';

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

    const [formHeadInfoState, setFormHeadInfoState] = useState<FormHeadInfo>({
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
        setExercise(year.toString())
        
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
            exercise: year.toString(),
            contractObject: contractObject,
        };

        setFormHeadInfoState(objInformationHead);
        setFormHeadInfo(objInformationHead);
    };

    useEffect(() => {
        let objRpp = {
            date: date.toString(),
            exercise: year.toString(),
            contractObject,
        };
        setFormHeadInfoState(objRpp);
        setFormHeadInfo(objRpp);
    }, [exercise, contractObject, date,year]);

    const validateField = (field) => {
        if (formSubmitted && !field) {
            return 'campo-obligatorio';
        }
        return '';
    };

    return (
        <>
            <div className='container-head-form-cdp'>
                <div>
                    <h2 className='tittles'>Fechas</h2>
                </div>
                <Grid container spacing={2} style={{ gap: '20px' }}>
                    <Grid item xs={12} sm={12} md={3}>
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
                                className={validateField(date)}

                            />
                            {formSubmitted && date === "" && <p className="aviso-campo" style={{ color: "red" }}>Este campo es obligatorio</p>}
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <div className="input-container">
                            <Controller
                                control={control}
                                name={"exercise"}
                                defaultValue={String(new Date().getFullYear())}

                                render={({ field }) => (
                                    <div>
                                        <label className="text-black weight-500 biggest">
                                            Vigencia <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <InputComponent
                                            id={field.name}
                                            idInput={field.name}
                                            value={year}
                                            className={`input-basic medium inactive-input ${validateField(year)}`}
                                            typeInput="number"
                                            register={register}
                                            classNameLabel="text-black weight-500 biggest"
                                            direction={EDirection.column}
                                            errors={errors}
                                            onChange={(e) => handleInputChange('exercise', e.target)}
                                            disabled={true}
                                            style={{ marginTop: '3.2px' }}
                                        />
                                    </div>
                                )}
                            />


                            {formSubmitted && year === "" && <p className="aviso-campo" style={{ color: "red" }}>Este campo es obligatorio</p>}
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <div className="input-container">
                            <Controller
                                control={control}
                                name={'exercise'}
                                defaultValue={String(new Date().getFullYear())}
                                render={({ field }) => (
                                    <div>
                                        <label className="text-black weight-500 biggest">
                                            Mes expedición <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <InputComponent
                                            id={"mes"}
                                            idInput={"mes"}
                                            value={month}
                                            className={`input-basic medium inactive-input ${validateField(month)}`}
                                            typeInput="text"
                                            register={register}
                                            classNameLabel="text-black weight-500 biggest"
                                            direction={EDirection.column}
                                            errors={errors}
                                            disabled={true}
                                        />
                                    </div>
                                )}
                            />

                            {formSubmitted && month === "" && <p className="aviso-campo" style={{ color: "red" }}>Este campo es obligatorio</p>}
                        </div>
                    </Grid>
                </Grid>

                <TextAreaComponent
                    id={'contractObject'}
                    idInput={'contractObject'}
                    className={`text-area-basic ${validateField(contractObject)}`}
                    register={register}
                    value={contractObject}
                    label={
                        <span className="text-black biggest">
                            Objeto contractual <span style={{ color: 'red' }}>*</span>
                        </span>
                    }
                    direction={EDirection.column}
                    errors={errors}
                    rows={2}
                    disabled={isDisabled}
                    onChange={(e) => handleInputChange("contractObject", e.target)}

                />
                {formSubmitted && contractObject === "" && (
                    <p className="aviso-campo" style={{ color: "red" }}>
                        Este campo es obligatorio
                    </p>
                )}
                {errors && (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <div className="title-button font-big">
                            Max. 5000 caracteres
                        </div>
                    </div>
                )}


            </div>
        </>
    );
}

export default CdpheadCreate;
