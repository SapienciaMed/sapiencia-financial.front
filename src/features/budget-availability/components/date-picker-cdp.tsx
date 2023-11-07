import React, { useState, useEffect } from 'react';

const DatePickerCdp = ({ setYear, setMonth, setDate, selected, placeholder, disabled, id = "", className }) => {
    const [value, setValue] = useState(selected || "");

    const monthsYear = [
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

    const getCurrentDate =  () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const formattedMonth = month < 10 ? `0${month}` : month;
        const day = today.getDate();
        setMonth(monthsYear[month])
        setYear(year)
       
        
        const formattedDay = day < 10 ? `0${day}` : day;
        return `${year}-${formattedMonth}-${formattedDay}`;
    }

    const handleChange = (event) => {
        let dateSelected = event.target['value'];
        const arrData = dateSelected.split("-");

        setYear(parseInt(arrData[0]));
        setMonth(monthsYear[parseInt(arrData[1]) - 1]);
        setDate(dateSelected);
        setValue(dateSelected);
        
    };

    useEffect(() => {
        setValue(getCurrentDate());
        setDate(getCurrentDate());
    }, []);

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
