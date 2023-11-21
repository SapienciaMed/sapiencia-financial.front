import { useState, useEffect } from 'react';
import { Controller } from "react-hook-form";
import { InputComponent, TextAreaComponent } from "../../../common/components/Form";
import { useCdpCrud } from "../hooks/use-cdp";
import { EDirection } from "../../../common/constants/input.enum";
import '../../../styles/from-create-cdp.scss';
import { Grid } from '@mui/material';

interface FormHeadInfo {
    date: string;
    cdpSapConsecutive: string;
    cdpAuroraConsecutive: string;
    contractObject: string;
}


/* interface Props {
    isDisabled: boolean;
    setFormHeadInfo?: (data: FormHeadInfo) => void;
    information?: (data: FormHeadInfo) => void;
    formSubmitted?: boolean;
} */

interface Props {
    isDisabled: boolean;
    setFormHeadInfo?: (data: FormHeadInfo) => void;
    information?: FormHeadInfo;
    formSubmitted?: boolean;
}


function CdpAssociation(props: Props) {
    const { isDisabled, setFormHeadInfo = () => { }, formSubmitted, information } = props;

    const [formHeadInfo, setFormHeadInfoState] = useState<FormHeadInfo>({
        date: '',
        cdpSapConsecutive: '',
        cdpAuroraConsecutive: '',
        contractObject: '',
    });
    const [cdpSapConsecutive, setCdpSapConsecutive] = useState('');
    const [cdpAuroraConsecutive, setCdpAuroraConsecutive] = useState('');
    const [date, setDate] = useState('');

    const { control, register, errors } = useCdpCrud();

    const handleInputChange = (name: keyof FormHeadInfo, value: string) => {
        switch (name) {
            case "cdpSapConsecutive":
                setCdpSapConsecutive(value);
                break;
            case "cdpAuroraConsecutive":
                setCdpAuroraConsecutive(value);
                break;
            default:
                break;
        }

        let objInformationHead = {
            date,
            cdpSapConsecutive,
            cdpAuroraConsecutive,
            contractObject: formHeadInfo.contractObject,
        };

        setFormHeadInfoState(objInformationHead);
        setFormHeadInfo(objInformationHead);
    };

    useEffect(() => {
        let objCdp = {
            date,
            cdpSapConsecutive,
            cdpAuroraConsecutive,
            contractObject: formHeadInfo.contractObject,
        };
        setFormHeadInfoState(objCdp);
        setFormHeadInfo(objCdp);
    }, [cdpSapConsecutive, cdpAuroraConsecutive, date, formHeadInfo.contractObject]);


    const validateField = (field: string) => {
        if (formSubmitted && !field) {
            return 'campo-obligatorio';
        }
        return '';
    };

    useEffect(() => {
        if (information) {
            let dateOne = information.date.split("T")[0];
            setDate(dateOne || '');
            setCdpSapConsecutive(information.cdpSapConsecutive || '');
            setCdpAuroraConsecutive(information.cdpAuroraConsecutive || '');
            setFormHeadInfoState(information);
        }
    }, [information]);

    return (
        <>
            <div className='container-head-form-cdp'>
                <Grid container spacing={2} style={{ gap: '20px' }}>
                    <Grid item xs={12} sm={12} md={3}>
                        <div className="date-container">
                            <label className="text-black weight-500 biggest" style={{ color: "black" }}>
                                Fecha de documento:
                                <span style={{ color: "red" }}> *</span>
                            </label>
                            <InputComponent
                                id="date"
                                idInput="date"
                                value={date}
                                className={`input-basic medium ${validateField(date)}`}
                                typeInput="text"
                                onChange={(e) => handleInputChange("date", e.target.value)}
                                classNameLabel="text-black weight-500 biggest"
                                direction={EDirection.column}
                                errors={errors}
                                disabled={true}
                            />
                            {formSubmitted && date === "" && (
                                <p className="aviso-campo" style={{ color: "red" }}>
                                    Este campo es obligatorio
                                </p>
                            )}
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <div className="cdp-sap-consecutive-container">
                            <label className="text-black weight-500 biggest" style={{ color: "black" }}>
                                Consecutivo CDP SAP
                                <span style={{ color: "red" }}> *</span>
                            </label>
                            <InputComponent
                                id="cdpSapConsecutive"
                                idInput="cdpSapConsecutive"
                                value={cdpSapConsecutive}
                                className={`input-basic medium ${validateField(cdpSapConsecutive)}`}
                                typeInput="text"
                                onChange={(e) => handleInputChange("cdpSapConsecutive", e.target.value)}
                                classNameLabel="text-black weight-500 biggest"
                                direction={EDirection.column}
                                errors={errors}
                                disabled={true}
                            />
                            {formSubmitted && cdpSapConsecutive === "" && (
                                <p className="aviso-campo" style={{ color: "red" }}>
                                    Este campo es obligatorio
                                </p>
                            )}
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <div className="cdp-aurora-consecutive-container">
                            <label className="text-black weight-500 biggest" style={{ color: "black" }}>
                                Consecutivo CDP Aurora
                                <span style={{ color: "red" }}> *</span>
                            </label>
                            <InputComponent
                                id="cdpAuroraConsecutive"
                                idInput="cdpAuroraConsecutive"
                                value={cdpAuroraConsecutive}
                                className={`input-basic medium ${validateField(cdpAuroraConsecutive)}`}
                                typeInput="text"
                                onChange={(e) => handleInputChange("cdpAuroraConsecutive", e.target.value)}
                                classNameLabel="text-black weight-500 biggest"
                                direction={EDirection.column}
                                errors={errors}
                                disabled={true}
                            />
                            {formSubmitted && cdpAuroraConsecutive === "" && (
                                <p className="aviso-campo" style={{ color: "red" }}>
                                    Este campo es obligatorio
                                </p>
                            )}
                        </div>
                    </Grid>
                </Grid>

                <TextAreaComponent
                    id="contractObject"
                    idInput="contractObject"
                    className={`text-area-basic ${validateField(formHeadInfo.contractObject)}`}
                    register={register}
                    value={formHeadInfo.contractObject}
                    label="Objeto contractual"
                    classNameLabel="text-black biggest"
                    direction={EDirection.column}
                    errors={errors}
                    rows={2}
                    disabled={true}
                    onChange={(e) => handleInputChange("contractObject", e.target.value)}
                />
                {formSubmitted && formHeadInfo.contractObject === "" && <p className="aviso-campo" style={{ color: "red" }}>Este campo es obligatorio</p>}
            </div>
        </>
    );
}

export default CdpAssociation;
