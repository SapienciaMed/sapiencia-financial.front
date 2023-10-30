import React, { useState, useEffect } from 'react';
import { Controller } from "react-hook-form";
import { DatePickerComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { useCdpCrud } from "../hooks/use-cdp";
import { EDirection } from "../../../common/constants/input.enum";
import { IBudgetAvalaibility } from "../interfaces/budgetAvailabilityInterfaces";
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
}

function CdpheadCreate(prop: Props) {
    const { isDisabled, setFormHeadInfo = () => { } } = prop;

    const [formHeadInfo, setFormHeadInfoState] = useState<FormHeadInfo>({
        date: null,
        exercise: String(new Date().getFullYear()),
        contractObject: '',
    });
    const [exercise, setExercise] = useState(String(new Date().getFullYear()));
    const [sapConsecutive, setSapConsecutive] = useState('');
    const [consecutive, setConsecutive] = useState('');
    const [rpAsociados, setRpAsociados] = useState('');
    const [contractObject, setContractObject] = useState('');
    const [date, setDate] = useState("");
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    
    const { control, register, errors } = useCdpCrud();

    const mothsYear = [
        "meses",
        "enero", 
        "febrero", 
        "marzo", 
        "abril", 
        "mayo", 
        "junio", 
        "julio", 
        "agosto", 
        "septiembre", 
        "octubre", 
        "noviembre", 
        "diciembre"
    ];

    const handleInputChange = (name, target) => {
        let value = target.value;
        const dateString = document.getElementById("document-date-cdp")['value'];
        let partsDate = dateString.split("/");
        setYear(partsDate[2]);
        let monthNumber = partsDate[1];
        setMonth(mothsYear[monthNumber]);
        
        const formattedDate = `${partsDate[2]}-${partsDate[1]}-${partsDate[0]}`;
        setDate(formattedDate);
        
        let objInformationHead = {
            date: formattedDate,
            exercise: formHeadInfo.exercise,
            contractObject: formHeadInfo.contractObject,
        };

        switch (name) {
            case "exercise":
                objInformationHead.exercise = value;
                setExercise(value);
                break;
            case "contractObject":
                objInformationHead.contractObject = value;
                setContractObject(value);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        let objRpp = {
            date,
            exercise,
            contractObject,
        };
        setFormHeadInfoState(objRpp);
        setFormHeadInfo(objRpp);
    }, [exercise, contractObject]);

    useEffect(() => {
        const dateString = document.getElementById("document-date-cdp")['value'];
        let partsDate = dateString.split("/");
        setYear(partsDate[2]);
        setDate(dateString);
        setMonth(mothsYear[partsDate[1]]);
    }, []);

    return (
        <>
            <div className='container-head-form-cdp'>
                <section className='grid-form-3-container-area mt-5px'>
                    <div className="date-picker-container">
                        <label className="date-picker-label text-black weight-500 biggest">Fecha Documento:</label>
                        <DatePickerCdp
                            selected={date}
                            onChange={value => handleInputChange("date", value)}
                            placeholder="DD/MM/YYYY"
                            disabled={isDisabled}
                            id="document-date-cdp"
                        />
                    </div>
                    <Controller
                        control={control}
                        name={"exercise"}
                        defaultValue={String(new Date().getFullYear())}
                        render={({ field }) => {
                            return (
                                <InputComponent
                                    id={field.name}
                                    idInput={field.name}
                                    value={year}
                                    className="input-basic medium inactive-input"
                                    typeInput="number"
                                    register={register}
                                    label="Vigencia"
                                    classNameLabel="text-black weight-500 biggest"
                                    direction={EDirection.column}
                                    errors={errors}
                                    onChange={(e) => handleInputChange(field.name, e.target)}
                                    disabled={true}
                                />
                            );
                        }}
                    />
                    <Controller
                        control={control}
                        name={'exercise'}
                        defaultValue={String(new Date().getFullYear())}
                        render={({ field }) => {
                            return (
                                <InputComponent
                                    id={"mes"}
                                    idInput={"mes"}
                                    value={month}
                                    className="input-basic medium inactive-input"
                                    typeInput="text"
                                    register={register}
                                    label="Mes expedición *"
                                    classNameLabel="text-black weight-500 biggest"
                                    direction={EDirection.column}
                                    errors={errors}
                                    disabled={true}
                                />
                            );
                        }}
                    />
                </section>
                <TextAreaComponent
                    id={'contractObject'}
                    idInput={'contractObject'}
                    className="text-area-basic"
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
            </div>
        </>
    );
}

export default CdpheadCreate;
