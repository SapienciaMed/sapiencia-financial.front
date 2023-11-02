import { useState, useEffect } from 'react';
import { Controller } from "react-hook-form";
import { InputComponent, TextAreaComponent } from "../../../common/components/Form";
import { useCdpCrud } from "../hooks/use-cdp";
import { EDirection } from "../../../common/constants/input.enum";
import '../../../styles/from-create-cdp.scss';

interface FormHeadInfo {
    date: string;
    cdpSapConsecutive: string;
    cdpAuroraConsecutive: string;
    contractObject: string;
}

interface Props {
    isDisabled: boolean;
    setFormHeadInfo?: (data: FormHeadInfo) => void;
    formSubmitted?: boolean;
}

function CdpAssociation(props: Props) {
    const { isDisabled, setFormHeadInfo = () => { }, formSubmitted } = props;

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

    return (
        <>
            <div className='container-head-form-cdp'>
                <section className="grid-form-3-container-area mt-5px" style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                    <div className="date-container">
                        <label className="date-label text-black weight-500 biggest">Fecha de Documento: <span>*</span></label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={`date-input ${validateField(date)}`}
                            readOnly={isDisabled}
                        />
                        {formSubmitted && date === "" && <p className="aviso-campo" style={{ color: "red" }}>Este campo es obligatorio</p>}
                    </div>
              {/*       <div className="cdp-sap-consecutive-container">
                        <Controller
                            control={control}
                            name="cdpSapConsecutive"
                            defaultValue={""}
                            render={({ field }) => (
                                <InputComponent
                                    id={field.name}
                                    idInput={field.name}
                                    value={cdpSapConsecutive}
                                    className={`input-basic medium ${validateField(cdpSapConsecutive)}`}
                                    typeInput="text"
                                    register={register}
                                    label="Consecutivo CDP SAP"
                                    classNameLabel="text-black weight-500 biggest"
                                    direction={EDirection.column}
                                    errors={errors}
                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                    disabled={isDisabled}
                                />
                            )}
                        />
                        {formSubmitted && cdpSapConsecutive === "" && <p className="aviso-campo" style={{ color: "red" }}>Este campo es obligatorio</p>}
                    </div>
                    <div className="cdp-aurora-consecutive-container">
                        <Controller
                            control={control}
                            name="cdpAuroraConsecutive"
                            defaultValue={""}
                            render={({ field }) => (
                                <InputComponent
                                    id={field.name}
                                    idInput={field.name}
                                    value={cdpAuroraConsecutive}
                                    className={`input-basic medium ${validateField(cdpAuroraConsecutive)}`}
                                    typeInput="text"
                                    register={register}
                                    label="Consecutivo CDP Aurora"
                                    classNameLabel="text-black weight-500 biggest"
                                    direction={EDirection.column}
                                    errors={errors}
                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                    disabled={isDisabled}
                                />
                            )}
                        />
                        {formSubmitted && cdpAuroraConsecutive === "" && <p className="aviso-campo" style={{ color: "red" }}>Este campo es obligatorio</p>}
                    </div> */}
                </section>

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
                    disabled={isDisabled}
                    onChange={(e) => handleInputChange("contractObject", e.target.value)}
                />
                {formSubmitted && formHeadInfo.contractObject === "" && <p className="aviso-campo" style={{ color: "red" }}>Este campo es obligatorio</p>}
            </div>
        </>
    );
}

export default CdpAssociation;
