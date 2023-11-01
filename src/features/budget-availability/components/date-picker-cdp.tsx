import React, { useState } from 'react';

const DatePickerCdp = ({ setYear, setMonth, setDate, selected, placeholder, disabled, id = "", className }) => {
    const [value, setValue] = useState(selected || null);

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

    const handleChange = (newValue) => {
        let dateSelected = event.target['value'];
        const arrData = dateSelected.split("-");

        setYear(arrData[0]);
        setMonth(mothsYear[parseInt(arrData[1])]);
        setDate(dateSelected);
        if (newValue instanceof Date) {
            setValue(newValue);
        }

    };


    return (
        <input
            type="date"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            id={id}
            className={`general-input ${value ? '' : 'campo-obligatorio'}`}
        />
    );
};

export default DatePickerCdp;
